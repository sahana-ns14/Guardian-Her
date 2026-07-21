// src/lib/chatbotData.ts
// Multilingual chatbot response library + getResponse()
// Supports: English (eng), Hindi (hin), Kannada (kan), Telugu (tel).
// Guardian-Her personality: Caring, protective, practical, empathetic, and intelligent.

type Lang = 'eng' | 'hin' | 'kan' | 'tel';

const templates: Record<Lang, any> = {
    eng: {
        intro: "I'm with you. Here's what you can do right now:",
        greetings: "Hello there! 👋 I am Guardian-Her, your personal AI safety companion. How are you doing today? I am here to help keep you safe and supported.",
        thanks: "You're very welcome! ❤️ I'm always right here with you whenever you need assistance.",
        tired: "I understand how exhausting things can get. 🌸 Take a deep breath and rest if you are in a safe space. If you're heading home right now, I can find a well-lit safe route or start a Check-In Timer to watch over you while you travel.",

        emergency: {
            sosActivated: "🚨 ALERT: I am activating SOS mode right now.\n— Your live location is being sent to trusted contacts.\n— Stay on this page. Help is on the way.\n\n(I am here with you. Stay calm.)",
            immediate: "⚠️ DANGER: If you are in immediate danger:\n1. Scream 'HELP' or 'FIRE' loudly.\n2. Run towards any shop, crowd, or lit area.\n3. Press the SOS button below immediately.\n\n(I am guarding you. You are not alone.)"
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
                "3. Dial 112 or 100 if safe to do so.",
                "\n(Be brave. You have support.)"
            ],
            general: [
                "1. Walk against traffic so vehicles can't creep up behind you.",
                "2. Keep your keys ready in your hand as a defensive tool.",
                "3. Share your live location with family now.",
                "\n(I am here to guide you safely.)"
            ],
            whereAmI: [
                "I am fetching your precise location coordinates now...",
                "You can share this location with your trusted contacts instantly.",
                "\n(I'm keeping track of where you are.)"
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
                "3. Meds: Paracetamol (Dolo 650) is commonly used for fever, but consult a doctor if it persists.",
                "\n(Take care. I hope you feel better soon.)"
            ],
            headache: [
                "1. Drink a glass of water (dehydration often causes headaches).",
                "2. Rest in a dark, quiet room for 15 mins.",
                "3. Apply a cold cloth to your forehead.",
                "\n(Rest well. Health is priority.)"
            ],
            period: [
                "1. A hot water bag on your lower tummy helps cramps.",
                "2. Drink warm ginger tea or water.",
                "3. Rest as much as possible.",
                "\n(Be gentle with yourself today.)"
            ]
        },
        casual: {
            howAreYou: "I am active and monitoring for your safety! 🛡️\nHow are you feeling right now?\n\n(I'm here as your friend and protector.)",
            joke: "Why did the computer go to the doctor?\nBecause it had a virus! 😄\n\n(Smiling is good for health!)",
            aboutAI: "I am Guardian-Her AI — your 24/7 emergency & safety companion.\nI track live location, alert trusted contacts, guide you along well-lit routes, and offer medical/safety support.\n\n(I am always awake for you.)"
        },
        relationship: {
            stress: "I hear you. Stress can feel overwhelming, but you are strong. 💙\n1. Take a deep breath: Inhale (4s), Hold (4s), Exhale (6s).\n2. Drink some water.\n3. Can I help guide you home or start a timer for you?\n\n(I'm right here with you.)",
            lonely: "You are never truly alone. I am here, and help is always just a tap away. 🤗\nWould you like to hear a joke, check safer routes, or view safety tips?\n\n(I care about you.)"
        },
        fallback: {
            default: "I am listening! 🛡️ How can I assist you right now?\n\n— Type 'Guide me home' for safe routes\n— Type 'Someone is following me' for emergency steps\n— Type 'SOS' to trigger an alert\n— Or tell me how you are feeling!",
        },
        phoneOptionsLabel: "Tap to call directly:",
        confirmCall: "Shall I place this call for you?"
    },

    hin: {
        intro: "मैं आपके साथ हूँ। यहाँ बताया गया है कि आप क्या कर सकती हैं:",
        greetings: "नमस्ते! 👋 मैं गार्डियन-हर हूँ, आपकी सुरक्षा साथी। आज आप कैसी हैं? मैं आपकी मदद के लिए यहाँ हूँ।",
        thanks: "आपका बहुत-बहुत स्वागत है! ❤️ मैं हमेशा आपके साथ हूँ।",
        tired: "मैं समझ सकती हूँ कि आप थकी हुई महसूस कर रही हैं। 🌸 थोड़ा आराम करें। अगर आप घर जा रही हैं, तो मैं आपके लिए सुरक्षित रास्ता ढूँढ सकती हूँ या टाइमर चालू कर सकती हूँ।",
        emergency: {
            sosActivated: "🚨 चेतावनी: मैं अभी SOS मोड सक्रिय कर रही हूँ। \n— आपका लाइव स्थान भरोसेमंद संपर्कों को भेजा जा रहा है।\n— कृपया यहाँ रहें। मदद रास्ते में है।",
            immediate: "⚠️ खतरा: यदि आप तत्काल खतरे में हैं:\n1. जोर से 'बचाओ' चिल्लाएं।\n2. किसी भीड़ या दुकान की ओर दौड़ें।\n3. तुरंत SOS बटन दबाएं।"
        },
        safety: {
            following: [
                "1. तुरंत सड़क पार करें और देखें कि क्या वे पीछे हैं।",
                "2. किसी दुकान या भीड़-भाड़ वाली जगह की ओर तेजी से चलें।",
                "3. सीधे घर न जाएं।",
                "4. क्या मैं आपके लिए सायरन बजाऊं या कॉल करूं?"
            ],
            threatened: [
                "1. जोर से शोर मचाएं। तुरंत ध्यान आकर्षित करें।",
                "2. खतरे से दूर जाएं।",
                "3. सुरक्षित होने पर 112 डायल करें।"
            ],
            general: [
                "1. ट्रैफिक की विपरीत दिशा में चलें।",
                "2. अपनी चाबियों को हाथ में रखें।",
                "3. अपना लाइव स्थान परिवार के साथ साझा करें।"
            ],
            whereAmI: [
                "मैं अभी आपके स्थान का पता लगा रही हूँ...",
                "आप इस स्थान को अपने संपर्कों के साथ तुरंत साझा कर सकती हैं।"
            ]
        },
        navigation: {
            guideHome: "मैं आपके लिए सबसे सुरक्षित और रोशन रास्ता खोजने के लिए सेफ-रूट्स खोल रही हूँ।",
            saferRoutesIntro: "मैं स्ट्रीट लाइट और भीड़ की जाँच करके रास्ता बनाती हूँ।"
        },
        health: {
            fever: [
                "1. पानी या ORS तुरंत पिएं।",
                "2. ठंडे कमरे में आराम करें।",
                "3. दवा: पैरासिटामोल (Dolo 650) आम है, लेकिन डॉक्टर से सलाह लें।"
            ],
            headache: [
                "1. एक गिलास पानी पिएं।",
                "2. 15 मिनट के लिए शांत कमरे में आराम करें।",
                "3. माथे पर ठंडा कपड़ा रखें।"
            ],
            period: [
                "1. पेट पर गर्म पानी की थैली रखें।",
                "2. गर्म अदरक की चाय पिएं।",
                "3. आराम करें।"
            ]
        },
        casual: {
            howAreYou: "मैं तैयार हूँ और आपकी सुरक्षा की निगरानी कर रही हूँ! 🛡️ आप कैसी हैं?",
            joke: "वकील ने अपने बेटे से क्या कहा? \nऑर्डर, ऑर्डर! 😄",
            aboutAI: "मैं गार्डियन-हर एआई हूँ — आपकी सुरक्षा साथी।"
        },
        relationship: {
            stress: "तनाव भारी होता है, लेकिन आप मजबूत हैं। 💙 गहरी सांस लें और पानी पिएं।",
            lonely: "आप अकेली नहीं हैं। मैं यहाँ हूँ। 🤗"
        },
        fallback: {
            default: "मैं आपकी बात सुन रही हूँ! 🛡️ मैं आपकी कैसे मदद कर सकती हूँ?\n\n— 'मुझे घर ले चलो' टाइप करें\n— 'कोई पीछा कर रहा है' टाइप करें\n— या बताएं कि आप कैसा महसूस कर रही हैं!"
        },
        phoneOptionsLabel: "कॉल करने के लिए टैप करें:",
        confirmCall: "क्या मैं कॉल लगाऊं?"
    },

    kan: {
        intro: "ನಾನು ನಿಮ್ಮೊಂದಿಗಿದ್ದೇನೆ. ನೀವು ಈಗ ಏನು ಮಾಡಬಹುದು ಎಂಬುದು ಇಲ್ಲಿದೆ:",
        greetings: "ನಮಸ್ಕಾರ! 👋 ನಾನು ಗಾರ್ಡಿಯನ್-ಹರ್, ನಿಮ್ಮ ಸುರಕ್ಷತಾ ಸಂಗಾತಿ. ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        thanks: "ನಿಮಗೆ ಸ್ವಾಗತ! ❤️ ನಾನು ಯಾವಾಗಲೂ ನಿಮ್ಮೊಂದಿಗಿದ್ದೇನೆ.",
        tired: "ನಿಮಗೆ ಆಯಾಸವಾಗಿದೆ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬಲ್ಲೆ. 🌸 ಕೊಂಚ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ. ನೀವು ಮನೆಗೆ ಹೊರಟಿದ್ದರೆ ನಾನು ಸುರಕ್ಷಿತ ಮಾರ್ಗ ತೋರಿಸಬಲ್ಲೆ.",
        emergency: {
            sosActivated: "🚨 ಎಚ್ಚರಿಕೆ: ನಾನು ಈಗ SOS ಮೋಡ್ ಸಕ್ರಿಯಗೊಳಿಸುತ್ತಿದ್ದೇನೆ.",
            immediate: "⚠️ ಅಪಾಯ: ತಕ್ಷಣವೇ SOS ಬಟನ್ ಒತ್ತಿರಿ ಅಥವಾ ಸಹಾಯಕ್ಕಾಗಿ ಕಿರುಚಿ."
        },
        safety: {
            following: [
                "1. ಅವರು ಹಿಂಬಾಲಿಸುತ್ತಿದ್ದಾರೆಯೇ ಎಂದು ತಿಳಿಯಲು ರಸ್ತೆ ದಾಟಿ.",
                "2. ಜನನಿಬಿಡ ಪ್ರದೇಶದ ಕಡೆಗೆ ವೇಗವಾಗಿ ನಡೆಯಿರಿ.",
                "3. ನೇರವಾಗಿ ಮನೆಗೆ ಹೋಗಬೇಡಿ.",
                "4. ನಾನು ಸೈರನ್ ಬಾರಿಸಲಿ ಅಥವಾ ಕರೆ ಮಾಡಲಿ?"
            ],
            threatened: ["1. ಶಬ್ದ ಮಾಡಿ.", "2. ಅಪಾಯದಿಂದ ದೂರ ಹೋಗಿ.", "3. 112 ಗೆ ಕರೆ ಮಾಡಿ."],
            general: ["1. ಟ್ರಾಫಿಕ್ ವಿರುದ್ಧ ನಡೆಯಿರಿ.", "2. ಲೈವ್ ಲೊಕೇಶನ್ ಹಂಚಿಕೊಳ್ಳಿ."],
            whereAmI: ["ನಾನು ನಿಮ್ಮ ನಿಖರ ಸ್ಥಳ ಪಡೆಯುತ್ತಿದ್ದೇನೆ..."]
        },
        navigation: {
            guideHome: "ನಾನು ನಿಮಗಾಗಿ ಸುರಕ್ಷಿತ ಮಾರ್ಗ ಹುಡುಕುತ್ತಿದ್ದೇನೆ.",
            saferRoutesIntro: "ಬೀದಿ ದೀಪಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ದಾರಿ ತೋರಿಸುತ್ತೇನೆ."
        },
        health: {
            fever: ["1. ನೀರು ಕುಡಿಯಿರಿ.", "2. ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.", "3. ಜ್ವರಕ್ಕೆ ಡೋಲೋ 650 ತೆಗೆದುಕೊಳ್ಳಿ."],
            headache: ["1. ನೀರು ಕುಡಿಯಿರಿ.", "2. ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ."],
            period: ["1. ಬಿಸಿ ನೀರಿನ ಚೀಲ ಬಳಸಿ.", "2. ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ."]
        },
        casual: {
            howAreYou: "ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ! 🛡️ ನೀವು ಹೇಗಿದ್ದೀರಿ?",
            joke: "ಪರೀಕ್ಷೆ ಹೇಗಿತ್ತು? ಪ್ರಶ್ನೆಗಳು ಚೆನ್ನಾಗಿದ್ದವು, ಉತ್ತರ ಗೊತ್ತಿರಲಿಲ್ಲ! 😄",
            aboutAI: "ನಾನು ಗಾರ್ಡಿಯನ್-ಹರ್ ಎಐ."
        },
        relationship: {
            stress: "ಉಸಿರು ತೆಗೆದುಕೊಳ್ಳಿ, ನೀರು ಕುಡಿಯಿರಿ. 💙",
            lonely: "ನೀವು ಒಂಟಿಯಲ್ಲ. ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. 🤗"
        },
        fallback: {
            default: "ನಾನು ಕೇಳುತ್ತಿದ್ದೇನೆ! 🛡️ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?\n\n— 'ನನ್ನನ್ನು ಮನೆಗೆ ಕರೆದೊಯ್ಯಿರಿ' ಎಂದು ಟೈಪ್ ಮಾಡಿ\n— 'ಯಾರೋ ಹಿಂಬಾಲಿಸುತ್ತಿದ್ದಾರೆ' ಎಂದು ಟೈಪ್ ಮಾಡಿ"
        },
        phoneOptionsLabel: "ಕರೆ ಮಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ:",
        confirmCall: "ನಾನು ಕರೆ ಮಾಡಲೇ?"
    },

    tel: {
        intro: "నేను మీతో ఉన్నాను. మీరు ఏమి చేయవచ్చో ఇక్కడ ఉంది:",
        greetings: "నమస్కారం! 👋 నేను గార్డియన్-హెర్, మీ రక్షణ సహాయకురాలిని. మీరు ఎలా ఉన్నారు?",
        thanks: "మీకు స్వాగతం! ❤️ నేను ఎల్లప్పుడూ మీతోనే ఉంటాను.",
        tired: "మీరు అలసటగా ఉన్నారని నేను అర్థం చేసుకోగలను. 🌸 కాసేపు విశ్రాంతి తీసుకోండి. మీరు ఇంటికి వెళ్తుంటే నేను సురక్షిత మార్గాన్ని చూపిస్తాను.",
        emergency: {
            sosActivated: "🚨 హెచ్చరిక: SOS మోడ్ ఆన్ చేయబడింది.",
            immediate: "⚠️ ప్రమాదం: వెంటనే SOS బటన్ నొక్కండి."
        },
        safety: {
            following: [
                "1. వారు వెంబడిస్తున్నారో లేదో చూడడానికి రోడ్డు దాటండి.",
                "2. రద్దీ ప్రాంతం వైపు వేగంగా నడవండి.",
                "3. నేరుగా ఇంటికి వెళ్లవద్దు.",
                "4. నేను సైరన్ మోగించాలా?"
            ],
            threatened: ["1. గట్టిగా శబ్దం చేయండి.", "2. 112 కి కాల్ చేయండి."],
            general: ["1. ట్రాఫిక్‌కు ఎదురుగా నడవండి.", "2. లొకేషన్ షేర్ చేయండి."],
            whereAmI: ["నేను మీ స్థానాన్ని తీసుకుంటున్నాను..."]
        },
        navigation: {
            guideHome: "నేను సురక్షితమైన మార్గాన్ని చూపిస్తున్నాను.",
            saferRoutesIntro: "నేను సురక్షిత మార్గాన్ని సూచిస్తాను."
        },
        health: {
            fever: ["1. నీరు తాగండి.", "2. విశ్రాంతి తీసుకోండి."],
            headache: ["1. నీరు తాగండి.", "2. ప్రశాంతంగా ఉండండి."],
            period: ["1. వేడి నీటి సంచి వాడండి.", "2. విశ్రాంతి తీసుకోండి."]
        },
        casual: {
            howAreYou: "నేను సిద్ధంగా ఉన్నాను! 🛡️ మీరు ఎలా ఉన్నారు?",
            joke: "100 లో సున్నా తీస్తే ఎంత? ఏముంది సార్, విలువే ఉండదు! 😄",
            aboutAI: "నేను గార్డియన్-హెర్ AI ని."
        },
        relationship: {
            stress: "దీర్ఘంగా ఊపిరి తీసుకోండి, నీరు తాగండి. 💙",
            lonely: "మీరు ఒంటరి కాదు. నేను ఇక్కడే ఉన్నాను. 🤗"
        },
        fallback: {
            default: "నేను వింటున్నాను! 🛡️ నేను ఎలా సహాయపడగలను?"
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
    const sosKeywords = ['sos', 'help', 'emergency', 'save me', 'save', 'helpme', 'हेल्प', 'मदद', 'बचाओ', 'ಸಹಾಯ', '<ctrl42>ಕಾಲ', 'సహాయం'];
    const followKeywords = ['following', 'follow', 'followed', 'behind me', 'pace', 'chasing', 'stalking', 'पीछा', 'ಹಿಂಬಾಲ', 'ವెంబడిస్తున్నారు'];
    const guideHomeKeywords = ['guide me home', 'guide me', 'take me home', 'safer route', 'safer routes', 'route home', 'get me home', 'घर भेजो', 'घर जाना', 'ಮನೆಗೆ', 'ఇంటికి'];
    const whereKeywords = ['where am i', 'my location', 'share location', 'track me', 'कहाँ हूँ', 'location', 'ಸ್ಥಳ', 'ಲೊಕೇಷನ್'];
    const greetingKeywords = ['hello', 'hlello', 'helo', 'hi', 'hey', 'good morning', 'good evening', 'namaste', 'नमस्ते', 'ಹಲೋ', 'హలో'];
    const thanksKeywords = ['thanks', 'thank you', 'thanku', ' धन्यवाद', 'ಧನ್ಯವಾದ', 'ధన్యవాదాలు'];
    const tiredKeywords = ['tired', 'sleepy', 'exhausted', 'drained', 'fatigue', 'rest', 'थक', 'ಆಯಾಸ', 'అలసట'];

    const feverKeywords = ['fever', 'temperature', 'hot body', 'shivering', 'बुखार', 'ಜ್ವರ', 'జ్వరం'];
    const headacheKeywords = ['headache', 'head ache', 'migraine', 'head pain', 'सिरदर्द', 'ತಲೆನೋವು', 'తలనొప్పి'];
    const periodKeywords = ['period', 'menstrual', 'cramps', 'stomach pain', 'मासिक', 'ಮುಟ್ಟು', 'పీరియడ్స్'];

    // 1) SOS / Emergency Priority
    if (includesAny(q, sosKeywords) || q === 'sos') {
        return t.emergency.sosActivated;
    }
    if (q.includes('unsafe') || q.includes('danger') || q.includes('scared') || q.includes('afraid')) {
        return t.emergency.immediate;
    }

    // 2) Following / Being Followed
    if (includesAny(q, followKeywords)) {
        const lines = t.safety.following;
        return Array.isArray(lines) ? `${t.intro}\n\n${lines.join('\n')}` : `${t.intro}\n\n${lines}`;
    }

    // 3) Greetings
    if (includesAny(q, greetingKeywords)) {
        return t.greetings;
    }

    // 4) Thanks / Gratitude
    if (includesAny(q, thanksKeywords)) {
        return t.thanks;
    }

    // 5) Tiredness / Fatigue
    if (includesAny(q, tiredKeywords)) {
        return t.tired;
    }

    // 6) Threatened / Harassed
    if (q.includes('threat') || q.includes('attack') || q.includes('harass') || q.includes('kill') || q.includes('hurt')) {
        const lines = t.safety.threatened;
        return Array.isArray(lines) ? `${t.intro}\n\n${lines.join('\n')}` : `${t.intro}\n\n${lines}`;
    }

    // 7) Guide home / Saferoute
    if (includesAny(q, guideHomeKeywords)) {
        return `${t.navigation.guideHome}\n\n${t.navigation.saferRoutesIntro}`;
    }

    // 8) Where am I / Location
    if (includesAny(q, whereKeywords)) {
        const lines = t.safety.whereAmI;
        return Array.isArray(lines) ? `${lines.join('\n')}` : `${lines}`;
    }

    // 9) Health Logic
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

    // 10) Casual / Small talk
    if (q.includes('how are you') || q.includes('who are you')) {
        return t.casual.howAreYou;
    }
    if (q.includes('joke') || q.includes('funny') || q.includes('laugh')) {
        return t.casual.joke;
    }
    if (q.includes('ai') || q.includes('about you') || q.includes('guardian')) {
        return t.casual.aboutAI;
    }

    // 11) Relationship / Stress
    if (q.includes('stress') || q.includes('sad') || q.includes('depressed') || q.includes('anxiety') || q.includes('worry')) {
        return t.relationship.stress;
    }
    if (q.includes('lonely') || q.includes('alone') || q.includes('friend')) {
        return t.relationship.lonely;
    }

    // 12) Intelligent Dynamic Fallback
    return t.fallback.default;
}

export default getResponse;