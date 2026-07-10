import { createAuthClient } from 'better-auth/react';

/**
 * Better Auth Client client-side helper.
 * Handles signin, signup, signout, and session subscriptions in client components.
 */
export const authClient = createAuthClient({
  // baseURL must match the server-side BETTER_AUTH_URL (fallback to window origin if client)
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
});

export const { signIn, signUp, signOut, useSession } = authClient;
