import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, Music, Zap, Radio } from 'lucide-react';

export default function MidnightLuxe({ formData }) {
    const chapters = formData.chapters || [];
    const [introComplete, setIntroComplete] = useState(false);

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500 selection:text-black relative overflow-x-hidden">
            <AnimatePresence mode="wait">
                {!introComplete && (
                    <NoirIntro key="intro" onComplete={() => setIntroComplete(true)} recipientName={recipientName} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {introComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                    >
                        {/* Interactive Noir Spotlights */}
                        <motion.div
                            className="fixed w-[800px] h-[800px] rounded-full pointer-events-none z-0 blur-[150px] opacity-20"
                            animate={{ x: mousePos.x - 400, y: mousePos.y - 400 }}
                            transition={{ type: 'spring', damping: 40, stiffness: 40, mass: 1.5 }}
                            style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)' }}
                        />

                        {/* Premium Noir Noise */}
                        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

                        {/* Header */}
                        <header className="relative z-10 pt-48 pb-40 px-6 text-center border-b border-white/5">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-12"
                            >
                                <div className="w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center bg-black/50 backdrop-blur-xl mx-auto">
                                    <Zap size={24} className="text-amber-500" />
                                </div>
                            </motion.div>

                            {recipientName && (
                                <motion.h1
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-8xl md:text-[15rem] font-serif italic font-light tracking-tighter mb-8 leading-[0.8]"
                                    style={{
                                        background: 'linear-gradient(to bottom, #FFD700, #B8860B)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textShadow: '0 20px 60px rgba(184, 134, 11, 0.3)'
                                    }}
                                >
                                    {recipientName}
                                </motion.h1>
                            )}

                            {celebrationType && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-center gap-6"
                                >
                                    <div className="h-px w-20 bg-amber-500/20" />
                                    <p className="text-[10px] uppercase tracking-[0.8em] text-amber-500/40 font-black">
                                        {celebrationType} // NOIR_EDITION_2026
                                    </p>
                                    <div className="h-px w-20 bg-amber-500/20" />
                                </motion.div>
                            )}
                        </header>

                        {/* Main Feed */}
                        <main className="max-w-7xl mx-auto px-6 space-y-60 pb-60 relative z-10 pt-20">
                            {chapters.map((chapter, index) => (
                                <LuxeChapter key={chapter.id || index} chapter={chapter} index={index} />
                            ))}
                        </main>

                        {/* Final Reflection */}
                        {formData.secretMessage && (
                            <footer className="relative z-10 py-60 px-6 text-center border-t border-white/5 bg-gradient-to-t from-amber-500/5 to-transparent">
                                <Star size={40} className="mx-auto mb-10 text-amber-500/30" />
                                <p className="text-4xl md:text-7xl font-serif italic text-amber-100 leading-tight max-w-5xl mx-auto">
                                    "{formData.secretMessage}"
                                </p>
                                <div className="mt-24 text-[10px] uppercase tracking-[1em] text-amber-500/20 font-bold">
                                    Exclusive Transmission // End of Line
                                </div>
                            </footer>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}

function NoirIntro({ onComplete, recipientName }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 4000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
        >
            {/* Spotlight Beam */}
            <motion.div
                initial={{ x: '-150%', opacity: 0, rotate: 45 }}
                animate={{ x: ['-150%', '150%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3.5, ease: "easeInOut", times: [0, 1] }}
                className="absolute top-0 bottom-0 w-[400px] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-3xl"
            />

            <motion.div
                initial={{ x: '150%', opacity: 0, rotate: -45 }}
                animate={{ x: ['150%', '-150%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3.5, ease: "easeInOut", times: [0, 1], delay: 0.2 }}
                className="absolute top-0 bottom-0 w-[300px] bg-gradient-to-r from-transparent via-amber-500/10 to-transparent blur-3xl mix-blend-screen"
            />

            {/* Revealed Text */}
            <div className="relative z-10 text-center px-4">
                {recipientName && (
                    <motion.div
                        initial={{ opacity: 0, filter: 'blur(20px)' }}
                        animate={{ opacity: [0, 1, 1, 0], filter: ['blur(20px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'] }}
                        transition={{ duration: 3.5, times: [0, 0.4, 0.8, 1] }}
                    >
                        <div className="text-amber-500/50 text-sm tracking-[1em] mb-4 uppercase">Target Identified</div>
                        <h1 className="text-6xl md:text-9xl font-serif italic text-white/90">
                            {recipientName}
                        </h1>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

function LuxeChapter({ chapter, index }) {
    const isEven = index % 2 === 0;
    const [photoIndex, setPhotoIndex] = useState(0);

    useEffect(() => {
        if (chapter.media?.length > 1) {
            const interval = setInterval(() => {
                setPhotoIndex(prev => (prev + 1) % chapter.media.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [chapter.media]);

    return (
        <motion.section
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-24 items-center`}
        >
            {/* Visual Canvas */}
            <div className="flex-1 w-full relative group">
                <div className="absolute -inset-10 bg-amber-500/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="aspect-[16/10] bg-zinc-900 rounded-[40px] overflow-hidden border border-white/5 relative shadow-2xl">
                    <AnimatePresence mode="wait">
                        {chapter.media?.length > 0 ? (
                            <motion.img
                                key={photoIndex}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5 }}
                                src={chapter.media[photoIndex].data}
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                alt=""
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                                <Star size={40} className="text-white/10" />
                            </div>
                        )}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    {/* Index Tag */}
                    <div className="absolute bottom-8 left-8 flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 text-[10px] uppercase tracking-widest font-black">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        NOIR_LOG_{String(index + 1).padStart(2, '0')}
                    </div>
                </div>
            </div>

            {/* Narrative Context */}
            <div className={`flex-1 ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white mb-10 leading-[0.85]">
                    {chapter.title}
                </h2>
                <p className="text-xl md:text-3xl text-white/40 font-serif leading-relaxed italic mb-12">
                    {chapter.content}
                </p>

                {chapter.voiceNote && (
                    <div className="inline-flex items-center gap-4 py-3 px-6 bg-white/5 rounded-full border border-white/10 text-amber-500/60">
                        <Music size={16} />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Audio Archive Decrypted</span>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
