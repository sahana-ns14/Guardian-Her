import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ui/ThemeToggle';
import { motion } from 'framer-motion';
import { useSOSManager } from '../hooks/useSOSManager';
import { Settings } from 'lucide-react';
import { useEffect } from 'react';
import { processQueue } from '../lib/queue';

import CheckInWatcher from './modules/CheckInWatcher';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Initialize SOS Manager (GLOBAL)
    useSOSManager();

    // Offline Queue Processor
    useEffect(() => {
        const runQueue = () => processQueue('http://localhost:3000/sos');
        window.addEventListener('online', runQueue);

        // Try on load too
        runQueue();

        return () => window.removeEventListener('online', runQueue);
    }, []);

    return (
        <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 transition-colors duration-300 flex flex-col items-center">
            <CheckInWatcher />
            <header className="w-full max-w-md p-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-cream-50/80 dark:bg-charcoal-900/80">
                <div className="flex items-center gap-2">
                    <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full" />
                    <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-lavender-300">
                        Guardian-Her
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                        onClick={() => navigate('/settings')}
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-charcoal-600 dark:text-cream-50 transition-colors"
                        aria-label="Settings"
                    >
                        <Settings size={24} />
                    </button>
                </div>
            </header>

            <main className="w-full max-w-md flex-1 p-4 pb-20 relative">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};
