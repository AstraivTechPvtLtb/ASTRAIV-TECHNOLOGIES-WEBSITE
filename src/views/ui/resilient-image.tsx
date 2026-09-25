'use client';

import { useState, useEffect } from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';

export interface ResilientImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  containerClassName?: string;
  fallbackSrc?: string;
  showSkeleton?: boolean;
}

/**
 * ResilientImage ensures strictly ZERO Cumulative Layout Shift (CLS).
 * - Enforces fixed aspect ratio or reserved boundary
 * - Provides subtle skeleton while image bytes stream and decode
 * - Smoothly fades in once ready
 * - Gracefully falls back to a branded fallback image without altering layout
 */
export function ResilientImage({
  src,
  alt,
  className,
  containerClassName,
  fallbackSrc = '/images/portfolio/portfolio-pulsefit.jpg',
  showSkeleton = true,
  fill,
  ...props
}: ResilientImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-slate-100 dark:bg-slate-900/60',
        fill ? 'w-full h-full' : '',
        containerClassName
      )}
    >
      {/* Background Skeleton placeholder - only rendered while image is not yet loaded */}
      {showSkeleton && !isLoaded && (
        <Skeleton className="absolute inset-0 z-0 h-full w-full rounded-none" />
      )}

      <Image
        {...props}
        src={hasError ? fallbackSrc : imgSrc}
        alt={alt !== undefined ? alt : 'Astraiv Technologies visual asset'}
        fill={fill}
        className={cn(
          'transition-opacity duration-300 ease-out will-change-opacity',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onLoad={() => {
          setIsLoaded(true);
        }}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
            setIsLoaded(true);
          }
        }}
      />
    </div>
  );
}
