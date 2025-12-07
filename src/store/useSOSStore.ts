import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationLog {
    timestamp: number;
    latitude: number;
    longitude: number;
    accuracy: number;
}

interface SOSState {
    isActive: boolean;
    startTime: number | null;
    locationLogs: LocationLog[];
    activateSOS: () => void;
    deactivateSOS: () => void;
    addLocationLog: (log: LocationLog) => void;
}

export const useSOSStore = create<SOSState>()(
    persist(
        (set) => ({
            isActive: false,
            startTime: null,
            locationLogs: [],
            activateSOS: () => set({ isActive: true, startTime: Date.now() }),
            deactivateSOS: () => set({ isActive: false, startTime: null }),
            addLocationLog: (log) => set((state) => ({ locationLogs: [...state.locationLogs, log] })),
        }),
        {
            name: 'guardianher_sos_state_v1',
        }
    )
);
