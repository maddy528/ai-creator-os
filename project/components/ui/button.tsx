'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40',
          variant === 'default' && 'bg-zinc-100 text-zinc-900 hover:bg-white',
          variant === 'outline' && 'border border-white/[0.08] bg-white/[0.03] text-zinc-200 hover:bg-white/[0.06]',
          variant === 'ghost' && 'text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100',
          variant === 'glow' && 'bg-indigo-600 text-white hover:bg-indigo-500 glow-pulse',
          size === 'sm' && 'px-3 py-1.5 text-xs',
          size === 'md' && 'px-4 py-2 text-sm',
          size === 'lg' && 'px-5 py-2.5 text-sm',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
