import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CloudReveal({ recipient, onOpen }) {
    const [cleared, setCleared] = useState(false);

    // Auto-open if user clicks the button
    const handleEnter = () => {
        setCleared(true);
        setTimeout(onOpen, 1000);
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-pink-200 to-indigo-200 overflow-hidden flex items-center justify-center">

            {/* Central Content (Hidden behind clouds initially) */}
            <motion.div
                className="text-center z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
                    <span className="text-6xl">❤️</span>
                </div>
                <h1 className="text-4xl font-serif italic text-indigo-900 mb-2">For {recipient}</h1>
                <p className="text-indigo-800/60 mb-8">Sending you lots of love...</p>

                <button
                    onClick={handleEnter}
                    className="px-8 py-3 bg-white text-indigo-600 rounded-full font-bold shadow-lg hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95"
                >
                    Catch the Vibe ✨
                </button>
            </motion.div>

            {/* Floating Hearts/Clouds Overlay */}
            <AnimatePresence>
                {!cleared && Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-4xl select-none cursor-pointer hover:scale-125 transition-transform"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight + 100,
                            opacity: 0
                        }}
                        animate={{
                            y: -100,
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        style={{
                            left: 0,
                            top: 0
                        }}
                        onClick={(e) => {
                            // "Pop" the heart on click
                            e.target.style.transform = "scale(2)";
                            e.target.style.opacity = "0";
                        }}
                    >
                        {['☁️', '💖', '✨', '💌'][Math.floor(Math.random() * 4)]}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
