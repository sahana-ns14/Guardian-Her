import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        const variants = {
            primary: 'bg-lavender-200 text-charcoal-800 hover:bg-lavender-300 dark:bg-lavender-300 dark:hover:bg-lavender-200 shadow-sm',
            secondary: 'bg-cream-200 text-charcoal-800 hover:bg-cream-100 dark:bg-charcoal-700 dark:text-cream-50',
            outline: 'border-2 border-lavender-300 text-charcoal-700 hover:bg-lavender-100 dark:border-charcoal-600 dark:text-cream-50',
            ghost: 'hover:bg-black/5 dark:hover:bg-white/10 text-charcoal-700 dark:text-cream-50',
            danger: 'bg-sos-red text-white hover:bg-red-500 shadow-glow',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm rounded-lg',
            md: 'px-4 py-2 text-base rounded-xl',
            lg: 'px-6 py-3 text-lg rounded-2xl',
            icon: 'p-2 rounded-full',
        };

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.96 }}
                className={cn(
                    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-lavender-300 disabled:opacity-50 disabled:pointer-events-none',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);
