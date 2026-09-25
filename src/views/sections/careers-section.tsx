'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { Link } from '@/i18n/routing';
import {
  Briefcase,
  Code2,
  Brain,
  ArrowRight,
  Globe2,
  Sparkles,
  ShieldCheck,
  Search,
} from 'lucide-react';

import { PublicJobOpening, DEFAULT_JOB_OPENINGS } from '@/models/types';

interface CareersSectionProps {
  initialRoles?: PublicJobOpening[];
}

export function CareersSection({ initialRoles }: CareersSectionProps) {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const allRoles = initialRoles !== undefined ? initialRoles : DEFAULT_JOB_OPENINGS;

  const departments = useMemo(() => {
    const depts = new Set<string>();
    allRoles.forEach((r) => {
      if (r.department) depts.add(r.department);
    });
    return ['all', ...Array.from(depts)];
  }, [allRoles]);

  const filteredRoles = useMemo(() => {
    return allRoles.filter((r) => {
      const matchesDept = selectedDept === 'all' || r.department.toLowerCase() === selectedDept.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDept && matchesSearch;
    });
  }, [allRoles, selectedDept, searchQuery]);

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
              <h3 className="text-base font-bold text-foreground tracking-tight">{perk.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                {perk.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Open Positions Directory */}
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/40">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                Current Open Opportunities
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                Direct applications reviewed within 48 business hours by our engineering founders.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-accent bg-primary/10 dark:bg-primary/20 px-3.5 py-1.5 rounded-full w-fit">
              <Sparkles className="h-3 w-3" />
              {filteredRoles.length} Active {filteredRoles.length === 1 ? 'Role' : 'Roles'}
            </span>
          </div>

          {/* Filtering Controls: Search & Department Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            {/* Department Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-card dark:bg-slate-900 text-muted-foreground hover:text-foreground border border-border/60'
                  }`}
                >
                  {dept === 'all' ? 'All Roles' : dept}
                </button>
              ))}
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                id="careers-search-roles"
                name="careers_search_roles"
                aria-label="Search skills or job title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills, title..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-card dark:bg-slate-900 border border-border/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Roles List */}
          <div className="flex flex-col gap-4 mt-2">
            {filteredRoles.length === 0 ? (
              <div className="p-10 bg-card/70 dark:bg-slate-900/60 backdrop-blur-xl border border-border/60 dark:border-slate-800/80 rounded-2xl text-center flex flex-col items-center justify-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-1">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">No Roles Found Matching Criteria</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
                  No active openings match your current search or filter. Clear the filter or submit a speculative application below.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDept('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredRoles.map((role, idx) => (
                <motion.div
                  key={role.slug || role.id || role.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
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
                      {role.salary && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                          {role.salary}
                        </span>
                      )}
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
                    href={`/careers/${role.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs hover:shadow-md transition-all duration-200 shrink-0 select-none active:scale-95 group/btn"
                  >
                    <span>View Role & Apply</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
