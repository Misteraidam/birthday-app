import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Heart, Star, Award, Shield } from 'lucide-react';

import MediaBox from './shared/MediaBox';

export default function MuseumCore({ formData, templateConfig }) {
    const chapters = formData.chapters || [];
    const [introComplete, setIntroComplete] = useState(false);

    const primaryColor = templateConfig?.primaryColor || '#D4AF37';
    const accentColor = templateConfig?.accentColor || '#D4AF37';
    const fontFamily = templateConfig?.fontFamily || "'EB Garamond', serif";

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div
            className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] selection:bg-[#D4AF37]/20 pb-40 relative"
            style={{ fontFamily }}
        >
            <AnimatePresence mode="wait">
                {!introComplete && (
                    <ArchiveIntro
                        key="intro"
                        onComplete={() => setIntroComplete(true)}
                        recipientName={recipientName}
                        primaryColor={primaryColor}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {introComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                    >
                        {/* Elegant Header */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2 }}
                            className="pt-32 pb-40 px-6 text-center border-b border-[#D4AF37]/30"
                            style={{ borderColor: `${primaryColor}4D` }}
                        >
                            <div className="flex justify-center mb-8">
                                <div className="w-12 h-[1px] self-center" style={{ background: primaryColor }} />
                                <Award size={24} className="mx-6" style={{ color: primaryColor }} strokeWidth={1} />
                                <div className="w-12 h-[1px] self-center" style={{ background: primaryColor }} />
                            </div>
                            {recipientName && (
                                <h1 className="text-7xl md:text-[12rem] font-light italic leading-none tracking-tighter mb-8">
                                    {recipientName}
                                </h1>
                            )}
                            {(formData.customOccasion || celebrationType) && (
                                <p className="text-xs uppercase tracking-[0.8em] font-bold" style={{ color: primaryColor }}>
                                    {(formData.customOccasion || celebrationType).toUpperCase()}
                                </p>
                            )}
                        </motion.div>

                        {/* Exhibition Chapters */}
                        <div className="max-w-6xl mx-auto px-6">
                            {chapters.map((chapter, index) => (
                                <ExhibitionPiece
                                    key={chapter.id || index}
                                    chapter={chapter}
                                    index={index}
                                    primaryColor={primaryColor}
                                />
                            ))}
                        </div>

                        {/* Final Appreciation */}
                        {formData.secretMessage && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="max-w-3xl mx-auto text-center mt-60 relative"
                            >
                                <div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-serif italic pointer-events-none select-none opacity-5"
                                    style={{ color: primaryColor }}
                                >
                                    End
                                </div>
                                <Quote size={40} className="mx-auto mb-12" style={{ color: primaryColor }} />
                                <p className="text-4xl md:text-6xl font-light italic leading-relaxed text-[#2A2A2A]">
                                    {formData.secretMessage}
                                </p>
                                <div className="mt-20 flex justify-center gap-4">
                                    <div className="w-2 h-2 rounded-full" style={{ background: primaryColor }} />
                                    <div className="w-2 h-2 rounded-full opacity-40" style={{ background: primaryColor }} />
                                    <div className="w-2 h-2 rounded-full opacity-10" style={{ background: primaryColor }} />
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ArchiveIntro({ onComplete, recipientName, primaryColor }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 4000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-[#FAF9F6] flex items-center justify-center font-serif text-[#1A1A1A]"
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
        >
            <div className="border p-12 md:p-24 relative max-w-4xl mx-4" style={{ borderColor: `${primaryColor}4D` }}>
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="absolute top-0 left-0 right-0 h-[2px] origin-left"
                    style={{ background: primaryColor }}
                />
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] origin-right"
                    style={{ background: primaryColor }}
                />

                <div className="overflow-hidden py-4">
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        className="text-4xl md:text-7xl font-light italic tracking-tight"
                    >
                        {recipientName}
                    </motion.h1>
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-center mt-4 text-[10px] uppercase tracking-[0.4em]"
                    style={{ color: primaryColor }}
                >
                    Legacy Collection
                </motion.div>
            </div>
        </motion.div>
    );
}

function ExhibitionPiece({ chapter, index, primaryColor }) {
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
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className={`py-40 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-20 items-center border-b last:border-0`}
            style={{ borderColor: `${primaryColor}1A` }}
        >
            {/* Visual Exhibit */}
            <div className="flex-1 w-full relative">
                <div
                    className="aspect-[3/4] p-4 bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border rotate-1 group"
                    style={{ borderColor: `${primaryColor}1A` }}
                >
                    <div className="w-full h-full overflow-hidden bg-[#F5F5F5] relative">
                        <MediaBox
                            media={chapter.media}
                            photoIndex={photoIndex}
                            containerClassName="w-full h-full relative"
                            className="filter sepia-[0.1] contrast-[1.05]"
                            fallbackIcon={Shield}
                            accentColor={primaryColor}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    </div>
                </div>
                {/* Artist Tag */}
                <div
                    className={`absolute bottom-[-20px] ${isEven ? 'right-[-20px]' : 'left-[-20px]'} bg-[#FAF9F6] p-4 border shadow-xl z-10 hidden md:block w-48`}
                    style={{ borderColor: `${primaryColor}33` }}
                >
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: primaryColor }}>Catalog No.</p>
                    <p className="font-sans text-xs opacity-40">2026_EX_#{String(index + 1).padStart(2, '0')}</p>
                </div>
            </div>

            {/* Narrative Content */}
            <div className={`flex-1 ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <span className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold block mb-8">
                    Memory Archive
                </span>
                <h2 className="text-5xl md:text-7xl font-light mb-10 leading-none tracking-tighter">
                    {chapter.title}
                </h2>
                <div className={`w-20 h-[1px] bg-[#D4AF37] mb-12 ${isEven ? 'mr-auto' : 'ml-auto md:mr-auto'}`} />
                <p className="text-xl md:text-2xl leading-relaxed text-[#4A4A4A] font-light italic">
                    {chapter.content}
                </p>

                {chapter.voiceNote && (
                    <div className="mt-12 flex items-center gap-4 py-3 px-6 bg-white border border-[#D4AF37]/20 shadow-sm w-fit">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Audio Commentary Attached</span>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
