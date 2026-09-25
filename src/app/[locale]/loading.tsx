import { Skeleton } from '@/views/ui/skeleton';

/**
 * Universal root-level page shell loading state.
 * Eliminates full-screen spinners and prevents Cumulative Layout Shift (CLS)
 * by reserving structural layout geometry.
 */
export default function RootLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between" aria-busy="true">
      {/* Structural layout skeleton aligned with global site grid */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:pt-36 md:pb-24">
        {/* Breadcrumb line skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-4 w-12 rounded-sm" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-sm" />
        </div>

        {/* Hero header skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="flex justify-center">
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>
          <Skeleton className="h-10 sm:h-12 w-4/5 max-w-xl mx-auto rounded-xl" />
          <div className="space-y-2 pt-1 max-w-md mx-auto">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 mx-auto rounded-md" />
          </div>
        </div>

        {/* Structural content grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((cardId) => (
            <div
              key={cardId}
              className="rounded-3xl border border-border/40 dark:border-slate-800/80 bg-card/60 dark:bg-slate-900/50 p-7 sm:p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>
              <div className="pt-4 border-t border-border/40 dark:border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-24 rounded-sm" />
                    <Skeleton className="h-3 w-32 rounded-sm" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
