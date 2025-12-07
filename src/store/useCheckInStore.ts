import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSOSStore } from './useSOSStore';

interface CheckInState {
    isActive: boolean;
    endTime: number | null;
    status: 'idle' | 'running' | 'warning' | 'expired';
    duration: number; // in minutes

    startCheckIn: (minutes: number) => void;
    cancelCheckIn: () => void;
    extendCheckIn: (minutes: number) => void;
    checkStatus: () => void;
    setStatus: (status: 'idle' | 'running' | 'warning' | 'expired') => void;
}

export const useCheckInStore = create<CheckInState>()(
    persist(
        (set, get) => ({
            isActive: false,
            endTime: null,
            status: 'idle',
            duration: 0,

            startCheckIn: (minutes: number) => {
                const now = Date.now();
                const endTime = now + minutes * 60 * 1000;
                set({ isActive: true, endTime, duration: minutes, status: 'running' });
            },

            cancelCheckIn: () => {
                set({ isActive: false, endTime: null, status: 'idle', duration: 0 });
            },

            extendCheckIn: (minutes: number) => {
                const { endTime, duration } = get();
                if (endTime) {
                    const newEndTime = endTime + minutes * 60 * 1000;
                    set({ endTime: newEndTime, duration: duration + minutes, status: 'running' });
                }
            },

            setStatus: (status) => set({ status }),

            checkStatus: () => {
                const { isActive, endTime, status } = get();
                if (!isActive || !endTime) return;

                const now = Date.now();
                const timeLeft = endTime - now;

                if (timeLeft <= 0) {
                    if (status !== 'expired') {
                        set({ status: 'expired' });
                        useSOSStore.getState().activateSOS();
                    }
                } else if (timeLeft <= 10000) { // Last 10 seconds
                    if (status !== 'warning') {
                        set({ status: 'warning' });
                    }
                }
            }
        }),
        {
            name: 'check-in-storage',
        }
    )
);
