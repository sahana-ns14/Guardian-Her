import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
}

export const Card = ({ className, children, ...props }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'bg-white/90 dark:bg-charcoal-800/90 backdrop-blur-sm rounded-3xl shadow-soft p-6 border border-white/20 dark:border-charcoal-700',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};
