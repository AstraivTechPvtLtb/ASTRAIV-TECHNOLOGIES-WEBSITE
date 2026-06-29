/**
 * Stripe Billing & Payment System Configuration.
 * Prepares the billing subscription architecture for membership and SaaS tiers.
 */

export const stripeConfig = {
  apiKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  
  // Base products and plans stubs
  plans: {
    free: {
      name: 'Starter',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || 'price_starter_placeholder',
      features: ['Up to 3 active projects', 'Basic CRM tools', 'Community support'],
    },
    pro: {
      name: 'Professional',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || 'price_pro_placeholder',
      features: ['Unlimited active projects', 'Advanced AI features', 'Priority Support (Slack)', 'Custom dashboard integrations'],
    },
    enterprise: {
      name: 'Enterprise',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE || 'price_enterprise_placeholder',
      features: ['Dedicated Account Manager', 'Custom agreements & SLA', 'Dedicated cloud infrastructure', '24/7 Phone support'],
    },
  },
};
