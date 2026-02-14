import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Feather, Star, Quote } from 'lucide-react';

import MediaBox from './shared/MediaBox';

export default function SoftMemorial({ formData, templateConfig }) {
    const chapters = formData.chapters || [];
    const [introComplete, setIntroComplete] = useState(false);

    const primaryColor = templateConfig?.primaryColor || '#64748B';
    const accentColor = templateConfig?.accentColor || '#8B9DC3';
    const fontFamily = templateConfig?.fontFamily || "'Lora', serif";

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div
            className="min-h-screen bg-[#F8FAFC] text-[#334155] selection:bg-slate-200 overflow-x-hidden relative"
            style={{ fontFamily }}
        >
            <AnimatePresence mode="wait">
                {!introComplete && (
                    <DoveIntro key="intro" onComplete={() => setIntroComplete(true)} recipientName={recipientName} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {introComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                    >
                        {/* Specialized Peace Decor */}
                        <RainOverlay />
                        <FeatherDecor />
                        <MistOverlay />

                        {/* Gentle Floating Elements */}
                        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
                            <motion.div
                                animate={{ y: [0, -100, 0], x: [0, 50, 0] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-[100px]"
                            />
                        </div>

                        {/* Header */}
                        <header className="relative z-10 pt-32 pb-40 px-6 text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-12"
                            >
                                <div className="inline-block p-4 bg-white rounded-full shadow-sm border border-slate-100">
                                    <Heart size={32} style={{ color: primaryColor }} className="fill-slate-50" />
                                </div>
                            </motion.div>

                            {recipientName && (
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-6xl md:text-9xl font-light tracking-tight mb-8 text-slate-800"
                                >
                                    {recipientName}
                                </motion.h1>
                            )}

                            {(formData.customOccasion || celebrationType) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    className="flex items-center justify-center gap-4"
                                >
                                    <div className="h-px w-12 bg-black/10" />
                                    <p className="text-[10px] uppercase tracking-[0.5em] font-bold">
                                        {(formData.customOccasion || celebrationType).toUpperCase()}
                                    </p>
                                    <div className="h-px w-12 bg-black/10" />
                                </motion.div>
                            )}
                        </header>

                        {/* Feed */}
                        <main className="max-w-4xl mx-auto px-6 space-y-40 pb-60 relative z-10">
                            {chapters.map((chapter, index) => (
                                <MemorialChapter
                                    key={chapter.id || index}
                                    chapter={chapter}
                                    index={index}
                                    accentColor={accentColor}
                                />
                            ))}
                        </main>

                        {/* Peace Footer */}
                        {formData.secretMessage && (
                            <footer className="relative z-10 py-60 px-6 text-center border-t border-slate-200 bg-gradient-to-t from-slate-100 to-transparent">
                                <Feather size={40} className="mx-auto mb-10 text-slate-300" />
                                <p className="text-3xl md:text-5xl font-light italic leading-relaxed text-slate-600 max-w-3xl mx-auto">
                                    "{formData.secretMessage}"
                                </p>
                                <div className="mt-20 text-[10px] uppercase tracking-[0.5em] text-slate-400 font-bold">
                                    With Eternal Love
                                </div>
                            </footer>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DoveIntro({ onComplete, recipientName }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 4500); // 4.5s total duration
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-[#F8FAFC] flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            {/* 1. Translucent Horizon */}
            <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#94A3B8] to-transparent top-1/2 left-0"
            />

            {/* 2. Dove Silhouette Passing */}
            <motion.div
                initial={{ x: '-100vw', y: 0, scale: 0.5, opacity: 0 }}
                animate={{
                    x: '100vw',
                    y: -100,
                    scale: 0.8,
                    opacity: [0, 1, 1, 0]
                }}
                transition={{ duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute z-20 text-[#64748B]"
            >
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.6,3.6c-1.3,0.3-2.6,0.9-3.8,1.6C7,6.4,5.4,8,4.1,9.8c-0.2,0.3-0.4,0.6-0.6,0.9c-0.6,1-1.1,2.1-1.4,3.2 c-0.1,0.3-0.1,0.6-0.2,0.9c0,0.1,0,0.2,0,0.3l0.1,0.1c0.3,0.3,0.7,0.5,1.1,0.7c0.4,0.2,0.9,0.4,1.3,0.5c0.9,0.3,1.9,0.5,2.8,0.6 c0,0,0.1,0,0.1,0c0.1,0,0.2-0.1,0.2-0.2c0.2-0.6,0.4-1.2,0.7-1.8c0.3-0.6,0.7-1.1,1.1-1.6c0.8-1,1.8-1.8,2.8-2.5c0.5-0.3,1-0.6,1.6-0.8 c1.1-0.5,2.3-0.8,3.5-0.9c0.6-0.1,1.2-0.1,1.8,0c0.6,0.1,1.2,0.2,1.7,0.5c0.3,0.1,0.5,0.3,0.7,0.5c0.1,0.1,0.2,0.3,0.3,0.5 c0.1,0.2,0.1,0.4,0,0.6c-0.1,0.4-0.4,0.8-0.8,1.1c-0.4,0.3-0.9,0.5-1.4,0.7c-1,0.4-2,0.6-3.1,0.8c-1.1,0.1-2.2,0.2-3.3,0.1 c-0.5,0-1.1-0.1-1.6-0.2c-0.2,0-0.3,0.1-0.3,0.2c0,0.1,0,0.2,0.1,0.3c0.4,0.5,0.9,0.9,1.4,1.3c1,0.8,2.2,1.3,3.4,1.7 c1.2,0.4,2.5,0.6,3.8,0.7c0.6,0,1.3,0,1.9-0.1c0.6-0.1,1.2-0.3,1.8-0.5c0.3-0.1,0.5-0.3,0.7-0.5c0.1-0.1,0.1-0.2,0.1-0.4 c0-0.3-0.2-0.6-0.5-0.8c-0.6-0.5-1.4-0.9-2.1-1.2c-1.5-0.6-3.1-0.9-4.7-1.1c-1.6-0.1-3.2,0-4.8,0.2c-0.4,0.1-0.8,0.1-1.2,0.2 c-0.2,0-0.3,0-0.4,0c-0.1-0.1-0.1-0.2-0.1-0.3c0.1-0.6,0.3-1.1,0.5-1.7c0.2-0.5,0.6-1,0.9-1.5c0.7-0.9,1.5-1.7,2.5-2.4 C11.9,4.2,12.6,3.6,12.6,3.6z" />
                </svg>
            </motion.div>

            {/* 3. Name Reveal - Dissolving in */}
            <div className="relative z-10 text-center">
                {recipientName && (
                    <motion.h1
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 2, delay: 2 }}
                        className="text-4xl md:text-6xl text-[#475569] font-light tracking-widest uppercase mb-4"
                    >
                        {recipientName}
                    </motion.h1>
                )}
                <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: '100px' }}
                    transition={{ duration: 1.5, delay: 2.5 }}
                    className="h-px bg-[#CBD5E1] mx-auto"
                />
            </div>
        </motion.div>
    );
}


function RainOverlay() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[6] overflow-hidden opacity-10">
            {[...Array(40)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: '-20vh', x: Math.random() * 100 + 'vw' }}
                    animate={{ y: '120vh' }}
                    transition={{
                        duration: 1 + Math.random() * 0.5,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "linear"
                    }}
                    className="absolute w-px h-12 bg-slate-400"
                />
            ))}
        </div>
    );
}

function FeatherDecor() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[7] overflow-hidden opacity-20">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: '-10vh', x: Math.random() * 100 + 'vw', rotate: 0 }}
                    animate={{
                        y: '110vh',
                        x: [null, (Math.random() * 100) + 'vw'],
                        rotate: 360
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        ease: "linear"
                    }}
                    className="absolute"
                >
                    <Feather size={24} className="text-slate-300 transform -rotate-45" />
                </motion.div>
            ))}
        </div>
    );
}

function MistOverlay() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[8] overflow-hidden opacity-30 mix-blend-screen">
            <motion.div
                animate={{ x: [-20, 20, -20], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/0 via-white/10 to-white/0"
            />
            <motion.div
                animate={{ x: [20, -20, 20], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/10 to-transparent"
            />
        </div>
    );
}

function MemorialChapter({ chapter, index }) {
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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 md:gap-24 items-center`}
        >
            {/* Narrative */}
            <div className={`flex-1 ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400 block mb-6">
                    Memory_{String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="text-4xl md:text-5xl font-light italic text-slate-800 mb-6 leading-tight">
                    {chapter.title}
                </h2>
                <p className="text-xl md:text-2xl font-light italic leading-relaxed text-slate-600/80">
                    {chapter.content}
                </p>

                {chapter.voiceNote && (
                    <div className="mt-10 inline-flex items-center gap-3 py-2 px-5 bg-white rounded-full border border-slate-100 text-slate-400">
                        <Music size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-widest">A Voice from the Past</span>
                    </div>
                )}
            </div>

            {/* Elegant Portrait */}
            <div className="flex-1 w-full max-w-xl">
                <div className="aspect-[4/5] bg-white p-4 shadow-xl rounded-sm border border-slate-100 relative group">
                    <MediaBox
                        media={chapter.media}
                        photoIndex={photoIndex}
                        containerClassName="w-full h-full relative"
                        className="grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
                        fallbackIcon={Star}
                        accentColor={accentColor}
                    />
                </div>
            </div>
        </motion.section>
    );
}
