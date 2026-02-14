import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Music, Award, Sparkles, Quote } from 'lucide-react';

import MediaBox from './shared/MediaBox';

export default function GoldenJubilee({ formData, templateConfig }) {
    const chapters = formData.chapters || [];

    const primaryColor = templateConfig?.primaryColor || '#FFD700';
    const accentColor = templateConfig?.accentColor || '#F59E0B';
    const fontFamily = templateConfig?.fontFamily || "'Playfair Display', serif";

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div
            className="min-h-screen bg-[#0A0A0A] text-white selection:bg-amber-500/30 overflow-x-hidden"
            style={{ fontFamily }}
        >
            {/* Golden Particles/Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute top-1/4 left-1/4 w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse"
                    style={{ background: `${primaryColor}1A` }} // 10% opacity
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] rounded-full blur-[100px] animate-pulse delay-1000"
                    style={{ background: `${accentColor}0D` }} // 5% opacity
                />
            </div>

            {/* Header */}
            <header className="relative z-10 pt-32 pb-40 px-6 text-center border-b border-white/5">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="mb-12"
                >
                    <div className="inline-block p-4 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
                        <Star size={40} style={{ color: primaryColor }} className="fill-amber-400/20" />
                    </div>
                </motion.div>

                {recipientName && (
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-7xl md:text-[10rem] font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-[0.85]"
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
                        <div className="h-px w-20" style={{ background: `${primaryColor}80` }} />
                        <p className="text-xs uppercase tracking-[0.6em] font-black" style={{ color: primaryColor }}>
                            {(formData.customOccasion || celebrationType).toUpperCase()}
                        </p>
                        <div className="h-px w-20" style={{ background: `${primaryColor}80` }} />
                    </motion.div>
                )}
            </header>

            {/* Main Feed */}
            <main className="max-w-6xl mx-auto px-6 space-y-32 pb-60 relative z-10 pt-20">
                {chapters.map((chapter, index) => (
                    <GoldenChapter
                        key={chapter.id || index}
                        chapter={chapter}
                        index={index}
                        primaryColor={primaryColor}
                        accentColor={accentColor}
                    />
                ))}
            </main>

            {/* Prestige Footer */}
            {formData.secretMessage && (
                <footer className="relative z-10 py-60 px-6 text-center bg-gradient-to-t from-amber-950/20 to-transparent">
                    <Quote size={40} className="mx-auto mb-12" style={{ color: `${primaryColor}80` }} />
                    <p className="text-4xl md:text-7xl font-bold italic text-white/90 leading-tight max-w-5xl mx-auto">
                        "{formData.secretMessage}"
                    </p>
                    <div className="mt-20 text-[10px] uppercase tracking-[1em] text-white/20">
                        EST. 2026
                    </div>
                </footer>
            )}
        </div>
    );
}

function GoldenChapter({ chapter, index, primaryColor, accentColor }) {
    const isEven = index % 2 === 0;
    const [photoIndex, setPhotoIndex] = useState(0);

    useEffect(() => {
        if (chapter.media?.length > 1) {
            const interval = setInterval(() => {
                setPhotoIndex(prev => (prev + 1) % chapter.media.length);
            }, 7000);
            return () => clearInterval(interval);
        }
    }, [chapter.media]);

    return (
        <motion.section
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-20 items-center`}
        >
            {/* Narrative Content */}
            <div className={`flex-[0.8] ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-0.5 bg-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">The Legacy</span>
                </div>
                <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter leading-none">
                    {chapter.title}
                </h2>
                <p className="text-xl md:text-3xl font-light text-white/50 leading-relaxed italic mb-12">
                    {chapter.content}
                </p>

                {chapter.voiceNote && (
                    <button
                        onClick={() => {
                            const audio = new Audio(chapter.voiceNote);
                            audio.play().catch(e => console.error("Voice note playback failed", e));
                        }}
                        className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/10 w-fit hover:bg-white/10 transition group"
                    >
                        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(245,158,11,0.3)] group-hover:scale-110 transition">
                            <Music size={24} />
                        </div>
                        <div className="text-left pr-4">
                            <span className="block text-[8px] font-black uppercase tracking-widest text-white/30">Audio Log</span>
                            <span className="block text-sm font-bold">Press to playback recorded memory</span>
                        </div>
                    </button>
                )}

                {chapter.videoMessage && (
                    <div className="mt-12 aspect-video w-full max-w-md bg-black rounded-2xl border border-white/10 overflow-hidden relative group">
                        <video
                            src={chapter.videoMessage}
                            controls
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-red-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            Visual Message
                        </div>
                    </div>
                )}
            </div>

            {/* Visual Display */}
            <div className="flex-1 w-full relative">
                <div
                    className="absolute inset-0 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `${primaryColor}1A` }}
                />
                <div className="aspect-[3/4] md:aspect-video bg-[#111111] p-2 rounded-2xl border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden group">
                    <MediaBox
                        media={chapter.media}
                        photoIndex={photoIndex}
                        containerClassName="w-full h-full relative rounded-xl"
                        fallbackIcon={Award}
                        accentColor={primaryColor}
                    />
                    {/* Catalog ID */}
                    <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                        <span className="text-[10px] font-black tracking-widest" style={{ color: primaryColor }}>EXHIBIT_{String(index + 1).padStart(2, '0')}</span>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
