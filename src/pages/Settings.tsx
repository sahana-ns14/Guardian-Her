import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { ArrowLeft, Bluetooth, Globe, Shield, LogOut, ChevronRight, User, X, Plus } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useBluetooth } from '../hooks/useBluetooth';
import { useProfileStore } from '../store/useProfileStore';

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function Settings() {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const { connect, status: bleStatus, isSupported } = useBluetooth();
    const { contacts, addContact, removeContact, clearProfile, logoutUser } = useProfileStore();

    const [newContactName, setNewContactName] = useState('');
    const [newContactPhone, setNewContactPhone] = useState('');

    const handleAddContact = () => {
        if (newContactName && newContactPhone) {
            addContact({ id: generateId(), name: newContactName, phone: newContactPhone });
            setNewContactName('');
            setNewContactPhone('');
        }
    };

    const handleBlePair = () => {
        if (!isSupported) {
            alert("Web Bluetooth is not supported in this browser.");
            return;
        }
        connect().catch(e => alert("Pairing failed: " + e));
    };

    const handleLogout = () => {
        clearProfile();
        logoutUser();
        try {
            localStorage.removeItem('guardianher_profile_v1');
        } catch (e) {}
        navigate('/welcome');
    };

    const currentLang = {
        'en': 'English',
        'hi': 'हिंदी (Hindi)',
        'kn': 'ಕನ್ನಡ (Kannada)',
        'te': 'తెలుగు (Telugu)'
    }[i18n.language] || 'English';

    const changeLanguage = () => {
        const langs = ['en', 'hi', 'kn', 'te'];
        const currIdx = langs.indexOf(i18n.language) !== -1 ? langs.indexOf(i18n.language) : 0;
        const nextLang = langs[(currIdx + 1) % langs.length];
        i18n.changeLanguage(nextLang);
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft size={24} />
                </Button>
                <h2 className="text-xl font-bold dark:text-cream-50">Settings</h2>
            </div>

            <div onClick={() => navigate('/profile')} className="cursor-pointer">
                <Card className="flex items-center gap-4 p-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-lavender-100 rounded-full flex items-center justify-center text-lavender-600">
                        <User size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-charcoal-900 dark:text-white">My Profile</h3>
                        <p className="text-xs text-charcoal-500">Manage personal details</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                </Card>
            </div>

            {/* Trusted Contacts Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Trusted Contacts</h3>
                    <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full">{contacts.length}/8</span>
                </div>

                {contacts.map((contact) => (
                    <Card key={contact.id} className="p-3 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-charcoal-800 dark:text-cream-50">{contact.name}</p>
                            <p className="text-xs text-charcoal-500 dark:text-lavender-300">{contact.phone}</p>
                        </div>
                        <button onClick={() => removeContact(contact.id)} className="p-2 text-charcoal-400 hover:text-red-500">
                            <X size={18} />
                        </button>
                    </Card>
                ))}

                {contacts.length < 8 && (
                    <Card className="p-4 space-y-3 bg-lavender-50/50 dark:bg-charcoal-800/30 border-dashed border-2 border-lavender-200">
                        {/* Simple inline add form - reusing layout/styles roughly */}
                        <div className="space-y-2">
                            <Input
                                placeholder="Contact Name"
                                value={newContactName}
                                onChange={(e) => setNewContactName(e.target.value)}
                                className="bg-white/80 h-10 text-sm"
                            />
                            <Input
                                placeholder="Phone Number"
                                type="tel"
                                value={newContactPhone}
                                onChange={(e) => setNewContactPhone(e.target.value)}
                                className="bg-white/80 h-10 text-sm"
                            />
                        </div>
                        <Button variant="secondary" size="sm" onClick={handleAddContact} className="w-full" disabled={!newContactName || !newContactPhone}>
                            <Plus size={16} className="mr-2" /> Add Trusted Contact
                        </Button>
                    </Card>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">Safety Devices</h3>
                <Card className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bluetooth className={bleStatus === 'connected' ? 'text-blue-500' : 'text-gray-400'} />
                            <div>
                                <p className="font-medium">Wearable Button</p>
                                <p className="text-xs text-gray-500">
                                    {bleStatus === 'connected' ? 'Connected' : bleStatus === 'connecting' ? 'Searching...' : 'Not Paired'}
                                </p>
                            </div>
                        </div>
                        <Button size="sm" variant={bleStatus === 'connected' ? 'outline' : 'primary'} onClick={handleBlePair}>
                            {bleStatus === 'connected' ? 'Disconnect' : 'Pair New'}
                        </Button>
                    </div>
                </Card>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">Preferences</h3>
                <Card className="divide-y divide-gray-100 dark:divide-charcoal-700">
                    <div className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Globe size={20} className="text-charcoal-600" />
                            <span>Language</span>
                        </div>
                        <button onClick={changeLanguage} className="text-sm font-medium text-rose-600">
                            {currentLang}
                        </button>
                    </div>
                    <div className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span>Appearance</span>
                        </div>
                        <ThemeToggle />
                    </div>
                    <div className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Shield size={20} className="text-charcoal-600" />
                            <span>Privacy Policy</span>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                    </div>
                </Card>
            </div>

            <div className="pt-6">
                <Button variant="outline" className="w-full text-charcoal-600 border-charcoal-200" onClick={handleLogout}>
                    <LogOut size={18} className="mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
