import { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ArrowLeft, Send, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { idb } from '../../lib/idb';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useSOSStore } from '../../store/useSOSStore';
import getResponse from '../../lib/chatbotData';
// @ts-ignore
import { franc } from 'franc-min';

interface Message {
    id: string;
    role: 'user' | 'bot';
    text: string;
    timestamp: number;
}

export default function Chatbot() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const { activateSOS } = useSOSStore();
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Quick constants (phone example)
    const MANIPAL_PHONES = ['08119 300 300', '080 3524 0555'];

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages]);

    const loadHistory = async () => {
        try {
            const history = await idb.getChatHistory();
            setMessages(history.map((h: any) => ({ ...h, role: h.role as 'user' | 'bot' })));
        } catch (e) {
            console.warn("idb load failed", e);
        }
    };

    // Speech recognition
    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSend(transcript);
            };
            recognition.start();
        } else {
            alert("Voice input not supported in this browser.");
        }
    };

    // TTS
    const speak = (text: string) => {
        if (!text) return;
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(text);
            u.onstart = () => setIsSpeaking(true);
            u.onend = () => setIsSpeaking(false);
            // stop previous before speaking
            try { window.speechSynthesis.cancel(); } catch (e) { }
            window.speechSynthesis.speak(u);
        }
    };

    // Core send handler
    const handleSend = async (textOverride?: string) => {
        const textToSend = (textOverride !== undefined) ? textOverride : input;
        if (!textToSend || !textToSend.trim()) return;

        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            text: textToSend,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        try { await idb.addChatMessage(userMsg); } catch (e) { /* ignore */ }

        // Language detection
        let detectedLang = 'eng';
        try {
            const lang = franc(textToSend) || 'eng';
            detectedLang = lang;
        } catch (e) { detectedLang = 'eng'; }

        const q = textToSend.toLowerCase();

        // If SOS-like phrase, trigger store
        const sosTriggers = ['sos', 'help', 'emergency', 'save me', 'मदद', 'सहाय्य', 'ಸಹಾಯ', 'సహాయం'];
        if (sosTriggers.some(k => q.includes(k))) {
            try { activateSOS(); } catch (e) { console.warn("activateSOS failed", e); }
            // build response via data file
            const botText = getResponse(textToSend, detectedLang);
            await pushBotResponse(botText);
            // vibrate and speak
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            try { speak(botText); } catch (e) { }
            return;
        }

        // navigation quick
        if (q.includes('guide me') || q.includes('safer route') || q.includes('guide me home')) {
            const botText = getResponse(textToSend, detectedLang);
            await pushBotResponse(botText);
            setTimeout(() => navigate('/routes'), 700);
            return;
        }

        // Normal reply
        let reply = getResponse(textToSend, detectedLang);
        if (!navigator.onLine) {
            reply = "(Offline Mode) " + reply;
        }

        // Add response
        await pushBotResponse(reply);
    };

    // Helper to push bot message and save to idb
    const pushBotResponse = async (text: string) => {
        const bot: Message = {
            id: crypto.randomUUID(),
            role: 'bot',
            text,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, bot]);
        try { await idb.addChatMessage(bot); } catch (e) { }
    };



    // Clear history
    const handleClear = async () => {
        setMessages([]);
        try { await idb.clearChat(); } catch (e) { }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                        <ArrowLeft size={24} />
                    </Button>
                    <h2 className="text-xl font-bold dark:text-cream-50">Safety Companion</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClear} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={20} />
                </Button>
            </div>

            <Card className="flex-1 overflow-y-auto space-y-4 mb-4 p-4" ref={containerRef as any}>
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        Say hello to your companion.
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                            ? 'bg-rose-200 text-rose-900 rounded-tr-none'
                            : 'bg-lavender-200 text-lavender-900 rounded-tl-none'
                            }`}>
                            {msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                        </div>
                    </div>
                ))}
            </Card>

            {/* Quick action row */}
            <div className="flex gap-2 items-center mb-2 px-1 overflow-x-auto">
                <Button size="sm" variant="outline" onClick={() => handleSend('guide me home')}>
                    Guide me home
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleSend('someone is following me')}>
                    Someone following
                </Button>
                <Button size="sm" variant="outline" onClick={() => pushBotResponse(`You can call Manipal Hospital: ${MANIPAL_PHONES.join(' / ')}\n- Book appointment\n- Consult doctor\n- Fever guidance`)}>
                    Call hospital
                </Button>
                <Button size="sm" variant="ghost" onClick={() => navigate('/emergency')}>
                    Emergency
                </Button>
            </div>

            <div className="flex gap-2 items-center">
                <Button
                    size="icon"
                    variant={isListening ? "primary" : "outline"}
                    className={isListening ? "animate-pulse" : ""}
                    onClick={startListening}
                >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </Button>

                <Button size="icon" variant="ghost" className={isSpeaking ? "text-rose-500 animate-pulse" : ""} onClick={() => speak(messages[messages.length - 1]?.text || "")}>
                    <Volume2 size={20} />
                </Button>

                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <Button size="icon" onClick={() => handleSend()}>
                    <Send size={20} />
                </Button>
            </div>
        </div>
    );
}