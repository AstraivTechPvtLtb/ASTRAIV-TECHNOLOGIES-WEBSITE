import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  avatarUrl?: string;
}

export function TestimonialCard({
  quote,
  authorName,
  authorRole,
  authorCompany,
  avatarUrl,
}: TestimonialCardProps) {
  return (
    <Card className="relative bg-card border border-border/40 overflow-hidden card-hover p-6 md:p-8">
      {/* Background Quote Icon for watermark style */}
      <Quote className="absolute right-6 top-6 h-16 w-16 text-primary/5 pointer-events-none" />
      
      <CardHeader className="p-0 flex flex-row items-center gap-4">
        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted border border-border">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={authorName}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm">
              {authorName.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col text-left">
          <h4 className="text-sm font-bold text-foreground">{authorName}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {authorRole}, <span className="font-semibold text-foreground/80">{authorCompany}</span>
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 mt-6">
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic">
          &ldquo;{quote}&rdquo;
        </p>
      </CardContent>
    </Card>
  );
}
