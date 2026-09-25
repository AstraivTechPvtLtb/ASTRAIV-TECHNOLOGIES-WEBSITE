import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors select-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow-xs',
        enterprise:
          'border-primary/20 bg-primary/10 text-primary dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-300',
        secondary:
          'border-border/60 bg-secondary/10 text-secondary dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-300',
        neutral:
          'border-border/70 bg-card/80 text-muted-foreground dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300',
        success:
          'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500/30',
        destructive:
          'border-destructive/20 bg-destructive/10 text-destructive dark:border-destructive/30',
        outline:
          'border-border text-foreground bg-transparent',
      },
      size: {
        default: 'px-3 py-1 text-xs',
        sm: 'px-2.5 py-0.5 text-[11px]',
        mono: 'px-2.5 py-0.5 text-[10.5px] font-mono font-bold uppercase tracking-wider',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
