import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSOSStore } from '../../store/useSOSStore';
import { useProfileStore } from '../../store/useProfileStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const SOSButton = () => {
    const { t } = useTranslation();
    const { isActive, activateSOS, deactivateSOS } = useSOSStore();
    const { contacts, name, phone } = useProfileStore();

    const [locationUrl, setLocationUrl] = React.useState("https://maps.google.com");

    // Continuous Live Tracking
    React.useEffect(() => {
        let watchId: number;
        if ('geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    setLocationUrl(`https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`);
                },
                (err) => console.error("SOS Loc Error:", err),
                { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
            );
        }
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    const handlePress = async () => {
        if (isActive) {
            deactivateSOS();
        } else {
            activateSOS();

            if (contacts.length === 0) {
                alert("⚠️ No trusted contacts found!\n\nPlease add contacts in Settings before using SOS.");
                deactivateSOS();
                return;
            }

            // Get FRESH current location when SOS is pressed
            let currentLocationUrl = locationUrl; // fallback to last known location

            try {
                // Get current position with high accuracy
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        resolve,
                        reject,
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                    );
                });

                // Update with FRESH coordinates
                currentLocationUrl = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
                console.log("✅ Fresh SOS Location:", currentLocationUrl);
            } catch (error) {
                console.error("❌ Could not get fresh location, using last known:", error);
            }

            const messageBody = `🚨 GUARDIAN-HER EMERGENCY ALERT 🚨
🚨 गार्जियन-हर आपातकालीन अलर्ट 🚨
🚨 ಗಾರ್ಡಿಯನ್-ಹರ್ ತುರ್ತು ಎಚ್ಚರಿಕೆ 🚨
🚨 గార్డియన్-హర్ అత్యవసర హెచ్చరిక 🚨

User / उपयोगकर्ता / ಬಳಕೆದಾರ / వినియోగదారు: ${name || 'Unknown'}
Phone / फोन / ಫೋನ್ / ఫోన్: ${phone || 'Unknown'}

⚠️ SHE NEEDS IMMEDIATE HELP!
⚠️ उसे तत्काल मदद की जरूरत है!
⚠️ ಅವಳಿಗೆ ತಕ್ಷಣದ ಸಹಾಯ ಬೇಕು!
⚠️ ఆమెకు తక్షణ సహాయం అవసరం!

📍 Live Location / लाइव स्थान / ನೇರ ಸ್ಥಳ / ప్రత్యక్ష స్థానం:
${currentLocationUrl}

Please help immediately! / कृपया तुरंत मदद करें! / ದಯವಿಟ್ಟು ತಕ್ಷಣ ಸಹಾಯ ಮಾಡಿ! / దయచేసి వెంటనే సహాయం చేయండి!`;

            console.log("📱 SOS ALERT DETAILS:");
            console.log("- Contacts count:", contacts.length);
            console.log("- Contacts:", contacts);
            console.log("- User name:", name);
            console.log("- User phone:", phone);
            console.log("- Message:", messageBody);

            // 2. Trigger Native SMS
            if (contacts.length > 0) {
                // Create a comma-separated list of numbers for the 'sms:' URI
                const recipients = contacts.map(c => c.phone).join(',');
                const encodedBody = encodeURIComponent(messageBody);

                // Construct the URI
                const smsUri = `sms:${recipients}?&body=${encodedBody}`;

                console.log("📨 SMS URI:", smsUri);
                console.log("📞 Recipients:", recipients);

                try {
                    window.location.href = smsUri;
                    console.log("✅ SMS app opened successfully");
                } catch (error) {
                    console.error("❌ Failed to open SMS app:", error);
                }
            }

            // 3. Log to Backend (Optional - just for record keeping)
            try {
                const backendUrl = `http://${window.location.hostname}:3000/sos`;
                console.log("🔄 Logging to backend:", backendUrl);
                fetch(backendUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contacts: contacts.map(c => ({ id: c.id, name: c.name, phone: c.phone })),
                        message: "SOS TRIGGERED (Native SMS)",
                        locationURL: currentLocationUrl,
                        timestamp: new Date().toISOString()
                    })
                }).then(() => {
                    console.log("✅ Backend log successful");
                }).catch(e => {
                    console.warn("⚠️ Backend log failed:", e);
                });
            } catch (e) {
                console.error("❌ Backend logging error:", e);
            }
        }
    };

    return (
        <div className="relative flex items-center justify-center py-10">
            {/* Ripple Effect Backgrounds */}
            <motion.div
                animate={isActive ? { scale: [1, 2], opacity: [0.5, 0] } : { scale: 1, opacity: 0.1 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={cn(
                    "absolute w-64 h-64 rounded-full",
                    isActive ? "bg-red-500" : "bg-rose-200 dark:bg-rose-900"
                )}
            />
            <motion.div
                animate={isActive ? { scale: [1, 1.5], opacity: [0.5, 0] } : { scale: 1, opacity: 0.1 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className={cn(
                    "absolute w-48 h-48 rounded-full",
                    isActive ? "bg-red-500" : "bg-rose-300 dark:bg-rose-800"
                )}
            />

            {/* Main Button */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                transition={isActive ? { duration: 0.8, repeat: Infinity } : {}}
                onClick={handlePress}
                className={cn(
                    "relative z-10 w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-glow transition-colors duration-300",
                    isActive
                        ? "bg-gradient-to-br from-red-500 to-red-600 text-white"
                        : "bg-gradient-to-br from-sos-red to-rose-400 text-white hover:from-red-500 hover:to-rose-500"
                )}
            >
                <span className="text-3xl font-bold tracking-widest">
                    {isActive ? t('sos.cancel') : t('home.sos_button')}
                </span>
                {isActive && (
                    <div className="flex flex-col items-center mt-2">
                        <span className="text-xs animate-pulse mb-2">Active</span>
                        <a
                            href="tel:112"
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white text-red-600 px-4 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-gray-100 transition-colors"
                        >
                            Call 112
                        </a>
                    </div>
                )}
            </motion.button>
        </div>
    );
};
