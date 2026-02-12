import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Quote, Star } from 'lucide-react';

export default function EternalVow({ formData }) {
    const chapters = formData.chapters || [];
    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const senderName = formData.senderName && formData.senderName !== 'Your Name'
        ? String(formData.senderName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div className="min-h-screen bg-[#FFFBEB] text-[#78350F] font-serif selection:bg-amber-200 overflow-x-hidden">
            {/* Elegant Ring Pattern Background */}
            <div className="fixed inset-0 pointer-events-none opacity-10">
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]" viewBox="0 0 400 400">
                    <circle cx="180" cy="200" r="80" fill="none" stroke="#B45309" strokeWidth="2" />
                    <circle cx="220" cy="200" r="80" fill="none" stroke="#B45309" strokeWidth="2" />
                </svg>
            </div>

            {/* Header */}
            <header className="relative z-10 pt-48 pb-32 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="mb-12"
                >
                    <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100">
                        <circle cx="40" cy="50" r="25" fill="none" stroke="#B45309" strokeWidth="3" />
                        <circle cx="60" cy="50" r="25" fill="none" stroke="#D4A574" strokeWidth="3" />
                    </svg>
                </motion.div>

                {recipientName && (
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-9xl font-light italic leading-tight tracking-tight mb-4"
                    >
                        {recipientName}
                    </motion.h1>
                )}
                {senderName && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        className="text-3xl font-light italic mb-8"
                    >
                        & {senderName}
                    </motion.p>
                )}
                {(formData.customOccasion || celebrationType) && (
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-amber-500/30" />
                        <span className="text-[10px] uppercase tracking-[0.5em] font-sans font-bold opacity-40">
                            {(formData.customOccasion || celebrationType).toUpperCase()}
                        </span>
                        <div className="h-px w-12 bg-amber-500/30" />
                    </div>
                )}
            </header>

            {/* Chapters Feed */}
            <main className="max-w-6xl mx-auto px-6 space-y-48 pb-60 relative z-10">
                {chapters.map((chapter, index) => (
                    <VowChapter key={chapter.id || index} chapter={chapter} index={index} />
                ))}
            </main>

            {/* Final Appreciation */}
            {formData.secretMessage && (
                <footer className="relative z-10 py-60 px-6 text-center bg-gradient-to-t from-amber-100 to-transparent">
                    <Quote size={40} className="mx-auto mb-12 text-amber-500/30" />
                    <p className="text-4xl md:text-6xl font-light italic leading-relaxed text-[#78350F] max-w-4xl mx-auto">
                        "{formData.secretMessage}"
                    </p>
                    <div className="mt-20 text-[10px] uppercase tracking-[0.6em] text-amber-600 font-bold">
                        Forever & Always
                    </div>
                </footer>
            )}
        </div>
    );
}

function VowChapter({ chapter, index }) {
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
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 md:gap-32 items-center`}
        >
            {/* Visual Capsule */}
            <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-amber-200/40 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="aspect-[4/5] bg-white p-6 shadow-2xl relative rotate-[-1deg] rounded-lg border border-amber-100 space-y-4">
                    <div className="w-full h-full overflow-hidden relative rounded-md">
                        <AnimatePresence mode="wait">
                            {chapter.media?.length > 0 ? (
                                <motion.img
                                    key={photoIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.5 }}
                                    src={chapter.media[photoIndex].data}
                                    className="w-full h-full object-cover"
                                    alt=""
                                />
                            ) : (
                                <div className="w-full h-full bg-amber-50 flex items-center justify-center">
                                    <Heart size={48} className="text-amber-100" />
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                    {/* Floating Tape Effect */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-amber-100/60 backdrop-blur-sm shadow-sm rotate-2" />
                </div>
            </div>

            {/* Text Narrative */}
            <div className={`flex-1 ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <div className="flex items-center gap-4 mb-10">
                    <span className="text-[10px] uppercase tracking-[0.6em] text-amber-600/40 font-bold">Volume_{String(index + 1).padStart(2, '0')}</span>
                    <div className="flex-grow h-px bg-amber-200/50" />
                </div>
                <h2 className="text-5xl md:text-7xl font-light italic text-[#78350F] mb-10 leading-tight">
                    {chapter.title}
                </h2>
                <p className="text-xl md:text-2xl font-light italic leading-relaxed text-[#78350F]/70">
                    {chapter.content}
                </p>

                {chapter.voiceNote && (
                    <div className="mt-12 inline-flex items-center gap-4 py-3 px-6 bg-white/50 backdrop-blur-md rounded-2xl border border-amber-100 text-amber-600">
                        <Music size={18} className="animate-pulse" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Playback Memory Attached</span>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
