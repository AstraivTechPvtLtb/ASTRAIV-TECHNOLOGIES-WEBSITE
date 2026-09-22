import React from 'react';
import { Cpu, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';

interface TechnologyCategory {
  category: string;
  items: string[];
}

interface TechnologiesSectionProps {
  technologies: TechnologyCategory[] | string[];
  title?: string;
  subtitle?: string;
}

export function TechnologiesSection({
  technologies,
  title = 'Technologies & Production Primitives',
  subtitle = 'Hardened frameworks, libraries, and cloud infrastructure tools deployed by our squads.',
}: TechnologiesSectionProps) {
  if (!technologies || technologies.length === 0) return null;

  // Normalize if passed an array of strings
  const isCategorized = typeof technologies[0] !== 'string';
  const categories: TechnologyCategory[] = isCategorized
    ? (technologies as TechnologyCategory[])
    : [{ category: 'Core Tech Stack', items: technologies as string[] }];

  return (
    <section className="my-16 sm:my-20 p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Cpu className="h-4 w-4" />
        </div>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
          ENGINEERING STACK
        </span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-slate-400 max-w-2xl mb-8">
        {subtitle}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-400 mb-4 pb-2 border-b border-slate-800">
                {cat.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Intelligent Cross-Link to Dedicated Technology Architecture */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-xs text-slate-400 font-medium">
          Looking for detailed architectural benchmarks, telemetry, and low-latency specs?
        </p>
        <Link
          href={ROUTES.PUBLIC.TECHNOLOGY}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-blue-400 hover:text-white transition-colors group/link"
        >
          <span>Explore All Production Stacks &amp; Benchmarks</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
