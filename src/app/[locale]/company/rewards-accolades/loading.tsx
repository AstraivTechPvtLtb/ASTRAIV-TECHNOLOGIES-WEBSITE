import { Skeleton } from '@/views/ui/skeleton';

export default function RewardsAccoladesLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between" aria-busy="true">
      <main className="flex-grow z-10 relative pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs Skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="h-4 w-12 rounded-sm" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-sm" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-32 rounded-sm" />
          </div>

          {/* Hero Header Skeleton */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
            <div className="flex justify-center">
              <Skeleton className="h-6 w-56 rounded-full" />
            </div>
            <Skeleton className="h-10 sm:h-14 w-4/5 max-w-xl mx-auto rounded-xl" />
            <Skeleton className="h-4 w-full max-w-md mx-auto rounded-md" />
            <Skeleton className="h-4 w-3/4 max-w-sm mx-auto rounded-md" />
          </div>

          {/* 4-Item Quick Metrics & Operational Reliability Ribbon Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 mb-12 sm:mb-16">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-2xl bg-card/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 space-y-2 text-left"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-3 w-24 rounded-sm" />
                </div>
                <Skeleton className="h-7 sm:h-8 w-28 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-sm" />
              </div>
            ))}
          </div>

          {/* Notice banner skeleton */}
          <div className="mb-14 sm:mb-16 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <Skeleton className="h-4 w-60 rounded-md" />
            <Skeleton className="h-3.5 w-full rounded-md" />
            <Skeleton className="h-3.5 w-4/5 rounded-md" />
          </div>

          {/* Accolades Directory Tabs + Grid Skeleton */}
          <div className="space-y-8">
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-9 w-28 rounded-full" />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card/80 dark:bg-slate-900/70 p-6 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-28 rounded-sm" />
                      <Skeleton className="h-3 w-20 rounded-sm" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                  <Skeleton className="h-3.5 w-full rounded-md" />
                  <Skeleton className="h-3.5 w-4/5 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
