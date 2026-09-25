import { Skeleton } from '@/views/ui/skeleton';

export default function ServiceDetailLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between" aria-busy="true">
      <main className="flex-grow z-10 relative pt-24 md:pt-32 pb-20">
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
          <div className="max-w-3xl mb-12 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32 rounded-sm" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-10 sm:h-14 w-full rounded-2xl" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />

            <div className="pt-4 flex gap-3">
              <Skeleton className="h-12 w-44 rounded-xl" />
              <Skeleton className="h-12 w-36 rounded-xl" />
            </div>
          </div>

          {/* 3-Card Deliverables Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-border/50 dark:border-slate-800/80 bg-card/70 dark:bg-slate-900/60 p-7 space-y-4"
              >
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
