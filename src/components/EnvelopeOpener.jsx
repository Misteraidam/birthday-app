import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function EnvelopeOpener({ recipientName, onComplete }) {
    const [isOpening, setIsOpening] = useState(false);

    const handleClick = () => {
        setIsOpening(true);
        setTimeout(onComplete, 1500); // Wait for animation to finish before unmounting
    };

    return (
        <div className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center z-50 perspective-[1000px] overflow-hidden">
            {/* Background Particles/Effects */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full opacity-50 animate-pulse"
                        style={{
                            width: Math.random() * 4 + 1 + 'px',
                            height: Math.random() * 4 + 1 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            animationDuration: Math.random() * 3 + 2 + 's'
                        }}
                    />
                ))}
            </div>

            <motion.div
                className="cursor-pointer relative"
                onClick={!isOpening ? handleClick : undefined}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isOpening ?
                    { scale: 3, opacity: 0, rotateX: 60 } :
                    { scale: 1, opacity: 1, rotateX: 0 }
                }
                transition={{ duration: 1.5, ease: "easeInOut" }}
                whileHover={!isOpening ? { scale: 1.05 } : {}}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Envelope Container */}
                <div className="w-[300px] h-[200px] bg-[#E3D0B9] relative shadow-2xl flex items-center justify-center">

                    {/* Flap (Top Triangle) */}
                    <motion.div
                        className="absolute top-0 left-0 w-0 h-0 border-l-[150px] border-r-[150px] border-t-[100px] border-l-transparent border-r-transparent border-t-[#D4BFA3] origin-top z-30"
                        animate={isOpening ? { rotateX: 180 } : { rotateX: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />

                    {/* Letter Poking Out */}
                    <motion.div
                        className="absolute bg-white text-black w-[280px] h-[180px] p-6 text-center flex flex-col items-center justify-center shadow-md z-10"
                        initial={{ y: 0 }}
                        animate={isOpening ? { y: -150 } : { y: 0 }}
                        transition={{ delay: 0.4, duration: 1 }}
                    >
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">To</p>
                        <h2 className="font-serif italic text-2xl mb-4">{recipientName}</h2>
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-[10px] text-red-500 font-bold border border-red-200">
                            ❤
                        </div>
                    </motion.div>

                    {/* Envelope Front (Left/Right/Bottom triangles to cover the letter) */}
                    <div className="absolute inset-0 z-20 pointer-events-none">
                        <div className="absolute bottom-0 left-0 w-0 h-0 border-t-[100px] border-r-[150px] border-b-[100px] border-l-[150px] border-transparent border-b-[#E3D0B9] border-l-[#E3D0B9]/40 border-r-[#E3D0B9]/40 border-t-transparent" />
                    </div>

                    {/* Seal */}
                    <motion.div
                        className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-700 rounded-full z-40 flex items-center justify-center shadow-lg border-2 border-red-800"
                        animate={isOpening ? { opacity: 0 } : { opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <span className="text-red-900 font-serif font-bold text-lg">W</span>
                    </motion.div>

                    <div className="absolute -bottom-12 w-full text-center">
                        <p className="text-white/40 text-xs uppercase tracking-widest animate-pulse">Tap to Open</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
