import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Maximize2, Sparkles, Heart, Star, Music, ExternalLink } from 'lucide-react';

export default function KineticBento({ formData }) {
    const chapters = formData.chapters || [];
    const [introComplete, setIntroComplete] = useState(false);

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden p-4 md:p-8 relative">
            <AnimatePresence mode="wait">
                {!introComplete && (
                    <SystemBootIntro key="intro" onComplete={() => setIntroComplete(true)} recipientName={recipientName} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {introComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Header / Intro */}
                        <motion.header
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-7xl mx-auto mb-16 pt-12 text-center md:text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-cyan-400 mb-6 font-bold">
                                <Layout size={12} /> System_Load
                            </div>
                            {recipientName && (
                                <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none">
                                    {recipientName.toUpperCase()}
                                </h1>
                            )}
                            {(formData.customOccasion || celebrationType) && (
                                <p className="text-xl md:text-2xl text-white/40 max-w-2xl font-light italic">
                                    {(formData.customOccasion || celebrationType).toUpperCase()}
                                </p>
                            )}
                        </motion.header>

                        {/* Bento Grid */}
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 pb-32">
                            {chapters.map((chapter, index) => (
                                <ChapterModule key={chapter.id || index} chapter={chapter} index={index} />
                            ))}
                        </div>

                        {/* Footer Message */}
                        {formData.secretMessage && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="max-w-4xl mx-auto text-center py-32 border-t border-white/5"
                            >
                                <p className="text-3xl md:text-5xl font-light italic text-white/60 leading-relaxed mb-12">
                                    "{formData.secretMessage}"
                                </p>
                                <div className="text-xs uppercase tracking-[0.5em] text-cyan-500 font-black">
                                    End_Of_Transmission
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SystemBootIntro({ onComplete, recipientName }) {
    React.useEffect(() => {
        const timer = setTimeout(onComplete, 2500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center font-mono text-cyan-500"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="text-center">
                <div className="mb-2 text-xs tracking-[0.2em]">SYSTEM_BOOT</div>
                <div className="text-xl font-bold animate-pulse">INITIALIZING KINETIC INTERFACE...</div>
            </div>
        </motion.div>
    );
}

function ChapterModule({ chapter, index }) {
    // Determine span based on index
    const spans = [
        'md:col-span-8 md:row-span-2', // Big focus
        'md:col-span-4 md:row-span-1', // Small sidebar
        'md:col-span-4 md:row-span-1', // Small sidebar
        'md:col-span-12 md:row-span-1', // Wide banner
        'md:col-span-6 md:row-span-2', // Medium square
        'md:col-span-6 md:row-span-2', // Medium square
    ];

    const span = spans[index % spans.length];
    const [isHovered, setIsHovered] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`${span} relative group bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col min-h-[300px]`}
        >
            {/* Visual Layer */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    {chapter.media?.length > 0 ? (
                        <motion.img
                            key={photoIndex}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: isHovered ? 0.3 : 0.2, scale: 1 }}
                            exit={{ opacity: 0 }}
                            src={chapter.media[photoIndex].data}
                            className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0"
                            alt=""
                        />
                    ) : (
                        <div className="w-full h-full bg-cyan-500/5 flex items-center justify-center opacity-10">
                            <Sparkles size={64} className="text-cyan-500" />
                        </div>
                    )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent pointer-events-none" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 p-8 md:p-12 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-mono tracking-tighter text-white/30 px-2 py-1 bg-white/5 rounded border border-white/5 uppercase">
                        Module_{String(index + 1).padStart(2, '0')}
                    </span>
                    <motion.div
                        animate={{ rotate: isHovered ? 90 : 0 }}
                        className="text-cyan-500/50"
                    >
                        <Maximize2 size={16} />
                    </motion.div>
                </div>

                <div className="mt-auto">
                    <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4 group-hover:text-cyan-400 transition-colors">
                        {chapter.title}
                    </h3>
                    <p className="text-white/60 text-lg leading-relaxed font-light line-clamp-3 mb-6">
                        {chapter.content}
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {chapter.voiceNote && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 rounded-xl border border-cyan-500/30 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                                <Music size={12} /> Audio_File
                            </div>
                        )}
                        {chapter.media?.length > 1 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                <Maximize2 size={12} /> Gallery_{chapter.media.length}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Decorative Edge Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
}
