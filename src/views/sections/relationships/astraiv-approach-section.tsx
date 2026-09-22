import React from 'react';
import { AstraivApproach } from '@/lib/solutions-data';
import { ShieldCheck, Layers, CheckCircle2 } from 'lucide-react';

interface AstraivApproachSectionProps {
  approach: AstraivApproach;
  capabilities?: { title: string; description: string }[];
  fullDesc?: string;
}

export function AstraivApproachSection({ approach, capabilities, fullDesc }: AstraivApproachSectionProps) {
  if (!approach || !approach.title) return null;
  const steps = Array.isArray(approach.methodologySteps) ? approach.methodologySteps : [];
  const validCapabilities = Array.isArray(capabilities) ? capabilities : [];

  return (
    <section className="my-16 sm:my-20">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-blue-500/20 p-8 sm:p-12 shadow-xl backdrop-blur-md">
        {/* Subtle cyan/blue glow */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
            <Layers className="h-3.5 w-3.5" />
            <span>THE ASTRAIV APPROACH</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            {approach.title}
          </h2>

          {approach.summary && (
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium mb-8 max-w-3xl">
              {approach.summary}
            </p>
          )}

          {fullDesc && (
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-10 max-w-3xl">
              {fullDesc}
            </p>
          )}

          {/* 4-Phase Engineering Blueprint */}
          {steps.length > 0 && (
            <div className="pt-6 border-t border-slate-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-6">
                Engineering Execution Lifecycle
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-black font-heading text-slate-500">
                          {step.step}
                        </span>
                        <ShieldCheck className="h-4 w-4 text-blue-400" />
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specialized Capabilities Grid */}
          {validCapabilities.length > 0 && (
            <div className="mt-10 pt-8 border-t border-slate-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-6">
                Specialized Architectural Capabilities
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {validCapabilities.map((cap, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800/70"
                  >
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>{cap.title}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed pl-6">
                      {cap.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
