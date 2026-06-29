'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}

export function ServiceCard({ icon, title, description, href }: ServiceCardProps) {
  return (
    <Card className="group relative overflow-hidden bg-card border border-border/40 hover:border-primary/30 card-hover select-none">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all duration-300" />
      
      <CardHeader className="relative z-10 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mb-2">
          {icon}
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-foreground mt-2">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 flex flex-col justify-between h-36">
        <CardDescription className="text-muted-foreground leading-relaxed text-sm">
          {description}
        </CardDescription>
        
        <Link 
          href={href}
          className="inline-flex items-center text-xs font-semibold text-primary group-hover:text-primary/80 transition-colors mt-auto w-fit"
        >
          Learn More <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
}
