import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ArrowLeft, Check } from 'lucide-react';
import { idb } from '../../lib/idb';

export default function SafetyReporting() {
    const navigate = useNavigate();
    const [type, setType] = useState('');
    const [desc, setDesc] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const categories = ['Harassment', 'Suspicious Activity', 'Dark Area', 'Stalking', 'Other'];

    const handleSubmit = async () => {
        if (!type) return;

        const report = {
            id: crypto.randomUUID(),
            type,
            description: desc,
            timestamp: Date.now(),
            location: null, // Would capture geolocation here
            synced: false
        };

        await idb.addReport(report);
        setSubmitted(true);
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Check size={40} />
                </div>
                <h2 className="text-2xl font-bold">Report Saved</h2>
                <p>Thank you for helping keep others safe.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft size={24} />
                </Button>
                <h2 className="text-xl font-bold dark:text-cream-50">Report Issue</h2>
            </div>

            <Card className="space-y-6">
                <div className="space-y-3">
                    <label className="text-sm font-medium">What happened?</label>
                    <div className="grid grid-cols-2 gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setType(cat)}
                                className={`p-3 rounded-xl text-sm border transition-all ${type === cat
                                    ? 'bg-rose-100 border-rose-300 text-rose-800'
                                    : 'border-lavender-200 hover:bg-lavender-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Details (Optional)</label>
                    <textarea
                        className="w-full px-4 py-3 rounded-xl border border-lavender-200 dark:border-charcoal-600 bg-white dark:bg-charcoal-900"
                        rows={4}
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        placeholder="Describe the incident..."
                    />
                </div>

                <Button className="w-full" onClick={handleSubmit} disabled={!type}>
                    Submit Report
                </Button>
            </Card>
        </div>
    );
}
