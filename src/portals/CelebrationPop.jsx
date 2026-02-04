import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, Music, Sparkles, Quote } from 'lucide-react';

export default function CelebrationPop({ formData }) {
    const chapters = formData.chapters || [];
    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
            {/* Animated Gradient Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                    style={{
                        background: 'conic-gradient(from 0deg, #A855F7, #EC4899, #F97316, #22D3EE, #A855F7)',
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
                        className="text-7xl md:text-[10rem] font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 leading-none"
                    >
                        {recipientName.toUpperCase()}
                    </motion.h1>
                )}
                {celebrationType && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs uppercase tracking-[0.6em] text-white/40 font-black"
                    >
                        {celebrationType} // PARTY_MODE_ON
                    </motion.p>
                )}
            </header>

            {/* Main Feed */}
            <main className="max-w-6xl mx-auto px-6 space-y-48 pb-60 relative z-10 pt-20">
                {chapters.map((chapter, index) => (
                    <PopChapter key={chapter.id || index} chapter={chapter} index={index} />
                ))}
            </main>

            {/* Final Message */}
            {formData.secretMessage && (
                <footer className="relative z-10 py-60 px-6 text-center bg-gradient-to-t from-purple-500/20 to-transparent">
                    <PartyPopper size={48} className="mx-auto mb-10 text-pink-400" />
                    <p className="text-4xl md:text-7xl font-black tracking-tight text-white leading-tight max-w-5xl mx-auto">
                        "{formData.secretMessage}"
                    </p>
                    <div className="mt-20 text-[10px] uppercase tracking-[1em] text-white/20">
                        Stay Electric // 2026.V1
                    </div>
                </footer>
            )}
        </div>
    );
}

function PopChapter({ chapter, index }) {
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
            {/* Visual Pop */}
            <div className="flex-1 w-full">
                <div className="aspect-square bg-white/5 border-4 border-white/20 rounded-[2.5rem] p-4 shadow-2xl relative group overflow-hidden">
                    <div className="w-full h-full overflow-hidden relative rounded-[1.5rem]">
                        <AnimatePresence mode="wait">
                            {chapter.media?.length > 0 ? (
                                <motion.img
                                    key={photoIndex}
                                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 1.2, rotate: 5 }}
                                    transition={{ type: "spring", bounce: 0.4 }}
                                    src={chapter.media[photoIndex].data}
                                    className="w-full h-full object-cover"
                                    alt=""
                                />
                            ) : (
                                <div className="w-full h-full bg-purple-500/10 flex items-center justify-center">
                                    <Sparkles size={64} className="text-purple-400/30" />
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Content Pop */}
            <div className={`flex-1 ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black tracking-widest text-purple-300 mb-8`}>
                    MOMENT_{index + 1}
                </div>
                <h2 className="text-4xl md:text-7xl font-black mb-8 leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    {chapter.title}
                </h2>
                <p className="text-xl md:text-3xl font-medium text-white/70 leading-relaxed mb-10">
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
        </motion.section>
    );
}
