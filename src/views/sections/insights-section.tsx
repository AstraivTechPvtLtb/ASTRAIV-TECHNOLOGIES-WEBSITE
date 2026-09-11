'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Clock, BookOpen } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { type BlogPost } from '@/controllers/blog.controller';

interface InsightsSectionProps {
  initialPosts?: BlogPost[];
}

export function InsightsSection({ initialPosts = [] }: InsightsSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Ensure we have at least one featured and 2-3 supporting articles
  const posts = initialPosts.length > 0 ? initialPosts : [
    {
      id: 'post-ai',
      title: 'AI-Driven Development: Navigating the Next Era of Enterprise Innovation',
      slug: 'future-of-ai-driven-enterprises',
      summary:
        'How forward-thinking leadership teams integrate autonomous AI agents and automated workflows to accelerate product engineering cycles without sacrificing code quality.',
      content: '',
      published: true,
      featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
      createdAt: '2026-08-01T09:00:00Z',
      categoryId: 'cat-business',
      category: { id: 'cat-business', name: 'Artificial Intelligence', slug: 'ai' },
      author: { name: 'Astraiv Engineering Lab', image: null },
    },
    {
      id: 'post-saas',
      title: 'Building Scalable SaaS Solutions in 2026',
      slug: 'building-scalable-saas-2026',
      summary: 'Explore the modern architectures powering high-performance, enterprise-grade SaaS environments using Next.js 16 and Prisma.',
      content: '',
      published: true,
      featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
      createdAt: '2026-08-15T10:00:00Z',
      categoryId: 'cat-tech',
      category: { id: 'cat-tech', name: 'Software Architecture', slug: 'tech' },
      author: { name: 'Astraiv Core', image: null },
    },
    {
      id: 'post-r2',
      title: 'Why Cloudflare R2 is the Future of Asset Delivery',
      slug: 'cloudflare-r2-asset-delivery',
      summary: 'A deep dive comparing AWS S3 egress costs with Cloudflare’s zero-egress asset bucket architecture.',
      content: '',
      published: true,
      featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      createdAt: '2026-07-25T11:00:00Z',
      categoryId: 'cat-cloud',
      category: { id: 'cat-cloud', name: 'Cloud Infrastructure', slug: 'cloud' },
      author: { name: 'Infrastructure Team', image: null },
    },
  ];

  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 4);

  return (
    <section id="insights" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-transparent relative scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header with Top-Right Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-slate-800 dark:text-slate-200 bg-secondary/10 dark:bg-secondary/20 border border-secondary/20 dark:border-secondary/30 mb-4 select-none">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              <span>INSIGHTS & PUBLICATIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Our Thinking & Architectural Blueprints
            </h2>
          </div>

          <Link
            href="/blog"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-card/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-border/80 dark:border-slate-800 transition-all select-none"
          >
            <span>View All Publications</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Featured Editorial Article (Matching PDF Page 4 Reference) */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group relative p-6 sm:p-10 lg:p-12 rounded-3xl bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800/90 hover:border-cyan-500/30 transition-all duration-300 shadow-xl overflow-hidden mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left: Article Narrative */}
              <div className="lg:col-span-6 flex flex-col justify-between text-left">
                <div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-cyan-300 border border-slate-700 inline-block mb-4">
                    {featuredPost.category?.name || 'Featured Publication'}
                  </span>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight mb-4 group-hover:text-cyan-300 transition-colors">
                    {featuredPost.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal mb-8 max-w-xl">
                    {featuredPost.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    <span>5 min read</span>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Right: Article Visual */}
              <div className="lg:col-span-6">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-2xl">
                  {featuredPost.featuredImage ? (
                    <Image
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center text-slate-700">
                      <BookOpen className="h-16 w-16 opacity-30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Secondary Editorial Stories Row */}
        {secondaryPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondaryPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group p-6 rounded-2xl bg-card/80 dark:bg-slate-900/70 border border-border/80 dark:border-slate-800 hover:border-primary/40 dark:hover:border-cyan-400/40 transition-all duration-200 flex flex-col justify-between text-left hover:-translate-y-1 shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary dark:text-cyan-400">
                      {post.category?.name || 'Engineering'}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-cyan-300 transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 font-normal">
                    {post.summary}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-cyan-400 pt-3 border-t border-border/40 dark:border-slate-800">
                  <span>Read Story</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
