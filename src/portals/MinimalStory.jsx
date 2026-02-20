import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Minus, Quote } from 'lucide-react';

import MediaBox from './shared/MediaBox';

export default function MinimalStory({ formData, templateConfig }) {
    const chapters = formData.chapters || [];
    const [introComplete, setIntroComplete] = useState(false);

    const primaryColor = templateConfig?.primaryColor || '#000000';
    const accentColor = templateConfig?.accentColor || '#666666';
    const fontFamily = templateConfig?.fontFamily || "'Inter', sans-serif";

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (

        <div
            className="min-h-screen bg-white text-black selection:bg-gray-100 overflow-x-hidden relative"
            style={{ fontFamily }}
        >
            <AnimatePresence mode="wait">
                {!introComplete && (
                    <CurtainIntro key="intro" onComplete={() => setIntroComplete(true)} recipientName={recipientName} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {introComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Header */}
                        <header className="relative z-10 pt-48 pb-32 px-6 text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-12"
                            >
                                <Minus className="mx-auto" style={{ color: `${primaryColor}22` }} size={64} />
                            </motion.div>
                            {recipientName && (
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-7xl md:text-[12rem] font-black tracking-tighter leading-none mb-8"
                                >
                                    {recipientName.toUpperCase()}
                                </motion.h1>
                            )}
                            {(formData.customOccasion || celebrationType) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-center gap-6"
                                >
                                    <div className="h-px w-12 bg-gray-100" />
                                    <p className="text-[10px] uppercase tracking-[1em] text-gray-400 font-bold">
                                        {(formData.customOccasion || celebrationType).toUpperCase()}
                                    </p>
                                    <div className="h-px w-12 bg-gray-100" />
                                </motion.div>
                            )}
                            {formData.eventVenue && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-6 text-sm text-gray-400 tracking-wide"
                                >
                                    📍 {formData.eventVenue}
                                </motion.p>
                            )}
                        </header>

                        {/* Chapters Feed */}
                        <main className="max-w-6xl mx-auto px-6 space-y-32 pb-60 relative z-10 pt-20">
                            {chapters.map((chapter, index) => (
                                <MinimalChapter
                                    key={chapter.id || index}
                                    chapter={chapter}
                                    index={index}
                                    primaryColor={primaryColor}
                                />
                            ))}
                        </main>

                        {/* Final Reflection */}
                        {formData.secretMessage && (
                            <footer className="relative z-10 py-60 px-6 text-center bg-black text-white">
                                <Minus className="mx-auto mb-12 text-gray-800" size={64} />
                                <p className="text-3xl md:text-6xl font-light tracking-tight leading-relaxed max-w-4xl mx-auto italic">
                                    "{formData.secretMessage}"
                                </p>
                                <div className="mt-20 text-[10px] uppercase tracking-[0.8em] text-gray-600 font-bold">
                                    Sincerely, {formData.senderName || 'Anonymous'}
                                </div>
                            </footer>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function CurtainIntro({ onComplete, recipientName }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 2500); // Quick, snappy reveal
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
            {/* Left Curtain */}
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: '-100%' }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#FAFAFA] border-r border-gray-200 z-20"
            />

            {/* Right Curtain */}
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#FAFAFA] border-l border-gray-200 z-20"
            />

            {/* Content Reveal Underneath - Stationary */}
            <div className="z-10 text-center">
                {recipientName && (
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="text-6xl md:text-9xl font-black tracking-tighter leading-none"
                    >
                        {recipientName.toUpperCase()}
                    </motion.h1>
                )}
            </div>
        </motion.div>
    );
}

function MinimalChapter({ chapter, index, primaryColor }) {
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            className="space-y-16"
        >
            {/* Index */}
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-black tracking-widest text-gray-300">SECTION_{String(index + 1).padStart(2, '0')}</span>
                <div className="flex-grow h-px bg-gray-100" />
            </div>

            {/* Narrative Content */}
            <div className="max-w-2xl">
                <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter leading-none">
                    {chapter.title}
                </h2>
                <p className="text-xl md:text-3xl font-serif text-gray-500 leading-relaxed italic border-l-4 border-gray-100 pl-8">
                    {chapter.content}
                </p>
            </div>

            {/* Visual Media - Vertical Stack */}
            <div className="grid grid-cols-1 gap-2">
                {chapter.media?.length > 0 ? (
                    chapter.media.map((item, i) => (
                        <MediaBox
                            key={i}
                            media={chapter.media}
                            photoIndex={i}
                            containerClassName="w-full aspect-video relative bg-gray-50"
                            className="grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
                            fallbackIcon={Minus}
                            accentColor={primaryColor}
                        />
                    ))
                ) : (
                    <div className="aspect-video bg-gray-50 flex items-center justify-center border border-gray-100">
                        <Minus size={40} className="text-gray-200" />
                    </div>
                )}
            </div>

            {chapter.voiceNote && (
                <div className="inline-flex items-center gap-4 py-3 px-6 bg-gray-50 border border-gray-100 text-gray-400">
                    <Music size={16} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Recorded Fragment Included</span>
                </div>
            )}
        </motion.section>
    );
}
