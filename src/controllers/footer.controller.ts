'use server';

/**
 * @file client/src/controllers/footer.controller.ts
 * @description [CONTROLLER] Business logic for retrieving public footer configuration, contact details, and social media channels.
 */

import { db } from '@/models/db';
import { isSupabaseConfigured, createClient as createSupabaseClient } from '@/lib/supabase/server';

export interface PublicSocialLink {
  id: string;
  platform: string;
  name: string;
  url: string;
  icon: string;
}

export interface PublicFooterData {
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  brandTagline: string;
  copyrightText: string;
  socials: PublicSocialLink[];
}

const DEFAULT_FOOTER_DATA: PublicFooterData = {
  phone: '+91 8167409664',
  email: 'info@astraivtechnologies.com',
  address: 'Ashoknagar, Kolkata',
  mapUrl: 'https://maps.google.com/?q=Ashoknagar,+Kolkata',
  brandTagline: 'Your trusted partner for AI, enterprise software, and scalable cloud systems.',
  copyrightText: 'Astraiv Technologies. All rights reserved.',
  socials: [
    {
      id: 'default-twitter',
      platform: 'twitter',
      name: 'Twitter',
      url: 'https://twitter.com',
      icon: 'twitter',
    },
    {
      id: 'default-linkedin',
      platform: 'linkedin',
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: 'linkedin',
    },
    {
      id: 'default-github',
      platform: 'github',
      name: 'GitHub',
      url: 'https://github.com',
      icon: 'github',
    },
  ],
};

/**
 * Retrieves public footer configuration and active social media links for the client website.
 */
export async function getPublicFooterData(): Promise<PublicFooterData> {
  try {
    if (!isSupabaseConfigured()) {
      try {
        const [settingsRecord, socialRecords] = await Promise.all([
          db.footerSetting ? db.footerSetting.findFirst() : Promise.resolve(null),
          db.socialLink
            ? db.socialLink.findMany({
                where: { active: true },
                orderBy: { orderIndex: 'asc' },
              })
            : Promise.resolve([]),
        ]);

        const phone = settingsRecord?.phone || DEFAULT_FOOTER_DATA.phone;
        const email = settingsRecord?.email || DEFAULT_FOOTER_DATA.email;
        const address = settingsRecord?.address || DEFAULT_FOOTER_DATA.address;
        const mapUrl =
          settingsRecord?.mapUrl ||
          `https://maps.google.com/?q=${encodeURIComponent(address)}`;
        const brandTagline = settingsRecord?.brandTagline || DEFAULT_FOOTER_DATA.brandTagline;
        const copyrightText = settingsRecord?.copyrightText || DEFAULT_FOOTER_DATA.copyrightText;

        const socials: PublicSocialLink[] =
          socialRecords.length > 0
            ? socialRecords.map((s) => ({
                id: s.id,
                platform: s.platform,
                name: s.name,
                url: s.url,
                icon: s.icon,
              }))
            : DEFAULT_FOOTER_DATA.socials;

        return {
          phone,
          email,
          address,
          mapUrl,
          brandTagline,
          copyrightText,
          socials,
        };
      } catch (dbErr) {
        console.warn('[Public Footer DB Fallback]:', dbErr);
        return DEFAULT_FOOTER_DATA;
      }
    }

    const supabase = await createSupabaseClient();
    const [settingsRes, socialsRes] = await Promise.all([
      supabase.from('footer_settings').select('*').limit(1).maybeSingle(),
      supabase.from('social_links').select('*').eq('active', true).order('order_index', { ascending: true }),
    ]);

    const settings = settingsRes.data;
    const phone = settings?.phone || DEFAULT_FOOTER_DATA.phone;
    const email = settings?.email || DEFAULT_FOOTER_DATA.email;
    const address = settings?.address || DEFAULT_FOOTER_DATA.address;
    const mapUrl = settings?.map_url || `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    const brandTagline = settings?.brand_tagline || DEFAULT_FOOTER_DATA.brandTagline;
    const copyrightText = settings?.copyright_text || DEFAULT_FOOTER_DATA.copyrightText;

    const socialsData = socialsRes.data;
    const socials: PublicSocialLink[] =
      socialsData && socialsData.length > 0
        ? socialsData.map((s) => ({
            id: s.id,
            platform: s.platform,
            name: s.name,
            url: s.url,
            icon: s.icon || s.platform,
          }))
        : DEFAULT_FOOTER_DATA.socials;

    return {
      phone,
      email,
      address,
      mapUrl,
      brandTagline,
      copyrightText,
      socials,
    };
  } catch (error) {
    console.error('[Get Public Footer Data Error]:', error);
    return DEFAULT_FOOTER_DATA;
  }
}
