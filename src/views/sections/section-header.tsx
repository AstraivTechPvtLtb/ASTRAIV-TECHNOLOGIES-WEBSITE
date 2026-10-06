import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  badge?: string;
  title: string | React.ReactNode;
  highlight?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  asH1?: boolean;
}

export function renderFormattedTitle(title: React.ReactNode, highlight?: string): React.ReactNode {
  if (typeof title !== 'string') return title;

  // Bracket syntax: "Why Businesses [Choose Astraiv]" -> "Choose Astraiv" has gradient
  if (title.includes('[') && title.includes(']')) {
    const parts: React.ReactNode[] = [];
    const regex = /\[(.*?)\]/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(title)) !== null) {
      if (match.index > lastIndex) {
        parts.push(title.substring(lastIndex, match.index));
      }
      parts.push(
        <span
          key={match.index}
          className="heading-gradient font-semibold"
        >
          {match[1]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < title.length) {
      parts.push(title.substring(lastIndex));
    }

    return parts;
  }

  if (highlight && title.includes(highlight)) {
    const parts = title.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="heading-gradient font-semibold">
          {highlight}
        </span>
        {parts.slice(1).join(highlight)}
      </>
    );
  }

  return title;
}

export function SectionHeader({
  badge,
  title,
  highlight,
  description,
  align = 'center',
  className,
  asH1 = false,
}: SectionHeaderProps) {
  const isCenter = align === 'center';
  const formattedTitle = renderFormattedTitle(title, highlight);

  return (
    <div
      className={cn(
        'flex flex-col gap-3.5 max-w-3xl mb-12 sm:mb-14 lg:mb-16',
        isCenter ? 'text-center mx-auto items-center' : 'text-left items-start',
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10.5px] font-mono font-semibold uppercase tracking-wider bg-primary/10 dark:bg-blue-500/10 text-primary dark:text-blue-400 border border-primary/20 dark:border-blue-500/20 mb-1 select-none">
          {badge}
        </span>
      )}

      {asH1 ? (
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-semibold tracking-tight text-foreground leading-[1.15] pb-0.5">
          {formattedTitle}
        </h1>
      ) : (
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-semibold tracking-tight text-foreground leading-[1.15] pb-0.5">
          {formattedTitle}
        </h2>
      )}
      {description && (
        <p className="text-sm sm:text-base md:text-[17px] text-muted-foreground leading-[1.62] max-w-2xl font-normal">
          {description}
        </p>
      )}
    </div>
  );
}

