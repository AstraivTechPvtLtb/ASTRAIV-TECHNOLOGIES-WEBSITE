import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 max-w-3xl mb-12 md:mb-16',
        align === 'center' ? 'text-center mx-auto' : 'text-left',
        className
      )}
    >
      {badge && (
        <span className="inline-flex self-start md:self-auto mx-0 md:mx-auto px-3.5 py-1 text-xs font-semibold tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20 dark:bg-primary/20 dark:text-primary-foreground uppercase w-fit">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/75 bg-clip-text">
        {title}
      </h2>
      {description && (
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
