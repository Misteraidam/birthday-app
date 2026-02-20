import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Zap, Radio, Quote } from 'lucide-react';

import MediaBox from './shared/MediaBox';

export default function NeonNights({ formData, templateConfig }) {
    const chapters = formData.chapters || [];

    const primaryColor = templateConfig?.primaryColor || '#06B6D4';
    const accentColor = templateConfig?.accentColor || '#F0ABFC';
    const fontFamily = templateConfig?.fontFamily || "'Orbitron', sans-serif";

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div
            className="min-h-screen bg-[#0A0A0A] text-white selection:bg-cyan-500/30 overflow-x-hidden"
            style={{ fontFamily }}
        >
            {/* Scan Lines Overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-50 opacity-10"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)'
                }}
            />

            {/* Neon Glow Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-[60%] h-[60%] rounded-full blur-[120px]"
                    style={{ background: `${primaryColor}26` }} // 15% opacity
                />
                <motion.div
                    animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] rounded-full blur-[120px]"
                    style={{ background: `${accentColor}26` }} // 15% opacity
                />
            </div>

            {/* Header */}
            <header className="relative z-10 pt-32 pb-40 px-6 text-center">
                <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="mb-12"
                >
                    <Zap size={48} className="mx-auto" style={{ color: primaryColor, filter: `drop-shadow(0 0 20px ${primaryColor})` }} />
                </motion.div>
                {recipientName && (
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-8xl lg:text-[14rem] font-black tracking-tighter mb-8 leading-none"
                        style={{ textShadow: `0 0 40px ${primaryColor}80, 0 0 80px ${primaryColor}33` }}
                    >
                        {recipientName.toUpperCase()}
                    </motion.h1>
                )}
                {(formData.customOccasion || celebrationType) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-4"
                    >
                        <div className="h-1 w-8" style={{ background: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }} />
                        <p className="text-[10px] uppercase tracking-[0.5em] font-bold" style={{ color: primaryColor }}>
                            {(formData.customOccasion || celebrationType).toUpperCase()}
                        </p>
                        <div className="h-1 w-8" style={{ background: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }} />
                    </motion.div>
                )}
                {formData.eventVenue && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 text-sm text-white/30 tracking-wide"
                    >
                        📍 {formData.eventVenue}
                    </motion.p>
                )}
            </header>

            {/* Main Feed */}
            <main className="max-w-6xl mx-auto px-6 space-y-32 pb-60 relative z-10 pt-20">
                {chapters.map((chapter, index) => (
                    <NeonChapter
                        key={chapter.id || index}
                        chapter={chapter}
                        index={index}
                        primaryColor={primaryColor}
                        accentColor={accentColor}
                    />
                ))}
            </main>

            {/* Final Transmission */}
            {formData.secretMessage && (
                <footer className="relative z-10 py-60 px-6 text-center border-t border-cyan-500/20 bg-gradient-to-t from-cyan-900/10 to-transparent">
                    <Radio size={40} className="mx-auto mb-10" style={{ color: accentColor, filter: `drop-shadow(0 0 20px ${accentColor})` }} />
                    <p className="text-4xl md:text-7xl font-black tracking-tight text-white leading-tight max-w-5xl mx-auto uppercase"
                        style={{ textShadow: `0 0 30px ${accentColor}80` }}>
                        "{formData.secretMessage}"
                    </p>
                    <div className="mt-20 text-[10px] uppercase tracking-[1em] opacity-40" style={{ color: primaryColor }}>
                        Transmission Complete
                    </div>
                </footer>
            )}
        </div>
    );
}

function NeonChapter({ chapter, index, primaryColor, accentColor }) {
    const isEven = index % 2 === 0;
    const [photoIndex, setPhotoIndex] = useState(0);

    useEffect(() => {
        if (chapter.media?.length > 1) {
            const interval = setInterval(() => {
                setPhotoIndex(prev => (prev + 1) % chapter.media.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [chapter.media]);

    return (
        <motion.section
            initial={{ opacity: 0, x: isEven ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-20 items-stretch`}
        >
            {/* Neural Data Content */}
            <div className={`flex-1 flex flex-col justify-center ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <div className="flex items-center gap-4 mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">DATA_NODE_{String(index + 1).padStart(2, '0')}</span>
                    <div className="flex-grow h-px bg-cyan-500/20" />
                </div>
                <h2 className="text-3xl md:text-5xl lg:text-8xl font-black mb-8 leading-[0.85] tracking-tighter uppercase"
                    style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}>
                    {chapter.title}
                </h2>
                <p className="text-base md:text-xl lg:text-2xl font-mono text-cyan-300/60 leading-relaxed mb-12">
                    {chapter.content}
                </p>

                {chapter.voiceNote && (
                    <div className="inline-flex items-center gap-4 p-4 border border-pink-500/50 bg-pink-500/5 text-pink-400">
                        <Music size={20} className="animate-pulse" />
                        <span className="text-[10px] uppercase font-black tracking-widest">Neural Audio Thread Linked</span>
                    </div>
                )}
            </div>

            {/* Cyber Visor Visual */}
            <div
                className="flex-1 w-full bg-black/40 border rounded-lg p-1.5 shadow-[0_0_50px_rgba(6,182,212,0.1)] group"
                style={{ borderColor: `${primaryColor}4D` }} // 30% opacity
            >
                <div className="w-full h-full min-h-[400px] overflow-hidden relative rounded-md">
                    <MediaBox
                        media={chapter.media}
                        photoIndex={photoIndex}
                        containerClassName="w-full h-full relative"
                        className="transition-all duration-500"
                        fallbackIcon={Zap}
                        accentColor={primaryColor}
                    />
                    {/* CRT Scanline overlay for image */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
                </div>
            </div>
        </motion.section>
    );
}
