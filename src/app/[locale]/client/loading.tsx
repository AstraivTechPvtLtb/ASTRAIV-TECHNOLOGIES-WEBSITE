import { Skeleton } from '@/views/ui/skeleton';

export default function ClientPortalLoading() {
  return (
    <div className="p-6 md:p-8 space-y-6" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-80 rounded-md" />
      </div>

      {/* Datatable / Card List Skeleton */}
      <div className="rounded-2xl border border-border/40 dark:border-slate-800/80 bg-card/70 dark:bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-border/30 dark:border-slate-800/60">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl border border-border/30 dark:border-slate-800/40"
            >
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-44 rounded-sm" />
                <Skeleton className="h-3 w-64 rounded-sm" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
