import React from 'react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { ArrowRight } from 'lucide-react';

interface ServiceCTASectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  href?: string;
  serviceName?: string;
}

export function ServiceCTASection({
  title = 'Ready to engineer your next digital platform?',
  subtitle = 'Schedule a discovery session with our senior architects to map technical deliverables, sprint cadences, and budget.',
  buttonText = 'Start a Project',
  href,
  serviceName,
}: ServiceCTASectionProps) {
  const targetHref =
    href || (serviceName ? `/contact?service=${encodeURIComponent(serviceName)}` : ROUTES.PUBLIC.START_PROJECT);

  return (
    <section className="my-16 sm:my-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950/90 via-slate-900 to-slate-950 border border-blue-500/30 p-8 sm:p-14 text-center shadow-2xl">
        {/* Glow accents */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">


          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={targetHref}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-xl shadow-primary/25 transition-all duration-300 group active:scale-95"
            >
              <span>{buttonText}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={ROUTES.PUBLIC.PRICING}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition-colors"
            >
              <span>View Pricing Models</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
