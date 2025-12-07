import { useEffect } from 'react';
import { useCheckInStore } from '../../store/useCheckInStore';
import { useSOSStore } from '../../store/useSOSStore';
import { Button } from '../ui/Button';
import { AlertTriangle, Plus, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckInWatcher() {
    const { isActive, status, checkStatus, cancelCheckIn, extendCheckIn } = useCheckInStore();
    const { isActive: isSOSActive } = useSOSStore();

    // Cancel timer if SOS is activated manually (or by timer itself)
    useEffect(() => {
        if (isSOSActive && isActive) {
            cancelCheckIn();
        }
    }, [isSOSActive, isActive, cancelCheckIn]);

    // Global Loop
    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            checkStatus();

            // Vibrate during warning - triggered if status becomes warning
            const currentStatus = useCheckInStore.getState().status;
            if (currentStatus === 'warning') {
                try { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } catch (e) { }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, checkStatus]);

    const handleSafe = () => {
        cancelCheckIn();
        if (navigator.vibrate) navigator.vibrate(100);
    };

    const handleExtend = () => {
        extendCheckIn(10);
        if (navigator.vibrate) navigator.vibrate(200);
    };

    // Only render if warning or expired
    if (!isActive || (status !== 'warning' && status !== 'expired')) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border-4 border-red-500 text-center space-y-6"
                >
                    <div className="animate-bounce">
                        <AlertTriangle size={64} className="mx-auto text-red-500" />
                    </div>

                    <div>
                        <h2 className="text-3xl font-black text-red-600 dark:text-red-500 uppercase tracking-tighter">
                            {status === 'expired' ? 'SOS ACTIVATED' : 'ARE YOU SAFE?'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg font-medium">
                            {status === 'expired'
                                ? "Emergency alerts have been sent."
                                : "Timer checks ending soon."
                            }
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Button className="w-full h-16 text-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20" onClick={handleSafe}>
                            <CheckCircle className="mr-2" size={24} /> I'm Safe
                        </Button>

                        <Button variant="outline" className="w-full h-14 text-lg border-2" onClick={handleExtend}>
                            <Plus className="mr-2" /> Extend 10 Minutes
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
