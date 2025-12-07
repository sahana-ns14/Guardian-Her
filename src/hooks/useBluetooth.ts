// @ts-nocheck
import { useState } from 'react';

export const useBluetooth = () => {
    const [device, setDevice] = useState<any>(null);
    const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [error, setError] = useState<string | null>(null);

    const connect = async () => {
        setError(null);
        setStatus('connecting');
        try {
            if (!navigator.bluetooth) {
                throw new Error("Bluetooth not supported");
            }
            // Request any device with a button service (generic UUID or standard)
            // For prototype, we filter by a common service or name prefix
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['battery_service'] // Example service
            });

            const server = await device.gatt?.connect();
            if (server) {
                setDevice(device);
                setStatus('connected');

                device.addEventListener('gattserverdisconnected', () => {
                    setStatus('disconnected');
                    setDevice(null);
                });
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Connection failed');
            setStatus('disconnected');
        }
    };

    const isSupported = 'bluetooth' in navigator;

    return { connect, status, device, error, isSupported };
};
