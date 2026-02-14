import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, Music, Sparkles, Quote } from 'lucide-react';

import MediaBox from './shared/MediaBox';

export default function CelebrationPop({ formData, templateConfig }) {
    const chapters = formData.chapters || [];

    const primaryColor = templateConfig?.primaryColor || '#A855F7';
    const accentColor = templateConfig?.accentColor || '#EC4899';
    const fontFamily = templateConfig?.fontFamily || "'Poppins', sans-serif";

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div
            className="min-h-screen bg-[#0A0A0A] text-white selection:bg-purple-500/30 overflow-x-hidden"
            style={{ fontFamily }}
        >
            {/* Animated Gradient Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                    style={{
                        background: `conic-gradient(from 0deg, ${primaryColor}, ${accentColor}, #F97316, #22D3EE, ${primaryColor})`,
                        filter: 'blur(100px)'
                    }}
                />
            </div>

            {/* Header */}
            <header className="relative z-10 pt-32 pb-40 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring" }}
                    className="text-7xl mb-8"
                >
                    🎉
                </motion.div>
                {recipientName && (
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl lg:text-[10rem] font-black tracking-tighter mb-4 bg-clip-text text-transparent leading-none break-words"
                        style={{ backgroundImage: `linear-gradient(to r, ${primaryColor}, ${accentColor}, #F97316)` }}
                    >
                        {recipientName.toUpperCase()}
                    </motion.h1>
                )}
                {(formData.customOccasion || celebrationType) && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs uppercase tracking-[0.6em] text-white/40 font-black"
                    >
                        {(formData.customOccasion || celebrationType).toUpperCase()}
                    </motion.p>
                )}
            </header>

            {/* Main Feed */}
            <main className="max-w-6xl mx-auto px-6 space-y-32 pb-60 relative z-10 pt-20">
                {chapters.map((chapter, index) => (
                    <PopChapter
                        key={chapter.id || index}
                        chapter={chapter}
                        index={index}
                        primaryColor={primaryColor}
                        accentColor={accentColor}
                    />
                ))}
            </main>

            {/* Final Message */}
            {formData.secretMessage && (
                <footer className="relative z-10 py-60 px-6 text-center bg-gradient-to-t from-purple-500/20 to-transparent">
                    <PartyPopper size={48} className="mx-auto mb-10" style={{ color: accentColor }} />
                    <p className="text-4xl md:text-7xl font-black tracking-tight text-white leading-tight max-w-5xl mx-auto">
                        "{formData.secretMessage}"
                    </p>
                    <div className="mt-20 text-[10px] uppercase tracking-[1em] text-white/20">
                        Stay Electric
                    </div>
                </footer>
            )}
        </div>
    );
}

function PopChapter({ chapter, index, primaryColor, accentColor }) {
    const isEven = index % 2 === 0;
    const [photoIndex, setPhotoIndex] = useState(0);

    useEffect(() => {
        if (chapter.media?.length > 1) {
            const interval = setInterval(() => {
                setPhotoIndex(prev => (prev + 1) % chapter.media.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [chapter.media]);

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.9, rotate: isEven ? -2 : 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center`}
        >
            {/* Content Pop */}
            <div className={`flex-1 ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black tracking-widest text-purple-300 mb-8`}>
                    MOMENT_{index + 1}
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-7xl font-black mb-6 md:mb-8 leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    {chapter.title}
                </h2>
                <p className="text-lg md:text-xl lg:text-3xl font-medium text-white/70 leading-relaxed mb-8 md:mb-10">
                    {chapter.content}
                </p>

                {chapter.voiceNote && (
                    <button
                        onClick={() => {
                            const audio = new Audio(chapter.voiceNote);
                            audio.play().catch(e => console.error("Voice playback failed", e));
                        }}
                        className="inline-flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/10 text-white/60 hover:bg-white/20 transition-all group"
                    >
                        <Music size={20} className="text-pink-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] uppercase font-black tracking-widest text-left">Play Audio Highlight</span>
                    </button>
                )}

                {chapter.videoMessage && (
                    <div className="mt-8 aspect-video w-full max-w-sm bg-black rounded-3xl border-2 border-white/10 overflow-hidden relative group">
                        <video
                            src={chapter.videoMessage}
                            controls
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-purple-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                            LIVE_MOMENT
                        </div>
                    </div>
                )}
            </div>

            {/* Visual Pop */}
            <div className="flex-1 w-full">
                <div className="aspect-square bg-white/5 border-4 border-white/20 rounded-[2.5rem] p-4 shadow-2xl relative group overflow-hidden">
                    <MediaBox
                        media={chapter.media}
                        photoIndex={photoIndex}
                        containerClassName="w-full h-full relative rounded-[1.5rem]"
                        fallbackIcon={Sparkles}
                        accentColor={primaryColor}
                    />
                </div>
            </div>
        </motion.section>
    );
}
