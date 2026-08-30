'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/views/ui/card';
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
    <Card className="group relative overflow-hidden bg-card/85 dark:bg-slate-900/85 backdrop-blur-xl border border-border/50 hover:border-primary/40 dark:hover:border-accent/40 card-hover select-none h-full flex flex-col justify-between rounded-[20px] shadow-xs hover:shadow-md transition-all duration-300">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all duration-300" />
      
      <CardHeader className="relative z-10 p-6 pb-3 flex-none">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mb-2">
          {icon}
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-foreground mt-2">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 flex-1 flex flex-col justify-between p-6 pt-0">
        <CardDescription className="text-muted-foreground leading-relaxed text-sm font-medium">
          {description}
        </CardDescription>
        
        <Link 
          href={href}
          className="inline-flex items-center text-xs font-bold text-primary group-hover:text-primary/80 transition-colors mt-auto pt-4 w-fit"
        >
          Learn More <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
}
