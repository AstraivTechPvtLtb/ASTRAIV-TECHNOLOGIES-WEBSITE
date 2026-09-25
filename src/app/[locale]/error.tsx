'use client';

import { useEffect } from 'react';
import { Navbar, Footer } from '@/views';
import { Button, buttonVariants } from '@/views/ui/button';
import { RotateCcw, AlertTriangle, Home } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { cn } from '@/lib/utils';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected runtime exception for observability
    console.error('[Astraiv Client Runtime Interruption]:', error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-24 px-6 relative z-10">
        <div className="max-w-xl w-full text-center space-y-8">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold tracking-wide uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            Execution Interrupted
          </div>

          {/* Headline & Description */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
              Something went <span className="text-rose-400">wrong</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              An unexpected runtime error occurred while rendering this interface. Our telemetry has logged this exception.
            </p>
            {error.digest && (
              <p className="font-mono text-xs text-slate-500">
                Trace ID: {error.digest}
              </p>
            )}
          </div>

          {/* Recovery Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button onClick={() => reset()} size="lg" className="gap-2 font-bold cursor-pointer">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            <Link
              href={ROUTES.PUBLIC.HOME}
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'gap-2 font-bold cursor-pointer')}
            >
              <Home className="w-4 h-4" />
              Return to Home
            </Link>
            <a
              href="mailto:support@astraivtechnologies.com"
              className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'text-xs text-muted-foreground hover:text-foreground')}
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
