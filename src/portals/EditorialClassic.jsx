import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, Music } from 'lucide-react';

export default function EditorialClassic({ formData }) {
    const chapters = formData.chapters || [];
    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div className="min-h-screen bg-[#FDFBEE] text-[#110000] font-serif selection:bg-black/5 overflow-x-hidden">
            {/* Natural Paper Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[100] opacity-30" style={{
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
                mixBlendMode: 'multiply'
            }} />

            {/* Header */}
            <header className="relative z-10 pt-48 pb-32 px-6 text-center border-b border-black/5">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mb-12"
                >
                    <div className="w-12 h-12 border border-[#110000]/20 rounded-full flex items-center justify-center">
                        <Star size={16} className="text-[#110000]/40" />
                    </div>
                </motion.div>

                {recipientName && (
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-7xl md:text-[14rem] font-black tracking-tighter mb-8 leading-[0.85] uppercase"
                    >
                        {recipientName}
                    </motion.h1>
                )}

                {celebrationType && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-6"
                    >
                        <div className="h-px w-20 bg-black/10" />
                        <p className="text-[10px] uppercase tracking-[0.6em] font-sans font-black opacity-40">
                            {celebrationType} // EDITION_2026.RAW
                        </p>
                        <div className="h-px w-20 bg-black/10" />
                    </motion.div>
                )}
            </header>

            {/* Main Feed */}
            <main className="max-w-6xl mx-auto px-6 space-y-48 pb-60 relative z-10 pt-20">
                {chapters.map((chapter, index) => (
                    <EditorialChapter key={chapter.id || index} chapter={chapter} index={index} />
                ))}
            </main>

            {/* Final Curation Footer */}
            {formData.secretMessage && (
                <footer className="relative z-10 py-60 px-6 text-center bg-[#110000] text-[#FDFBEE]">
                    <Quote size={40} className="mx-auto mb-12 opacity-30" />
                    <p className="text-4xl md:text-7xl font-light italic leading-tight max-w-5xl mx-auto">
                        "{formData.secretMessage}"
                    </p>
                    <div className="mt-24 text-[10px] uppercase tracking-[1em] opacity-40">
                        Curation by {formData.senderName || 'Anonymous'} // PORTRAIT_END
                    </div>
                </footer>
            )}
        </div>
    );
}

function EditorialChapter({ chapter, index }) {
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
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-20 items-center`}
        >
            {/* Visual Fragment */}
            <div className="flex-1 w-full relative">
                <div className="aspect-[4/5] bg-black/[0.03] rounded-[40px] overflow-hidden shadow-2xl relative group">
                    <AnimatePresence mode="wait">
                        {chapter.media?.length > 0 ? (
                            <motion.img
                                key={photoIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5 }}
                                src={chapter.media[photoIndex].data}
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                alt=""
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Star size={80} className="text-black/5" />
                            </div>
                        )}
                    </AnimatePresence>
                    {/* Index Tape */}
                    <div className="absolute bottom-8 left-8 bg-[#FDFBEE] px-4 py-2 rounded-full border border-black/5 shadow-sm">
                        <span className="text-[10px] font-black tracking-widest text-[#110000]/60">FILE_{String(index + 1).padStart(2, '0')}</span>
                    </div>
                </div>
            </div>

            {/* Narrative Fragment */}
            <div className={`flex-1 ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <h2 className="text-5xl md:text-8xl font-black mb-10 leading-[0.85] tracking-tighter uppercase text-[#110000]">
                    {chapter.title}
                </h2>
                <p className="text-xl md:text-3xl font-serif italic text-black/60 leading-relaxed mb-12">
                    {chapter.content}
                </p>

                {chapter.voiceNote && (
                    <div className="inline-flex items-center gap-4 py-3 px-6 bg-black/5 rounded-full text-black/40">
                        <Music size={16} />
                        <span className="text-[10px] uppercase font-bold tracking-widest font-sans">Audio Fragment Attached</span>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
