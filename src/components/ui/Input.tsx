import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-lavender-200 ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'w-full px-4 py-3 rounded-xl border border-lavender-200 dark:border-charcoal-600 bg-white dark:bg-charcoal-900 text-charcoal-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lavender-300 transition-all shadow-sm',
                        error && 'border-red-400 focus:ring-red-200',
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
            </div>
        );
    }
);
