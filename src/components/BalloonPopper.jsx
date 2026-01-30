import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BalloonPopper({ recipientName, onComplete }) {
    // Generate random balloons
    const [balloons, setBalloons] = useState(() =>
        Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            x: Math.random() * 80 + 10, // 10-90%
            color: ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'][Math.floor(Math.random() * 5)],
            delay: Math.random() * 2,
            scale: Math.random() * 0.5 + 0.8
        }))
    );
    const [poppedCount, setPoppedCount] = useState(0);
    const requiredPops = 3;

    const popBalloon = (id) => {
        setBalloons(prev => prev.filter(b => b.id !== id));
        setPoppedCount(prev => {
            const newCount = prev + 1;
            if (newCount >= requiredPops) {
                setTimeout(onComplete, 1000);
            }
            return newCount;
        });
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-[#87CEEB] to-[#B0E2FF] overflow-hidden flex items-center justify-center font-sans cursor-crosshair">
            {/* Background Clouds */}
            <div className="absolute inset-0 opacity-50 pointer-events-none">
                <motion.div animate={{ x: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-10 left-10 w-32 h-16 bg-white rounded-full blur-xl" />
                <motion.div animate={{ x: [0, -40, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-40 right-20 w-48 h-20 bg-white rounded-full blur-xl" />
                <motion.div animate={{ x: [0, 30, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute bottom-20 left-1/3 w-64 h-24 bg-white rounded-full blur-xl" />
            </div>

            <div className="z-10 text-center pointer-events-none">
                <motion.h1
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl md:text-7xl font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)] mb-4"
                >
                    Happy Birthday<br />{recipientName}!
                </motion.h1>
                <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full inline-block border border-white/30">
                    <p className="text-white text-lg font-bold">
                        {poppedCount < requiredPops
                            ? `Pop ${requiredPops - poppedCount} more user_rules to start!`
                            : "Here we go! 🎉"}
                    </p>
                </div>
            </div>

            <AnimatePresence>
                {balloons.map((b) => (
                    <motion.div
                        key={b.id}
                        initial={{ y: '120vh', x: `${b.x}vw`, rotate: Math.random() * 20 - 10 }}
                        animate={{ y: '-120vh', rotate: Math.random() * 40 - 20 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                            y: {
                                duration: 15 + Math.random() * 5, // Slower: 15-20s
                                ease: "linear",
                                delay: b.delay,
                                repeat: Infinity,
                            },
                            rotate: {
                                duration: 5,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            popBalloon(b.id);
                        }}
                        className="absolute bottom-0 cursor-pointer p-8 -m-8 group" // Padding increases hit area
                        style={{ left: 0 }}
                    >
                        {/* Shard Particles for Pop Effect */}
                        <div className="relative group-active:scale-90 transition-transform">
                            {/* Balloon Shape */}
                            <div
                                className={`w-16 h-20 rounded-[50%] ${b.color} relative shadow-xl`}
                                style={{
                                    boxShadow: 'inset -8px -8px 15px rgba(0,0,0,0.2), inset 8px 8px 15px rgba(255,255,255,0.4)',
                                    transform: `scale(${b.scale})`
                                }}
                            >
                                {/* Reflection */}
                                <div className="absolute top-4 left-4 w-4 h-6 bg-white/30 rounded-full blur-[2px]" />

                                {/* String */}
                                <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[2px] h-16 bg-white/40" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Global Pop Flash */}
            {poppedCount > 0 && (
                <motion.div
                    key={poppedCount}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 0 }}
                    className="absolute inset-0 bg-white pointer-events-none z-0"
                />
            )}
        </div>
    );
}
