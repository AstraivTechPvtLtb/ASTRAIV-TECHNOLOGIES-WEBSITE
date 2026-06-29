/**
 * Email Service (Resend) Configuration.
 * Configures contact mailers, transactional verification mails, and client support notifications.
 */

export const emailConfig = {
  apiKey: process.env.RESEND_API_KEY || '',
  defaultFrom: 'Astraiv Technologies <noreply@astraiv.com>',
  supportEmail: 'support@astraiv.com',
  infoEmail: 'info@astraiv.com',
  
  // Standard transactional template IDs or configurations
  templates: {
    welcome: {
      subject: 'Welcome to Astraiv Technologies',
    },
    verification: {
      subject: 'Verify your Astraiv account',
    },
    ticketCreated: {
      subject: '[Astraiv Support] Ticket Created - #',
    },
    projectUpdate: {
      subject: '[Astraiv Projects] Milestone Completed',
    },
  },
};
