import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Star, Music, PartyPopper } from 'lucide-react';

export default function DopamineDream({ formData }) {
    const chapters = formData.chapters || [];
    const [introComplete, setIntroComplete] = useState(false);

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div className="min-h-screen bg-[#FFF0F5] text-[#2D2D2D] font-sans selection:bg-[#FF69B4]/30 overflow-x-hidden relative">
            <AnimatePresence mode="wait">
                {!introComplete && (
                    <EnergyIntro key="intro" onComplete={() => setIntroComplete(true)} recipientName={recipientName} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {introComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Liquid Background Decorations */}
                        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                                transition={{ duration: 20, repeat: Infinity }}
                                className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#FF69B4]/20 rounded-full blur-[120px]"
                            />
                            <motion.div
                                animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
                                transition={{ duration: 25, repeat: Infinity }}
                                className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-[#00FFFF]/20 rounded-full blur-[100px]"
                            />
                            <motion.div
                                animate={{ x: [-50, 50, -50], y: [-50, 50, -50] }}
                                transition={{ duration: 15, repeat: Infinity }}
                                className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-[#FF4500]/10 rounded-full blur-[80px]"
                            />
                        </div>

                        {/* Energetic Header */}
                        <motion.header
                            initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            className="pt-32 pb-40 px-6 text-center relative z-10"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="inline-block p-4 bg-white rounded-3xl shadow-2xl mb-8 rotate-12"
                            >
                                <PartyPopper size={48} className="text-[#FF69B4]" />
                            </motion.div>
                            {recipientName && (
                                <h1 className="text-6xl md:text-[14rem] font-black leading-none mb-8 tracking-tighter"
                                    style={{
                                        WebkitTextFillColor: 'transparent',
                                        WebkitTextStrokeWidth: '2px',
                                        WebkitTextStrokeColor: '#2D2D2D'
                                    }}>
                                    {recipientName.toUpperCase()}
                                </h1>
                            )}
                            <div className="flex flex-wrap justify-center gap-4">
                                {(formData.customOccasion || celebrationType) && (
                                    <span className="px-6 py-2 bg-white rounded-full text-xs font-black tracking-widest border-2 border-[#2D2D2D] shadow-[4px_4px_0px_#2D2D2D]">
                                        {(formData.customOccasion || celebrationType).toUpperCase()}
                                    </span>
                                )}
                                {['ENERGY', 'JOY', 'CELEBRATION', '2026'].map((tag, i) => (
                                    <span key={i} className="px-6 py-2 bg-white rounded-full text-xs font-black tracking-widest border-2 border-[#2D2D2D] shadow-[4px_4px_0px_#2D2D2D]">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.header>

                        {/* Bouncy Chapters */}
                        <div className="max-w-5xl mx-auto px-6 space-y-24 pb-40 relative z-10">
                            {chapters.map((chapter, index) => (
                                <BouncyChapter key={chapter.id || index} chapter={chapter} index={index} />
                            ))}
                        </div>

                        {/* Footer Pop */}
                        {formData.secretMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="max-w-4xl mx-auto px-6 py-32"
                            >
                                <div className="bg-white border-4 border-[#2D2D2D] p-12 md:p-20 rounded-[4rem] shadow-[20px_20px_0px_#FF69B4] -rotate-2 relative overflow-hidden">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                        className="absolute -top-10 -right-10 opacity-10"
                                    >
                                        <Sparkles size={200} className="text-[#00FFFF]" />
                                    </motion.div>
                                    <p className="text-4xl md:text-6xl font-black text-[#2D2D2D] leading-tight text-center relative z-10">
                                        "{formData.secretMessage}"
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function EnergyIntro({ onComplete, recipientName }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 3500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-[#FFF0F5] flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >
            {/* Color Streams */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
                className="absolute top-0 bottom-0 left-0 w-full bg-[#FF69B4] mix-blend-multiply opacity-50"
            />
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: '-100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
                className="absolute top-0 bottom-0 right-0 w-full bg-[#00FFFF] mix-blend-multiply opacity-50"
            />

            {/* Burst */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute rounded-full bg-yellow-300 blur-2xl w-96 h-96"
            />

            <div className="relative z-10 text-center">
                {recipientName && (
                    <motion.h1
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', delay: 1.2 }}
                        className="text-6xl md:text-9xl font-black text-[#2D2D2D]"
                    >
                        {recipientName}
                    </motion.h1>
                )}
            </div>
        </motion.div>
    );
}

function BouncyChapter({ chapter, index }) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 bg-white border-4 border-[#2D2D2D] rounded-[3rem] p-10 shadow-[12px_12px_0px_#2D2D2D] hover:shadow-[16px_16px_0px_#00FFFF] transition-all`}
        >
            {/* Visual Pop */}
            <div className="flex-1">
                <div className="aspect-square rounded-[2rem] overflow-hidden border-4 border-[#2D2D2D] rotate-2">
                    {chapter.media?.length > 0 ? (
                        <img
                            src={chapter.media[0].data}
                            className="w-full h-full object-cover"
                            alt=""
                        />
                    ) : (
                        <div className="w-full h-full bg-[#FFF0F5] flex items-center justify-center">
                            <Star size={64} className="text-[#FF69B4] animate-bounce" />
                        </div>
                    )}
                </div>
            </div>

            {/* Content Pop */}
            <div className="flex-1 flex flex-col justify-center">
                <div className="mb-6">
                    <span className="bg-[#00FFFF] border-2 border-[#2D2D2D] px-4 py-1.5 rounded-full text-xs font-black italic">
                        MOMENT_{index + 1}
                    </span>
                </div>
                <h3 className="text-4xl md:text-6xl font-black mb-6 leading-none">
                    {chapter.title}
                </h3>
                <p className="text-lg md:text-xl font-bold text-[#2D2D2D]/70 leading-relaxed mb-8">
                    {chapter.content}
                </p>
                <div className="flex gap-4">
                    {chapter.voiceNote && (
                        <div className="p-3 bg-[#FF69B4] border-2 border-[#2D2D2D] rounded-2xl shadow-[4px_4px_0px_#2D2D2D]">
                            <Music size={24} className="text-white" />
                        </div>
                    )}
                    <div className="flex-grow h-12 bg-[#FFF0F5] border-2 border-[#2D2D2D] rounded-full flex items-center px-4">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [8, 20, 8] }}
                                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                                    className="w-1.5 bg-[#FF69B4] rounded-full"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
