import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/views/ui/card';
import { Button, buttonVariants } from '@/views/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  onSelectPlan?: () => void;
  href?: string;
}

export function PricingCard({
  name,
  price,
  period = '/mo',
  description,
  features,
  buttonText,
  isPopular = false,
  onSelectPlan,
  href,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        'relative flex flex-col h-full bg-card/90 dark:bg-card/70 backdrop-blur-xl border overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300',
        isPopular ? 'border-primary/60 dark:border-primary/50 shadow-card-hover ring-1 ring-primary/20' : 'border-border/70 dark:border-border/40'
      )}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary px-3.5 py-1 rounded-bl-xl text-[10px] sm:text-xs font-semibold text-primary-foreground tracking-wider uppercase z-10">
          Most Popular
        </div>
      )}
      
      <CardHeader className="p-5 sm:p-6 pb-0 flex flex-col">
        <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{name}</CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 min-h-[38px] leading-relaxed">{description}</p>
        <div className="flex items-baseline gap-1 mt-4 pt-3 border-t border-border/40 flex-wrap">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-heading">{price}</span>
          {price !== 'Custom' && <span className="text-xs sm:text-sm text-muted-foreground font-medium">{period}</span>}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-5 sm:p-6">
        <ul className="flex flex-col gap-3.5 my-auto">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-foreground/80 leading-snug">
              <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5 shrink-0">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 mt-auto">
        {href ? (
          <Link
            href={href}
            className={cn(
              buttonVariants({ variant: isPopular ? 'enterprise' : 'outline' }),
              'w-full font-semibold h-11 rounded-xl cursor-pointer'
            )}
          >
            {buttonText}
          </Link>
        ) : (
          <Button
            onClick={onSelectPlan}
            variant={isPopular ? 'enterprise' : 'outline'}
            className="w-full font-semibold h-11 rounded-xl cursor-pointer"
          >
            {buttonText}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
