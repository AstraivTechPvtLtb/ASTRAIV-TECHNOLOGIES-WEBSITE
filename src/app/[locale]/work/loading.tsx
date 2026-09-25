import { Skeleton } from '@/views/ui/skeleton';

export default function WorkLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between" aria-busy="true">
      <main className="flex-grow z-10 relative pt-24 md:pt-32">
        {/* Header Hero Section Skeleton */}
        <section className="px-6 max-w-7xl mx-auto text-center pb-10">
          <div className="inline-flex justify-center mb-4">
            <Skeleton className="h-6 w-44 rounded-full" />
          </div>
          <Skeleton className="h-10 sm:h-14 w-4/5 max-w-2xl mx-auto rounded-xl mb-4" />
          <div className="space-y-2 max-w-xl mx-auto">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 mx-auto rounded-md" />
          </div>

          {/* Quick Metrics Bar Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-card/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 space-y-2 text-left"
              >
                <Skeleton className="h-3 w-20 rounded-sm" />
                <Skeleton className="h-7 w-24 rounded-md" />
                <Skeleton className="h-3 w-28 rounded-sm" />
              </div>
            ))}
          </div>
        </section>

        {/* Case Studies Section Skeleton */}
        <section className="py-12 px-6 max-w-7xl mx-auto">
          {/* Filter Pills Skeleton */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>

          {/* Case Studies Cards Stack */}
          <div className="space-y-10 sm:space-y-12 max-w-6xl mx-auto">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-card/80 dark:bg-slate-900/70 p-6 sm:p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Image slot (exact aspect ratio container matching CaseStudiesSection) */}
                <div className="lg:col-span-6 w-full h-[240px] sm:h-[300px] md:h-[340px] rounded-2xl overflow-hidden bg-slate-200/80 dark:bg-slate-800/60">
                  <Skeleton className="w-full h-full rounded-none" />
                </div>

                {/* Content details slot */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-28 rounded-full" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-4/5 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />

                  {/* Highlights checklist */}
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                  </div>

                  {/* Button skeleton */}
                  <div className="pt-4 flex gap-3">
                    <Skeleton className="h-10 w-36 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
