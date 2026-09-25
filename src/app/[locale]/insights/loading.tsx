import { Skeleton } from '@/views/ui/skeleton';

export default function InsightsLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between" aria-busy="true">
      <main className="flex-grow z-10 relative">
        {/* Editorial Header Skeleton */}
        <section className="pt-28 pb-8 md:pt-36 md:pb-10 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <Skeleton className="h-10 sm:h-12 w-80 max-w-full rounded-xl" />
              <Skeleton className="h-4 w-96 max-w-full rounded-md" />
            </div>
            <Skeleton className="h-12 w-full md:w-80 rounded-2xl" />
          </div>

          {/* Quick Nav Anchors Skeleton */}
          <div className="flex flex-wrap gap-2 pt-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-8 w-28 rounded-full" />
            ))}
          </div>
        </section>

        {/* Featured Publication Hero Skeleton */}
        <section className="px-6 max-w-7xl mx-auto mb-16">
          <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-card/80 dark:bg-slate-900/70 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 16:9 Image container skeleton */}
            <div className="lg:col-span-7 aspect-video w-full rounded-2xl overflow-hidden bg-slate-200/80 dark:bg-slate-800/60">
              <Skeleton className="w-full h-full rounded-none" />
            </div>

            <div className="lg:col-span-5 space-y-4">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-8 sm:h-10 w-full rounded-xl" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <div className="pt-4 flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28 rounded-sm" />
                  <Skeleton className="h-3 w-20 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Column Articles Grid Skeleton */}
        <section className="px-6 max-w-7xl mx-auto pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/40 dark:border-slate-800/80 bg-card/70 dark:bg-slate-900/60 overflow-hidden flex flex-col"
              >
                <div className="aspect-video w-full bg-slate-200/80 dark:bg-slate-800/60">
                  <Skeleton className="w-full h-full rounded-none" />
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-16 rounded-sm" />
                      <Skeleton className="h-3 w-16 rounded-sm" />
                    </div>
                    <Skeleton className="h-5 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />
                  </div>
                  <Skeleton className="h-3 w-24 rounded-sm pt-2" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
