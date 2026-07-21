// src/lib/chatbotData.ts
// Multilingual chatbot response library + getResponse()
// Supports: English (eng), Hindi (hin), Kannada (kan), Telugu (tel).
// Guardian-Her personality: Empathetic, human-like, caring, protective, intelligent, and versatile.

type Lang = 'eng' | 'hin' | 'kan' | 'tel';

const templates: Record<Lang, any> = {
    eng: {
        greetings: "Hello there! 👋 I'm Guardian-Her, your personal AI safety companion. How are you doing today?",
        goodMorning: "Good morning! ☀️ Wishing you a bright, safe, and happy day ahead! Remember, I am right here with you all day.",
        goodNight: "Good night! 🌙 Sleep peacefully. Make sure your doors are locked safely. I'm keeping guard 24/7.",
        goodbye: "Take care and stay safe! 👋 Whenever you need guidance or support, I am just a message away.",
        thanks: "You're very welcome! ❤️ I'm always right here whenever you need someone to talk to or stay safe with.",
        
        // Common Daily Activities & States
        water: "Please drink a glass of fresh water right away! 💧 Staying hydrated keeps your energy up and reduces dizziness.",
        food: "Please get a good, warm meal when you can! 🍲 If you're picking up food late at night, make sure to stay on well-lit main roads.",
        tired: "I understand how exhausting things can get. 🌸 Take a deep breath and rest if you are in a safe space. If you're heading home right now, I can find a well-lit safe route or start a Check-In Timer to watch over you while you travel.",
        comfort: "Take a slow, deep breath with me. 🌿 Inhale... Exhale... You are safe, and I am watching over you right now. You are never alone.",
        
        // Daily Life & Travel
        goingOut: "Stay safe out there! 🚶‍♀️ Remember to stay on well-lit streets, keep your phone battery charged, and feel free to share your live location or set a Check-In Timer with me.",
        cabTravel: "Travelling by cab or auto? 🚕 Always verify the driver's vehicle number before getting in, share your trip status with family, and use Guardian-Her live GPS tracking!",
        studying: "Good luck with your studies! 📚 Remember to take short 5-minute breaks and rest your eyes.",
        working: "Hope your workday is going great! 💼 Take periodic water breaks and stretch.",
        
        // Emotions & Small Talk
        happy: "I'm so happy to hear that! 😊 Your joy makes my day brighter. Stay smiling!",
        sad: "I'm really sorry you're feeling down. 💙 Remember that tough times pass and you are stronger than you think. I'm right here if you want to chat.",
        bored: "Want to hear a fun joke or explore safety tips? 😃 Why did the computer go to the doctor? Because it had a virus! 😄",
        
        // Identity & App Features
        name: "I am Guardian-Her AI 🛡️ — built by Sahana N S with passion for Women's Safety throughout the world!",
        features: "Here is what I can do for you:\n1. 🚨 One-Touch SOS Emergency Alert\n2. 🗺️ Saferoutes Navigation Engine (finding well-lit paths)\n3. ⏱️ Automated Check-In Safety Timer\n4. 🏥 Emergency Contacts & Hospital Directory\n5. 💬 24/7 Supportive AI Chat Companion",
        howToUse: "Using Guardian-Her is simple!\n— Tap the red SOS button for emergency alerts\n— Go to 'Routes' to find well-lit paths\n— Set a 'Check-In Timer' when walking alone\n— Or talk to me anytime right here!",
        
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
            default: "I hear you! 💙 Tell me a bit more about what's on your mind, or let me know if you need safe route guidance, emergency support, or health tips."
        }
    },

    hin: {
        greetings: "नमस्ते! 👋 मैं गार्डियन-हर हूँ, आपकी सुरक्षा साथी। आज आप कैसी हैं?",
        goodMorning: "शुभ प्रभात! ☀️ आपका दिन सुरक्षित और मंगलमय हो!",
        goodNight: "शुभ रात्रि! 🌙 शांति से सोएं, मैं 24/7 आपकी सुरक्षा के लिए तैयार हूँ।",
        goodbye: "अपना ख्याल रखें! 👋 मैं हमेशा आपके साथ हूँ।",
        thanks: "आपका बहुत-बहुत स्वागत है! ❤️",
        water: "कृपया तुरंत एक गिलास पानी पिएं! 💧",
        food: "कृपया पौष्टिक भोजन करें! 🍲",
        tired: "थोड़ा आराम करें। 🌸 अगर आप घर जा रही हैं, तो मैं सुरक्षित रास्ता बता सकती हूँ।",
        comfort: "गहरी सांस लें। 🌿 आप सुरक्षित हैं।",
        goingOut: "सुरक्षित रहें! 🚶‍♀️ रोशन रास्तों पर चलें और लोकेशन चालू रखें।",
        cabTravel: "कैब या ऑटो में? 🚕 ड्राइवर का नंबर जांचें और ट्रिप शेयर करें!",
        studying: "पढ़ाई के लिए शुभकामनाएं! 📚 बीच में ब्रेक लें।",
        working: "आपका काम अच्छा रहे! 💼 पानी पिएं और आराम करें।",
        happy: "यह सुनकर बहुत खुशी हुई! 😊 मुस्कुराती रहें!",
        sad: "उदासी दूर होगी, आप बहुत मजबूत हैं। 💙 मैं आपके साथ हूँ।",
        bored: "क्या आप चुटकुला सुनना चाहेंगी? 😄",
        name: "मैं गार्डियन-हर एआई हूँ 🛡️ — साहाना एन एस द्वारा निर्मित!",
        features: "मेरी सुविधाएँ:\n1. 🚨 SOS आपातकालीन अलर्ट\n2. 🗺️ सेफ-रूट्स नेविगेशन\n3. ⏱️ चेक-इन टाइमर\n4. 💬 24/7 एआई चैट साथी",
        howToUse: "उपयोग करना आसान है! रेड SOS बटन दबाएं या सेफ-रूट्स चुनें।",
        emergency: {
            sosActivated: "🚨 चेतावनी: SOS मोड सक्रिय कर दिया गया है।",
            immediate: "⚠️ खतरा: तुरंत 112 डायल करें या SOS दबाएं।"
        },
        safety: {
            following: ["1. तुरंत सड़क पार करें।", "2. भीड़ वाली जगह पर जाएं।", "3. सीधे घर न जाएं।"],
            threatened: ["1. शोर मचाएं।", "2. 112 डायल करें।"],
            general: ["1. ट्रैफिक के सामने चलें।"],
            whereAmI: ["स्थान का पता लगाया जा रहा है..."]
        },
        navigation: { guideHome: "सुरक्षित रास्ता खोजा जा रहा है।", saferRoutesIntro: "स्ट्रीट लाइट की जाँच की जा रही है।" },
        health: { fever: ["1. पानी पिएं।", "2. आराम करें।"], headache: ["1. पानी पिएं।"], period: ["1. गर्म पानी की थैली।"] },
        casual: { howAreYou: "मैं ठीक हूँ! 🛡️ आप कैसी हैं?", joke: "ऑर्डर, ऑर्डर! 😄", aboutAI: "मैं गार्डियन-हर हूँ।" },
        relationship: { stress: "गहरी सांस लें। 💙", lonely: "आप अकेली नहीं हैं। 🤗" },
        fallback: { default: "मैं आपकी बात सुन रही हूँ! 💙 बताएं कि आप कैसा महसूस कर रही हैं।" }
    },

    kan: {
        greetings: "ನಮಸ್ಕಾರ! 👋 ನಾನು ಗಾರ್ಡಿಯನ್-ಹರ್, ನಿಮ್ಮ ಸುರಕ್ಷತಾ ಸಂಗಾತಿ.",
        goodMorning: "ಶುಭೋದಯ! ☀️ ನಿಮ್ಮ ದಿನ ಸುರಕ್ಷಿತವಾಗಿರಲಿ!",
        goodNight: "ಶುಭ ರಾತ್ರಿ! 🌙 ನೆಮ್ಮದಿಯಿಂದ ನಿದ್ರಿಸಿ.",
        goodbye: "ಕಾಳಜಿ ವಹಿಸಿ! 👋 ನಾನು ಇಲ್ಲಿದ್ದೇನೆ.",
        thanks: "ನಿಮಗೆ ಸ್ವಾಗತ! ❤️",
        water: "ದಯವಿಟ್ಟು ನೀರು ಕುಡಿಯಿರಿ! 💧",
        food: "ಉತ್ತಮ ಆಹಾರ ಸೇವಿಸಿ! 🍲",
        tired: "ಕೊಂಚ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ. 🌸",
        comfort: "ದೀರ್ಘವಾಗಿ ಉಸಿರಾಡಿ. 🌿",
        goingOut: "ಸುರಕ್ಷಿತವಾಗಿರಿ! 🚶‍♀️ ಬೆಳಕಿರುವ ರಸ್ತೆಯಲ್ಲಿ ನಡೆಯಿರಿ.",
        cabTravel: "ಕ್ಯಾಬ್‌ನಲ್ಲಿ ಪ್ರಯಾಣವೇ? 🚕 ವಾಹನದ ಸಂಖ್ಯೆ ಪರಿಶೀಲಿಸಿ!",
        studying: "ಓದಿಗೆ ಶುಭಾಶಯಗಳು! 📚",
        working: "ಕೆಲಸ ಯಶಸ್ವಿಯಾಗಲಿ! 💼",
        happy: "ಸಂತೋಷವಾಯಿತು! 😊",
        sad: "ಧೈರ್ಯವಾಗಿರಿ. 💙",
        bored: "ಜೋಕ್ ಕೇಳಲು ಇಷ್ಟವೇ? 😄",
        name: "ನಾನು ಗಾರ್ಡಿಯನ್-ಹರ್ ಎಐ 🛡️ — ಸಾಹನಾ ಎನ್ ಎಸ್ ಅವರು ನಿರ್ಮಿಸಿದ್ದಾರೆ!",
        features: "ನನ್ನ ವೈಶಿಷ್ಟ್ಯಗಳು:\n1. 🚨 SOS ಎಚ್ಚರಿಕೆ\n2. 🗺️ ಸುರಕ್ಷಿತ ಮಾರ್ಗ\n3. ⏱️ ಚೆಕ್-ಇನ್ ಟೈಮರ್",
        howToUse: "ಬಳಸುವುದು ಸುಲಭ! SOS ಬಟನ್ ಒತ್ತಿ ಅಥವಾ ಮಾರ್ಗಗಳನ್ನು ನೋಡಿ.",
        emergency: { sosActivated: "🚨 SOS ಮೋಡ್ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ.", immediate: "⚠️ 112 ಗೆ ಕರೆ ಮಾಡಿ." },
        safety: { following: ["1. ರಸ್ತೆ ದಾಟಿ.", "2. ಜನನಿಬಿಡ ಪ್ರದೇಶಕ್ಕೆ ಹೋಗಿ."], threatened: ["1. 112 ಗೆ ಕರೆ ಮಾಡಿ."], general: ["1. ಲೊಕೇಶನ್ ಹಂಚಿಕೊಳ್ಳಿ."], whereAmI: ["ಸ್ಥಳ ಪಡೆಯಲಾಗುತ್ತಿದೆ..."] },
        navigation: { guideHome: "ಸುರಕ್ಷಿತ ಮಾರ್ಗ ಹುಡುಕುತ್ತಿದ್ದೇನೆ.", saferRoutesIntro: "ದಾರಿ ತೋರಿಸುತ್ತೇನೆ." },
        health: { fever: ["1. ನೀರು ಕುಡಿಯಿರಿ."], headache: ["1. ನೀರು ಕುಡಿಯಿರಿ."], period: ["1. ಬಿಸಿ ನೀರಿನ ಚೀಲ."] },
        casual: { howAreYou: "ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ! 🛡️", joke: "ಉತ್ತರ ಗೊತ್ತಿರಲಿಲ್ಲ! 😄", aboutAI: "ನಾನು ಗಾರ್ಡಿಯನ್-ಹರ್ ಎಐ." },
        relationship: { stress: "ಉಸಿರು ತೆಗೆದುಕೊಳ್ಳಿ. 💙", lonely: "ನೀವು ಒಂಟಿಯಲ್ಲ. 🤗" },
        fallback: { default: "ನಾನು ಕೇಳುತ್ತಿದ್ದೇನೆ! 💙 ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ ತಿಳಿಸಿ." }
    },

    tel: {
        greetings: "నమస్కారం! 👋 నేను గార్డియన్-హెర్, మీ రక్షణ సహాయకురాలిని.",
        goodMorning: "శుభోదయం! ☀️ మీ రోజు సురక్షితంగా జరగాలి!",
        goodNight: "శుభరాత్రి! 🌙 ప్రశాంతంగా నిద్రపోండి.",
        goodbye: "జాగ్రత్త! 👋 నేను ఇక్కడే ఉన్నాను.",
        thanks: "మీకు స్వాగతం! ❤️",
        water: "దయచేసి నీరు తాగండి! 💧",
        food: "మంచి ఆహారం తీసుకోండి! 🍲",
        tired: "కాసేపు విశ్రాంతి తీసుకోండి. 🌸",
        comfort: "దీర్ಘంగా ఊపిరి తీసుకోండి. 🌿",
        goingOut: "సురక్షితంగా ఉండండి! 🚶‍♀️",
        cabTravel: "క్యాబ్‌లో ప్రయాణమా? 🚕 నంబర్ సరిచూసుకోండి!",
        studying: "చదువుకి శుభాకాంక్షలు! 📚",
        working: "మీ పని బాగా జరగాలి! 💼",
        happy: "చాలా సంతోషం! 😊",
        sad: "ధైర్యంగా ఉండండి. 💙",
        bored: "సరదా కథ చెప్తారా? 😄",
        name: "నేను గార్డియన్-హెర్ AI ని 🛡️ — సహనా ఎన్ ఎస్ రూపకల్పన!",
        features: "నా ఫీచర్లు:\n1. 🚨 SOS అలర్ట్\n2. 🗺️ సేఫ్ రూట్స్",
        howToUse: "వాడటం చాలా సులభం!",
        emergency: { sosActivated: "🚨 SOS మోడ్ ఆన్ చేయబడింది.", immediate: "⚠️ 112 కి కాల్ చేయండి." },
        safety: { following: ["1. రోడ్డు దాటండి."], threatened: ["1. 112 కి కాల్ చేయండి."], general: ["1. లొకేషన్ షేర్ చేయండి."], whereAmI: ["స్థానాన్ని తీసుకుంటున్నాను..."] },
        navigation: { guideHome: "మార్గం సూచిస్తాను.", saferRoutesIntro: "మార్గం చూపిస్తాను." },
        health: { fever: ["1. నీరు తాగండి."], headache: ["1. నీరు తాగండి."], period: ["1. విశ్రాంతి తీసుకోండి."] },
        casual: { howAreYou: "నేను సిద్ధంగా ఉన్నాను! 🛡️", joke: "విలువే ఉండదు! 😄", aboutAI: "నేను గార్డియన్-హెర్ AI ని." },
        relationship: { stress: "నీరు తాగండి. 💙", lonely: "మీరు ఒంటరి కాదు. 🤗" },
        fallback: { default: "నేను వింటున్నాను! 💙 ఎలా ఉన్నారో చెప్పండి." }
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

    // 1) SOS / Emergency Priority
    const sosKeywords = ['sos', 'help', 'emergency', 'save me', 'save', 'helpme', 'मदद', 'बचाओ', 'ಸಹಾಯ', 'సహాయం'];
    if (includesAny(q, sosKeywords) || q === 'sos') {
        return t.emergency.sosActivated;
    }

    // 2) Being Followed / Safety Threats
    const followKeywords = ['following', 'follow', 'followed', 'behind me', 'pace', 'chasing', 'stalking', 'पीछा', 'ಹಿಂಬಾಲ', 'ವెంబడిస్తున్నారు'];
    if (includesAny(q, followKeywords)) {
        const lines = t.safety.following;
        return Array.isArray(lines) ? `${t.intro || ''}\n\n${lines.join('\n')}` : `${lines}`;
    }

    // 3) Greetings & Good Wishes
    if (q.includes('good morning') || q.includes('morning')) return t.goodMorning;
    if (q.includes('good night') || q.includes('night') || q.includes('sleep')) return t.goodNight;
    if (q.includes('bye') || q.includes('goodbye') || q.includes('see you') || q.includes('take care')) return t.goodbye;
    const greetingKeywords = ['hello', 'hlello', 'helo', 'hi', 'hey', 'namaste', 'नमस्ते', 'ಹಲೋ', 'హలో'];
    if (includesAny(q, greetingKeywords)) return t.greetings;

    // 4) Thanks & Gratitude
    const thanksKeywords = ['thanks', 'thank you', 'thanku', 'धन्यवाद', 'ಧನ್ಯವಾದ', 'ಧನ್ಯವಾದಗಳು', 'ధన్యవాదాలు'];
    if (includesAny(q, thanksKeywords)) return t.thanks;

    // 5) Identity & App Info
    if (q.includes('your name') || q.includes('who are you') || q.includes('who made you') || q.includes('created by') || q.includes('sahana')) {
        return t.name;
    }
    if (q.includes('feature') || q.includes('what can you do') || q.includes('options') || q.includes('menu')) {
        return t.features;
    }
    if (q.includes('how to use') || q.includes('how it works') || q.includes('help me use')) {
        return t.howToUse;
    }

    // 6) Physical Needs (Water, Food, Rest)
    const waterKeywords = ['water', 'drink', 'thirsty', 'thirst', 'पानी', 'जल', 'ನೀರು', 'నీరు'];
    if (includesAny(q, waterKeywords)) return t.water;

    const foodKeywords = ['food', 'hungry', 'eat', 'dinner', 'lunch', 'breakfast', 'खाना', 'भोजन', 'ಊಟ', 'ತಿಂಡಿ', 'ఆహారం'];
    if (includesAny(q, foodKeywords)) return t.food;

    const tiredKeywords = ['tired', 'sleepy', 'exhausted', 'drained', 'fatigue', 'rest', 'थक', 'ಆಯಾಸ', 'ಅಲಸಟ'];
    if (includesAny(q, tiredKeywords)) return t.tired;

    // 7) Travel & Daily Activities
    if (q.includes('cab') || q.includes('uber') || q.includes('ola') || q.includes('auto') || q.includes('taxi')) return t.cabTravel;
    if (q.includes('going out') || q.includes('walking') || q.includes('outside') || q.includes('travel')) return t.goingOut;
    if (q.includes('study') || q.includes('exam') || q.includes('read') || q.includes('college') || q.includes('school')) return t.studying;
    if (q.includes('work') || q.includes('office') || q.includes('job')) return t.working;

    // 8) Emotions & Moods
    if (q.includes('happy') || q.includes('great') || q.includes('awesome') || q.includes('good')) return t.happy;
    if (q.includes('sad') || q.includes('crying') || q.includes('upset')) return t.sad;
    if (q.includes('bored') || q.includes('bore') || q.includes('joke')) return t.bored;

    const comfortKeywords = ['scared', 'fear', 'frightened', 'nervous', 'panic', 'डर', 'ಭಯ', 'ಭಯ'];
    if (includesAny(q, comfortKeywords)) return t.comfort;

    // 9) Navigation & Location
    const guideHomeKeywords = ['guide me home', 'guide me', 'take me home', 'safer route', 'safer routes', 'route home', 'घर जाना', 'ಮನೆಗೆ', 'ఇంటికి'];
    if (includesAny(q, guideHomeKeywords)) return `${t.navigation.guideHome}\n\n${t.navigation.saferRoutesIntro}`;

    const whereKeywords = ['where am i', 'my location', 'share location', 'track me', 'कहाँ हूँ', 'location', 'ಸ್ಥಳ', 'ಲೊಕೇಷನ್'];
    if (includesAny(q, whereKeywords)) {
        const lines = t.safety.whereAmI;
        return Array.isArray(lines) ? `${lines.join('\n')}` : `${lines}`;
    }

    // 10) Health Issues
    const feverKeywords = ['fever', 'temperature', 'hot body', 'shivering', 'बुखार', 'ಜ್ವರ', 'ಜ్వరం'];
    if (includesAny(q, feverKeywords)) {
        const lines = t.health.fever;
        return Array.isArray(lines) ? `${lines.join('\n')}` : `${lines}`;
    }

    const headacheKeywords = ['headache', 'head ache', 'migraine', 'head pain', 'सिरदर्द', 'ತಲೆನೋವು', 'తలనొప్పి'];
    if (includesAny(q, headacheKeywords)) {
        const lines = t.health.headache;
        return Array.isArray(lines) ? `${lines.join('\n')}` : `${lines}`;
    }

    const periodKeywords = ['period', 'menstrual', 'cramps', 'stomach pain', 'मासिक', 'ಮುಟ್ಟು', 'పీరియడ్స్'];
    if (includesAny(q, periodKeywords)) {
        const lines = t.health.period;
        return Array.isArray(lines) ? `${lines.join('\n')}` : `${lines}`;
    }

    // 11) Relationship & Stress
    if (q.includes('stress') || q.includes('depressed') || q.includes('anxiety') || q.includes('worry')) return t.relationship.stress;
    if (q.includes('lonely') || q.includes('alone') || q.includes('friend')) return t.relationship.lonely;

    // 12) Human Dynamic Response
    return t.fallback.default;
}

export default getResponse;