import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Music, Quote, Zap } from 'lucide-react';

export default function LuxuryGold({ formData }) {
    const chapters = formData.chapters || [];
    const [introComplete, setIntroComplete] = useState(false);

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div className="min-h-screen bg-black text-[#FDB931] font-serif selection:bg-[#FDB931] selection:text-black overflow-x-hidden relative">
            <AnimatePresence mode="wait">
                {!introComplete && (
                    <EliteIntro key="intro" onComplete={() => setIntroComplete(true)} recipientName={recipientName} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {introComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                    >
                        {/* Background Stardust */}
                        <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

                        {/* Header */}
                        <header className="relative z-10 pt-48 pb-40 px-6 text-center border-b border-[#FDB931]/10">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mb-12"
                            >
                                <div className="w-20 h-20 rounded-full border border-[#FDB931]/30 flex items-center justify-center bg-black/50 backdrop-blur-xl mx-auto shadow-[0_0_30px_rgba(253,185,49,0.2)]">
                                    <Star size={32} className="text-[#FDB931]" fill="#FDB931" />
                                </div>
                            </motion.div>

                            {recipientName && (
                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-7xl md:text-[12rem] font-bold uppercase tracking-tighter mb-8 leading-[0.8] text-transparent bg-clip-text bg-gradient-to-br from-[#FDB931] via-[#FFFACD] to-[#CFB53B]"
                                >
                                    {recipientName}
                                </motion.h1>
                            )}

                            {(formData.customOccasion || celebrationType) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-center gap-6"
                                >
                                    <div className="h-px w-20 bg-[#FDB931]/20" />
                                    <p className="text-[10px] uppercase tracking-[0.8em] text-[#FDB931]/40 font-black">
                                        {(formData.customOccasion || celebrationType).toUpperCase()}
                                    </p>
                                    <div className="h-px w-20 bg-[#FDB931]/20" />
                                </motion.div>
                            )}
                        </header>

                        {/* Main Feed */}
                        <main className="max-w-6xl mx-auto px-6 space-y-48 pb-60 relative z-10 pt-20">
                            {chapters.map((chapter, index) => (
                                <GoldenChapter key={chapter.id || index} chapter={chapter} index={index} />
                            ))}
                        </main>

                        {/* Final Curation Footer */}
                        {formData.secretMessage && (
                            <footer className="relative z-10 py-60 px-6 text-center border-t border-[#FDB931]/10 bg-gradient-to-t from-[#1a1a1a] to-transparent">
                                <Quote size={40} className="mx-auto mb-12 text-[#FDB931]/30" />
                                <p className="text-4xl md:text-7xl font-light italic text-[#FFFACD] leading-tight max-w-5xl mx-auto">
                                    "{formData.secretMessage}"
                                </p>
                                <div className="mt-24 text-[10px] uppercase tracking-[1em] text-[#FDB931]/20 font-bold">
                                    Excellence Curated by {formData.senderName || 'Anonymous'}
                                </div>
                            </footer>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function EliteIntro({ onComplete, recipientName }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 4500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
        >
            {/* Gold Dust */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

            {/* Rising Lines */}
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute w-px bg-[#FDB931] left-1/2 transform -translate-x-1/2"
            />

            {/* Content */}
            <div className="relative z-10 text-center bg-black/80 p-12 backdrop-blur-sm border-y border-[#FDB931]">
                {recipientName && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, duration: 1.5 }}
                    >
                        <div className="text-[#FDB931]/50 text-xs tracking-[1em] mb-6 uppercase">Access Granted</div>
                        <h1 className="text-6xl md:text-9xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#FDB931] via-[#FFFACD] to-[#CFB53B] mb-2 uppercase">
                            {recipientName}
                        </h1>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

function GoldenChapter({ chapter, index }) {
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
            {/* Visual Frame */}
            <div className="flex-1 w-full relative group">
                <div className="absolute inset-0 border border-[#FDB931]/30 translate-x-4 translate-y-4 transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2" />
                <div className="aspect-[4/5] bg-zinc-900 overflow-hidden relative shadow-2xl">
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
                            <div className="w-full h-full flex items-center justify-center">
                                <Star size={64} className="text-[#FDB931]/10" />
                            </div>
                        )}
                    </AnimatePresence>
                    {/* Index Tag */}
                    <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-xl px-4 py-2 border border-[#FDB931]/30">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-[#FDB931]">ASSET_{String(index + 1).padStart(2, '0')}</span>
                    </div>
                </div>
            </div>

            {/* Narrative Content */}
            <div className={`flex-1 ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <h2 className="text-5xl md:text-8xl italic font-light text-white mb-10 leading-[0.85] tracking-tighter">
                    {chapter.title}
                </h2>
                <div className={`h-px w-20 bg-[#FDB931] mb-12 ${isEven ? 'mr-auto' : 'ml-auto md:mr-auto'}`} />
                <p className="text-xl md:text-3xl text-[#FDB931]/60 leading-relaxed italic mb-12 italic">
                    {chapter.content}
                </p>

                {chapter.voiceNote && (
                    <div className="inline-flex items-center gap-4 py-3 px-6 border border-[#FDB931]/30 bg-[#FDB931]/5 text-[#FDB931]/80">
                        <Music size={16} />
                        <span className="text-[10px] uppercase font-bold tracking-widest font-sans">Premium Audio Fragment Detected</span>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
