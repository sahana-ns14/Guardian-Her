import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ArrowLeft, Phone } from 'lucide-react';

export default function EmergencySupport() {
    const navigate = useNavigate();

    const contacts = [
        { name: 'Police Control Room', number: '100', color: 'bg-red-100 text-red-800' },
        { name: 'National Emergency', number: '112', color: 'bg-red-200 text-red-900' },
        { name: 'Women Helpline', number: '181', color: 'bg-rose-100 text-rose-800' },
        { name: 'Ambulance', number: '102', color: 'bg-blue-100 text-blue-800' },
        { name: 'Cyber Crime', number: '1930', color: 'bg-gray-100 text-gray-800' },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft size={24} />
                </Button>
                <h2 className="text-xl font-bold dark:text-cream-50">Emergency Support</h2>
            </div>

            <div className="grid gap-3">
                {contacts.map((c) => (
                    <Card key={c.number} className="flex items-center justify-between p-4">
                        <div>
                            <h3 className="font-bold text-lg">{c.name}</h3>
                            <p className="text-sm opacity-70">Tap to call</p>
                        </div>
                        <a href={`tel:${c.number}`}>
                            <Button size="icon" className={`rounded-full ${c.color} w-12 h-12`}>
                                <Phone size={24} />
                            </Button>
                        </a>
                    </Card>
                ))}
            </div>
        </div>
    );
}
