import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Maximize2, Sparkles, Quote, Flower2 } from 'lucide-react';

import MediaBox from './shared/MediaBox';

export default function RoseGarden({ formData, templateConfig }) {
    const chapters = formData.chapters || [];

    const primaryColor = templateConfig?.primaryColor || '#EC4899';
    const accentColor = templateConfig?.accentColor || '#FDA4AF';
    const fontFamily = templateConfig?.fontFamily || "'EB Garamond', serif";

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div
            className="min-h-screen bg-[#FFF5F7] text-[#831843] selection:bg-pink-200 overflow-x-hidden"
            style={{ fontFamily }}
        >
            {/* Liquid Blob Backgrounds */}
            {/* Floating Rose Petals */}
            <FloatingRoses />

            <div className="fixed inset-0 pointer-events-none opacity-40 blur-[120px]">
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full"
                    style={{ background: primaryColor }}
                />
                <motion.div
                    animate={{ x: [0, -80, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full"
                    style={{ background: accentColor }}
                />
            </div>

            {/* Header */}
            <header className="relative z-10 pt-20 md:pt-32 pb-20 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8"
                >
                    <Heart size={40} className="mx-auto" style={{ color: primaryColor }} fill={`${primaryColor} 33`} />
                </motion.div>
                {recipientName && (
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-[8rem] font-light italic leading-none tracking-tighter mb-6"
                    >
                        {recipientName}
                    </motion.h1>
                )}

                {(formData.customOccasion || celebrationType) && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        className="text-xs uppercase tracking-[0.8em] font-bold"
                    >
                        {(formData.customOccasion || celebrationType).toUpperCase()}
                    </motion.p>
                )}


                {/* Decorative Rose Icon */}
                <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="mt-12 opacity-30"
                >
                    <span className="text-4xl">🌹</span>
                </motion.div>
            </header>

            {/* Chapters Feed */}
            <main className="max-w-6xl mx-auto px-6 space-y-32 pb-60 relative z-10">
                {chapters.map((chapter, index) => (
                    <ChapterEntry
                        key={chapter.id || index}
                        chapter={chapter}
                        index={index}
                        primaryColor={primaryColor}
                        accentColor={accentColor}
                    />
                ))}
            </main>

            {/* Secret Message Footer */}
            {formData.secretMessage && (
                <footer className="relative z-10 py-60 px-6 text-center border-t border-pink-200/50">
                    <Quote size={40} className="mx-auto mb-10" style={{ color: accentColor }} />
                    <p className="text-3xl md:text-5xl font-light italic leading-relaxed text-pink-900/70 max-w-3xl mx-auto">
                        "{formData.secretMessage}"
                    </p>
                    <div className="mt-20 text-[10px] uppercase tracking-[0.5em] font-bold" style={{ color: accentColor }}>
                        Forever Yours, {formData.senderName || 'Anonymous'}
                    </div>
                </footer>
            )}
        </div>
    );
}

function FloatingRoses() {
    // Rose petal emojis for variety
    const petals = ['🌹', '🥀', '💮', '🌸', '❤️', '💕'];

    // Pre-calculate positions so they don't change on re-render
    const roses = React.useMemo(() =>
        [...Array(25)].map((_, i) => ({
            startX: Math.random() * 100,
            startY: -10 - Math.random() * 20,
            duration: 18 + Math.random() * 12, // Slower: 18-30 seconds
            delay: Math.random() * 10,
            size: 16 + Math.random() * 14, // Smaller: 16-30px
            opacity: 0.2 + Math.random() * 0.15, // Subtle: 20-35%
            sway: 15 + Math.random() * 25,
        }))
        , []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
            {roses.map((rose, i) => (
                <motion.div
                    key={i}
                    initial={{
                        y: rose.startY + 'vh',
                        opacity: 0
                    }}
                    animate={{
                        y: '120vh',
                        opacity: [0, rose.opacity, rose.opacity, 0]
                    }}
                    transition={{
                        duration: rose.duration,
                        repeat: Infinity,
                        delay: rose.delay,
                        ease: "linear"
                    }}
                    className="absolute"
                    style={{
                        fontSize: rose.size + 'px',
                        left: rose.startX + '%',
                        filter: 'blur(0.5px)'
                    }}
                >
                    <motion.span
                        animate={{
                            x: [-rose.sway, rose.sway, -rose.sway],
                            rotate: [-10, 10, -10]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="inline-block"
                    >
                        {petals[i % petals.length]}
                    </motion.span>
                </motion.div>
            ))}
        </div>
    );
}

function ChapterEntry({ chapter, index, primaryColor, accentColor }) {
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
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className={`flex flex - col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap - 16 md: gap - 24 items - center`}
        >
            {/* Visual Module */}
            <div className="flex-1 w-full">
                <div className="aspect-[9/16] md:aspect-[4/5] bg-white p-4 shadow-2xl relative rotate-1 rounded-sm border border-pink-100 group">
                    <div className="w-full h-full overflow-hidden relative">
                        <MediaBox
                            media={chapter.media}
                            photoIndex={photoIndex}
                            containerClassName="w-full h-full relative"
                            className="hover:scale-105 transition-all duration-1000 ease-in-out"
                            fallbackIcon={Sparkles}
                            accentColor={primaryColor}
                        />
                    </div>
                    {/* Media Count Badge */}
                    {chapter.media?.length > 1 && (
                        <div className="absolute bottom-8 right-8 px-3 py-1 bg-white/50 backdrop-blur-md rounded-full text-[10px] uppercase font-bold text-pink-600">
                            Ensemble {photoIndex + 1}/{chapter.media.length}
                        </div>
                    )}
                </div>
            </div>

            {/* Narrative Module */}
            <div className={`flex - 1 ${isEven ? 'text-left' : 'text-right md:text-left'} `}>
                <span className="text-[10px] uppercase tracking-[0.5em] text-pink-400 font-bold block mb-8">
                    Fragment_{String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="text-4xl md:text-6xl font-light italic text-pink-900 mb-8 leading-tight tracking-tight">
                    {chapter.title}
                </h2>
                <div className={`w - 12 h - px bg - pink - 200 mb - 10 ${isEven ? 'mr-auto' : 'ml-auto md:mr-auto'} `} />
                <p className="text-xl md:text-2xl font-light italic leading-relaxed text-pink-900/60">
                    {chapter.content}
                </p>

                {chapter.voiceNote && (
                    <button
                        onClick={() => {
                            const audio = new Audio(chapter.voiceNote);
                            audio.play().catch(e => console.error("Voice playback failed", e));
                        }}
                        className="mt-12 inline-flex items-center gap-4 py-3 px-6 bg-white rounded-2xl border border-pink-100 shadow-sm text-pink-500 hover:bg-pink-50 transition-colors group"
                    >
                        <Music size={16} className="group-hover:scale-110 transition-transform animate-pulse" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-left">Click to Play Voice Recording</span>
                    </button>
                )}

                {chapter.videoMessage && (
                    <div className="mt-12 aspect-video w-full max-w-sm bg-black rounded-lg border border-pink-100 overflow-hidden relative group">
                        <video
                            src={chapter.videoMessage}
                            controls
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-pink-500 text-white px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest">
                            Video Memory
                        </div>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
