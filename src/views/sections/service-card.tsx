'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/views/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

export interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  imageSrc?: string;
  badge?: string | null;
}

export function ServiceCard({
  icon,
  title,
  description,
  href,
  imageSrc = '/images/services/service-software.jpg',
  badge,
}: ServiceCardProps) {
  return (
    <Card className="group relative overflow-hidden bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 hover:border-primary/40 dark:hover:border-blue-400/40 select-none h-full flex flex-col justify-between rounded-[22px] shadow-xs hover:shadow-[0_16px_36px_-10px_rgba(11,61,145,0.12)] dark:hover:shadow-[0_16px_36px_-10px_rgba(37, 99, 235,0.12)] transition-all duration-300 transform-gpu hover:-translate-y-1.5">
      {/* Visual Image Header with zoom & gradient blend */}
      <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-slate-950/20">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Dual-theme gradient transition into card body */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent dark:from-slate-900 dark:via-slate-900/40 dark:to-transparent" />
        
        {/* Floating Category Badge */}
        {badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-slate-950/70 text-blue-300 backdrop-blur-md rounded-full border border-blue-400/30">
            {badge}
          </span>
        )}

        {/* Floating Icon Pod */}
        <div className="absolute bottom-3 right-4 h-10 w-10 flex items-center justify-center rounded-xl bg-card/90 dark:bg-slate-800/90 text-primary dark:text-blue-400 border border-border/60 dark:border-slate-700/60 shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
          {icon}
        </div>
      </div>

      <CardHeader className="relative z-10 p-5 sm:p-6 pb-2 flex-none">
        <CardTitle className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 flex-1 flex flex-col justify-between p-5 sm:p-6 pt-0">
        <CardDescription className="text-muted-foreground leading-relaxed text-xs sm:text-sm font-medium">
          {description}
        </CardDescription>

        <Link
          href={href}
          className="inline-flex items-center text-xs font-bold text-primary dark:text-blue-400 group-hover:text-primary/80 dark:group-hover:text-blue-300 transition-colors mt-5 pt-3 border-t border-border/40 dark:border-slate-800/60 w-full justify-between"
        >
          <span>Explore Service</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
}
