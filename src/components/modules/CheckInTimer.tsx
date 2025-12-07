import { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useCheckInStore } from '../../store/useCheckInStore';
import { Clock, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CheckInTimer() {
    const navigate = useNavigate();
    // Destructure only what we use globally or needing update
    const { isActive, endTime, startCheckIn, cancelCheckIn, extendCheckIn } = useCheckInStore();
    const [timeLeftDisplay, setTimeLeftDisplay] = useState<string>('');
    const [progress, setProgress] = useState(100);

    // Local loop for UI View updates
    useEffect(() => {
        let interval: any;
        if (isActive) {
            // We just update View, logic handled by Store/Watcher
            interval = setInterval(() => {
                updateDisplay();
            }, 1000);
            updateDisplay();
        }
        return () => clearInterval(interval);
    }, [isActive, endTime]);

    const updateDisplay = () => {
        const state = useCheckInStore.getState();
        if (!state.endTime) return;
        const now = Date.now();
        const diff = state.endTime - now;

        if (diff <= 0) {
            setTimeLeftDisplay('00:00');
            setProgress(0);
            return;
        }

        const totalDuration = state.duration * 60 * 1000;
        const p = Math.min(100, Math.max(0, (diff / totalDuration) * 100));
        setProgress(p);

        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeftDisplay(`${m}:${s.toString().padStart(2, '0')}`);
    };

    const handleStart = (min: number) => {
        startCheckIn(min);
        updateDisplay();
        if (navigator.vibrate) navigator.vibrate(100);
    };

    const handleExtend = () => {
        extendCheckIn(10);
        if (navigator.vibrate) navigator.vibrate(200);
    };

    const handleSafe = () => {
        cancelCheckIn();
        if (navigator.vibrate) navigator.vibrate(100);
    };

    if (!isActive) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                        <ArrowLeft size={24} />
                    </Button>
                    <h2 className="text-xl font-bold dark:text-cream-50">Check-In Timer</h2>
                </div>

                <Card className="p-6 bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 text-center space-y-6">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-full inline-flex mx-auto">
                        <Clock size={48} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Set Safety Timer</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            I'll watch over your journey. If you don't check in before the timer expires, I'll alert your contacts.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <Button className="h-12 text-lg" variant="outline" onClick={() => handleStart(10)}>10 Minutes</Button>
                        <Button className="h-12 text-lg" variant="outline" onClick={() => handleStart(30)}>30 Minutes</Button>
                        <Button className="h-12 text-lg" variant="outline" onClick={() => handleStart(60)}>1 Hour</Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Active Running State (Normal)
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft size={24} />
                </Button>
                <h2 className="text-xl font-bold dark:text-cream-50">Timer Running</h2>
            </div>

            <Card className="p-8 bg-indigo-50 dark:bg-gray-800 border-2 border-indigo-500 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                {/* Progress Bar Background */}
                <div
                    className="absolute bottom-0 left-0 h-2 bg-indigo-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${progress}%` }}
                />

                <div className="flex flex-col items-center text-center space-y-8 py-4 relative z-10">
                    <div className="relative">
                        {/* Pulse Animation */}
                        <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20"></div>
                        <div className="relative bg-white dark:bg-gray-900 w-48 h-48 rounded-full border-8 border-indigo-100 dark:border-gray-700 flex items-center justify-center shadow-xl">
                            <span className="text-5xl font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                                {timeLeftDisplay}
                            </span>
                        </div>
                    </div>

                    <p className="text-lg font-medium text-indigo-900 dark:text-indigo-200 bg-indigo-100 dark:bg-gray-700 px-4 py-1 rounded-full">
                        Guardian is active
                    </p>

                    <div className="w-full space-y-3">
                        <Button
                            variant="primary"
                            className="w-full h-14 text-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200/50"
                            onClick={handleSafe}
                        >
                            I'm Safe
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-12 border-indigo-200 dark:border-gray-600"
                            onClick={handleExtend}
                        >
                            <Plus className="mr-2" size={18} />
                            Extend 10 Min
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
