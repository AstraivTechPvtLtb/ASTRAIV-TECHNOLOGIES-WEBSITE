import { Skeleton } from '@/views/ui/skeleton';

export function StartProjectSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6" aria-busy="true">
      {/* Stepper Progress Bar Skeleton */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-3.5 w-32 rounded-sm" />
          <Skeleton className="h-3.5 w-16 rounded-sm" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Main Step Card Skeleton */}
      <div className="rounded-3xl border border-border/60 dark:border-slate-800/80 bg-card/80 dark:bg-slate-900/60 p-6 sm:p-10">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-7 sm:h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 max-w-full rounded-md" />
        </div>

        {/* 3x3 Project Type Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-border/50 dark:border-slate-800/70 bg-card/60 dark:bg-slate-900/50 space-y-3"
            >
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-3.5 w-full rounded-sm" />
              <Skeleton className="h-3.5 w-4/5 rounded-sm" />
            </div>
          ))}
        </div>

        {/* Action Controls Bar Skeleton */}
        <div className="mt-10 pt-6 border-t border-border/40 dark:border-slate-800/80 flex items-center justify-between">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-12 w-44 rounded-xl" />
        </div>
      </div>

      {/* Trust Badges Strip Skeleton */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-border/40 bg-card/40 dark:bg-slate-900/30 flex items-center justify-center gap-2.5"
          >
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3.5 w-40 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StartProjectLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between" aria-busy="true">
      <main className="pt-28 pb-16 flex-grow z-10 relative">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 mb-4 sm:mb-8 space-y-3">
          <div className="flex justify-center">
            <Skeleton className="h-6 w-52 rounded-full" />
          </div>
          <Skeleton className="h-10 sm:h-12 w-3/4 max-w-xl mx-auto rounded-xl" />
          <Skeleton className="h-4 w-full max-w-lg mx-auto rounded-md" />
        </div>
        <StartProjectSkeleton />
      </main>
    </div>
  );
}
