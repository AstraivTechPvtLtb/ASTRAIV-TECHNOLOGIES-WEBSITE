import { Skeleton } from '@/views/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-8 space-y-8" aria-busy="true">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded-md" />
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-border/50 dark:border-slate-800/80 bg-card/70 dark:bg-slate-900/60 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded-sm" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-3 w-32 rounded-sm" />
          </div>
        ))}
      </div>

      {/* 2-Column Split: Active Projects & Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-border/50 dark:border-slate-800/80 bg-card/70 dark:bg-slate-900/60 space-y-4">
          <Skeleton className="h-6 w-36 rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3].map((k) => (
              <div key={k} className="p-4 rounded-xl border border-border/40 dark:border-slate-800/60 space-y-2">
                <Skeleton className="h-5 w-44 rounded-md" />
                <Skeleton className="h-3.5 w-full rounded-sm" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border/50 dark:border-slate-800/80 bg-card/70 dark:bg-slate-900/60 space-y-4">
          <Skeleton className="h-6 w-36 rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3].map((k) => (
              <div key={k} className="p-4 rounded-xl border border-border/40 dark:border-slate-800/60 space-y-2">
                <Skeleton className="h-5 w-52 rounded-md" />
                <Skeleton className="h-3.5 w-3/4 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
