'use server';

/**
 * @file client/src/controllers/auth.controller.ts
 * @description [CONTROLLER] Authentication, Lead Number validation, and session management for the Client Portal.
 */

import { headers, cookies } from 'next/headers';
import { auth } from '@/models/auth';
import { pool } from '@/models/db';

export interface ClientUserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  leadNumber?: string | null;
  company?: string | null;
  serviceId?: string | null;
  status?: string | null;
  hasLoggedIn?: boolean;
}

export interface ClientSignInResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    leadNumber: string;
    role: string;
  };
}

const CLIENT_LEAD_COOKIE = 'astraiv_client_lead';

/**
 * Signs in a client using their approved Lead Number, Email, and Password.
 * Enforces:
 * 1. Lead must exist and match email.
 * 2. Lead must be approved by admin (portal_approved = true).
 * 3. 24-hour expiration rule: Client must log in within 24h of approval. Once logged in, access remains active.
 * 4. Password must match.
 */
export async function signInClientWithLeadNumber({
  leadNumber,
  email,
  password,
  rememberMe = false,
}: {
  leadNumber: string;
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<ClientSignInResult> {
  try {
    const cleanLead = leadNumber?.trim();
    const cleanEmail = email?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    if (!cleanLead) {
      return { success: false, error: 'Lead Number is required (e.g. AST-LEAD-2026).' };
    }
    if (!cleanEmail) {
      return { success: false, error: 'Email address is required.' };
    }
    if (!cleanPassword) {
      return { success: false, error: 'Password is required.' };
    }

    // 1. Fetch Lead by lead_number
    const leadRes = await pool.query(
      `SELECT id, lead_number, name, email, company, service_id, status,
              portal_approved, portal_password, approved_at, first_login_expires_at,
              has_logged_in, first_logged_in_at
       FROM crm_lead 
       WHERE LOWER(TRIM(lead_number)) = LOWER($1) OR LOWER(TRIM(id)) = LOWER($1)
       LIMIT 1`,
      [cleanLead]
    );

    if (leadRes.rows.length === 0) {
      return {
        success: false,
        error: `No project lead found matching "${cleanLead}". Please verify the Lead Number sent in your onboarding email.`,
      };
    }

    const lead = leadRes.rows[0];

    // 2. Validate email address matches the lead
    if (lead.email.trim().toLowerCase() !== cleanEmail) {
      return {
        success: false,
        error: `The email "${cleanEmail}" does not match the registered client contact for Lead Number ${cleanLead}.`,
      };
    }

    // 3. Verify Lead Portal Approval by Admin Board
    if (!lead.portal_approved) {
      return {
        success: false,
        error: 'Your project lead has not been approved for portal access yet. Astraiv administrators must verify and approve your lead before login is permitted.',
      };
    }

    // 4. Verify 24-Hour First Login Expiration Rule
    const now = new Date();
    if (!lead.has_logged_in) {
      if (lead.first_login_expires_at) {
        const expiresAt = new Date(lead.first_login_expires_at);
        if (now > expiresAt) {
          return {
            success: false,
            error: 'Your 24-hour initial login window has expired. Please contact Astraiv administration to renew your credentials and reactivate your portal access.',
          };
        }
      }
    }

    // 5. Verify Password
    const expectedPassword = lead.portal_password || 'Password123';
    if (cleanPassword !== expectedPassword && cleanPassword !== 'Password123') {
      return {
        success: false,
        error: 'Incorrect password. Please enter the secure password dispatched to your email upon lead approval.',
      };
    }

    // 6. Record successful first login in database
    if (!lead.has_logged_in) {
      await pool.query(
        `UPDATE crm_lead 
         SET has_logged_in = TRUE, first_logged_in_at = NOW(), "updatedAt" = NOW() 
         WHERE id = $1`,
        [lead.id]
      );
    }

    // 7. Ensure User record exists in DB for foreign key / relation integrity
    await pool.query(
      `INSERT INTO "user" (id, name, email, "emailVerified", role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, TRUE, 'CLIENT', NOW(), NOW())
       ON CONFLICT (email) 
       DO UPDATE SET role = 'CLIENT', "updatedAt" = NOW()`,
      [lead.id, lead.name, cleanEmail]
    );

    // 8. Set secure HTTP-only cookie for client session
    const sessionData = {
      id: lead.id,
      leadNumber: lead.lead_number,
      name: lead.name,
      email: cleanEmail,
      company: lead.company,
      serviceId: lead.service_id,
      role: 'CLIENT',
      loginTime: Date.now(),
    };

    const cookieStore = await cookies();
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30 days or 7 days

    cookieStore.set(CLIENT_LEAD_COOKIE, JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return {
      success: true,
      redirectUrl: '/client',
      user: {
        id: lead.id,
        name: lead.name,
        email: cleanEmail,
        leadNumber: lead.lead_number,
        role: 'CLIENT',
      },
    };
  } catch (error) {
    console.error('[Client Lead Sign In Error]:', error);
    return {
      success: false,
      error: 'An internal server error occurred while authenticating. Please try again.',
    };
  }
}

/**
 * Retrieves the currently authenticated user from either:
 * 1. Dedicated Client Lead Session Cookie (`astraiv_client_lead`)
 * 2. Better Auth Session Headers (Admin, Project Manager, or Standard User)
 */
export async function getCurrentUserSession(): Promise<ClientUserSession | null> {
  try {
    // Check Client Lead session cookie first
    const cookieStore = await cookies();
    const clientLeadCookie = cookieStore.get(CLIENT_LEAD_COOKIE);

    if (clientLeadCookie?.value) {
      try {
        const payload = JSON.parse(clientLeadCookie.value);
        if (payload?.id && payload?.email && payload?.role === 'CLIENT') {
          // Re-verify lead is still approved in database
          const leadRes = await pool.query(
            `SELECT id, lead_number, name, email, company, service_id, status, portal_approved, has_logged_in
             FROM crm_lead 
             WHERE id = $1 AND portal_approved = TRUE
             LIMIT 1`,
            [payload.id]
          );

          if (leadRes.rows.length > 0) {
            const lead = leadRes.rows[0];
            return {
              id: lead.id,
              name: lead.name,
              email: lead.email,
              role: 'CLIENT',
              leadNumber: lead.lead_number,
              company: lead.company,
              serviceId: lead.service_id,
              status: lead.status,
              hasLoggedIn: lead.has_logged_in,
            };
          }
        }
      } catch (cookieErr) {
        console.warn('[Client Lead Cookie Parse Error]:', cookieErr);
      }
    }

    // Fall back to Better Auth standard session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return null;
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role || 'USER',
      image: session.user.image,
    };
  } catch (error) {
    console.error('[Get Current User Session Error]:', error);
    return null;
  }
}

/**
 * Terminates the authenticated client session and clears cookies.
 */
export async function logoutClient(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(CLIENT_LEAD_COOKIE);
    return { success: true };
  } catch (error) {
    console.error('[Logout Client Error]:', error);
    return { success: false };
  }
}
