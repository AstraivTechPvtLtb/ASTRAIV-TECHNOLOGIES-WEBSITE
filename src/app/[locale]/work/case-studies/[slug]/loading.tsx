import { Skeleton } from '@/views/ui/skeleton';

export default function CaseStudyDetailLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between" aria-busy="true">
      <main className="flex-grow z-10 relative pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb line skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="h-4 w-12 rounded-sm" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-sm" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-28 rounded-sm" />
          </div>

          {/* Hero Header Skeleton */}
          <div className="max-w-4xl mb-10 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-10 sm:h-14 w-full rounded-2xl" />
            <Skeleton className="h-5 w-4/5 rounded-lg" />
            <div className="flex flex-wrap gap-4 pt-2">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-5 w-28 rounded-md" />
              <Skeleton className="h-5 w-36 rounded-md" />
            </div>
          </div>

          {/* Featured Visual Image Container Skeleton (Strictly matching actual rendered aspect ratio) */}
          <div className="w-full h-[260px] sm:h-[340px] md:h-[440px] rounded-3xl overflow-hidden bg-slate-200/80 dark:bg-slate-800/60 mb-12">
            <Skeleton className="w-full h-full rounded-none" />
          </div>

          {/* 4-Item Impact Metric Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-card/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 space-y-2 text-left"
              >
                <Skeleton className="h-3.5 w-24 rounded-sm" />
                <Skeleton className="h-8 w-28 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-sm" />
              </div>
            ))}
          </div>

          {/* 2-Column Content Split Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              <div className="p-8 rounded-3xl bg-card/60 dark:bg-slate-900/50 border border-border/50 dark:border-slate-800/80 space-y-4">
                <Skeleton className="h-7 w-48 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-11/12 rounded-md" />
              </div>

              <div className="p-8 rounded-3xl bg-card/60 dark:bg-slate-900/50 border border-border/50 dark:border-slate-800/80 space-y-4">
                <Skeleton className="h-7 w-56 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>
            </div>

            {/* Sidebar metadata skeleton */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-card/60 dark:bg-slate-900/50 border border-border/50 dark:border-slate-800/80 space-y-4">
                <Skeleton className="h-5 w-32 rounded-md" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((k) => (
                    <Skeleton key={k} className="h-7 w-20 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
