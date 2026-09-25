import { Skeleton } from '@/views/ui/skeleton';

export default function TestimonialsLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between" aria-busy="true">
      <main className="flex-grow z-10 relative pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs Skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="h-4 w-12 rounded-sm" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-14 rounded-sm" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-sm" />
          </div>

          {/* Hero Header Skeleton */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
            <div className="flex justify-center">
              <Skeleton className="h-6 w-36 rounded-full" />
            </div>
            <Skeleton className="h-10 sm:h-14 w-4/5 max-w-xl mx-auto rounded-xl" />
            <Skeleton className="h-4 w-full max-w-lg mx-auto rounded-md" />
            <Skeleton className="h-4 w-3/4 max-w-md mx-auto rounded-md" />
          </div>

          {/* Controls Bar Skeleton (Filter Tabs + Search) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-border/40 dark:border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-9 w-full md:w-72 rounded-xl" />
          </div>

          {/* 3-Column Testimonial Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-border/70 dark:border-slate-800/80 bg-card/80 dark:bg-slate-900/70 p-7 sm:p-8 flex flex-col justify-between space-y-6"
              >
                <div>
                  {/* Star Rating Skeleton */}
                  <div className="flex items-center gap-1.5 mb-5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Skeleton key={s} className="h-4 w-4 rounded-sm" />
                    ))}
                  </div>

                  {/* Quote Skeleton */}
                  <div className="space-y-2.5">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />
                    <Skeleton className="h-4 w-4/5 rounded-md" />
                  </div>
                </div>

                {/* Author Bio Footer Skeleton */}
                <div className="pt-4 border-t border-border/40 dark:border-slate-800/80 flex items-center gap-3.5">
                  <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-28 rounded-sm" />
                    <Skeleton className="h-3 w-36 rounded-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
