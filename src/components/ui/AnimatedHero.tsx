import { motion } from 'framer-motion';

export const AnimatedHero = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-lg mx-auto p-2"
        >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-rose-950 border border-white/20 p-6 backdrop-blur-xl">
                {/* Ambient Glowing Orbs */}
                <motion.div
                    className="absolute -top-10 -left-10 w-40 h-40 bg-rose-500/30 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />

                <svg
                    viewBox="0 0 420 260"
                    className="w-full h-auto relative z-10 filter drop-shadow-md"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Gradients */}
                        <linearGradient id="heroSky" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#31103F" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#4C0519" stopOpacity="0.8" />
                        </linearGradient>

                        <linearGradient id="shieldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FB7185" />
                            <stop offset="100%" stopColor="#E11D48" />
                        </linearGradient>

                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#F43F5E" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#34D399" stopOpacity="0.3" />
                        </linearGradient>

                        <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FF6584" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#FF6584" stopOpacity="0" />
                        </radialGradient>

                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Sky Background */}
                    <rect x="0" y="0" width="420" height="260" rx="20" fill="url(#heroSky)" />

                    {/* Stars / Constellations */}
                    <circle cx="50" cy="40" r="1.5" fill="#FFF" opacity="0.8" />
                    <circle cx="120" cy="30" r="2" fill="#FFF" opacity="0.9" />
                    <circle cx="280" cy="25" r="1" fill="#FFF" opacity="0.6" />
                    <circle cx="360" cy="45" r="2.5" fill="#FFE4E6" opacity="0.9" />
                    <circle cx="390" cy="80" r="1.5" fill="#FFF" opacity="0.7" />

                    {/* Animated Pulsing Radar Rings */}
                    <motion.circle
                        cx="210"
                        cy="130"
                        r="90"
                        fill="none"
                        stroke="#F43F5E"
                        strokeWidth="1"
                        strokeDasharray="4 6"
                        opacity="0.4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        style={{ transformOrigin: "210px 130px" }}
                    />
                    <motion.circle
                        cx="210"
                        cy="130"
                        r="65"
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="1.5"
                        opacity="0.5"
                        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Safe Route Pathway curve */}
                    <motion.path
                        d="M 30 220 C 120 200 160 150 210 130 C 260 110 320 160 390 140"
                        fill="none"
                        stroke="url(#pathGradient)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />

                    {/* Protective Aura behind character */}
                    <circle cx="210" cy="125" r="50" fill="url(#auraGlow)" />

                    {/* Modern Vector Character (Woman in Protective Shield Aura) */}
                    <g transform="translate(180, 75)">
                        {/* Flowing Hair */}
                        <path
                            d="M 22 28 C 15 15, 42 12, 38 28 C 44 38, 48 55, 42 70 C 38 65, 34 50, 34 40 Z"
                            fill="#F43F5E"
                            opacity="0.9"
                        />

                        {/* Head & Neck */}
                        <circle cx="30" cy="24" r="13" fill="#FFE0D3" />
                        <path
                            d="M 20 20 C 22 10, 38 10, 40 20 C 36 17, 24 17, 20 20 Z"
                            fill="#1E1B4B"
                        />

                        {/* Elegant Body / Jacket */}
                        <path
                            d="M 18 42 C 22 36, 38 36, 42 42 L 48 85 L 12 85 Z"
                            fill="#312E81"
                        />
                        <path
                            d="M 24 42 L 30 65 L 36 42 Z"
                            fill="#F43F5E"
                        />

                        {/* Arm holding Glowing Guardian Crystal */}
                        <path
                            d="M 38 45 L 52 58 L 46 62"
                            fill="none"
                            stroke="#FFE0D3"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />

                        {/* Legs */}
                        <rect x="20" y="85" width="7" height="35" rx="3.5" fill="#1E1B4B" />
                        <rect x="33" y="85" width="7" height="35" rx="3.5" fill="#1E1B4B" />
                        <ellipse cx="23.5" cy="120" rx="6" ry="3" fill="#E11D48" />
                        <ellipse cx="36.5" cy="120" rx="6" ry="3" fill="#E11D48" />
                    </g>

                    {/* Glowing Safety Beacon / Shield Orb in Hand */}
                    <motion.g
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <circle cx="235" cy="132" r="14" fill="url(#shieldGlow)" filter="url(#glow)" />
                        <path
                            d="M 235 125 L 241 129 L 241 135 C 241 139 235 142 235 142 C 235 142 229 139 229 135 L 229 129 Z"
                            fill="#FFF"
                        />
                    </motion.g>



                    {/* Sparkles / Particles */}
                    <motion.g
                        animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <path d="M 160 50 L 162 55 L 167 57 L 162 59 L 160 64 L 158 59 L 153 57 L 158 55 Z" fill="#F43F5E" />
                        <path d="M 330 90 L 331.5 93.5 L 335 95 L 331.5 96.5 L 330 100 L 328.5 96.5 L 325 95 L 328.5 93.5 Z" fill="#38BDF8" />
                    </motion.g>
                </svg>
            </div>
        </motion.div>
    );
};
