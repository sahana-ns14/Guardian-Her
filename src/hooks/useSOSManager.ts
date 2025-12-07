import { useEffect, useRef } from 'react';
import { useSOSStore } from '../store/useSOSStore';
import { useProfileStore } from '../store/useProfileStore';
import { siren } from '../lib/audio';
import { useTranslation } from 'react-i18next';

export const useSOSManager = () => {
    const { isActive, addLocationLog } = useSOSStore();
    const { contacts } = useProfileStore();
    const { t } = useTranslation();
    const watchId = useRef<number | null>(null);
    const wakeLock = useRef<any>(null);

    useEffect(() => {
        if (isActive) {
            // 1. Start Siren Sound
            siren.start();

            // Auto-stop siren after 20 seconds
            setTimeout(() => {
                siren.stop();
            }, 20000);

            // 2. Vibrate (if supported)
            if (navigator.vibrate) {
                navigator.vibrate([500, 200, 500, 200, 1000]);
            }

            // 3. Wake Lock
            const requestWakeLock = async () => {
                try {
                    if ('wakeLock' in navigator) {
                        wakeLock.current = await (navigator as any).wakeLock.request('screen');
                    }
                } catch (err) {
                    console.error('Wake Lock error:', err);
                }
            };
            requestWakeLock();

            // 4. Location Tracking
            if ('geolocation' in navigator) {
                watchId.current = navigator.geolocation.watchPosition(
                    (position) => {
                        const { latitude, longitude, accuracy } = position.coords;
                        addLocationLog({
                            timestamp: Date.now(),
                            latitude,
                            longitude,
                            accuracy
                        });
                    },
                    (err) => console.error('GPS error', err),
                    { enableHighAccuracy: true, maximumAge: 0 }
                );
            }

        } else {
            // Cleanup
            siren.stop();
            if (watchId.current !== null) {
                navigator.geolocation.clearWatch(watchId.current);
                watchId.current = null;
            }
            if (wakeLock.current) {
                wakeLock.current.release();
                wakeLock.current = null;
            }
        }

        return () => {
            // Cleanup on unmount if still active
        };
    }, [isActive, contacts, addLocationLog, t]);
};
