import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Globe } from 'lucide-react';

const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
];

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-charcoal-800 dark:text-white px-3 py-2 rounded-full font-medium shadow-sm hover:bg-white/30 transition-all"
            >
                <Globe size={18} />
                <span className="text-sm">{currentLang.native}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-charcoal-800 rounded-2xl shadow-xl border border-gray-100 dark:border-charcoal-700 overflow-hidden"
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-charcoal-700 transition-colors flex justify-between items-center ${i18n.language === lang.code ? 'font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'text-gray-700 dark:text-gray-200'
                                    }`}
                            >
                                <span>{lang.native}</span>
                                {i18n.language === lang.code && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
