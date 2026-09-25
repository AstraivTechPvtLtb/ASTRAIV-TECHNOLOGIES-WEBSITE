import { Skeleton } from '@/views/ui/skeleton';

export default function ArticleDetailLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between" aria-busy="true">
      <main className="flex-grow z-10 relative pt-24 md:pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="h-4 w-12 rounded-sm" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-sm" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-32 rounded-sm" />
          </div>

          {/* Article Header Skeleton */}
          <div className="space-y-4 mb-8">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-10 sm:h-14 w-full rounded-2xl" />
            <Skeleton className="h-5 w-4/5 rounded-lg" />

            {/* Author & Timestamp Row */}
            <div className="flex items-center gap-4 pt-4 border-t border-border/40 dark:border-slate-800/80">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32 rounded-sm" />
                <Skeleton className="h-3 w-24 rounded-sm" />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          </div>

          {/* Featured Cover Media Skeleton (Matches actual 21:9 / 16:9 ratio container) */}
          <div className="w-full h-[260px] sm:h-[380px] md:h-[460px] rounded-3xl overflow-hidden bg-slate-200/80 dark:bg-slate-800/60 mb-12">
            <Skeleton className="w-full h-full rounded-none" />
          </div>

          {/* Article Body Skeleton (Paragraph blocks, subheadings) */}
          <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-11/12 rounded-md" />
            <Skeleton className="h-5 w-4/5 rounded-md" />

            <div className="pt-4 pb-2">
              <Skeleton className="h-8 w-2/3 rounded-xl" />
            </div>

            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-5/6 rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-3/4 rounded-md" />

            {/* Code / Callout block skeleton */}
            <div className="p-6 rounded-2xl bg-card/60 dark:bg-slate-900/60 border border-border/50 dark:border-slate-800/80 space-y-3">
              <Skeleton className="h-4 w-1/3 rounded-sm" />
              <Skeleton className="h-4 w-4/5 rounded-sm" />
              <Skeleton className="h-4 w-2/3 rounded-sm" />
            </div>

            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-4/5 rounded-md" />
          </div>
        </div>
      </main>
    </div>
  );
}
