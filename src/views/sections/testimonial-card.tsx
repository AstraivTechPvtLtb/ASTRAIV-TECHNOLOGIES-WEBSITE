import { ResilientImage } from '@/views/ui/resilient-image';
import { Card, CardContent, CardHeader } from '@/views/ui/card';
import { Quote, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  avatarUrl?: string;
  rating?: number;
}

export function TestimonialCard({
  quote,
  authorName,
  authorRole,
  authorCompany,
  avatarUrl,
  rating = 5,
}: TestimonialCardProps) {
  // Ensure rating is an integer between 1 and 5
  const activeStars = Math.min(5, Math.max(1, Math.round(rating)));

  return (
    <Card className="group relative bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 hover:border-primary/40 dark:hover:border-blue-400/40 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 transform-gpu hover:-translate-y-1 overflow-hidden p-6 sm:p-7 flex flex-col justify-between h-full select-none">
      {/* Background Quote Watermark */}
      <Quote className="absolute right-6 top-6 h-16 w-16 text-primary/5 dark:text-blue-400/5 pointer-events-none group-hover:text-primary/10 transition-colors" />

      <div>
        {/* Star Rating Row (Always 5 stars total with filled & unfilled presentation) */}
        <div className="flex items-center gap-1 mb-5" aria-label={`${activeStars} out of 5 stars`}>
          {[1, 2, 3, 4, 5].map((starIdx) => (
            <Star
              key={starIdx}
              className={cn(
                'h-4 w-4 transition-colors',
                starIdx <= activeStars
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-200 dark:fill-slate-800 text-slate-300 dark:text-slate-700'
              )}
            />
          ))}
        </div>

        {/* Quote Content */}
        <CardContent className="p-0">
          <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed font-medium">
            &ldquo;{quote}&rdquo;
          </p>
        </CardContent>
      </div>

      {/* Author Footer */}
      <CardHeader className="p-0 mt-8 pt-5 border-t border-border/40 dark:border-slate-800/60 flex flex-row items-center gap-3.5">
        <div className="relative h-11 w-11 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-border/60 dark:border-slate-700/60 shrink-0">
          {avatarUrl ? (
            <ResilientImage
              src={avatarUrl}
              alt={authorName}
              fill
              sizes="44px"
              className="object-cover"
              fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-blue-300 font-bold text-xs font-mono">
              {authorName.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col text-left">
          <h3 className="text-sm font-extrabold text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
            {authorName}
          </h3>
          <p className="text-xs text-muted-foreground font-medium">
            {authorRole && authorCompany ? (
              <>
                {authorRole} • <span className="font-semibold text-secondary dark:text-indigo-400">{authorCompany}</span>
              </>
            ) : authorCompany ? (
              <span className="font-semibold text-secondary dark:text-indigo-400">{authorCompany}</span>
            ) : (
              authorRole || 'Client Partner'
            )}
          </p>
        </div>
      </CardHeader>
    </Card>
  );
}
