'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BlogCard } from './blog-card';
import { formatDate } from '@/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  featuredImage: string | null;
  createdAt: Date | string;
  category: Category;
  author: {
    name: string;
    image: string | null;
  };
}

interface BlogListProps {
  initialPosts: Post[];
  categories: Category[];
}

export function BlogList({ initialPosts, categories }: BlogListProps) {
  const t = useTranslations('Blog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter posts based on category and search query
  const filteredPosts = initialPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' || post.category.slug === selectedCategory;
    
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 md:py-16 z-10 relative">
      {/* Search and Filters panel */}
      <div className="mb-12 max-w-4xl mx-auto flex flex-col gap-6">
        {/* Search bar */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-2xl blur-xl opacity-50 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative flex items-center bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-1.5 shadow-md transition-all duration-300 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
            <Search className="h-5 w-5 text-muted-foreground ml-3.5 mr-2.5 transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none py-2.5 text-sm md:text-base text-foreground placeholder:text-muted-foreground font-semibold"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {/* "All" button */}
          <button
            onClick={() => setSelectedCategory('all')}
            className="relative px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all duration-300 select-none cursor-pointer focus-visible:outline-none"
          >
            <span className={`relative z-10 transition-colors duration-300 ${selectedCategory === 'all' ? 'text-white dark:text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
              {t('allCategories')}
            </span>
            {selectedCategory === 'all' && (
              <motion.span
                layoutId="activeCategoryPill"
                className="absolute inset-0 bg-primary dark:bg-accent rounded-xl shadow-[0_4px_12px_rgba(91,95,239,0.3)] z-0"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}
            {selectedCategory === 'all' ? (
              <span className="sr-only" />
            ) : (
              <span className="absolute inset-0 rounded-xl bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-900/90 border border-slate-200/50 dark:border-slate-800/50 -z-10 transition-colors" />
            )}
          </button>

          {/* Individual Category buttons */}
          {categories.map((category) => {
            const isSelected = selectedCategory === category.slug;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className="relative px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all duration-300 select-none cursor-pointer focus-visible:outline-none"
              >
                <span
                  className={`relative z-10 transition-colors duration-300 ${
                    isSelected
                      ? 'text-white dark:text-slate-950 font-bold'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {category.name}
                </span>
                {isSelected && (
                  <motion.span
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-primary dark:bg-accent rounded-xl shadow-[0_4px_12px_rgba(91,95,239,0.3)] z-0"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
                {!isSelected && (
                  <span className="absolute inset-0 rounded-xl bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-900/90 border border-slate-200/50 dark:border-slate-800/50 -z-10 transition-colors" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid container with AnimatePresence for filter transitions */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto min-h-[300px]"
      >
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <motion.div
                layout
                key={post.id}
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <BlogCard
                  title={post.title}
                  slug={post.slug}
                  summary={post.summary}
                  imageUrl={post.featuredImage || undefined}
                  category={post.category.name}
                  publishedAt={formatDate(post.createdAt)}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="col-span-full flex flex-col items-center justify-center text-center p-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-200/40 dark:border-slate-800/40 max-w-lg mx-auto"
            >
              <Sparkles className="h-10 w-10 text-muted-foreground opacity-60 mb-4 animate-pulse" />
              <p className="text-sm md:text-base text-muted-foreground font-semibold">
                {t('noPosts')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
