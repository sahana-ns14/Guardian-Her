import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '../store/useProfileStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Plus, X, ArrowRight } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function Setup() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { name, phone, medicalNotes, contacts, setProfile, addContact, removeContact, completeSetup } = useProfileStore();

    const [localName, setLocalName] = useState(name);
    const [localPhone, setLocalPhone] = useState(phone);
    const [localMedical, setLocalMedical] = useState(medicalNotes);

    const [newContactName, setNewContactName] = useState('');
    const [newContactPhone, setNewContactPhone] = useState('');

    const [locationStatus, setLocationStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');

    const handleEnableLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                () => setLocationStatus('granted'),
                () => setLocationStatus('denied')
            );
        }
    };

    const handleAddContact = () => {
        if (newContactName && newContactPhone) {
            addContact({ id: generateId(), name: newContactName, phone: newContactPhone });
            setNewContactName('');
            setNewContactPhone('');
        }
    };

    const handleFinish = () => {
        // Save all main fields
        setProfile({ name: localName, phone: localPhone, medicalNotes: localMedical });
        completeSetup();
        navigate('/');
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-charcoal-800 dark:text-cream-50">{t('onboarding.setup_title')}</h2>
                <p className="text-charcoal-600 dark:text-lavender-200 text-sm">Valid data helps us protect you better.</p>
            </div>

            <Card className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-lavender-200 ml-1 mb-1">
                        Language
                    </label>
                    <select
                        className="w-full px-4 py-3 rounded-xl border border-lavender-200 dark:border-charcoal-600 bg-white dark:bg-charcoal-900"
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                    >
                        <option value="en">English</option>
                        <option value="hi">हिंदी (Hindi)</option>
                        <option value="kn">ಕನ್ನಡ (Kannada)</option>
                        <option value="te">తెలుగు (Telugu)</option>
                    </select>
                </div>

                <Input
                    label={t('onboarding.name_label')}
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder="e.g. Aditi"
                />
                <Input
                    label={t('onboarding.phone_label')}
                    value={localPhone}
                    onChange={(e) => setLocalPhone(e.target.value)}
                    type="tel"
                    placeholder="+91..."
                />
                <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-lavender-200 ml-1 mb-1">
                        Medical Notes (Optional)
                    </label>
                    <textarea
                        className="w-full px-4 py-3 rounded-xl border border-lavender-200 dark:border-charcoal-600 bg-white dark:bg-charcoal-900 text-charcoal-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lavender-300 transition-all shadow-sm"
                        rows={3}
                        value={localMedical}
                        onChange={(e) => setLocalMedical(e.target.value)}
                        placeholder="Allergies, blood group..."
                    />
                </div>
            </Card>

            <Card className="p-4 flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-charcoal-800 dark:text-cream-50">Location Services</h3>
                    <p className="text-xs text-charcoal-500">Required for SOS tracking</p>
                </div>
                {locationStatus === 'granted' ? (
                    <span className="text-green-500 font-bold text-sm px-3 py-2 bg-green-50 rounded-lg">
                        Active ✓
                    </span>
                ) : (
                    <Button size="sm" variant="outline" onClick={handleEnableLocation} className="border-rose-200 text-rose-600">
                        Enable
                    </Button>
                )}
            </Card>

            <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                    <h3 className="font-semibold text-charcoal-800 dark:text-lavender-100">{t('onboarding.contacts_label')}</h3>
                    <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full">{contacts.length}/8</span>
                </div>

                {contacts.map((contact) => (
                    <motion.div
                        key={contact.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-between p-3 bg-white dark:bg-charcoal-800 rounded-xl shadow-sm border border-lavender-100 dark:border-charcoal-600"
                    >
                        <div>
                            <p className="font-medium text-charcoal-800 dark:text-cream-50">{contact.name}</p>
                            <p className="text-xs text-charcoal-500 dark:text-lavender-300">{contact.phone}</p>
                        </div>
                        <button onClick={() => removeContact(contact.id)} className="p-2 text-charcoal-400 hover:text-red-500">
                            <X size={18} />
                        </button>
                    </motion.div>
                ))}

                {contacts.length < 8 && (
                    <Card className="p-4 space-y-3 bg-lavender-50/50 dark:bg-charcoal-800/30 border-dashed border-2 border-lavender-200">
                        <Input
                            placeholder="Contact Name"
                            value={newContactName}
                            onChange={(e) => setNewContactName(e.target.value)}
                            className="bg-white/80"
                        />
                        <Input
                            placeholder="Phone Number"
                            type="tel"
                            value={newContactPhone}
                            onChange={(e) => setNewContactPhone(e.target.value)}
                            className="bg-white/80"
                        />
                        <Button variant="secondary" size="sm" onClick={handleAddContact} className="w-full" disabled={!newContactName || !newContactPhone}>
                            <Plus size={16} className="mr-2" /> Add Trusted Contact
                        </Button>
                    </Card>
                )}
            </div>

            <div className="pt-4">
                <Button variant="primary" size="lg" className="w-full" onClick={handleFinish} disabled={!localName || !localPhone}>
                    Complete Setup <ArrowRight size={20} className="ml-2" />
                </Button>
            </div>
        </div>
    );
}
