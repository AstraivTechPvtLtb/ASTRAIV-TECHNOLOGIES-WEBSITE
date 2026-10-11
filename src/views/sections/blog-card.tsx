import { ResilientImage } from '@/views/ui/resilient-image';
import { Card, CardContent, CardHeader, CardTitle } from '@/views/ui/card';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';

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
    <Card className="group relative flex flex-col overflow-hidden card-interactive rounded-2xl h-full">
      <CardHeader className="p-0 relative aspect-video overflow-hidden bg-muted">
        {imageUrl ? (
          <ResilientImage
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-103"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center text-muted-foreground text-sm font-medium">
            Astraiv Tech Insights
          </div>
        )}
        <div className="absolute top-3 left-3 skill-badge-gradient px-2.5 py-0.5 rounded-full text-xs font-mono font-medium text-foreground shadow-xs">
          {category}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-5">
        <div className="flex items-center gap-3 text-xs font-mono font-medium text-muted-foreground mb-3">
          <span>{publishedAt}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span>{readTime}</span>
        </div>
        <CardTitle className="text-lg font-medium tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          <Link href={ROUTES.PUBLIC.BLOG_DETAIL(slug)} className="after:absolute after:inset-0 after:z-10">{title}</Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-3 flex-1 font-light dark:font-normal">
          {summary}
        </p>
      </CardContent>
    </Card>
  );
}
