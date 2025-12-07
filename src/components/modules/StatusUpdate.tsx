import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useProfileStore } from '../../store/useProfileStore';

export default function StatusUpdate() {
    const navigate = useNavigate();
    const { contacts } = useProfileStore();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [locationUrl, setLocationUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [sentStatus, setSentStatus] = useState<'none' | 'success' | 'error'>('none');
    const [sendToAll, setSendToAll] = useState(false);

    // Live Location Tracking
    useEffect(() => {
        if (contacts.length > 0) {
            setPhoneNumber(contacts[0].phone);
        }

        let watchId: number;
        if ('geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    // Update location instantly as user moves
                    setLocationUrl(`https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`);
                },
                (err) => console.error("Location Error:", err),
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000
                }
            );
        }

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [contacts]);

    const handleSend = async (status: 'safe' | 'unsafe') => {
        if (!sendToAll && !phoneNumber) {
            alert("Please enter a phone number");
            return;
        }

        setLoading(true);
        setSentStatus('none');

        try {
            // Construct message
            let messageBody = "";
            if (status === 'safe') {
                messageBody = `✅ I am SAFE.\n\nI just wanted to let you know I am okay.`;
            } else {
                messageBody = `❌ I am NOT SAFE.\n\nPlease contact me or help immediately.`;
            }

            if (locationUrl) {
                messageBody += `\n\nLocation:\n${locationUrl}`;
            }

            const encodedBody = encodeURIComponent(messageBody);

            // Determine recipients
            let recipients = phoneNumber;
            if (sendToAll && contacts.length > 0) {
                recipients = contacts.map(c => c.phone).join(',');
            }

            // phoneNumber from state or all contacts
            const smsUri = `sms:${recipients}?&body=${encodedBody}`;
            window.location.href = smsUri;

            setSentStatus('success');
            setTimeout(() => setSentStatus('none'), 3000);

            // Log to backend (optional)
            const backendUrl = `http://${window.location.hostname}:3000/status`;
            fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: recipients, status, locationURL: locationUrl })
            }).catch(() => { });

        } catch (error) {
            console.error(error);
            setSentStatus('error');
            alert("Failed to initiate SMS");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-charcoal-900 p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-8">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft className="h-6 w-6 text-charcoal-600 dark:text-gray-300" />
                </Button>
                <h1 className="text-2xl font-bold ml-4 text-charcoal-900 dark:text-white">Status Update</h1>
            </div>

            <div className="flex-1 flex flex-col max-w-md mx-auto w-full space-y-8">

                {/* Input Section */}
                <div className="bg-white dark:bg-charcoal-800 p-6 rounded-3xl shadow-soft">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Recipient Phone Number
                    </label>
                    <div className="relative mb-4">
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+91..."
                            disabled={sendToAll}
                            className={`w-full pl-4 pr-4 py-4 rounded-xl border border-gray-200 dark:border-charcoal-600 bg-gray-50 dark:bg-charcoal-700 text-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all ${sendToAll ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    {contacts.length > 0 && (
                        <div className="flex items-center space-x-2 mb-4">
                            <input
                                type="checkbox"
                                id="sendAll"
                                checked={sendToAll}
                                onChange={(e) => setSendToAll(e.target.checked)}
                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="sendAll" className="text-sm font-medium text-charcoal-700 dark:text-gray-300">
                                Send to All {contacts.length} Trusted Contacts
                            </label>
                        </div>
                    )}

                    {!sendToAll && contacts.length > 0 && (
                        <div className="mt-3 flex gap-2 flex-wrap">
                            {contacts.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setPhoneNumber(c.phone)}
                                    className="text-xs bg-lavender-100 text-lavender-700 px-3 py-1 rounded-full hover:bg-lavender-200"
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Location Status */}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <MapPin size={16} className={locationUrl ? "text-green-500" : "text-gray-400"} />
                    <span>{locationUrl ? "Location Attached" : "Locating..."}</span>
                </div>

                {/* Big Buttons */}
                <div className="grid grid-cols-1 gap-6">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                        onClick={() => handleSend('safe')}
                        className="h-32 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-500 flex flex-col items-center justify-center text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 transition-colors"
                    >
                        <CheckCircle size={48} className="mb-2" />
                        <span className="text-2xl font-bold">I'M SAFE</span>
                        <span className="text-sm opacity-80">Send "Safe" Message</span>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                        onClick={() => handleSend('unsafe')}
                        className="h-32 rounded-3xl bg-rose-100 dark:bg-rose-900/30 border-2 border-rose-500 flex flex-col items-center justify-center text-rose-700 dark:text-rose-400 hover:bg-rose-200 transition-colors"
                    >
                        <XCircle size={48} className="mb-2" />
                        <span className="text-2xl font-bold">I'M NOT SAFE</span>
                        <span className="text-sm opacity-80">Send "Unsafe" Alert</span>
                    </motion.button>
                </div>

                {/* Success Feedback */}
                {sentStatus === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-100 text-green-800 p-4 rounded-xl text-center font-bold"
                    >
                        Message Sent Successfully!
                    </motion.div>
                )}
            </div>
        </div>
    );
}
