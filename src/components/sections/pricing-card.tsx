import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  onSelectPlan?: () => void;
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
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        'relative flex flex-col bg-card border card-hover overflow-hidden',
        isPopular ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'border-border/40'
      )}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary px-3.5 py-1 rounded-bl-lg text-xs font-semibold text-primary-foreground tracking-wider uppercase">
          Most Popular
        </div>
      )}
      
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-xl font-bold tracking-tight text-foreground">{name}</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
        <div className="flex items-baseline gap-1 mt-4">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">{price}</span>
          {price !== 'Custom' && <span className="text-sm text-muted-foreground font-medium">{period}</span>}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-6">
        <ul className="flex flex-col gap-3">
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
      
      <CardFooter className="p-6 pt-0">
        <Button
          onClick={onSelectPlan}
          variant={isPopular ? 'default' : 'outline'}
          className="w-full font-semibold"
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
