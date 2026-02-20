import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Star, Moon, Sparkles, Quote } from 'lucide-react';

import MediaBox from './shared/MediaBox';

export default function CosmicDream({ formData, templateConfig }) {
    const chapters = formData.chapters || [];

    const primaryColor = templateConfig?.primaryColor || '#A855F7';
    const accentColor = templateConfig?.accentColor || '#3B82F6';
    const fontFamily = templateConfig?.fontFamily || "'Space Grotesk', sans-serif";

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div
            className="min-h-screen bg-[#0F0A1A] text-[#E9D5FF] selection:bg-purple-500/30 overflow-x-hidden"
            style={{ fontFamily }}
        >
            {/* Starfield Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(60)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
                        transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                    />
                ))}
            </div>

            {/* Nebula Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div
                    className="absolute top-1/4 left-1/4 w-[60%] h-[60%] rounded-full blur-[120px]"
                    style={{ background: `${primaryColor}1A` }} // 10% opacity
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] rounded-full blur-[100px]"
                    style={{ background: `${accentColor}1A` }} // 10% opacity
                />
            </div>

            {/* Shooting Stars */}
            <ShootingStars />

            {/* Header */}
            <header className="relative z-10 pt-32 pb-40 px-6 text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="text-5xl mb-12 inline-block"
                >
                    ✨
                </motion.div>
                {recipientName && (
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-7xl md:text-[12rem] font-black tracking-tighter mb-8 leading-none"
                        style={{ textShadow: `0 0 80px ${primaryColor}66` }}
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
                        <div className="h-px w-20 bg-purple-500/30" />
                        <p className="text-xs uppercase tracking-[0.8em] font-black" style={{ color: primaryColor }}>
                            {(formData.customOccasion || celebrationType).toUpperCase()}
                        </p>
                        <div className="h-px w-20 bg-purple-500/30" />
                    </motion.div>
                )}
                {formData.eventVenue && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 text-sm text-purple-200/50 tracking-wide"
                    >
                        📍 {formData.eventVenue}
                    </motion.p>
                )}
            </header>

            {/* Feed */}
            <main className="max-w-7xl mx-auto px-6 space-y-48 pb-60 relative z-10 pt-20">
                {chapters.map((chapter, index) => (
                    <CosmicChapter
                        key={chapter.id || index}
                        chapter={chapter}
                        index={index}
                        primaryColor={primaryColor}
                        accentColor={accentColor}
                    />
                ))}
            </main>

            {/* Cosmic Footer */}
            {formData.secretMessage && (
                <footer className="relative z-10 py-60 px-6 text-center border-t border-white/5">
                    <Moon size={40} className="mx-auto mb-10 text-purple-400" />
                    <p className="text-3xl md:text-6xl font-light tracking-tight text-white leading-tight max-w-5xl mx-auto italic">
                        "{formData.secretMessage}"
                    </p>
                    <div className="mt-20 text-[10px] uppercase tracking-[0.8em] font-black" style={{ color: primaryColor }}>
                        Stardust Memories
                    </div>
                </footer>
            )}
        </div>
    );
}

function ShootingStars() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[11] overflow-hidden opacity-40">
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ x: '110vw', y: (Math.random() * 50) + 'vh' }}
                    animate={{ x: '-10vw', y: '+=20vh' }}
                    transition={{
                        duration: 1 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 4 + Math.random() * 5,
                        ease: "easeIn"
                    }}
                    className="absolute w-20 h-[1px] bg-gradient-to-l from-white to-transparent rotate-[-15deg]"
                />
            ))}
        </div>
    );
}

function CosmicChapter({ chapter, index, primaryColor, accentColor }) {
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
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-20 items-center`}
        >
            {/* Narrative Burst */}
            <div className={`flex-1 ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <h2 className="text-4xl md:text-7xl font-bold mb-8 leading-[0.9] tracking-tighter text-white">
                    {chapter.title}
                </h2>
                <div className={`h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mb-10 ${isEven ? 'mr-auto' : 'ml-auto md:mr-auto'}`} />
                <p className="text-xl md:text-3xl font-light text-purple-200/60 leading-relaxed mb-12">
                    {chapter.content}
                </p>

                {chapter.voiceNote && (
                    <div className="flex items-center gap-4 p-4 bg-purple-900/30 rounded-3xl border border-purple-500/20 w-fit">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(168,85,247,0.4)]">
                            <Music size={24} />
                        </div>
                        <div className="pr-4">
                            <span className="block text-[8px] font-black uppercase tracking-widest text-purple-300">Signal Captured</span>
                            <span className="block text-sm font-bold opacity-60">Audio transcription attached</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Visual Constellation */}
            <div className="flex-1 w-full relative group">
                <div
                    className="absolute -inset-10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `${primaryColor}1A` }}
                />
                <div className="aspect-[4/5] bg-black/40 backdrop-blur-3xl rounded-[3rem] p-4 border border-purple-500/20 overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                    <MediaBox
                        media={chapter.media}
                        photoIndex={photoIndex}
                        containerClassName="w-full h-full relative"
                        className="opacity-80"
                        fallbackIcon={Sparkles}
                        accentColor={primaryColor}
                    />
                    {/* Index Tape */}
                    <div className="absolute top-8 left-8 bg-purple-900/60 backdrop-blur-xl px-4 py-2 rounded-full border border-purple-400/30">
                        <span className="text-[10px] font-black tracking-widest text-purple-200">SECTOR_{String(index + 1).padStart(2, '0')}</span>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
