'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { 
  Code2, 
  Database, 
  Wind, 
  Infinity as LoopIcon, 
  ShieldCheck, 
  Zap, 
  CloudLightning, 
  Globe2 
} from 'lucide-react';

export function TechSection() {
  const techs = [
    {
      icon: <Globe2 className="h-5 w-5 text-indigo-500" />,
      name: 'Next.js 16',
      role: 'Frontend & Server Architecture',
      description: 'Used for advanced Server Actions, Server Components, page caching, and serverless edge rendering.',
    },
    {
      icon: <Code2 className="h-5 w-5 text-blue-500" />,
      name: 'TypeScript',
      role: 'Typesafe Development',
      description: 'Guarantees absolute compiler safety, eliminating runtime bugs and facilitating clean structural refactoring.',
    },
    {
      icon: <Wind className="h-5 w-5 text-sky-400" />,
      name: 'Tailwind CSS v4',
      role: 'Utility Styling Engine',
      description: 'Provides pixel-perfect styling, zero CSS runtime bloat, and optimized utility layouts.',
    },
    {
      icon: <Database className="h-5 w-5 text-emerald-500" />,
      name: 'Prisma & Postgres',
      role: 'Database & ORM layer',
      description: 'Ensures typesafe relational database queries with automated connection pool management.',
    },
    {
      icon: <LoopIcon className="h-5 w-5 text-purple-500" />,
      name: 'Framer Motion',
      role: 'Fluid Micro-interactions',
      description: 'Powers custom animated card lifts, scroll reveals, and hardware-accelerated animations.',
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-rose-500" />,
      name: 'Zod & React Hook Form',
      role: 'Validation & Form State',
      description: 'Strict runtime validations for API requests and client inputs, optimizing security.',
    },
    {
      icon: <CloudLightning className="h-5 w-5 text-amber-500" />,
      name: 'AWS & Cloudflare R2',
      role: 'Infrastructure & CDN',
      description: 'Distributes files and pages globally with low latency and near-zero server load overhead.',
    },
    {
      icon: <Zap className="h-5 w-5 text-cyan-500" />,
      name: 'Better Auth',
      role: 'Authentication System',
      description: 'Implements secure multi-tenant cookie sessions, password hashing, and role structures.',
    },
  ];

  return (
    <section id="technologies" className="py-20 md:py-28 px-6 bg-slate-50/50 dark:bg-slate-900/10 border-b border-border/20">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Technology Stack"
          title="Elite Technologies for High Performance"
          description="We build exclusively with state-of-the-art frameworks and databases, guaranteeing near-instant load speeds and bulletproof code security."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-6xl mx-auto">
          {techs.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              whileHover={{ y: -4 }}
              className="p-6 bg-card border border-border/40 rounded-[20px] shadow-xs hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col text-left justify-between min-h-[220px]"
            >
              <div className="flex flex-col gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-border/40 shrink-0">
                  {tech.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold tracking-tight text-foreground">{tech.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-accent">
                    {tech.role}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-4 font-semibold">
                {tech.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
