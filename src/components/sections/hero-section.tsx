import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  badgeText?: string;
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function HeroSection({
  badgeText = 'Announcing Astraiv SaaS 1.0',
  headline,
  subheadline,
  ctaText = 'Get Started',
  ctaHref = '/auth/signup',
  secondaryCtaText = 'Book a Consultation',
  secondaryCtaHref = '/contact',
}: HeroSectionProps) {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[85vh] py-20 px-6 overflow-hidden text-center bg-background border-b border-border/20">
      {/* Premium Gradient Background Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Decorative Top Grid Line Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6 md:gap-8">
        {/* Animated Badge */}
        {badgeText && (
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-foreground bg-secondary/80 border border-border/60 rounded-full shadow-xs backdrop-blur-xs select-none animate-fade-in">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>{badgeText}</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </div>
        )}

        {/* Large Premium Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] max-w-3xl">
          {headline}
        </h1>

        {/* Supporting Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
          {subheadline}
        </p>

        {/* Interactive Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
          <Link
            href={ctaHref}
            className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'h-12 px-8 font-semibold shadow-md')}
          >
            {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href={secondaryCtaHref}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'h-12 px-8 font-semibold bg-background/35 backdrop-blur-xs'
            )}
          >
            {secondaryCtaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
