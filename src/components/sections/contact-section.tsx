'use client';

import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from './contact-form';

export function ContactSection() {
  const t = useTranslations('Home');

  return (
    <section id="contact" className="py-12 md:py-20 px-6 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Contact details */}
        <div className="flex flex-col gap-6 text-left">
          <span className="inline-flex self-start px-3.5 py-1 text-xs font-semibold tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20 dark:bg-primary/20 dark:text-primary-foreground uppercase w-fit">
            Get in Touch
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
            {t('ctaTitle')}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl font-semibold">
            {t('ctaSubtitle')}
          </p>

          <div className="flex flex-col gap-5 mt-4">
            <div className="flex items-center gap-4 text-foreground/80">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold">info@astraiv.com</span>
            </div>
            <div className="flex items-center gap-4 text-foreground/80">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold">+1 (555) 019-9231</span>
            </div>
            <div className="flex items-center gap-4 text-foreground/80">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold leading-relaxed max-w-xs font-semibold">
                100 Pine Street, San Francisco, CA 94111
              </span>
            </div>
          </div>
        </div>

        {/* Reusable Contact Form */}
        <div className="relative">
          {/* Subtle glow underneath the contact card */}
          <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl pointer-events-none" />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
