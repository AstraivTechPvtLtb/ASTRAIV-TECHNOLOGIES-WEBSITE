import { Skeleton } from '@/views/ui/skeleton';

export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between" aria-busy="true">
      <main className="flex-grow z-10 relative pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="h-4 w-12 rounded-sm" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-sm" />
          </div>

          {/* Hero Header Skeleton */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <div className="flex justify-center">
              <Skeleton className="h-6 w-40 rounded-full" />
            </div>
            <Skeleton className="h-10 sm:h-14 w-4/5 max-w-xl mx-auto rounded-xl" />
            <Skeleton className="h-4 w-full max-w-md mx-auto rounded-md" />
            <Skeleton className="h-4 w-3/4 max-w-sm mx-auto rounded-md" />
          </div>

          {/* 3 Pricing Tier Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {[1, 2, 3].map((tier) => (
              <div
                key={tier}
                className="rounded-3xl border border-border/60 dark:border-slate-800/80 bg-card/80 dark:bg-slate-900/70 p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-28 rounded-md" />
                    {tier === 2 && <Skeleton className="h-5 w-20 rounded-full" />}
                  </div>
                  <Skeleton className="h-4 w-full rounded-md" />

                  {/* Price Block Skeleton */}
                  <div className="pt-2 pb-2">
                    <Skeleton className="h-10 w-36 rounded-lg" />
                    <Skeleton className="h-3 w-24 rounded-sm mt-1" />
                  </div>

                  {/* Features List Skeleton */}
                  <div className="space-y-3 pt-4 border-t border-border/40 dark:border-slate-800/60">
                    {[1, 2, 3, 4, 5].map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                        <Skeleton className="h-3.5 w-full rounded-sm" />
                      </div>
                    ))}
                  </div>
                </div>

                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
