'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { Eye, ShieldCheck, HeartHandshake, Zap } from 'lucide-react';

export function WhySection() {
  const points = [
    {
      icon: <HeartHandshake className="h-6 w-6 text-primary" />,
      title: 'Built on Trust & Psychology',
      description: 'We structure information visually based on cognitive psychology, ensuring your visitors feel subconscious trust and confidence in your platform from the first millisecond.',
    },
    {
      icon: <Eye className="h-6 w-6 text-secondary" />,
      title: 'Senior Engineering Team',
      description: 'We do not delegate to junior engineers. Your software is designed and coded exclusively by senior full-stack architects with decades of experience at top-tier firms.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
      title: 'Enterprise-Grade Security',
      description: 'Security is baked into our code from day one. We enforce rigorous standards matching SOC2 and ISO compliance, ensuring your data is shielded at all layers.',
    },
    {
      icon: <Zap className="h-6 w-6 text-accent" />,
      title: 'High-Velocity Automation',
      description: 'We eliminate manual friction. By automating databases, pipelines, CRM syncs, and notifications, we design solutions that scale with zero administrative overhead.',
    },
  ];

  const stats = [
    {
      num: '99.99%',
      label: 'Server Uptime',
      description: 'Active SLA uptime monitoring backed by AWS and Cloudflare Edge caching infrastructure.',
    },
    {
      num: '40%+',
      label: 'Infrastructure Saving',
      description: 'Average server overhead reduction achieved by optimizing Next.js queries and databases.',
    },
    {
      num: '10M+',
      label: 'API Actions Processed',
      description: 'Scaling transactions smoothly for high-velocity FinTech and SaaS integrations.',
    },
    {
      num: '100%',
      label: 'On-Time SLA Delivery',
      description: 'Transparent client boards, weekly iterations, and zero project delays.',
    },
  ];

  return (
    <section id="why-us" className="py-20 md:py-28 px-6 bg-slate-50/50 dark:bg-slate-900/10 border-y border-border/20 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Why Astraiv"
          title="Engineered for Trust & Scalability"
          description="We combine cognitive psychology with top-tier technical architecture to build software that drives conversion and scales automatically."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-5xl mx-auto">
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              whileHover={{ y: -5 }}
              className="flex gap-6 p-8 bg-card border border-border/40 rounded-[20px] shadow-sm hover:shadow-[0_20px_50px_-20px_rgba(11,61,145,0.06)] hover:border-primary/20 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 border border-border/40 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                {point.icon}
              </div>
              <div className="flex flex-col gap-2 text-left">
                <h3 className="text-xl font-bold tracking-tight text-foreground">{point.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border/15 my-16 md:my-20 max-w-5xl mx-auto" />

        {/* Astraiv Metrics Block */}
        <div className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3.5 py-1 text-xs font-semibold tracking-wider text-accent bg-accent/10 rounded-full border border-accent/20 uppercase">
              Astraiv Metrics
            </span>
            <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground mt-4 font-heading">
              Validated by Operational Excellence
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-semibold mt-4">
              We hold ourselves to rigorous metrics, ensuring your software is not just visually stunning but highly performant and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                className="flex flex-col gap-3 p-8 bg-card border border-border/40 rounded-[20px] shadow-sm text-left hover:border-accent/30 transition-colors duration-300"
              >
                <span className="text-4xl md:text-5xl font-extrabold text-accent dark:text-accent tracking-tight font-heading">
                  {stat.num}
                </span>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-sm font-bold text-foreground uppercase tracking-wide">
                    {stat.label}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold mt-1">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
