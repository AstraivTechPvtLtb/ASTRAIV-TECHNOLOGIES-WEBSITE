import React from 'react';
import { Link } from '@/i18n/routing';
import type { PublicServiceItem } from '@/lib/services-data';
import { ROUTES } from '@/routes';
import { ArrowRight } from 'lucide-react';
import { ServiceIcon } from '@/views/ui/service-icon';

interface RelatedServicesSectionProps {
  services: PublicServiceItem[];
  solutionTitle?: string;
  title?: string;
  subtitle?: string;
}

export function RelatedServicesSection({
  services,
  solutionTitle,
  title = 'Engineering Disciplines Powering This Solution',
  subtitle,
}: RelatedServicesSectionProps) {
  if (!services || services.length === 0) return null;

  const displaySubtitle =
    subtitle || (solutionTitle ? `The core technical capabilities Astraiv squads deploy to architect and maintain ${solutionTitle}.` : 'Core engineering disciplines and architecture capabilities deployed by our squads.');

  return (
    <section className="my-16 sm:my-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl">
            {displaySubtitle}
          </p>
        </div>
        <Link
          href={ROUTES.PUBLIC.SERVICES}
          className="text-xs sm:text-sm font-bold text-primary dark:text-blue-400 hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>All Services</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.slug}
            className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg backdrop-blur-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
                  <ServiceIcon name={service.icon} className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                  {service.category}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">
                {service.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed mb-4">
                {service.shortDesc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
              <span>Explore Discipline Scope</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>

            <Link
              href={ROUTES.PUBLIC.SERVICE_DETAIL(service.slug)}
              className="absolute inset-0 z-10"
              aria-label={`View ${service.title} Service`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
