import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  asH1?: boolean;
}

export function SectionHeader({
  badge,
  title,
  description,
  align = 'center',
  className,
  asH1 = false,
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-3.5 max-w-3xl mb-12 sm:mb-14 lg:mb-16',
        isCenter ? 'text-center mx-auto items-center' : 'text-left items-start',
        className
      )}
    >
      {badge && (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-3.5 py-1 text-[11px] font-mono font-bold tracking-wider uppercase rounded-full select-none',
            'bg-primary/10 text-primary border border-primary/20 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-400/25',
            isCenter ? 'mx-auto' : 'mx-0'
          )}
        >
          {badge}
        </span>
      )}
      {asH1 ? (
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-display font-extrabold tracking-tight text-foreground leading-[1.2] pb-0.5">
          {title}
        </h1>
      ) : (
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-display font-extrabold tracking-tight text-foreground leading-[1.2] pb-0.5">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-sm sm:text-base md:text-[17px] text-muted-foreground leading-relaxed max-w-2xl font-medium">
          {description}
        </p>
      )}
    </div>
  );
}
