import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/views/ui/card';
import { Quote, Star } from 'lucide-react';

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
  return (
    <Card className="group relative bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 hover:border-primary/40 dark:hover:border-blue-400/40 rounded-[22px] shadow-xs hover:shadow-[0_16px_36px_-10px_rgba(11,61,145,0.1)] dark:hover:shadow-[0_16px_36px_-10px_rgba(37, 99, 235,0.1)] transition-all duration-300 transform-gpu hover:-translate-y-1 overflow-hidden p-6 sm:p-8 flex flex-col justify-between h-full select-none">
      {/* Background Quote Watermark */}
      <Quote className="absolute right-6 top-6 h-16 w-16 text-primary/5 dark:text-blue-400/5 pointer-events-none group-hover:text-primary/10 transition-colors" />

      <div>
        {/* Star Rating Row */}
        <div className="flex items-center gap-1 mb-5">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
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
            <Image
              src={avatarUrl}
              alt={authorName}
              fill
              sizes="44px"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-blue-300 font-bold text-xs font-mono">
              {authorName.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col text-left">
          <h4 className="text-sm font-extrabold text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
            {authorName}
          </h4>
          <p className="text-xs text-muted-foreground font-medium">
            {authorRole} • <span className="font-semibold text-secondary dark:text-indigo-400">{authorCompany}</span>
          </p>
        </div>
      </CardHeader>
    </Card>
  );
}
