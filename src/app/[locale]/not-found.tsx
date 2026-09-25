import { Link } from '@/i18n/routing';
import { Navbar, Footer } from '@/views';
import { ROUTES } from '@/routes';
import { Compass, Home, Layers, Sparkles } from 'lucide-react';
import { buttonVariants } from '@/views/ui/button';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-24 px-6 relative z-10">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            404 Error • Resource Missing
          </div>

          {/* Headline & Description */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading">
              Route <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">Not Found</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              The platform route or resource you are attempting to access does not exist or has been relocated within our enterprise architecture.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={ROUTES.PUBLIC.HOME}
              className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'gap-2')}
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
            <Link
              href={ROUTES.PUBLIC.SERVICES}
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'gap-2')}
            >
              <Layers className="w-4 h-4" />
              Explore Services
            </Link>
            <Link
              href={ROUTES.PUBLIC.START_PROJECT}
              className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'gap-2 text-muted-foreground hover:text-foreground')}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              Start a Project
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
