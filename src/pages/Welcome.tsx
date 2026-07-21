import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { AnimatedHero } from '../components/ui/AnimatedHero';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

export default function Welcome() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen w-full bg-[#FDFBF7] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <motion.div
                className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />

            {/* Language Switcher - Top Right */}
            <div className="absolute top-4 right-4 z-20">
                <LanguageSwitcher />
            </div>

            {/* Main Content */}
            <div className="max-w-2xl w-full flex flex-col items-center space-y-8 relative z-10">
                {/* Animated Hero Illustration */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-lg"
                >
                    <AnimatedHero />
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-center space-y-3"
                >
                    <h1 className="text-5xl md:text-6xl font-bold text-[#2D3748] tracking-tight">
                        {t('onboarding.welcome_title')}
                    </h1>
                    <p className="text-lg md:text-xl text-[#4A5568] max-w-md mx-auto leading-relaxed px-4">
                        {t('onboarding.welcome_subtitle')}
                    </p>
                </motion.div>

                {/* Actions: Sign In, Sign Up, or Guest Setup */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="w-full max-w-sm space-y-3"
                >
                    <button
                        onClick={() => navigate('/login')}
                        className="group w-full bg-[#2D3748] hover:bg-[#1A202C] text-white font-semibold text-lg py-3.5 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3"
                    >
                        <Shield className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span>{t('onboarding.sign_in')}</span>
                    </button>

                    <button
                        onClick={() => navigate('/login?tab=register')}
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-base py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        <span>{t('onboarding.create_account')}</span>
                    </button>

                    <div className="pt-2 text-center">
                        <button
                            onClick={() => navigate('/setup')}
                            className="text-xs font-medium text-[#4A5568] hover:text-[#1A202C] underline underline-offset-4 transition-colors"
                        >
                            {t('onboarding.guest_setup')}
                        </button>
                    </div>
                </motion.div>

                {/* Footer Tagline */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-center pt-4 space-y-1"
                >
                    <p className="text-xs text-[#6B7280] italic">
                        {t('onboarding.footer_tagline')}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
