import React from 'react';
import { motion } from 'framer-motion';

// Mini animated previews for each template
export function RoseGardenPreview({ isActive }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 overflow-hidden">
            {/* Floating petals */}
            {isActive && [...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-lg"
                    initial={{ x: Math.random() * 100 + '%', y: -20, rotate: 0, opacity: 0 }}
                    animate={{ y: 350, rotate: 360, opacity: [0, 0.8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
                >
                    🌸
                </motion.div>
            ))}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <motion.div
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl mb-2"
                >
                    💝
                </motion.div>
                <p className="text-xs font-light italic">My Valentine</p>
            </div>
        </div>
    );
}

export function GoldenJubileePreview({ isActive }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 overflow-hidden">
            {/* Gold particles */}
            {isActive && [...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-200 rounded-full"
                    style={{ left: `${Math.random() * 100}%` }}
                    initial={{ y: 350, opacity: 0 }}
                    animate={{ y: -20, opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
                />
            ))}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <motion.div
                    animate={isActive ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl mb-2"
                >
                    🎂
                </motion.div>
                <p className="text-xs font-bold">BIRTHDAY</p>
            </div>
        </div>
    );
}

export function EternalVowPreview({ isActive }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-rose-100 to-amber-200 overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-800">
                <motion.svg
                    className="w-12 h-12 mb-2"
                    viewBox="0 0 100 100"
                    animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <circle cx="40" cy="50" r="20" fill="none" stroke="#B45309" strokeWidth="3" />
                    <circle cx="60" cy="50" r="20" fill="none" stroke="#D4A574" strokeWidth="3" />
                </motion.svg>
                <p className="text-xs font-light italic">Forever</p>
            </div>
        </div>
    );
}

export function CapAndGownPreview({ isActive }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-900 overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <motion.div
                    initial={{ y: isActive ? -50 : 0 }}
                    animate={isActive ? { y: 0 } : {}}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="text-3xl mb-2"
                >
                    🎓
                </motion.div>
                <motion.p
                    className="text-xs font-bold text-yellow-400"
                    animate={isActive ? { opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    CONGRATS!
                </motion.p>
            </div>
        </div>
    );
}

export function SoftMemorialPreview({ isActive }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-blue-100 to-slate-300 overflow-hidden">
            {isActive && [...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-sm opacity-30"
                    style={{ left: `${20 + i * 15}%` }}
                    initial={{ y: 350 }}
                    animate={{ y: -20, opacity: [0, 0.4, 0] }}
                    transition={{ duration: 8, repeat: Infinity, delay: i * 1.5, ease: "linear" }}
                >
                    ✨
                </motion.div>
            ))}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                <motion.div
                    animate={isActive ? { y: [0, -5, 0] } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-3xl mb-2"
                >
                    🕊️
                </motion.div>
                <p className="text-xs font-light">In Memory</p>
            </div>
        </div>
    );
}

export function CelebrationPopPreview({ isActive }) {
    return (
        <div className="absolute inset-0 overflow-hidden" style={{ background: 'linear-gradient(135deg, #A855F7, #EC4899, #F97316)' }}>
            <motion.div
                className="absolute inset-0"
                animate={isActive ? { rotate: 360 } : {}}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ background: 'conic-gradient(from 0deg, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.1))' }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <motion.div
                    animate={isActive ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-3xl mb-2"
                >
                    🎉
                </motion.div>
                <p className="text-xs font-bold">PARTY!</p>
            </div>
        </div>
    );
}

export function MinimalStoryPreview({ isActive }) {
    return (
        <div className="absolute inset-0 bg-white overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-black">
                <motion.div
                    className="w-8 h-0.5 bg-gray-300 mb-4"
                    animate={isActive ? { scaleX: [0, 1, 1, 0] } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <p className="text-xl font-black tracking-tight">Story</p>
                <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-2">MINIMAL</p>
            </div>
        </div>
    );
}

export function CosmicDreamPreview({ isActive }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 overflow-hidden">
            {/* Stars */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-0.5 h-0.5 bg-white rounded-full"
                    style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                    animate={isActive ? { opacity: [0.2, 1, 0.2] } : { opacity: 0.3 }}
                    transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                />
            ))}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-purple-200">
                <motion.div
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-3xl mb-2"
                >
                    🌙
                </motion.div>
                <p className="text-xs font-light">Dreams</p>
            </div>
        </div>
    );
}

export function VintageFilmPreview({ isActive }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-300 overflow-hidden">
            {/* Film grain overlay */}
            <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-800">
                <motion.div
                    animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-3xl mb-2"
                >
                    📽️
                </motion.div>
                <p className="text-xs font-light italic">Memories</p>
            </div>
        </div>
    );
}

export function NeonNightsPreview({ isActive }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            {/* Neon glow */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full blur-xl"
                style={{ background: 'rgba(6, 182, 212, 0.4)' }}
                animate={isActive ? { x: [0, 30, 0], y: [0, -20, 0] } : {}}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-20 h-20 rounded-full blur-xl"
                style={{ background: 'rgba(236, 72, 153, 0.4)' }}
                animate={isActive ? { x: [0, -30, 0], y: [0, 20, 0] } : {}}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                    animate={isActive ? { opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-3xl mb-2"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.8))' }}
                >
                    ⚡
                </motion.div>
                <p className="text-xs font-bold text-cyan-400" style={{ textShadow: '0 0 10px rgba(6, 182, 212, 0.8)' }}>NEON</p>
            </div>
        </div>
    );
}

// Map template IDs to preview components
export const TEMPLATE_PREVIEWS = {
    RoseGarden: RoseGardenPreview,
    GoldenJubilee: GoldenJubileePreview,
    EternalVow: EternalVowPreview,
    CapAndGown: CapAndGownPreview,
    SoftMemorial: SoftMemorialPreview,
    CelebrationPop: CelebrationPopPreview,
    MinimalStory: MinimalStoryPreview,
    CosmicDream: CosmicDreamPreview,
    VintageFilm: VintageFilmPreview,
    NeonNights: NeonNightsPreview,
};

export default TEMPLATE_PREVIEWS;
