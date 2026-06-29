import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface DataCardProps {
  title: string;
  value: string | number;
  change?: number; // percentage change, e.g. 12.5 or -3.2
  timeframe?: string; // e.g. "from last month"
  icon?: ReactNode;
  className?: string;
}

export function DataCard({
  title,
  value,
  change,
  timeframe = 'from last month',
  icon,
  className,
}: DataCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className={cn('bg-card border border-border/40 overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-2 space-y-0">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground/80">{icon}</div>}
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-sm',
                isPositive 
                  ? 'bg-green-500/10 text-green-600 dark:text-green-500' 
                  : 'bg-destructive/10 text-destructive'
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {isPositive ? '+' : ''}
              {change}%
            </span>
            <span className="text-xs text-muted-foreground font-medium">{timeframe}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
