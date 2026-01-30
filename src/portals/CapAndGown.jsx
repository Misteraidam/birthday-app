import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, Star, Music, Trophy, Quote } from 'lucide-react';

export default function CapAndGown({ formData }) {
    const chapters = formData.chapters || [];
    const recipientName = formData.recipientName && formData.recipientName !== 'Graduate'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-yellow-500/30 overflow-x-hidden">
            {/* Subtle Grid Pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(255,215,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            {/* Header */}
            <header className="relative z-10 pt-32 pb-40 px-6 text-center border-b border-white/5">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <GraduationCap size={64} className="mx-auto text-yellow-400" />
                </motion.div>
                {recipientName && (
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-7xl md:text-[10rem] font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none"
                    >
                        {recipientName.toUpperCase()}
                    </motion.h1>
                )}
                {celebrationType && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-4"
                    >
                        <div className="h-px w-12 bg-yellow-500/30" />
                        <p className="text-xs uppercase tracking-[0.5em] text-yellow-400 font-bold">
                            {celebrationType} // CLASS OF {new Date().getFullYear()}
                        </p>
                        <div className="h-px w-12 bg-yellow-500/30" />
                    </motion.div>
                )}
            </header>

            {/* Main Feed */}
            <main className="max-w-6xl mx-auto px-6 space-y-48 pb-60 relative z-10 pt-20">
                {chapters.map((chapter, index) => (
                    <TriumphChapter key={chapter.id || index} chapter={chapter} index={index} />
                ))}
            </main>

            {/* Final Tribute */}
            {formData.secretMessage && (
                <footer className="relative z-10 py-60 px-6 text-center bg-gradient-to-t from-yellow-500/5 to-transparent border-t border-white/5">
                    <Trophy size={40} className="mx-auto mb-10 text-yellow-500/50" />
                    <p className="text-3xl md:text-6xl font-black tracking-tight text-white/90 leading-tight max-w-4xl mx-auto">
                        "{formData.secretMessage}"
                    </p>
                    <div className="mt-20 text-[10px] uppercase tracking-[1em] text-white/20">
                        The Adventure Begins // 2026.V1
                    </div>
                </footer>
            )}
        </div>
    );
}

function TriumphChapter({ chapter, index }) {
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
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-20 items-stretch`}
        >
            {/* Visual Module */}
            <div className="flex-1 w-full bg-white/5 border border-white/10 rounded-3xl p-4 shadow-2xl overflow-hidden group">
                <div className="w-full h-full min-h-[400px] overflow-hidden relative rounded-2xl">
                    <AnimatePresence mode="wait">
                        {chapter.media?.length > 0 ? (
                            <motion.img
                                key={photoIndex}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5 }}
                                src={chapter.media[photoIndex].data}
                                className="w-full h-full object-cover"
                                alt=""
                            />
                        ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                <Award size={80} className="text-yellow-500/20" />
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Information Module */}
            <div className={`flex-1 flex flex-col justify-center ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <div className="flex items-center gap-4 mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400">ACHIEVEMENT_{String(index + 1).padStart(2, '0')}</span>
                    <div className="flex-grow h-px bg-white/10" />
                </div>
                <h2 className="text-4xl md:text-7xl font-black mb-8 leading-none tracking-tighter">
                    {chapter.title}
                </h2>
                <p className="text-xl md:text-2xl font-light text-white/50 leading-relaxed max-w-xl">
                    {chapter.content}
                </p>

                {chapter.voiceNote && (
                    <div className="mt-12 inline-flex items-center gap-4 py-3 px-6 bg-white/5 rounded-2xl border border-white/10 text-white/60">
                        <Music size={16} className="text-yellow-400" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Graduation Shoutout Attached</span>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
