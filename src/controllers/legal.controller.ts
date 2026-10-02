/**
 * @file client/src/controllers/legal.controller.ts
 * @description [CONTROLLER] Fetches published versioned legal documents (Privacy, Terms) from the database with seamless canonical fallback.
 */

import { db } from '@/models/db';

export interface LegalSection {
  icon?: string;
  title: string;
  content: string;
}

export interface PublishedLegalDocument {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  versionNumber: number;
  effectiveDate: string;
  summary: string;
  sections: LegalSection[];
  publishedAt: Date | null;
}

const CANONICAL_FALLBACK_PRIVACY: PublishedLegalDocument = {
  id: 'doc-privacy-policy',
  slug: 'privacy',
  title: 'Privacy Policy',
  description: 'Learn how Astraiv Technologies protects and manages client and visitor data in compliance with GDPR, CCPA, ISO 27001, and SOC-2 standards.',
  versionNumber: 1,
  effectiveDate: 'September 2026',
  summary: 'Last updated: September 2026. This policy outlines our commitment to safeguarding customer, client, and visitor information across all Astraiv Technologies systems.',
  sections: [
    {
      icon: 'Eye',
      title: '1. Information We Collect',
      content: `Astraiv Technologies collects information to provide higher-quality enterprise software, architectural consultations, and platform performance. This includes:
- **Direct Submissions**: Information you voluntarily provide when requesting a software architecture quote, submitting project requirements, applying for an open engineering role, or submitting client feedback (e.g. name, work email address, company name, telephone number, resume files, and project scope).
- **Technical Telemetry**: Information automatically generated through your interaction with our website and client portal, such as IP address, browser type, device identifiers, referring URLs, operating system, and pages visited, captured via privacy-focused telemetry.
- **Client Engagement Data**: For contracted enterprise clients, project specifications, architectural repositories, ticket communications, and billing metrics managed through encrypted database connections.`,
    },
    {
      icon: 'Database',
      title: '2. How We Use Your Information',
      content: `We utilize gathered information exclusively for legitimate business, architectural, and contractual purposes:
- Delivering, operating, testing, and optimizing custom software engineering platforms.
- Responding to project inquiries, preparing commercial proposals, and scheduling technical discovery sessions.
- Administering client portal accounts, support tickets, and role-based access controls.
- Complying with regulatory, tax, accounting, and institutional security mandates.
- Evaluating engineering job applicants and scheduling founder interviews.
- Protecting our systems against unauthorized access, credential stuffing, DDoS attacks, and security vulnerabilities.`,
    },
    {
      icon: 'Lock',
      title: '3. Data Security & Storage Standards',
      content: `Astraiv adheres to strict institutional security benchmarks:
- **Encryption**: All data in transit is encrypted using modern TLS 1.3 cryptographic suites. Persistent data at rest is encrypted using AES-256 standards across PostgreSQL clusters and Cloudflare R2 object storage.
- **Access Control**: Strict principle of least privilege (PoLP) and multi-factor authentication (MFA) govern developer and system access to production databases.
- **Tenant Isolation**: Client data in multi-tenant environments is segregated through Row-Level Security (RLS) policies and dedicated tenant partitions.
- **Data Retention**: We retain commercial records and communication logs only as long as necessary to satisfy contractual obligations or statutory requirements.`,
    },
    {
      icon: 'Globe',
      title: '4. Third-Party Sub-Processors',
      content: `We partner with world-class, SOC-2 compliant cloud infrastructure providers to host and secure our platforms:
- **Cloud Infrastructure**: Amazon Web Services (AWS) and Cloudflare for global edge delivery, caching, and CDN routing.
- **Database & Persistence**: Managed PostgreSQL via Supabase and dedicated VPC database clusters.
- **Analytics & Telemetry**: Google Analytics 4 (configured with IP anonymization) to monitor Core Web Vitals and site usability.
We do not sell, rent, or monetize client or visitor data to third-party data brokers or marketing conglomerates.`,
    },
    {
      icon: 'ShieldCheck',
      title: '5. Your Rights (GDPR & CCPA Compliance)',
      content: `Depending on your jurisdiction, you have statutory privacy rights regarding your personal information:
- **Access & Portability**: Request a copy of the personal information we maintain concerning you in a structured, machine-readable format.
- **Correction & Rectification**: Request correction of any incomplete or inaccurate data.
- **Erasure ("Right to be Forgotten")**: Request deletion of your personal records, subject to ongoing legal or contractual record-retention requirements.
- **Objection & Restriction**: Object to our processing of your personal data or request restricted processing.
To exercise any of these rights, contact our Data Governance team at privacy@astraivtechnologies.com.`,
    },
    {
      icon: 'Mail',
      title: '6. Contact & Data Governance Officer',
      content: `If you have questions, concerns, or requests regarding this Privacy Policy or our security posture, please reach out directly:
- **Email**: privacy@astraivtechnologies.com / info@astraivtechnologies.com
- **Mailing Address**: Astraiv Technologies, Ashoknagar, Kolkata, West Bengal, India
- **Response SLA**: Inquiries are reviewed and answered within 48 business hours.`,
    },
  ],
  publishedAt: new Date('2026-09-01T00:00:00Z'),
};

const CANONICAL_FALLBACK_TERMS: PublishedLegalDocument = {
  id: 'doc-terms-of-service',
  slug: 'terms',
  title: 'Terms of Service',
  description: 'Review the terms of service, engagement models, intellectual property assignments, and service level agreements for Astraiv Technologies.',
  versionNumber: 1,
  effectiveDate: 'September 2026',
  summary: 'Last updated: September 2026. These terms govern software engineering engagements, architectural consultations, IP assignments, and support agreements with Astraiv Technologies.',
  sections: [
    {
      icon: 'FileText',
      title: '1. Engagement Scope & Master Service Agreements',
      content: `Astraiv Technologies provides high-performance custom software engineering, AI intelligent systems, distributed cloud architecture, and technical consulting services.
- **Statement of Work (SOW)**: Each client engagement is governed by a dedicated Statement of Work or commercial proposal defining deliverables, architectural milestones, technology stacks, pricing, and delivery timelines.
- **Mutual Agreement**: Engaging Astraiv or executing an SOW constitutes binding acceptance of these Terms of Service alongside any custom Master Services Agreement (MSA) executed between the parties.`,
    },
    {
      icon: 'Award',
      title: '2. Intellectual Property & Ownership Rights',
      content: `We believe in unconditional, unencumbered client ownership:
- **100% Client Ownership**: Upon full payment of milestone fees, all bespoke source code, UI/UX designs, database schemas, and custom algorithms developed specifically for the client transfer completely and exclusively to the client.
- **Pre-Existing Frameworks & Boilerplates**: Astraiv retains ownership of its internal reusable engineering libraries, development toolchains, and open-source contributions. The client is granted a perpetual, irrevocable, royalty-free, worldwide license to utilize and modify any incorporated Astraiv frameworks within their bespoke application.
- **No Vendor Lock-In**: We construct platforms with standard, documented, cloud-native technologies (Next.js, Node.js, PostgreSQL, Docker, Kubernetes) ensuring clients can independently host, deploy, and maintain their codebases.`,
    },
    {
      icon: 'ShieldAlert',
      title: '3. Confidentiality & Non-Disclosure (NDA)',
      content: `Astraiv treats all proprietary client information with institutional rigor:
- **Mutual Non-Disclosure**: All trade secrets, architectural schematics, business roadmaps, client data, and proprietary algorithms shared during discovery or execution are protected under strict mutual confidentiality.
- **Code & Credential Isolation**: Developer access to client repositories, staging environments, and production systems is governed by role-based credentials, SSH keys, and encrypted secret vaults. Astraiv developers never share or commit private client keys or customer data to public repositories.`,
    },
    {
      icon: 'CheckCircle2',
      title: '4. Delivery Milestones, Invoicing & Acceptance',
      content: `Project milestones adhere to structured engineering sprints:
- **Sprint Reviews & Demo Sign-Off**: Deliverables are deployed to staging environments for client validation. Clients have an agreed acceptance window (typically 10 business days) to review features and submit revision requests.
- **Payment Terms**: Invoices for milestone phases or dedicated monthly retainer sprints are payable within the net terms defined in the SOW (typically Net-15 or Net-30). Late payments may result in temporary staging deployment freezes.
- **Warranty & Hypercare**: Astraiv includes a 30 to 90-day post-launch warranty window (as defined in the SOW) to rectify any functional defects or deviations from approved specifications at zero additional charge.`,
    },
    {
      icon: 'RefreshCw',
      title: '5. Service Level Agreements (SLAs) & Hosting Availability',
      content: `For clients engaging Astraiv for DevOps, Cloud Architecture, and Managed Infrastructure:
- **High-Availability Targets**: We engineer systems targeting 99.9% uptime across multi-region cloud infrastructures (AWS, Cloudflare, Supabase, Google Cloud).
- **Incident Response Levels**: P1 critical production outages are prioritized with initial technical response within 1 hour. P2 and P3 issues are addressed within standard business hours as dictated by the support agreement.
- **Third-Party Outages**: Astraiv is not liable for infrastructure downtime caused by global outages of upstream cloud providers (e.g. AWS regional power losses, Cloudflare global edge degradation).`,
    },
    {
      icon: 'Scale',
      title: '6. Limitation of Liability & Governing Law',
      content: `To the maximum extent permitted by applicable law:
- **Liability Cap**: In no event shall either party's total aggregate liability arising out of or related to these Terms exceed the total fees paid by the client under the specific Statement of Work giving rise to the claim.
- **Consequential Damages**: Neither party shall be liable for indirect, incidental, punitive, or consequential damages (including loss of profits or data interruptions).
- **Governing Law**: These Terms and any dispute arising hereunder shall be governed by and construed in accordance with the laws of West Bengal, India, without regard to conflict of law principles. Parties agree to submit to the jurisdiction of competent courts in Kolkata, India, or mutually agreed international arbitration.`,
    },
    {
      icon: 'Mail',
      title: '7. Inquiries & Legal Notices',
      content: `Legal notices, contractual revisions, or enterprise MSA inquiries should be addressed to:
- **Email**: legal@astraivtechnologies.com / info@astraivtechnologies.com
- **Corporate Entity**: Astraiv Technologies, Ashoknagar, Kolkata, West Bengal, India.`,
    },
  ],
  publishedAt: new Date('2026-09-01T00:00:00Z'),
};

export async function getPublishedLegalDocument(slug: 'privacy' | 'terms'): Promise<PublishedLegalDocument> {
  const fallback = slug === 'privacy' ? CANONICAL_FALLBACK_PRIVACY : CANONICAL_FALLBACK_TERMS;

  try {
    // 1. Try finding by document slug with published revision relation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const legalDoc = await (db as any).legalDocument?.findUnique({
      where: { slug },
      include: {
        revisions: {
          where: { status: 'published' },
          orderBy: { versionNumber: 'desc' },
          take: 1,
        },
      },
    });

    if (legalDoc && legalDoc.revisions && legalDoc.revisions.length > 0) {
      const rev = legalDoc.revisions[0];
      let parsedSections: LegalSection[] = [];
      if (typeof rev.sections === 'string') {
        parsedSections = JSON.parse(rev.sections);
      } else if (Array.isArray(rev.sections)) {
        parsedSections = rev.sections;
      }

      return {
        id: legalDoc.id,
        slug: legalDoc.slug,
        title: rev.title || legalDoc.title || fallback.title,
        description: legalDoc.description || fallback.description,
        versionNumber: rev.versionNumber || 1,
        effectiveDate: rev.effectiveDate || fallback.effectiveDate,
        summary: rev.summary || fallback.summary,
        sections: parsedSections.length > 0 ? parsedSections : fallback.sections,
        publishedAt: rev.publishedAt ? new Date(rev.publishedAt) : fallback.publishedAt,
      };
    }

    // 2. Direct lookup on legalRevision if document join was empty
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const directRevision = await (db as any).legalRevision?.findFirst({
      where: {
        documentSlug: slug,
        status: 'published',
      },
      orderBy: {
        versionNumber: 'desc',
      },
    });

    if (directRevision) {
      let parsedSections: LegalSection[] = [];
      if (typeof directRevision.sections === 'string') {
        parsedSections = JSON.parse(directRevision.sections);
      } else if (Array.isArray(directRevision.sections)) {
        parsedSections = directRevision.sections;
      }

      return {
        id: directRevision.documentId || fallback.id,
        slug,
        title: directRevision.title || fallback.title,
        description: fallback.description,
        versionNumber: directRevision.versionNumber || 1,
        effectiveDate: directRevision.effectiveDate || fallback.effectiveDate,
        summary: directRevision.summary || fallback.summary,
        sections: parsedSections.length > 0 ? parsedSections : fallback.sections,
        publishedAt: directRevision.publishedAt ? new Date(directRevision.publishedAt) : fallback.publishedAt,
      };
    }
  } catch (err) {
    console.warn(`[getPublishedLegalDocument] DB lookup failed for ${slug}, using fallback:`, (err as Error)?.message || err);
  }

  return fallback;
}
