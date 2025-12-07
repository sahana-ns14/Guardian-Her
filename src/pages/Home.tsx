import { Layout } from '../components/Layout';
import { SOSButton } from '../components/sos/SOSButton';

import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, MessageCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const modules = [
        {
            id: 'routes',
            label: t('home.safer_routes'),
            icon: MapPin,
            color: 'bg-lavender-200 text-lavender-800',
            delay: 0.1
        },
        {
            id: 'support',
            label: t('home.emergency_support'),
            icon: Phone,
            color: 'bg-rose-200 text-rose-800',
            delay: 0.2
        },
        {
            id: 'timer',
            label: t('home.check_in'),
            icon: Clock,
            color: 'bg-cream-200 text-yellow-800',
            delay: 0.3
        },
        {
            id: 'chatbot',
            label: t('home.chatbot'),
            icon: MessageCircle,
            color: 'bg-blue-200 text-blue-800',
            delay: 0.4
        },
        {
            id: 'report',
            label: t('home.report'),
            icon: AlertTriangle,
            color: 'bg-orange-200 text-orange-800',
            delay: 0.5
        },
        {
            id: 'status',
            label: 'Quick Status',
            icon: MessageCircle,
            color: 'bg-teal-200 text-teal-800',
            delay: 0.6
        },
    ];

    return (
        <Layout>
            <div className="flex flex-col h-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col justify-center"
                >
                    <SOSButton />
                </motion.div>

                <motion.div
                    className="grid grid-cols-2 gap-4 pb-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {modules.map((mod) => (
                        <motion.div
                            key={mod.id}
                            variants={{
                                hidden: { y: 20, opacity: 0 },
                                visible: { y: 0, opacity: 1 }
                            }}
                        >
                            <Button
                                variant="ghost"
                                className="w-full h-32 p-0 rounded-3xl overflow-hidden shadow-soft bg-white dark:bg-charcoal-800 hover:scale-[1.02] transition-transform"
                                onClick={() => navigate(`/${mod.id}`)}
                            >
                                <div className="flex flex-col items-center justify-center space-y-3 p-4 w-full h-full">
                                    <div className={`p-3 rounded-full ${mod.color} bg-opacity-50`}>
                                        <mod.icon size={24} />
                                    </div>
                                    <span className="text-sm font-medium text-charcoal-700 dark:text-gray-200">
                                        {mod.label}
                                    </span>
                                </div>
                            </Button>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Recent Info / Safety Tip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="pb-4"
                >
                    <h3 className="text-sm font-semibold text-charcoal-500 mb-2 ml-1">Recent Safety Reports</h3>
                    <div className="bg-white dark:bg-charcoal-800 p-4 rounded-2xl shadow-sm border border-lavender-100 dark:border-charcoal-600">
                        <p className="text-sm text-charcoal-600 dark:text-gray-300">No recent incidents reported in your area.</p>
                        <button onClick={() => navigate('/report')} className="text-rose-500 text-xs font-medium mt-2">Submit a report</button>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
