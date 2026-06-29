import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/routing';

interface BlogCardProps {
  title: string;
  slug: string;
  summary: string;
  imageUrl?: string;
  category: string;
  publishedAt: string;
  readTime?: string;
}

export function BlogCard({
  title,
  slug,
  summary,
  imageUrl,
  category,
  publishedAt,
  readTime = '5 min read',
}: BlogCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden bg-card border border-border/40 hover:border-primary/20 card-hover h-full">
      <CardHeader className="p-0 relative aspect-video overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-103"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-muted-foreground text-sm font-semibold">
            Astraiv Tech Insights
          </div>
        )}
        <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-xs font-semibold text-primary border border-border">
          {category}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-medium">
          <span>{publishedAt}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span>{readTime}</span>
        </div>
        <CardTitle className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-3 flex-1">
          {summary}
        </p>
      </CardContent>
    </Card>
  );
}
