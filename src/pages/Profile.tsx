import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '../store/useProfileStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ArrowLeft, User, Phone, FileText, Users, LogOut, Mail, ShieldCheck } from 'lucide-react';

export default function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { name, email, phone, medicalNotes, contacts, isAuthenticated, logoutUser } = useProfileStore();

    const handleLogout = () => {
        logoutUser();
        navigate('/welcome');
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
                    <ArrowLeft size={24} />
                </Button>
                <h2 className="text-xl font-bold dark:text-cream-50">{t('profile.title')}</h2>
            </div>

            <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                    <div className="w-24 h-24 bg-rose-100 dark:bg-rose-950/60 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-md">
                        <User size={48} />
                    </div>
                    {isAuthenticated && (
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-sm" title="Authenticated User">
                            <ShieldCheck size={18} />
                        </div>
                    )}
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-charcoal-800 dark:text-white">{name || "Guardian User"}</h3>
                    {email && (
                        <p className="text-sm text-charcoal-500 dark:text-lavender-200 flex items-center justify-center gap-1 mt-0.5">
                            <Mail size={14} /> {email}
                        </p>
                    )}
                    {phone && (
                        <p className="text-xs text-charcoal-400 dark:text-lavender-300 flex items-center justify-center gap-1 mt-0.5">
                            <Phone size={12} /> {phone}
                        </p>
                    )}
                </div>
            </div>

            <Card className="space-y-4">
                <div className="flex items-start gap-3">
                    <FileText className="text-charcoal-400 mt-1" size={20} />
                    <div>
                        <span className="block text-sm font-medium text-charcoal-900 dark:text-gray-100">{t('profile.medical_notes')}</span>
                        <p className="text-sm text-charcoal-600 dark:text-gray-400">{medicalNotes || t('profile.no_medical_notes')}</p>
                    </div>
                </div>
            </Card>

            <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <Users size={18} className="text-charcoal-500" />
                    <h3 className="font-semibold text-charcoal-700 dark:text-gray-200">{t('profile.trusted_contacts')}</h3>
                </div>
                {contacts.length === 0 && <p className="text-sm text-gray-400 px-1">{t('profile.no_contacts')}</p>}
                {contacts.map((c) => (
                    <Card key={c.id} className="p-3 flex justify-between items-center">
                        <div>
                            <p className="font-medium">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.phone}</p>
                        </div>
                        <Phone size={18} className="text-charcoal-400" />
                    </Card>
                ))}
            </div>

            <div className="pt-4 space-y-2">
                <Button
                    variant="outline"
                    className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                    onClick={handleLogout}
                >
                    <LogOut size={18} className="mr-2" />
                    {t('profile.sign_out')}
                </Button>
            </div>
        </div>
    );
}
