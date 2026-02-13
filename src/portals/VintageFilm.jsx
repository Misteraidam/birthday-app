import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Film, Camera, Quote } from 'lucide-react';

import MediaBox from './shared/MediaBox';

export default function VintageFilm({ formData, templateConfig }) {
    const chapters = formData.chapters || [];

    const primaryColor = templateConfig?.primaryColor || '#78350F';
    const accentColor = templateConfig?.accentColor || '#F59E0B';
    const fontFamily = templateConfig?.fontFamily || "'EB Garamond', serif";

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div
            className="min-h-screen bg-[#FEF3C7] text-[#78350F] selection:bg-amber-200 overflow-x-hidden"
            style={{ fontFamily }}
        >
            {/* Film Grain Overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-50 opacity-20"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                    mixBlendMode: 'overlay'
                }}
            />

            {/* Vignette */}
            <div
                className="fixed inset-0 pointer-events-none z-40"
                style={{
                    background: `radial-gradient(ellipse at center, transparent 50%, ${primaryColor}4D 100%)`
                }}
            />

            {/* Cinematic Light Leaks */}
            <LightLeaks accentColor={accentColor} />

            {/* Header */}
            <header className="relative z-10 pt-32 pb-40 px-6 text-center border-b border-[#78350F]/10">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="mb-8 inline-block"
                >
                    <Camera size={48} style={{ color: primaryColor }} />
                </motion.div>
                {recipientName && (
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-7xl md:text-[10rem] font-light italic leading-none tracking-tighter mb-8"
                    >
                        {recipientName}
                    </motion.h1>
                )}

                {(formData.customOccasion || celebrationType) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        className="flex items-center justify-center gap-6"
                    >
                        <div className="h-px w-20 bg-amber-800/20" />
                        <p className="text-xs uppercase tracking-[0.5em] font-sans font-black">
                            {(formData.customOccasion || celebrationType).toUpperCase()}
                        </p>
                        <div className="h-px w-20 bg-amber-800/20" />
                    </motion.div>
                )}
            </header>

            {/* Main Feed */}
            <main className="max-w-6xl mx-auto px-6 space-y-48 pb-60 relative z-10 pt-20">
                {chapters.map((chapter, index) => (
                    <FilmChapter
                        key={chapter.id || index}
                        chapter={chapter}
                        index={index}
                        accentColor={accentColor}
                    />
                ))}
            </main>

            {/* Fin Footer */}
            {formData.secretMessage && (
                <footer className="relative z-10 py-60 px-6 text-center bg-amber-900 text-amber-100">
                    <Film size={40} className="mx-auto mb-10 opacity-50" />
                    <p className="text-3xl md:text-6xl font-light italic leading-relaxed max-w-5xl mx-auto">
                        "{formData.secretMessage}"
                    </p>
                    <div className="mt-20 text-[10px] uppercase tracking-[1em] opacity-40">
                        The End
                    </div>
                </footer>
            )}
        </div>
    );
}

function LightLeaks({ accentColor }) {
    return (
        <div className="fixed inset-0 pointer-events-none z-[45] overflow-hidden opacity-30">
            {[...Array(2)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        opacity: [0, 0.4, 0],
                        scale: [1, 1.2, 1],
                        x: ['-10%', '10%', '-10%']
                    }}
                    transition={{
                        duration: 8 + i * 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-x-0 h-[400px]"
                    style={{
                        top: i === 0 ? '-100px' : 'auto',
                        bottom: i === 1 ? '-100px' : 'auto',
                        background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)`,
                        filter: 'blur(100px)',
                    }}
                />
            ))}
        </div>
    );
}

function FilmChapter({ chapter, index, accentColor }) {
    const isEven = index % 2 === 0;
    const [photoIndex, setPhotoIndex] = useState(0);

    useEffect(() => {
        if (chapter.media?.length > 1) {
            const interval = setInterval(() => {
                setPhotoIndex(prev => (prev + 1) % chapter.media.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [chapter.media]);

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-20 items-center`}
        >
            {/* Visual Reel Section */}
            <div className="flex-1 w-full relative">
                {/* Film sprocket decoration */}
                <div className="absolute top-0 left-0 w-full h-8 flex justify-between px-4 overflow-hidden opacity-30">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-4 h-6 bg-black rounded-sm" />
                    ))}
                </div>

                <div className="p-4 bg-white shadow-2xl rotate-1 border border-gray-200 mt-12">
                    <div className="w-full aspect-[4/3] bg-black overflow-hidden relative">
                        <MediaBox
                            media={chapter.media}
                            photoIndex={photoIndex}
                            containerClassName="w-full h-full relative"
                            className="sepia-[0.3] contrast-110"
                            fallbackIcon={Film}
                            accentColor={accentColor}
                        />
                        {/* Grain overlay for image */}
                        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-overlay" />
                    </div>
                </div>
            </div>

            {/* Narrative Reel Section */}
            <div className={`flex-1 ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <div className="flex items-center gap-4 mb-10">
                    <span className="text-[10px] font-mono tracking-widest text-amber-900/40 uppercase">Frame_{String(index + 1).padStart(2, '0')}</span>
                    <div className="flex-grow h-px bg-amber-900/10" />
                </div>
                <h2 className="text-4xl md:text-7xl font-light italic text-[#78350F] mb-10 leading-none">
                    {chapter.title}
                </h2>
                <p className="text-xl md:text-2xl font-light text-amber-900 leading-relaxed italic">
                    {chapter.content}
                </p>

                {chapter.voiceNote && (
                    <div className="mt-12 inline-flex items-center gap-4 py-3 px-6 bg-amber-100 rounded-full border border-amber-200 text-amber-700">
                        <Music size={16} />
                        <span className="text-[10px] uppercase font-bold tracking-widest font-sans">Recorded Narrative Found</span>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
