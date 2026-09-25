import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Universal accessible Skeleton loader.
 * Uses subtle, theme-aligned tokens with zero layout shift.
 * Respects user's reduced-motion preferences.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-md bg-slate-200/80 dark:bg-slate-800/60 animate-pulse motion-reduce:animate-none',
        className
      )}
      {...props}
    />
  );
}

/**
 * Pre-dimensioned Skeleton blocks for common editorial patterns
 */
export function TextSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2.5', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-3.5 rounded-sm',
            i === lines - 1 ? 'w-3/5' : i === 0 ? 'w-full' : 'w-5/6'
          )}
        />
      ))}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-2xl sm:rounded-3xl border border-border/50 dark:border-slate-800/80 bg-card/60 dark:bg-slate-900/50 p-6 sm:p-8 flex flex-col justify-between space-y-4',
        className
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
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
  );
}
