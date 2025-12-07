import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';

export const ThemeToggle = () => {
    const { theme, setTheme } = useSettingsStore();

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full bg-cream-200 dark:bg-charcoal-700 text-charcoal-800 dark:text-cream-50 hover:bg-cream-100 dark:hover:bg-charcoal-600 transition-colors shadow-sm"
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </motion.button>
    );
};
