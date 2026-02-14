import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Music, Quote, Zap } from 'lucide-react';
import MediaBox from './shared/MediaBox';

export default function CosmicReveal({ formData, templateConfig }) {
    const chapters = formData.chapters || formData.memories || [];
    const [introComplete, setIntroComplete] = useState(false);

    const primaryColor = templateConfig?.primaryColor || '#111827';
    const accentColor = templateConfig?.accentColor || '#6366F1';
    const fontFamily = templateConfig?.fontFamily || "'Inter', sans-serif";

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div
            className="min-h-screen bg-[#f9fafb] text-gray-900 selection:bg-gray-100 overflow-x-hidden relative"
            style={{ fontFamily }}
        >
            <AnimatePresence mode="wait">
                {!introComplete && (
                    <EtherealSpaceIntro key="intro" onComplete={() => setIntroComplete(true)} recipientName={recipientName} />
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
                        <header className="relative z-10 pt-48 pb-32 px-6 text-center border-b border-gray-100">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-12"
                            >
                                <div
                                    className="w-12 h-12 border rounded-full flex items-center justify-center mx-auto"
                                    style={{ borderColor: `${primaryColor}1A` }}
                                >
                                    <Star size={16} style={{ color: `${primaryColor}4D` }} />
                                </div>
                            </motion.div>

                            {recipientName && (
                                <motion.h1
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-7xl md:text-[10rem] font-extrabold tracking-tighter mb-8 leading-[0.85] uppercase"
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
                                    <div className="h-px w-20 bg-gray-200" />
                                    <p className="text-[10px] uppercase tracking-[0.6em] text-gray-400 font-black">
                                        {(formData.customOccasion || celebrationType).toUpperCase()}
                                    </p>
                                    <div className="h-px w-20 bg-gray-200" />
                                </motion.div>
                            )}
                        </header>

                        {/* Main Feed */}
                        <main className="max-w-6xl mx-auto px-6 space-y-48 pb-60 relative z-10 pt-20">
                            {chapters.map((chapter, index) => (
                                <RevealChapter
                                    key={chapter.id || index}
                                    chapter={chapter}
                                    index={index}
                                    primaryColor={primaryColor}
                                />
                            ))}
                        </main>

                        {/* Final Reflection Footer */}
                        {formData.secretMessage && (
                            <footer className="relative z-10 py-60 px-6 text-center bg-gray-900 text-white">
                                <Quote size={40} className="mx-auto mb-10 opacity-30" />
                                <p className="text-4xl md:text-7xl font-light italic leading-tight max-w-5xl mx-auto">
                                    "{formData.secretMessage}"
                                </p>
                                <div className="mt-20 text-[10px] uppercase tracking-[1em] opacity-40">
                                    Shared by {formData.senderName || 'Anonymous'}
                                </div>
                            </footer>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function EtherealSpaceIntro({ onComplete, recipientName }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 4000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-[#0F0A1A] flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
        >
            {/* Deep Space Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0F0A1A] to-[#0F0A1A]" />

            {/* Stars */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                    transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
                    className="absolute bg-white rounded-full shadow-[0_0_10px_white]"
                    style={{
                        width: Math.random() * 3 + 1 + 'px',
                        height: Math.random() * 3 + 1 + 'px',
                        top: Math.random() * 100 + '%',
                        left: Math.random() * 100 + '%'
                    }}
                />
            ))}

            {/* Mist */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent mix-blend-screen filter blur-3xl"
            />

            {/* Content */}
            <div className="relative z-10 text-center">
                {recipientName && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    >
                        <h1 className="text-6xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 via-purple-200 to-white tracking-tighter mb-6 relative">
                            {recipientName}
                            <motion.span
                                animate={{ opacity: [0, 0.5, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute inset-0 text-white blur-xl -z-10"
                            >
                                {recipientName}
                            </motion.span>
                        </h1>
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 200, opacity: 1 }}
                            transition={{ delay: 1, duration: 1.5 }}
                            className="h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent mx-auto"
                        />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

function RevealChapter({ chapter, index }) {
    const isEven = index % 2 === 0;
    const [photoIndex, setPhotoIndex] = useState(0);

    // Some older data might use 'media' as a string or 'media' as an array or 'val' etc.
    // Normalized media extraction:
    const mediaArray = Array.isArray(chapter.media) ? chapter.media :
        (chapter.media ? [{ data: chapter.media }] : []);

    useEffect(() => {
        if (mediaArray.length > 1) {
            const interval = setInterval(() => {
                setPhotoIndex(prev => (prev + 1) % mediaArray.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [mediaArray]);

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-20 items-center`}
        >
            {/* Narrative Content */}
            <div className={`flex-1 ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <h2 className="text-5xl md:text-8xl font-extrabold mb-10 leading-[0.85] tracking-tighter uppercase text-gray-900">
                    {chapter.title}
                </h2>
                <div className={`h-px w-20 bg-gray-200 mb-10 ${isEven ? 'mr-auto' : 'ml-auto md:mr-auto'}`} />
                <p className="text-xl md:text-3xl font-light text-gray-500 leading-relaxed mb-12">
                    {chapter.content || chapter.chat || chapter.val}
                </p>

                {chapter.voiceNote && (
                    <div className="inline-flex items-center gap-4 py-3 px-6 bg-gray-100 rounded-full text-gray-400">
                        <Music size={16} />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Audio Narrative Linked</span>
                    </div>
                )}
            </div>

            {/* Visual Frame */}
            <div className="flex-1 w-full relative">
                <div className="aspect-[16/10] bg-white rounded-3xl overflow-hidden shadow-2xl relative group border border-gray-100">
                    <MediaBox
                        media={mediaArray}
                        photoIndex={photoIndex}
                        containerClassName="w-full h-full relative"
                        className="grayscale hover:grayscale-0 transition-all duration-1000"
                        fallbackIcon={Zap}
                    />
                    {/* Index Tag */}
                    <div className="absolute top-8 left-8 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm text-[10px] font-black tracking-widest text-gray-400">
                        NODE_{String(index + 1).padStart(2, '0')}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
