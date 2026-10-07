import { buttonVariants, Button } from '@/views/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';

interface PricingCardProps {
  name: string;
  description: string;
  features: string[];
  price?: number | null;
  currency?: string;
  billingPeriod?: string;
  buttonText?: string;
  isPopular?: boolean;
  badge?: string | null;
  onSelectPlan?: () => void;
  href?: string;
}

export function PricingCard({
  name,
  description,
  features,
  price,
  currency = '$',
  billingPeriod,
  buttonText = 'Request a Quote',
  isPopular = false,
  badge,
  onSelectPlan,
  href,
}: PricingCardProps) {
  const displayBadge = badge || (isPopular ? 'Most Popular' : null);
  const hasValidPrice = typeof price === 'number' && price > 0;

  return (
    <div
      className={cn(
        'relative flex flex-col h-full bg-card dark:bg-card/75 backdrop-blur-xl border overflow-hidden rounded-2xl sm:rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6 sm:p-7 group',
        isPopular
          ? 'border-primary/60 dark:border-primary/50 shadow-card-hover ring-1 ring-primary/20'
          : 'border-border/70 dark:border-border/40 hover:border-primary/40'
      )}
    >
      {displayBadge && (
        <div className="absolute top-0 right-0 bg-primary px-3.5 py-1 rounded-bl-xl text-[10px] sm:text-xs font-semibold text-primary-foreground tracking-wider uppercase z-10 shadow-xs">
          {displayBadge}
        </div>
      )}

      {/* Header: Title & Description */}
      <div className="flex flex-col">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-heading pr-16">
          {name}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2.5 leading-relaxed font-normal">
          {description}
        </p>

        {/* Optional future price mode: rendered only when hasValidPrice is true */}
        {hasValidPrice && (
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold text-foreground">
              {`${currency}${price}`}
            </span>
            {billingPeriod && (
              <span className="text-xs text-muted-foreground font-medium">
                {`/${billingPeriod}`}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Inclusions / Features: natural flow, 20px-24px gap after description */}
      <div className="mt-5 sm:mt-6 flex-1 flex flex-col">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-3">
          What&apos;s Included:
        </div>
        <ul className="flex flex-col gap-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/85 leading-snug">
              <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5 shrink-0">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer CTA */}
      <div className="mt-8 pt-4 border-t border-border/40">
        {href ? (
          <Link
            href={href}
            className={cn(
              buttonVariants({ variant: isPopular ? 'enterprise' : 'outline' }),
              'w-full font-semibold h-11 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 group-hover:scale-[1.01] transition-transform'
            )}
          >
            <span>{buttonText}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <Button
            onClick={onSelectPlan}
            variant={isPopular ? 'enterprise' : 'outline'}
            className="w-full font-semibold h-11 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>{buttonText}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
