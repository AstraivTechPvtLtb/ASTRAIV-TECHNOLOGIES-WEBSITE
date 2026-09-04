'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { Link } from '@/i18n/routing';
import {
  Briefcase,
  Code2,
  Brain,
  Cloud,
  ArrowRight,
  Globe2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function CareersSection() {
  const perks = [
    {
      icon: <Globe2 className="h-5 w-5 text-primary" />,
      title: '100% Remote & Global Autonomy',
      description: 'Work from wherever you are most productive. We value high output and clean deliverables over seat-time.',
    },
    {
      icon: <Code2 className="h-5 w-5 text-secondary" />,
      title: 'Modern Architecture Only',
      description: 'Zero legacy debt. We build exclusively with Next.js 16, React 19, TypeScript, Rust, Python, and edge runtimes.',
    },
    {
      icon: <Brain className="h-5 w-5 text-accent" />,
      title: 'AI & Cognitive Engineering',
      description: 'Direct hands-on experience building autonomous agents, multi-tenant RAG systems, and enterprise LLM pipelines.',
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
      title: 'Competitive Compensation',
      description: 'Top-tier global market rates, milestone sprint bonuses, and accelerated career growth into staff architectural roles.',
    },
  ];

  const roles = [
    {
      title: 'Senior Full-Stack Architect',
      type: 'Full-Time / Remote',
      department: 'Engineering',
      description: 'Lead high-throughput web applications and SaaS portal architectures using Next.js App Router, TypeScript, and Postgres.',
      skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma'],
    },
    {
      title: 'AI Systems & LLM Engineer',
      type: 'Full-Time / Remote',
      department: 'AI & Automation',
      description: 'Design and deploy state-of-the-art cognitive agents, hybrid vector retrieval (RAG), and asynchronous task queues.',
      skills: ['Python', 'FastAPI', 'LangChain', 'Vector DBs', 'PyTorch', 'Agentic Workflows'],
    },
    {
      title: 'Cloud & DevOps Infrastructure Lead',
      type: 'Full-Time / Remote',
      department: 'Cloud Ops',
      description: 'Engineer zero-downtime CI/CD pipelines, container orchestration, edge caching on Cloudflare R2, and AWS infrastructure.',
      skills: ['AWS', 'Cloudflare Workers/R2', 'Docker', 'Terraform', 'Turborepo', 'Security Hardening'],
    },
  ];

  return (
    <section id="careers" className="py-20 md:py-28 px-6 bg-slate-50/60 dark:bg-slate-900/20 border-y border-border/30 relative scroll-mt-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Section Header */}
        <SectionHeader
          badge="Careers & Culture"
          title="Build the Future with Elite Engineers"
          description="Join our team of elite full-stack engineers and architects solving high-stakes enterprise challenges."
        />

        {/* Culture / Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full">
          {perks.map((perk, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="p-6 bg-card/90 dark:bg-slate-900/80 backdrop-blur-xl border border-border/60 dark:border-slate-800/80 rounded-2xl flex flex-col gap-3 text-left shadow-xs hover:shadow-md transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 border border-border/40 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                {perk.icon}
              </div>
              <h4 className="text-base font-bold text-foreground tracking-tight">{perk.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                {perk.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Open Positions */}
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/40">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                Current Open Opportunities
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                Direct applications reviewed within 48 business hours by our engineering founders.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-accent bg-primary/10 dark:bg-primary/20 px-3 py-1.5 rounded-full w-fit">
              <Sparkles className="h-3 w-3" />
              {roles.length} Open Roles
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {roles.map((role, idx) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="p-6 sm:p-7 bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/60 dark:border-slate-800/80 rounded-2xl hover:border-primary/40 dark:hover:border-accent/40 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                <div className="flex flex-col gap-2.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-border/40">
                      {role.department}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {role.type}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors">
                    {role.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {role.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {role.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-muted/70 text-foreground/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs hover:shadow-md transition-all duration-200 shrink-0 select-none active:scale-95 group/btn"
                >
                  <span>Apply for Role</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
