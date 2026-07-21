// src/lib/chatbotData.ts
// Multilingual chatbot response library + getResponse()
// Supports: English (eng), Hindi (hin), Kannada (kan), Telugu (tel).
// Guardian-Her personality: Empathetic, human-like, caring, protective, and smart.

type Lang = 'eng' | 'hin' | 'kan' | 'tel';

const templates: Record<Lang, any> = {
    eng: {
        intro: "I'm right here with you:",
        greetings: "Hello there! 👋 I'm Guardian-Her, your personal AI safety companion. How are you doing today? Tell me how you're feeling!",
        thanks: "You're very welcome! ❤️ I'm always right here whenever you need someone to talk to or stay safe with.",
        tired: "I understand how exhausting things can get. 🌸 Please rest and take care of yourself. If you are traveling home right now, I can find a bright safe route or monitor your journey.",
        water: "Please drink a glass of fresh water right away! 💧 Staying hydrated keeps your energy up and reduces dizziness. If you're out on the street and need to find a nearby store or safe haven to get water, I can guide you!",
        food: "Please get a good, warm meal when you can! 🍲 If you are going out alone to pick up food, make sure to stay on well-lit streets.",
        comfort: "Take a slow, deep breath with me. 🌿 Inhale... Exhale... You are safe, and I am watching over you right now. You are never alone.",
        
        emergency: {
            sosActivated: "🚨 ALERT: I am activating SOS mode right now.\n— Your live location is being sent to trusted contacts.\n— Stay calm. Help is on the way.",
            immediate: "⚠️ DANGER: If you feel in immediate danger:\n1. Scream 'HELP' or 'FIRE' loudly.\n2. Run towards any shop or crowded area.\n3. Press the SOS button below immediately."
        },
        safety: {
            following: [
                "1. Cross the street immediately to confirm if they are following.",
                "2. Walk briskly towards a shop, petrol pump, or crowded area.",
                "3. Do NOT go straight home if they are still behind you.",
                "4. Shall I trigger the SOS siren or call a contact for you?",
                "\n(I am watching over you. Stay on the line.)"
            ],
            threatened: [
                "1. Make loud noise. Attract attention immediately.",
                "2. Move away from the threat aggressively if needed.",
                "3. Dial 112 or 100 if safe to do so."
            ],
            general: [
                "1. Walk against traffic so vehicles can't creep up behind you.",
                "2. Keep your keys ready in your hand as a defensive tool.",
                "3. Share your live location with family now."
            ],
            whereAmI: [
                "I am fetching your precise location coordinates now...",
                "You can share this location with your trusted contacts instantly."
            ]
        },
        navigation: {
            guideHome: "I am opening Saferoutes to find the brightest, safest path for you.\n— Avoid dark alleys.\n— Stay on main roads.\n\n(I will guide you until you reach home safely.)",
            saferRoutesIntro: "I check for street lighting, police stations, and open shops to build your safe path."
        },
        health: {
            fever: [
                "1. Hydrate: Drink water or ORS immediately.",
                "2. Rest: Lie down in a cool room.",
                "3. Meds: Paracetamol (Dolo 650) is commonly used for fever, but consult a doctor if it persists."
            ],
            headache: [
                "1. Drink a glass of water (dehydration often causes headaches).",
                "2. Rest in a dark, quiet room for 15 mins.",
                "3. Apply a cold cloth to your forehead."
            ],
            period: [
                "1. A hot water bag on your lower tummy helps cramps.",
                "2. Drink warm ginger tea or water.",
                "3. Rest as much as possible."
            ]
        },
        casual: {
            howAreYou: "I'm active, healthy, and keeping a watchful eye on your safety! 🛡️ How are you doing right now?",
            joke: "Why did the computer go to the doctor?\nBecause it had a virus! 😄",
            aboutAI: "I am Guardian-Her AI — your 24/7 safety & emergency companion."
        },
        relationship: {
            stress: "I hear you. Stress can feel heavy, but you are strong. 💙 Take a deep breath and drink some water. I'm right here with you.",
            lonely: "You are never truly alone. I am here, and I care about you. 🤗 How can I support you right now?"
        },
        fallback: {
            default: "I'm right here with you! 💙 Tell me a bit more, or let me know if you need safe route guidance, emergency assistance, or health tips."
        },
        phoneOptionsLabel: "Tap to call directly:",
        confirmCall: "Shall I place this call for you?"
    },

    hin: {
        intro: "मैं आपके साथ हूँ:",
        greetings: "नमस्ते! 👋 मैं गार्डियन-हर हूँ, आपकी सुरक्षा साथी। आज आप कैसी हैं?",
        thanks: "आपका बहुत-बहुत स्वागत है! ❤️ मैं हमेशा आपके साथ हूँ।",
        tired: "थकावट महसूस हो रही है तो कृपया थोड़ा आराम करें। 🌸 अगर आप घर जा रही हैं, तो मैं आपके लिए सुरक्षित रास्ता ढूँढ सकती हूँ।",
        water: "कृपया तुरंत एक गिलास ताज़ा पानी पिएं! 💧 पानी पीने से शरीर में ऊर्जा रहती है। अगर आप बाहर हैं और पानी की दुकान चाहिए तो मैं रास्ता बता सकती हूँ!",
        food: "कृपया कुछ अच्छा और पौष्टिक खाना खाएं! 🍲 बाहर जाते समय सुरक्षित और रोशन रास्तों का इस्तेमाल करें।",
        comfort: "गहरी सांस लें। 🌿 आप पूरी तरह सुरक्षित हैं, मैं आपके साथ हूँ।",
        emergency: {
            sosActivated: "🚨 चेतावनी: मैं अभी SOS मोड सक्रिय कर रही हूँ।",
            immediate: "⚠️ खतरा: यदि आप खतरे में हैं तो तुरंत 112 डायल करें या SOS दबाएं।"
        },
        safety: {
            following: [
                "1. तुरंत सड़क पार करें।",
                "2. किसी दुकान या भीड़-भाड़ वाली जगह की ओर बढ़ें।",
                "3. सीधे घर न जाएं।"
            ],
            threatened: ["1. जोर से शोर मचाएं।", "2. 112 डायल करें।"],
            general: ["1. ट्रैफिक के सामने चलें।", "2. स्थान साझा करें।"],
            whereAmI: ["स्थान का पता लगाया जा रहा है..."]
        },
        navigation: {
            guideHome: "मैं आपके लिए सबसे सुरक्षित और रोशन रास्ता ढूँढ रही हूँ।",
            saferRoutesIntro: "सुरक्षित रास्ते की जाँच की जा रही है।"
        },
        health: {
            fever: ["1. पानी पिएं।", "2. आराम करें।", "3. डॉक्टर से सलाह लें।"],
            headache: ["1. पानी पिएं।", "2. अंधेरे कमरे में आराम करें।"],
            period: ["1. गर्म पानी की थैली इस्तेमाल करें।", "2. आराम करें।"]
        },
        casual: {
            howAreYou: "मैं बिल्कुल ठीक हूँ और आपकी सुरक्षा का ध्यान रख रही हूँ! 🛡️",
            joke: "वकील ने बेटे से क्या कहा? ऑर्डर, ऑर्डर! 😄",
            aboutAI: "मैं गार्डियन-हर एआई हूँ।"
        },
        relationship: {
            stress: "गहरी सांस लें और पानी पिएं। 💙 मैं आपके साथ हूँ।",
            lonely: "आप अकेली नहीं हैं। मैं यहाँ हूँ। 🤗"
        },
        fallback: {
            default: "मैं आपकी बात सुन रही हूँ! 💙 मुझे और बताएं कि आप कैसा महसूस कर रही हैं।"
        },
        phoneOptionsLabel: "कॉल करें:",
        confirmCall: "क्या मैं कॉल लगाऊं?"
    },

    kan: {
        intro: "ನಾನು ನಿಮ್ಮೊಂದಿಗಿದ್ದೇನೆ:",
        greetings: "ನಮಸ್ಕಾರ! 👋 ನಾನು ಗಾರ್ಡಿಯನ್-ಹರ್, ನಿಮ್ಮ ಸುರಕ್ಷತಾ ಸಂಗಾತಿ. ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        thanks: "ನಿಮಗೆ ಸ್ವಾಗತ! ❤️ ನಾನು ಯಾವಾಗಲೂ ನಿಮ್ಮೊಂದಿಗಿದ್ದೇನೆ.",
        tired: "ನಿಮಗೆ ಆಯಾಸವಾಗಿದೆ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬಲ್ಲೆ. 🌸 ಕೊಂಚ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.",
        water: "ದಯವಿಟ್ಟು ತಕ್ಷಣ ಒಂದು ಲೋಟ ನೀರು ಕುಡಿಯಿರಿ! 💧 ನೀರು ಕುಡಿಯುವುದು ನಿಮ್ಮ ಆರೋಗ್ಯಕ್ಕೆ ಬಹಳ ಮುಖ್ಯ.",
        food: "ದಯವಿಟ್ಟು ಉತ್ತಮ ಆಹಾರ ಸೇವಿಸಿ! 🍲 ಹೊರಗೆ ಹೋಗುವಾಗ ಸುರಕ್ಷಿತವಾಗಿರಿ.",
        comfort: "ದೀರ್ಘವಾಗಿ ಉಸಿರು ತೆಗೆದುಕೊಳ್ಳಿ. 🌿 ನೀವು ಸುರಕ್ಷಿತವಾಗಿದ್ದೀರಿ.",
        emergency: {
            sosActivated: "🚨 ಎಚ್ಚರಿಕೆ: SOS ಮೋಡ್ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ.",
            immediate: "⚠️ ಅಪಾಯ: ತಕ್ಷಣವೇ SOS ಬಟನ್ ಒತ್ತಿರಿ."
        },
        safety: {
            following: ["1. ರಸ್ತೆ ದಾಟಿ.", "2. ಜನನಿಬಿಡ ಪ್ರದೇಶಕ್ಕೆ ಹೋಗಿ.", "3. ಮನೆಗೆ ನೇರವಾಗಿ ಹೋಗಬೇಡಿ."],
            threatened: ["1. ಶಬ್ದ ಮಾಡಿ.", "2. 112 ಗೆ ಕರೆ ಮಾಡಿ."],
            general: ["1. ಲೈವ್ ಲೊಕೇಶನ್ ಹಂಚಿಕೊಳ್ಳಿ."],
            whereAmI: ["ಸ್ಥಳವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ..."]
        },
        navigation: {
            guideHome: "ನಾನು ಸುರಕ್ಷಿತ ಮಾರ್ಗ ಹುಡುಕುತ್ತಿದ್ದೇನೆ.",
            saferRoutesIntro: "ದಾರಿ ತೋರಿಸುತ್ತೇನೆ."
        },
        health: {
            fever: ["1. ನೀರು ಕುಡಿಯಿರಿ.", "2. ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ."],
            headache: ["1. ನೀರು ಕುಡಿಯಿರಿ.", "2. ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ."],
            period: ["1. ಬಿಸಿ ನೀರಿನ ಚೀಲ ಬಳಸಿ."]
        },
        casual: {
            howAreYou: "ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ! 🛡️ ನೀವು ಹೇಗಿದ್ದೀರಿ?",
            joke: "ಪರೀಕ್ಷೆ ಹೇಗಿತ್ತು? ಉತ್ತರ ಗೊತ್ತಿರಲಿಲ್ಲ! 😄",
            aboutAI: "ನಾನು ಗಾರ್ಡಿಯನ್-ಹರ್ ಎಐ."
        },
        relationship: {
            stress: "ಉಸಿರು ತೆಗೆದುಕೊಳ್ಳಿ, ನೀರು ಕುಡಿಯಿರಿ. 💙",
            lonely: "ನೀವು ಒಂಟಿಯಲ್ಲ. ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. 🤗"
        },
        fallback: {
            default: "ನಾನು ನಿಮ್ಮೊಂದಿಗಿದ್ದೇನೆ! 💙 ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ ತಿಳಿಸಿ."
        },
        phoneOptionsLabel: "ಕರೆ ಮಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ:",
        confirmCall: "ನಾನು ಕರೆ ಮಾಡಲೇ?"
    },

    tel: {
        intro: "నేను మీతో ఉన్నాను:",
        greetings: "నమస్కారం! 👋 నేను గార్డియన్-హెర్, మీ రక్షణ సహాయకురాలిని. మీరు ఎలా ఉన్నారు?",
        thanks: "మీకు స్వాగతం! ❤️ నేను ఎల్లప్పుడూ మీతోనే ఉంటాను.",
        tired: "కాసేపు ప్రశాంతంగా విశ్రాంతి తీసుకోండి. 🌸",
        water: "దయచేసి వెంటనే ఒక గ్లాసు మంచినీరు తాగండి! 💧 మంచి నీరు తాగడం చాలా మంచిది.",
        food: "దయచేసి మంచి ఆహారం తీసుకోండి! 🍲",
        comfort: "దీర్ఘంగా ఊపిరి తీసుకోండి. 🌿 మీరు సురక్షితంగా ఉన్నారు.",
        emergency: {
            sosActivated: "🚨 SOS మోడ్ ఆన్ చేయబడింది.",
            immediate: "⚠️ వెంటనే SOS బటన్ నొక్కండి."
        },
        safety: {
            following: ["1. రోడ్డు దాటండి.", "2. రద్దీ ప్రాంతం వైపు వెళ్ళండి."],
            threatened: ["1. 112 కి కాల్ చేయండి."],
            general: ["1. లొకేషన్ షేర్ చేయండి."],
            whereAmI: ["స్థానాన్ని తీసుకుంటున్నాను..."]
        },
        navigation: {
            guideHome: "సురక్షితమైన మార్గాన్ని చూపిస్తున్నాను.",
            saferRoutesIntro: "మార్గం సూచిస్తాను."
        },
        health: {
            fever: ["1. నీరు తాగండి.", "2. విశ్రాంతి తీసుకోండి."],
            headache: ["1. నీరు తాగండి."],
            period: ["1. విశ్రాంతి తీసుకోండి."]
        },
        casual: {
            howAreYou: "నేను సిద్ధంగా ఉన్నాను! 🛡️ మీరు ఎలా ఉన్నారు?",
            joke: "విలువే ఉండదు! 😄",
            aboutAI: "నేను గార్డియన్-హెర్ AI ని."
        },
        relationship: {
            stress: "నీరు తాగండి. 💙 నేను మీతోనే ఉన్నాను.",
            lonely: "మీరు ఒంటరి కాదు. నేను ఇక్కడే ఉన్నాను. 🤗"
        },
        fallback: {
            default: "నేను వింటున్నాను! 💙 మీరు ఎలా ఉన్నారో చెప్పండి."
        },
        phoneOptionsLabel: "కాల్ చేయడానికి నొక్కండి:",
        confirmCall: "నేను కాల్ చేయాలా?"
    }
};

function normalizeLang(langCode?: string): Lang {
    if (!langCode) return 'eng';
    const code = langCode.toLowerCase();
    if (code.startsWith('hin') || code === 'bod' || code === 'mai') return 'hin';
    if (code.startsWith('kan')) return 'kan';
    if (code.startsWith('tel')) return 'tel';
    return 'eng';
}

function includesAny(q: string, arr: string[]) {
    return arr.some(k => q.includes(k));
}

export function getResponse(query: string, langCode?: string): string {
    const lang = normalizeLang(langCode);
    const t = templates[lang];
    const raw = (query || '').trim();
    const q = raw.toLowerCase();

    if (!q) {
        return t.greetings;
    }

    // Keyword sets
    const sosKeywords = ['sos', 'help', 'emergency', 'save me', 'save', 'helpme', 'मदद', 'बचाओ', 'ಸಹಾಯ', 'సహాయం'];
    const followKeywords = ['following', 'follow', 'followed', 'behind me', 'pace', 'chasing', 'stalking', 'पीछा', 'ಹಿಂಬಾಲ', 'వెంబడిస్తున్నారు'];
    const guideHomeKeywords = ['guide me home', 'guide me', 'take me home', 'safer route', 'safer routes', 'route home', 'get me home', 'घर भेजो', 'घर जाना', 'ಮನೆಗೆ', 'ఇంటికి'];
    const whereKeywords = ['where am i', 'my location', 'share location', 'track me', 'कहाँ हूँ', 'location', 'ಸ್ಥಳ', 'ಲೊಕೇಷನ್'];
    const greetingKeywords = ['hello', 'hlello', 'helo', 'hi', 'hey', 'good morning', 'good evening', 'namaste', 'नमस्ते', 'ಹಲೋ', 'హలో'];
    const thanksKeywords = ['thanks', 'thank you', 'thanku', 'धन्यवाद', 'ಧನ್ಯವಾದ', 'ధన్యవాదాలు'];
    
    // Everyday human & comfort needs
    const waterKeywords = ['water', 'drink', 'thirsty', 'thirst', 'पानी', 'जल', 'ನೀರು', 'నీరు', 'మంచినీళ్లు'];
    const foodKeywords = ['food', 'hungry', 'eat', 'dinner', 'lunch', 'breakfast', 'खाना', 'भोजन', 'ಊಟ', 'ತಿಂಡಿ', 'ఆహారం', 'అన్నం'];
    const tiredKeywords = ['tired', 'sleepy', 'exhausted', 'drained', 'fatigue', 'rest', 'थक', 'ಆಯಾಸ', 'ಅಲಸಟ'];
    const comfortKeywords = ['scared', 'fear', 'frightened', 'nervous', 'panic', 'डर', 'ಭಯ', 'భయం'];

    const feverKeywords = ['fever', 'temperature', 'hot body', 'shivering', 'बुखार', 'ಜ್ವರ', 'ಜ్వరం'];
    const headacheKeywords = ['headache', 'head ache', 'migraine', 'head pain', 'सिरदर्द', 'ತಲೆನೋವು', 'తలనొప్పి'];
    const periodKeywords = ['period', 'menstrual', 'cramps', 'stomach pain', 'मासिक', 'ಮುಟ್ಟು', 'పీరిಯಡ್ಸ್'];

    // 1) SOS / Emergency Priority
    if (includesAny(q, sosKeywords) || q === 'sos') {
        return t.emergency.sosActivated;
    }

    // 2) Following / Being Followed
    if (includesAny(q, followKeywords)) {
        const lines = t.safety.following;
        return Array.isArray(lines) ? `${t.intro}\n\n${lines.join('\n')}` : `${t.intro}\n\n${lines}`;
    }

    // 3) Water / Hydration
    if (includesAny(q, waterKeywords)) {
        return t.water;
    }

    // 4) Food / Hunger
    if (includesAny(q, foodKeywords)) {
        return t.food;
    }

    // 5) Tiredness / Rest
    if (includesAny(q, tiredKeywords)) {
        return t.tired;
    }

    // 6) Fear / Comfort
    if (includesAny(q, comfortKeywords)) {
        return t.comfort;
    }

    // 7) Greetings
    if (includesAny(q, greetingKeywords)) {
        return t.greetings;
    }

    // 8) Thanks / Gratitude
    if (includesAny(q, thanksKeywords)) {
        return t.thanks;
    }

    // 9) Threatened / Harassed
    if (q.includes('threat') || q.includes('attack') || q.includes('harass') || q.includes('kill') || q.includes('hurt')) {
        const lines = t.safety.threatened;
        return Array.isArray(lines) ? `${t.intro}\n\n${lines.join('\n')}` : `${t.intro}\n\n${lines}`;
    }

    // 10) Guide home / Saferoute
    if (includesAny(q, guideHomeKeywords)) {
        return `${t.navigation.guideHome}\n\n${t.navigation.saferRoutesIntro}`;
    }

    // 11) Where am I / Location
    if (includesAny(q, whereKeywords)) {
        const lines = t.safety.whereAmI;
        return Array.isArray(lines) ? `${lines.join('\n')}` : `${lines}`;
    }

    // 12) Health Logic
    if (includesAny(q, feverKeywords)) {
        const lines = t.health.fever;
        return Array.isArray(lines) ? `${t.intro}\n\n${lines.join('\n')}` : `${t.intro}\n\n${lines}`;
    }
    if (includesAny(q, headacheKeywords)) {
        const lines = t.health.headache;
        return Array.isArray(lines) ? `${t.intro}\n\n${lines.join('\n')}` : `${t.intro}\n\n${lines}`;
    }
    if (includesAny(q, periodKeywords)) {
        const lines = t.health.period;
        return Array.isArray(lines) ? `${t.intro}\n\n${lines.join('\n')}` : `${t.intro}\n\n${lines}`;
    }

    // 13) Casual / Small talk
    if (q.includes('how are you') || q.includes('who are you')) {
        return t.casual.howAreYou;
    }
    if (q.includes('joke') || q.includes('funny') || q.includes('laugh')) {
        return t.casual.joke;
    }
    if (q.includes('ai') || q.includes('about you') || q.includes('guardian')) {
        return t.casual.aboutAI;
    }

    // 14) Relationship / Stress
    if (q.includes('stress') || q.includes('sad') || q.includes('depressed') || q.includes('anxiety') || q.includes('worry')) {
        return t.relationship.stress;
    }
    if (q.includes('lonely') || q.includes('alone') || q.includes('friend')) {
        return t.relationship.lonely;
    }

    // 15) Human Fallback
    return t.fallback.default;
}

export default getResponse;