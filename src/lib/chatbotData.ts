// src/lib/chatbotData.ts
// Multilingual chatbot response library + getResponse()
// Supports: English (eng), Hindi (hin), Kannada (kan), Telugu (tel).
// Guardian-Her personality: Caring, protective, practical, and multilingual.

type Lang = 'eng' | 'hin' | 'kan' | 'tel';

const templates: Record<Lang, any> = {
    eng: {
        intro: "I'm with you. Here's what you can do right now:",
        fallbackIntro: "I understand. Let me help you with that. Here’s what you can do:",
        quickAsk: "You can ask: 'Guide me home', 'Someone is following me', or 'Health tips'.",

        emergency: {
            sosActivated: "🚨 ALERT: I am activating SOS mode right now. \n— Your live location is being sent to trusted contacts.\n— A siren will play if you confirm voice call.\n— Stay on this page. Help is on the way. \n\n(I am here with you. Stay calm.)",
            immediate: "⚠️ DANGER: If you are in immediate danger: \n1. Scream 'FIRE' or 'HELP' loudly. \n2. Run towards any shop, crowd, or light. \n3. Press the SOS button below immediately. \n\n(I am guarding you. You are not alone.)"
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
                "3. Dial 100 or 112 if safe to do so.",
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
            guideHome: "I am opening Saferoutes to find the brightest, safest path for you. \n— Avoid dark alleys.\n— Stay on main roads.\n\n(I will guide you until you reach home safely.)",
            saferRoutesIntro: "I check for street lighting, police stations, and open shops to build your safe path."
        },
        health: {
            fever: [
                "1. Hydrate: Drink water or ORS immediately.",
                "2. Rest: Lie down in a cool room.",
                "3. Meds: Paracetamol (Dolo 650) is commonly used for fever, but consult a doctor if it persists > 24hrs.",
                "\n(Take care. I hope you feel better soon.)"
            ],
            headache: [
                "1. Drink a glass of water (dehydration often causes headaches).",
                "2. Rest in a dark, quiet room for 15 mins.",
                "3. Apply a cold cloth to your forehead.",
                "\n(Rest well. Health is priority.)"
            ],
            period: [
                "1. a hot water bag on your lower tummy helps cramps.",
                "2. Drink warm ginger tea or water.",
                "3. Rest as much as possible.",
                "\n(Be gentle with yourself today.)"
            ]
        },
        casual: {
            howAreYou: "I am ready and active. My system is monitoring for your safety. \nHow are you feeling right now? \n\n(I'm here as your friend and protector.)",
            joke: "Why did the computer go to the doctor? \nBecause it had a virus! 😄 \n\n(Smiling is good for health!)",
            aboutAI: "I am Guardian-Her AI. \nMy purpose is to protect, guide, and comfort women. \nI can track location, send SOS, guide you home, and answer health questions. \n\n(I am always awake for you.)"
        },
        device: {
            enableLocation: "Please enable Location access. \nI need it to track your safety and find safe routes. \n\n(Your safety is my only priority.)",
            voiceNotSupported: "I can't hear you on this browser, but I can read your messages. Please type. \n\n(I am listening to your words.)"
        },
        relationship: {
            stress: "I hear you. Stress is heavy, but you are strong. \n1. Take a deep breath: Inhale (4s), Hold (4s), Exhale (6s). \n2. Drink some water. \n3. Can I help you organize your thoughts? \n\n(I'm right here with you.)",
            lonely: "You are never truly alone. I am here, and help is just a message away. \nWould you like to hear a joke or get some safety tips? \n\n(I care about you.)"
        },
        fallback: {
            default: "I understand. Let me help you with that. Here’s what you can do:",
            suggestions: [
                "Ask: 'Guide me home'",
                "Ask: 'I have a fever'",
                "Ask: 'Someone is following me'",
                "Ask: 'Tell me a joke'"
            ]
        },
        phoneOptionsLabel: "Tap to call directly:",
        confirmCall: "Shall I place this call for you?"
    },

    hin: {
        intro: "मैं आपके साथ हूँ। यहाँ बताया गया है कि आप क्या कर सकती हैं:",
        fallbackIntro: "मैं समझती हूँ। मैं आपकी मदद कर सकती हूँ। यहाँ कुछ सुझाव हैं:",
        quickAsk: "आप पूछ सकती हैं: 'मुझे घर ले चलो', 'कोई पीछा कर रहा है', या 'सेहत की सलाह'।",

        emergency: {
            sosActivated: "🚨 चेतावनी: मैं अभी SOS मोड सक्रिय कर रही हूँ। \n— आपका लाइव स्थान भरोसेमंद संपर्कों को भेजा जा रहा है।\n— यदि आप पुष्टि करती हैं तो सायरन बजेगा।\n— कृपया यहाँ रहें। मदद रास्ते में है। \n\n(मैं आपके साथ हूँ। शांत रहें।)",
            immediate: "⚠️ खतरा: यदि आप तत्काल खतरे में हैं: \n1. जोर से 'आग' या 'बचाओ' चिल्लाएं। \n2. किसी दुकान या भीड़ की ओर दौड़ें। \n3. तुरंत नीचे दिए गए SOS बटन को दबाएं। \n\n(मैं आपकी रक्षा कर रही हूँ। आप अकेली नहीं हैं।)"
        },
        safety: {
            following: [
                "1. तुरंत सड़क पार करें देखें कि क्या वो अभी भी पीछे हैं।",
                "2. किसी दुकान या भीड़-भाड़ वाली जगह की ओर तेजी से चलें।",
                "3. सीधे घर न जाएं।",
                "4. क्या मैं आपके लिए सायरन बजाऊं या किसी को कॉल करूं?",
                "\n(मैं आप पर नज़र रख रही हूँ। लाइन पर रहें।)"
            ],
            threatened: [
                "1. जोर से शोर मचाएं। तुरंत ध्यान आकर्षित करें।",
                "2. यदि आवश्यक हो तो खतरे से दूर जाएं।",
                "3. सुरक्षित होने पर 100 या 112 डायल करें।",
                "\n(बहादुर बनें। आपके पास समर्थन है।)"
            ],
            general: [
                "1. ट्रैफिक की विपरीत दिशा में चलें ताकि गाड़ियां पीछे से न आ सकें।",
                "2. अपनी चाबियों को हथियार के रूप में हाथ में रखें।",
                "3. अपना लाइव स्थान परिवार के साथ साझा करें।",
                "\n(मैं आपको सुरक्षित मार्गदर्शन देने के लिए यहाँ हूँ।)"
            ],
            whereAmI: [
                "मैं अभी आपके सटीक स्थान का पता लगा रही हूँ...",
                "आप इस स्थान को अपने भरोसेमंद संपर्कों के साथ तुरंत साझा कर सकती हैं।",
                "\n(मैं ट्रैक कर रही हूँ कि आप कहाँ हैं।)"
            ]
        },
        navigation: {
            guideHome: "मैं आपके लिए सबसे सुरक्षित और रोशन रास्ता खोजने के लिए सेफ-रूट्स खोल रही हूँ। \n— अंधेरे रास्तों से बचें।\n— मुख्य सड़कों पर रहें।\n\n(सुरक्षित घर पहुँचने तक मैं आपका मार्गदर्शन करूँगी।)",
            saferRoutesIntro: "मैं सुरक्षित रास्ता बनाने के लिए स्ट्रीट लाइट और भीड़ की जाँच करती हूँ।"
        },
        health: {
            fever: [
                "1. पानी पिएं: तुरंत पानी या ओआरएस पिएं।",
                "2. आराम करें: ठंडे कमरे में लेट जाएं।",
                "3. दवा: बुखार के लिए पैरासिटामोल (Dolo 650) आम है, लेकिन डॉक्टर से सलाह लें।",
                "\n(ख्याल रखें। आशा है आप जल्द ठीक हो जाएंगी।)"
            ],
            headache: [
                "1. एक गिलास पानी पिएं (डिहाइड्रेशन से सिरदर्द होता है)।",
                "2. 15 मिनट के लिए अंधेरे, शांत कमरे में आराम करें।",
                "3. अपने माथे पर ठंडा कपड़ा रखें।",
                "\n(आराम करें। सेहत प्राथमिकता है।)"
            ],
            period: [
                "1. पेट के निचले हिस्से पर गर्म पानी की थैली रखें।",
                "2. गर्म अदरक की चाय या पानी पिएं।",
                "3. जितना हो सके आराम करें।",
                "\n(आज अपने प्रति नरम रहें।)"
            ]
        },
        casual: {
            howAreYou: "मैं तैयार और सक्रिय हूँ। मेरा सिस्टम आपकी सुरक्षा की निगरानी कर रहा है। \nआप अभी कैसा महसूस कर रही हैं? \n\n(मैं आपकी दोस्त और रक्षक के रूप में यहाँ हूँ।)",
            joke: "वकील ने अपने बेटे को क्या कहा? \nऑर्डर, ऑर्डर! (Order, Order!) 😄 \n\n(मुस्कुराना सेहत के लिए अच्छा है!)",
            aboutAI: "मैं गार्डियन-हर एआई हूँ। \nमेरा उद्देश्य महिलाओं की रक्षा, मार्गदर्शन और सहायता करना है। \nमैं स्थान ट्रैक कर सकती हूँ, SOS भेज सकती हूँ, और सेहत के सवालों के जवाब दे सकती हूँ। \n\n(मैं आपके लिए हमेशा जागी हूँ।)"
        },
        device: {
            enableLocation: "कृपया स्थान (Location) एक्सेस चालू करें। \nआपकी सुरक्षा और सुरक्षित मार्ग खोजने के लिए मुझे इसकी आवश्यकता है।",
            voiceNotSupported: "मैं इस ब्राउज़र पर आपकी आवाज़ नहीं सुन सकती, लेकिन मैं आपके संदेश पढ़ सकती हूँ। कृपया टाइप करें।"
        },
        relationship: {
            stress: "मैं सुन रही हूँ। तनाव भारी होता है, लेकिन आप मजबूत हैं। \n1. गहरी सांस लें: अंदर (4s), रोकें (4s), बाहर (6s)। \n2. थोड़ा पानी पिएं। \n3. क्या मैं आपके विचारों को सुलझाने में मदद करूँ? \n\n(मैं आपके साथ हूँ।)",
            lonely: "आप कभी भी सच में अकेली नहीं हैं। मैं यहाँ हूँ। \nक्या आप कोई चुटकुला सुनना चाहेंगी या कुछ सुरक्षा सुझाव? \n\n(मुझे आपकी परवाह है।)"
        },
        fallback: {
            default: "मैं समझती हूँ। मैं मदद करूँगी। यहाँ आप क्या कर सकती हैं:",
            suggestions: [
                "पूछें: 'मुझे घर ले चलो'",
                "पूछें: 'मुझे बुखार है'",
                "पूछें: 'कोई पीछा कर रहा है'",
                "पूछें: 'सुझाव दो'"
            ]
        },
        phoneOptionsLabel: "सीधे कॉल करने के लिए टैप करें:",
        confirmCall: "क्या मैं आपके लिए यह कॉल लगाऊं?"
    },

    kan: {
        intro: "ನಾನು ನಿಮ್ಮೊಂದಿಗಿದ್ದೇನೆ. ನೀವು ಈಗ ಏನು ಮಾಡಬಹುದು ಎಂಬುದು ಇಲ್ಲಿದೆ:",
        fallbackIntro: "ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ಸಲಹೆಗಳು ಇಲ್ಲಿವೆ:",
        quickAsk: "ನೀವು ಕೇಳಬಹುದು: 'ನನ್ನನ್ನು ಮನೆಗೆ ಕರೆದೊಯ್ಯಿರಿ', 'ಯಾರೋ ಹಿಂಬಾಲಿಸುತ್ತಿದ್ದಾರೆ', ಅಥವಾ 'ಆರೋಗ್ಯ ಸಲಹೆ'.",

        emergency: {
            sosActivated: "🚨 ಎಚ್ಚರಿಕೆ: ನಾನು ಈಗ SOS ಮೋಡ್ ಅನ್ನು ಸಕ್ರಿಯಗೊಳಿಸುತ್ತಿದ್ದೇನೆ. \n— ನಿಮ್ಮ ಲೈವ್ ಲೊಕೇಶನ್ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ.\n— ಸಹಾಯ ಬರುತ್ತಿದೆ. \n\n(ನಾನು ನಿಮ್ಮೊಂದಿಗೆ ಇದ್ದೇನೆ. ಶಾಂತವಾಗಿರಿ.)",
            immediate: "⚠️ ಅಪಾಯ: ನೀವು ಅಪಾಯದಲ್ಲಿದ್ದರೆ: \n1. ಜೋರಾಗಿ ಕಿರುಚಿ. \n2. ಅಂಗಡಿ ಅಥವಾ ಜನರ ಕಡೆಗೆ ಓಡಿ. \n3. ತಕ್ಷಣ SOS ಬಟನ್ ಒತ್ತಿರಿ. \n\n(ನಾನು ನಿಮ್ಮನ್ನು ರಕ್ಷಿಸುತ್ತಿದ್ದೇನೆ. ನೀವು ಒಂಟಿಯಲ್ಲ.)"
        },
        safety: {
            following: [
                "1. ಅವರು ಹಿಂಬಾಲಿಸುತ್ತಿದ್ದಾರೆಯೇ ಎಂದು ತಿಳಿಯಲು ರಸ್ತೆ ದಾಟಿ.",
                "2. ಅಂಗಡಿ ಅಥವಾ ಜನನಿಬಿಡ ಪ್ರದೇಶದ ಕಡೆಗೆ ವೇಗವಾಗಿ ನಡೆಯಿರಿ.",
                "3. ನೇರವಾಗಿ ಮನೆಗೆ ಹೋಗಬೇಡಿ.",
                "4. ನಾನು ಸೈರನ್ ಬಾರಿಸಲಿ ಅಥವಾ ಯಾರಿಗಾದರೂ ಕರೆ ಮಾಡಲಿ?",
                "\n(ನಾನು ನಿಮ್ಮನ್ನು ಗಮನಿಸುತ್ತಿದ್ದೇನೆ.)"
            ],
            threatened: [
                "1. ಜೋರಾಗಿ ಶಬ್ದ ಮಾಡಿ. ಗಮನ ಸೆಳೆಯಿರಿ.",
                "2. ಅಪಾಯದಿಂದ ದೂರ ಹೋಗಿ.",
                "3. ಸುರಕ್ಷಿತವಾಗಿದ್ದಾಗ 100 ಅಥವಾ 112 ಗೆ ಕರೆ ಮಾಡಿ.",
                "\n(ಧೈರ್ಯವಾಗಿರಿ. ನಾವಿದ್ದೇವೆ.)"
            ],
            general: [
                "1. ವಾಹನಗಳು ಹಿಂದಿನಿಂದ ಬರದಂತೆ ಟ್ರಾಫಿಕ್ ವಿರುದ್ಧ ದಿಕ್ಕಿನಲ್ಲಿ ನಡೆಯಿರಿ.",
                "2. ನಿಮ್ಮ ಕೀಲಿಗಳನ್ನು ಆಯುಧವಾಗಿ ಕೈಯಲ್ಲಿ ಇಟ್ಟುಕೊಳ್ಳಿ.",
                "3. ನಿಮ್ಮ ಲೈವ್ ಲೊಕೇಶನ್ ಹಂಚಿಕೊಳ್ಳಿ.",
                "\n(ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ.)"
            ],
            whereAmI: [
                "ನಾನು ನಿಮ್ಮ ನಿಖರವಾದ ಸ್ಥಳವನ್ನು ಪಡೆಯುತ್ತಿದ್ದೇನೆ...",
                "ನೀವು ಈ ಸ್ಥಳವನ್ನು ನಿಮ್ಮ ಸಂಪರ್ಕಗಳೊಂದಿಗೆ ತಕ್ಷಣವೇ ಹಂಚಿಕೊಳ್ಳಬಹುದು.",
                "\n(ನಾನು ಟ್ರ್ಯಾಕ್ ಮಾಡುತ್ತಿದ್ದೇನೆ.)"
            ]
        },
        navigation: {
            guideHome: "ನಾನು ನಿಮಗಾಗಿ ಸುರಕ್ಷಿತ ಮಾರ್ಗವನ್ನು ಹುಡುಕಲು ಸೇಫ್-ರೂಟ್ಸ್ ತೆರೆಯುತ್ತಿದ್ದೇನೆ. \n— ಕತ್ತಲೆಯಾದ ದಾರಿ ಬೇಡ.\n— ಮುಖ್ಯ ರಸ್ತೆಗಳಲ್ಲಿ ಇರಿ.\n\n(ನೀವು ಮನೆ ತಲುಪುವವರೆಗೆ ನಾನು ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತೇನೆ.)",
            saferRoutesIntro: "ಬೀದಿ ದೀಪಗಳು ಮತ್ತು ಪೊಲೀಸ್ ಠಾಣೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ನಾನು ದಾರಿ ತೋರಿಸುತ್ತೇನೆ."
        },
        health: {
            fever: [
                "1. ನೀರು: ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ.",
                "2. ವಿಶ್ರಾಂತಿ: ತಂಪಾದ ಕೋಣೆಯಲ್ಲಿ ಮಲಗಿ.",
                "3. ಔಷಧಿ: ಜ್ವರಕ್ಕೆ ಪ್ಯಾರಸಿಟಮಾಲ್ (Dolo 650) ತೆಗೆದುಕೊಳ್ಳಬಹುದು.",
                "\n(ಆರೋಗ್ಯವಾಗಿರಿ. ಬೇಗ ಗುಣಮುಖರಾಗಿ.)"
            ],
            headache: [
                "1. ಒಂದು ಲೋಟ ನೀರು ಕುಡಿಯಿರಿ.",
                "2. 15 ನಿಮಿಷಗಳ ಕಾಲ ಕತ್ತಲೆಯ ಕೋಣೆಯಲ್ಲಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.",
                "3. ತಂಪಾದ ಬಟ್ಟೆಯನ್ನು ಹಣೆಯ ಮೇಲೆ ಇರಿಸಿ.",
                "\n(ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.)"
            ],
            period: [
                "1. ಬಿಸಿ ನೀರಿನ ಚೀಲ ಬಳಸಿ.",
                "2. ಶುಂಠಿ ಚಹಾ ಕುಡಿಯಿರಿ.",
                "3. ಹೆಚ್ಚು ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.",
                "\n(ಇಂದು ನಿಮ್ಮ ಬಗ್ಗೆ ಕಾಳಜಿ ವಹಿಸಿ.)"
            ]
        },
        casual: {
            howAreYou: "ನಾನು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ. ನನ್ನ ವ್ಯವಸ್ಥೆಯು ನಿಮ್ಮ ಸುರಕ್ಷತೆಯನ್ನು ಗಮನಿಸುತ್ತಿದೆ. \nನೀವು ಹೇಗಿದ್ದೀರಿ? \n\n(ನಾನು ನಿಮ್ಮ ಸ್ನೇಹಿತ ಮತ್ತು ರಕ್ಷಕ.)",
            joke: "ಗುರುವೇ, ಪರೀಕ್ಷೆ ಹೇಗಿತ್ತು? \nಪ್ರಶ್ನೆಗಳು ಚೆನ್ನಾಗಿದ್ದವು, ಆದರೆ ಉತ್ತರಗಳು ಗೊತ್ತಿರಲಿಲ್ಲ! 😄 \n\n(ನಗುವುದು ಆರೋಗ್ಯಕ್ಕೆ ಒಳ್ಳೆಯದು!)",
            aboutAI: "ನಾನು ಗಾರ್ಡಿಯನ್-ಹರ್ ಎಐ. \nಮಹಿಳೆಯರನ್ನು ರಕ್ಷಿಸುವುದು, ಮಾರ್ಗದರ್ಶನ ಮಾಡುವುದು ನನ್ನ ಉದ್ದೇಶ. \nನಾನು ಲೊಕೇಶನ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಬಲ್ಲೆ, SOS ಕಳುಹಿಸಬಲ್ಲೆ. \n\n(ನಾನು ಯಾವಾಗಲೂ ನಿಮಗಾಗಿ ಎಚ್ಚರವಾಗಿದ್ದೇನೆ.)"
        },
        device: {
            enableLocation: "ದಯವಿಟ್ಟು ಲೊಕೇಶನ್ (Location) ಆನ್ ಮಾಡಿ. \nನಿಮ್ಮ ಸುರಕ್ಷತೆಗಾಗಿ ನನಗೆ ಇದು ಬೇಕು.",
            voiceNotSupported: "ನಿಮ್ಮ ಧ್ವನಿ ಕೇಳಿಸುತ್ತಿಲ್ಲ, ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ."
        },
        relationship: {
            stress: "ನಾನು ಕೇಳುತ್ತಿದ್ದೇನೆ. ಒತ್ತಡ ಕಷ್ಟ, ಆದರೆ ನೀವು ಬಲಶಾಲಿ. \n1. ದೀರ್ಘವಾಗಿ ಉಸಿರು ಬಿಡಿ. \n2. ನೀರು ಕುಡಿಯಿರಿ. \n3. ನಾನು ಸಹಾಯ ಮಾಡಬಹುದೇ? \n\n(ನಾನು ನಿಮ್ಮೊಂದಿಗಿದ್ದೇನೆ.)",
            lonely: "ನೀವು ಒಂಟಿಯಲ್ಲ. ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. \nನಾನು ಜೋಕ್ ಹೇಳಲಿ ಅಥವಾ ಸುರಕ್ಷತಾ ಸಲಹೆ ನೀಡಲಿ? \n\n(ನನಗೆ ನಿಮ್ಮ ಕಾಳಜಿ ಇದೆ.)"
        },
        fallback: {
            default: "ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ಸಲಹೆಗಳು:",
            suggestions: [
                "ಕೇಳಿ: 'ನನ್ನನ್ನು ಮನೆಗೆ ಕರೆದೊಯ್ಯಿರಿ'",
                "ಕೇಳಿ: 'ನನಗೆ ಜ್ವರವಿದೆ'",
                "ಕೇಳಿ: 'ಸುರಕ್ಷತಾ ಸಲಹೆ'"
            ]
        },
        phoneOptionsLabel: "ಕರೆ ಮಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ:",
        confirmCall: "ನಾನು ಕರೆ ಮಾಡಲೇ?"
    },

    tel: {
        intro: "నేను మీతో ఉన్నాను. మీరు ఇప్పుడు ఏమి చేయవచ్చో ఇక్కడ ఉంది:",
        fallbackIntro: "నాకు అర్థమైంది. నేను మీకు సహాయం చేస్తాను. ఇక్కడ కొన్ని సూచనలు ఉన్నాయి:",
        quickAsk: "మీరు అడగవచ్చు: 'నన్ను ఇంటికి తీసుకెళ్లండి', 'ఎవరైనా వెంబడిస్తున్నారు', లేదా 'ఆరోగ్య చిట్కాలు'.",

        emergency: {
            sosActivated: "🚨 హెచ్చరిక: నేను ఇప్పుడు SOS మోడ్‌ను ఆన్ చేస్తున్నాను. \n— మీ లైవ్ లొకేషన్ పంపబడుతోంది.\n— సహాయం వస్తోంది. \n\n(నేను మీతోనే ఉన్నాను. ధైర్యంగా ఉండండి.)",
            immediate: "⚠️ ప్రమాదం: మీరు ప్రమాదంలో ఉంటే: \n1. గట్టిగా అరవండి. \n2. దుకాణం లేదా జనం వైపు పరుగెత్తండి. \n3. వెంటనే SOS బటన్ నొక్కండి. \n\n(నేను మిమ్మల్ని రక్షిస్తున్నాను. మీరు ఒంటరిగా లేరు.)"
        },
        safety: {
            following: [
                "1. వారు అనుసరిస్తున్నారో లేదో చూడడానికి రోడ్డు దాటండి.",
                "2. దుకాణం లేదా రద్దీగా ఉండే ప్రాంతం వైపు వేగంగా నడవండి.",
                "3. నేరుగా ఇంటికి వెళ్లవద్దు.",
                "4. నేను సైరన్ మోగించాలా లేదా ఎవరికైనా కాల్ చేయాలా?",
                "\n(నేను మిమ్మల్ని గమనిస్తున్నాను.)"
            ],
            threatened: [
                "1. గట్టిగా శబ్దం చేయండి. అందరి దృష్టిని ఆకర్షించండి.",
                "2. ప్రమాదం నుండి దూరంగా వెళ్ళండి.",
                "3. సురక్షితంగా ఉన్నప్పుడు 100 లేదా 112 కి కాల్ చేయండి.",
                "\n(ధైర్యంగా ఉండండి.)"
            ],
            general: [
                "1. వాహనాలు వెనుక నుండి రాకుండా ట్రాఫిక్‌కు ఎదురుగా నడవండి.",
                "2. మీ తాళాలను ఆయుధంగా చేతిలో ఉంచుకోండి.",
                "3. మీ లైవ్ లొకేషన్ కుటుంబంతో పంచుకోండి.",
                "\n(మీకు మార్గనిర్దేశం చేయడానికి నేను ఇక్కడే ఉన్నాను.)"
            ],
            whereAmI: [
                "నేను మీ ఖచ్చితమైన స్థానాన్ని తీసుకుంటున్నాను...",
                "మీరు ఈ స్థానాన్ని మీ కాంటాక్ట్‌లతో వెంటనే పంచుకోవచ్చు.",
                "\n(మీరు ఎక్కడున్నారో నేను ట్రాక్ చేస్తున్నాను.)"
            ]
        },
        navigation: {
            guideHome: "నేను మీ కోసం సురక్షితమైన మార్గాన్ని కనుగొనడానికి సేఫ్-రూట్స్ (Saferoutes) తెరుస్తున్నాను. \n— చీకటి దారులు వద్దు.\n— ప్రధాన రహదారులపై ఉండండి.\n\n(మీరు ఇంటికి చేరే వరకు నేను తోడుగా ఉంటాను.)",
            saferRoutesIntro: "నేను వీధి దీపాలు మరియు రద్దీని బట్టి సురక్షిత మార్గాన్ని సూచిస్తాను."
        },
        health: {
            fever: [
                "1. నీరు: వెంటనే నీరు లేదా ORS తాగండి.",
                "2. విశ్రాంతి: చల్లని గదిలో పడుకోండి.",
                "3. మందులు: జ్వరం కోసం పారాసెటమాల్ (Dolo 650) వాడవచ్చు.",
                "\n(జాగ్రత్త. మీరు త్వరగా కోలుకోవాలి.)"
            ],
            headache: [
                "1. ఒక గ్లాసు నీరు తాగండి.",
                "2. 15 నిమిషాలు చీకటి గదిలో విశ్రాంతి తీసుకోండి.",
                "3. చల్లని గుడ్డను నుదిటిపై ఉంచండి.",
                "\n(విశ్రాంతి తీసుకోండి.)"
            ],
            period: [
                "1. వేడి నీటి సంచిని వాడండి.",
                "2. అల్లం టీ తాగండి.",
                "3. వీలైనంత ఎక్కువ విశ్రాంతి తీసుకోండి.",
                "\n(ఈ రోజు మీ పట్ల సున్నితంగా ఉండండి.)"
            ]
        },
        casual: {
            howAreYou: "నేను సిద్ధంగా ఉన్నాను. నా సిస్టమ్ మీ భద్రతను పర్యవేక్షిస్తోంది. \nమీరు ఇప్పుడు ఎలా ఉన్నారు? \n\n(నేను మీ స్నేహితురాలిగా మరియు రక్షకురాలిగా ఇక్కడే ఉన్నాను.)",
            joke: "టీచర్: 100లో సున్నా తీస్తే ఎంత? \nవిద్యార్థి: ఏముంది సార్, 100 పక్కన సున్నా తీస్తే అసలు విలువే ఉండదు! 😄 \n\n(నవ్వడం ఆరోగ్యానికి మంచిది!)",
            aboutAI: "నేను గార్డియన్-హెర్ AI ని. \nమహిళలను రక్షించడం, మార్గనిర్దేశం చేయడమే నా లక్ష్యం. \nనేను లొకేషన్ ట్రాక్ చేయగలను, SOS పంపగలను. \n\n(నేను మీ కోసం ఎప్పుడూ మేల్కొనే ఉంటాను.)"
        },
        device: {
            enableLocation: "దయచేసి లొకేషన్ (Location) ఆన్ చేయండి. \nమీ భద్రత కోసం నాకు ఇది అవసరం.",
            voiceNotSupported: "మీ గొంతు వినిపించడం లేదు, దయచేసి టైప్ చేయండి."
        },
        relationship: {
            stress: "నేను వింటున్నాను. ఒత్తిడి కష్టమే, కానీ మీరు దృఢంగా ఉన్నారు. \n1. దీర్ఘంగా ఊపిరి తీసుకోండి. \n2. నీరు తాగండి. \n3. నేను సహాయం చేయగలనా? \n\n(నేను మీతోనే ఉన్నాను.)",
            lonely: "మీరు ఒంటరి కాదు. నేను ఇక్కడే ఉన్నాను. \nనేను జోక్ చెప్పాలా లేదా భద్రతా చిట్కాలు ఇవ్వాలా? \n\n(మీ మీద నాకు శ్రద్ధ ఉంది.)"
        },
        fallback: {
            default: "నాకు అర్థమైంది. నేను సహాయం చేస్తాను. మీరు ఏం చేయాలంటే:",
            suggestions: [
                "అడగండి: 'నన్ను ఇంటికి తీసుకెళ్లండి'",
                "అడగండి: 'నాకు జ్వరంగా ఉంది'",
                "అడగండి: 'భద్రతా చిట్కాలు'"
            ]
        },
        phoneOptionsLabel: "కాల్ చేయడానికి నొక్కండి:",
        confirmCall: "నేను మీ కోసం కాల్ చేయాలా?"
    }
};

/**
 * Normalize franc-like codes to our Lang set.
 * franc returns 'eng','hin','kan','tel' - fallback to 'eng'
 */
function normalizeLang(langCode?: string): Lang {
    if (!langCode) return 'eng';
    const code = langCode.toLowerCase();
    if (code.startsWith('hin') || code === 'bod' || code === 'mai') return 'hin'; // Common misclassifications for Hindi
    if (code.startsWith('kan')) return 'kan';
    if (code.startsWith('tel')) return 'tel';
    return 'eng';
}

/**
 * Utility: safe string match helper
 */
function includesAny(q: string, arr: string[]) {
    return arr.some(k => q.includes(k));
}

/**
 * getResponse: generate helpful response for the query.
 * - query: user text
 * - langCode: franc result like 'eng'|'hin'|'kan'|'tel'
 * Guardian-Her behavior: always clear steps + emotional support.
 */
export function getResponse(query: string, langCode?: string): string {
    const lang = normalizeLang(langCode);
    const t = templates[lang];
    const raw = (query || '').trim();
    const q = raw.toLowerCase();

    // Keywords / intents
    const sosKeywords = ['sos', 'help', 'emergency', 'save me', 'save', 'helpme', 'हेल्प', 'मदद', 'बचाओ', 'ಸಹಾಯ', 'సహాయం', 'ఆపద'];
    const followKeywords = ['following', 'follow', 'followed', 'behind me', 'pace', 'chasing', 'stalking', 'पीछा', 'ಹಿಂಬಾಲ', 'వెంబడిస్తున్నారు'];
    const guideHomeKeywords = ['guide me home', 'guide me', 'take me home', 'safer route', 'safer routes', 'route home', 'get me home', 'घर भेजो', 'घर जाना', 'ಮನೆಗೆ', 'ఇంటికి'];
    const whereKeywords = ['where am i', 'my location', 'share location', 'track me', 'कहाँ हूँ', 'location', 'ಸ್ಥಳ', 'లొకేషన్'];
    const callKeywords = ['call', 'call police', 'call ambulance', 'call doctor', 'call hospital', 'phone', 'dial', 'फोन', 'ಕರೆ', 'కాల్'];

    // Health keywords
    const feverKeywords = ['fever', 'temperature', 'hot body', 'shivering', 'बुखार', 'ज्वर', 'ಜ್ವರ', 'జ్వరం'];
    const headacheKeywords = ['headache', 'head ache', 'migraine', 'head pain', 'सिरदर्द', 'ತಲೆನೋವು', 'తలనొప్పి'];
    const periodKeywords = ['period', 'menstrual', 'cramps', 'stomach pain', 'tummy pain', 'bleeding', 'मासिक', 'ಮುಟ್ಟು', 'పీరియడ్స్'];

    // 1) SOS / Emergency Priority
    if (includesAny(q, sosKeywords) || q === 'sos') {
        return t.emergency.sosActivated;
    }
    if (q.includes('unsafe') || q.includes('danger') || q.includes('scared') || q.includes('afraid') || q.includes('खतरा')) {
        return t.emergency.immediate;
    }

    // 2) Following / Being Followed
    if (includesAny(q, followKeywords)) {
        const lines = t.safety.following;
        return `${t.intro}\n\n${lines.join('\n')}`;
    }

    // 3) Threatened / Harassed
    if (q.includes('threat') || q.includes('attack') || q.includes('harass') || q.includes('kill') || q.includes('hurt')) {
        const lines = t.safety.threatened;
        return `${t.intro}\n\n${lines.join('\n')}`;
    }

    // 4) Guide home / Saferoute
    if (includesAny(q, guideHomeKeywords)) {
        return `${t.navigation.guideHome}\n\n${t.navigation.saferRoutesIntro}`;
    }

    // 5) Where am I / Location
    if (includesAny(q, whereKeywords)) {
        const lines = t.safety.whereAmI;
        return `${lines.join('\n')}`;
    }

    // 6) Call intent
    if (includesAny(q, callKeywords)) {
        const phoneText = `${t.phoneOptionsLabel} 100 / 112 / 108\n\n${t.confirmCall}`;
        return phoneText;
    }

    // 7) Health Logic
    if (includesAny(q, feverKeywords)) {
        const lines = t.health.fever;
        return `${t.intro}\n\n${lines.join('\n')}`;
    }
    if (includesAny(q, headacheKeywords)) {
        const lines = t.health.headache;
        return `${t.intro}\n\n${lines.join('\n')}`;
    }
    if (includesAny(q, periodKeywords)) {
        const lines = t.health.period;
        return `${t.intro}\n\n${lines.join('\n')}`;
    }

    // 8) Device / Permissions
    if (q.includes('location permission') || q.includes('enable location') || q.includes('gps')) {
        return t.device.enableLocation;
    }

    // 9) Casual / Small talk
    if (q.includes('how are you') || q.includes('who are you') || q.includes('hello') || q.includes('hi ')) {
        return t.casual.howAreYou;
    }
    if (q.includes('joke') || q.includes('funny') || q.includes('laugh')) {
        return t.casual.joke;
    }
    if (q.includes('what is ai') || q.includes('artificial intelligence') || q.includes('about you') || q.includes('guardian')) {
        return t.casual.aboutAI;
    }

    // 10) Relationship / Stress
    if (q.includes('stress') || q.includes('sad') || q.includes('depressed') || q.includes('anxiety') || q.includes('worry') || q.includes('tension')) {
        return t.relationship.stress;
    }
    if (q.includes('lonely') || q.includes('alone') || q.includes('no one') || q.includes('friend')) {
        return t.relationship.lonely;
    }

    // 11) Fallback - MUST NOT be generic.
    return `${t.fallbackIntro}\n\n${t.fallback.suggestions.join('\n')}`;
}

export default getResponse;