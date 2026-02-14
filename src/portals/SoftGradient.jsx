import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Quote, Star } from 'lucide-react';
import MediaBox from './shared/MediaBox';

export default function SoftGradient({ formData, templateConfig }) {
    const chapters = formData.chapters || [];
    const [introComplete, setIntroComplete] = useState(false);

    const primaryColor = templateConfig?.primaryColor || '#FDA4AF';
    const accentColor = templateConfig?.accentColor || '#67E8F9';
    const fontFamily = templateConfig?.fontFamily || "'Poppins', sans-serif";

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div
            className="min-h-screen text-[#4A3728] selection:bg-rose-100/50 overflow-x-hidden relative"
            style={{
                background: `linear-gradient(135deg, #FDF4F5 0%, #FCF0E4 50%, #F0F4FF 100%)`,
                fontFamily
            }}
        >
            <AnimatePresence mode="wait">
                {!introComplete && (
                    <KindredIntro
                        key="intro"
                        onComplete={() => setIntroComplete(true)}
                        recipientName={recipientName}
                        primaryColor={primaryColor}
                        accentColor={accentColor}
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
                        {/* Header */}
                        <header className="relative z-10 pt-32 pb-40 px-6 text-center">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="mb-12"
                            >
                                <Heart size={64} className="mx-auto" style={{ color: primaryColor }} fill={primaryColor} />
                            </motion.div>
                            {recipientName && (
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-7xl md:text-[10rem] font-serif italic mb-8 leading-none"
                                    style={{
                                        background: `linear-gradient(135deg, ${primaryColor}, ${accentColor}, #60A5FA)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {recipientName}
                                </motion.h1>
                            )}

                            {(formData.customOccasion || celebrationType) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-center gap-6"
                                >
                                    <div className="h-px w-20 bg-rose-200" />
                                    <p className="text-[10px] uppercase tracking-[0.4em] text-rose-400 font-bold">
                                        {(formData.customOccasion || celebrationType).toUpperCase()}
                                    </p>
                                    <div className="h-px w-20 bg-rose-200" />
                                </motion.div>
                            )}
                        </header>

                        {/* Main Feed */}
                        <main className="max-w-5xl mx-auto px-6 space-y-48 pb-60 relative z-10 pt-20">
                            {chapters.map((chapter, index) => (
                                <GradientChapter
                                    key={chapter.id || index}
                                    chapter={chapter}
                                    index={index}
                                    primaryColor={primaryColor}
                                    accentColor={accentColor}
                                />
                            ))}
                        </main>

                        {/* Final Curation Footer */}
                        {formData.secretMessage && (
                            <footer className="relative z-10 py-60 px-6 text-center border-t border-rose-100 bg-gradient-to-t from-white/20 to-transparent">
                                <Star size={40} className="mx-auto mb-10 text-rose-300" />
                                <p className="text-3xl md:text-6xl font-serif italic text-[#4A3728] leading-tight max-w-5xl mx-auto opacity-80">
                                    "{formData.secretMessage}"
                                </p>
                                <div className="mt-20 text-[10px] uppercase tracking-[1em] text-rose-400 opacity-40">
                                    With Love, {formData.senderName || 'Anonymous'}
                                </div>
                            </footer>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function KindredIntro({ onComplete, recipientName, primaryColor, accentColor }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 3500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-[#FDF4F5] flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
        >
            {/* Soft Orbs */}
            <motion.div
                initial={{ scale: 0, x: -100, y: -50, opacity: 0 }}
                animate={{ scale: 1.5, x: -20, y: 0, opacity: 0.6 }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="absolute w-[400px] h-[400px] rounded-full blur-[80px]"
                style={{ backgroundColor: primaryColor }}
            />
            <motion.div
                initial={{ scale: 0, x: 100, y: 50, opacity: 0 }}
                animate={{ scale: 1.5, x: 20, y: 0, opacity: 0.6 }}
                transition={{ duration: 3, ease: "easeInOut", delay: 0.2 }}
                className="absolute w-[400px] h-[400px] rounded-full blur-[80px]"
                style={{ backgroundColor: accentColor }}
            />

            {/* Content */}
            <div className="relative z-10 text-center">
                {recipientName && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                    >
                        <h1 className="text-6xl md:text-9xl font-serif italic text-[#4A3728]/80 mb-4">
                            {recipientName}
                        </h1>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 100 }}
                            transition={{ duration: 1.5, delay: 1 }}
                            className="h-1 mx-auto rounded-full"
                            style={{ background: `linear-gradient(to right, ${primaryColor}, ${accentColor})` }}
                        />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

function GradientChapter({ chapter, index, primaryColor, accentColor }) {
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
            {/* Narrative Content */}
            <div className={`flex-1 ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <h2 className="text-4xl md:text-7xl font-serif mb-10 text-[#4A3728] leading-tight italic">
                    {chapter.title}
                </h2>
                <div className={`h-1 w-20 mb-10 ${isEven ? 'mr-auto' : 'ml-auto md:mr-auto'}`} style={{ backgroundColor: `${primaryColor}4D` }} />
                <p className="text-xl md:text-2xl text-[#4A3728]/70 leading-relaxed mb-12">
                    {chapter.content}
                </p>

                {chapter.voiceNote && (
                    <div className="inline-flex items-center gap-4 py-3 px-6 bg-white/80 rounded-full border border-rose-100 shadow-sm text-rose-400">
                        <Music size={16} />
                        <span className="text-[10px] uppercase font-bold tracking-widest font-sans">Audio Memory Decrypted</span>
                    </div>
                )}
            </div>

            {/* Visual Frame */}
            <div className="flex-1 w-full relative">
                <div className="aspect-[4/3] bg-white/60 backdrop-blur-3xl rounded-[3rem] p-4 border border-white/50 overflow-hidden shadow-2xl relative">
                    <MediaBox
                        media={chapter.media}
                        photoIndex={photoIndex}
                        containerClassName="w-full h-full relative rounded-[2rem] overflow-hidden"
                        className=""
                        fallbackIcon={Heart}
                        accentColor={primaryColor}
                    />
                    {/* Index Tag */}
                    <div className="absolute top-8 left-8 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-rose-100 shadow-sm">
                        <span className="text-[10px] font-bold tracking-widest text-rose-400">MEMO_{String(index + 1).padStart(2, '0')}</span>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
