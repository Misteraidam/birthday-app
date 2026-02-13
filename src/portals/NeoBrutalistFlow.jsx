import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, ArrowRight, Share2, Music } from 'lucide-react';
import MediaBox from './shared/MediaBox';

export default function NeoBrutalistFlow({ formData, templateConfig }) {
    const chapters = formData.chapters || [];
    const [introComplete, setIntroComplete] = useState(false);

    const primaryColor = templateConfig?.primaryColor || '#FFFF00';
    const accentColor = templateConfig?.accentColor || '#000000';
    const fontFamily = templateConfig?.fontFamily || "'Syne', sans-serif";

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div
            className="min-h-screen text-black font-black selection:bg-black selection:text-[#FFFF00] p-4 md:p-12 overflow-x-hidden relative"
            style={{ backgroundColor: primaryColor, fontFamily }}
        >
            <AnimatePresence mode="wait">
                {!introComplete && (
                    <RawIntro key="intro" onComplete={() => setIntroComplete(true)} recipientName={recipientName} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {introComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* RAW Header */}
                        <motion.header
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="mb-32 relative"
                        >
                            <div className="flex flex-col md:flex-row md:items-end gap-6">
                                {recipientName && (
                                    <h1 className="text-8xl md:text-[18rem] leading-[0.8] tracking-tighter uppercase break-words">
                                        {recipientName}
                                    </h1>
                                )}
                                {(formData.customOccasion || celebrationType) && (
                                    <div className="bg-black text-[#FFFF00] px-6 py-4 text-2xl uppercase mb-4 rotate-2 self-start md:self-auto">
                                        {(formData.customOccasion || celebrationType).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Decorative Grid Line */}
                            <div className="mt-12 h-4 bg-black w-full" />
                        </motion.header>

                        {/* Brutalist Blocks */}
                        <div className="max-w-7xl mx-auto space-y-40 pb-60">
                            {chapters.map((chapter, index) => (
                                <BrutalistBlock
                                    key={chapter.id || index}
                                    chapter={chapter}
                                    index={index}
                                    accentColor={accentColor}
                                />
                            ))}
                        </div>

                        {/* Final Transmission */}
                        {formData.secretMessage && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                className="max-w-4xl mx-auto bg-white border-8 border-black p-12 shadow-[30px_30px_0px_rgba(0,0,0,1)] relative"
                            >
                                <div className="absolute -top-10 -left-10 bg-black text-white p-4 rotate-[-5deg]">
                                    <Zap size={40} />
                                </div>
                                <p className="text-4xl md:text-7xl uppercase italic leading-[0.9]">
                                    {formData.secretMessage}
                                </p>
                                <div className="mt-12 flex justify-between items-center border-t-4 border-black pt-8">
                                    <span className="text-xl uppercase">End_Of_Story</span>
                                    <Share2 size={32} />
                                </div>
                            </motion.div>
                        )}

                        {/* Background Texture Overlay */}
                        <div className="fixed inset-0 pointer-events-none mix-blend-multiply opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function RawIntro({ onComplete, recipientName }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-[#004D40] flex items-center justify-center overflow-hidden"
            exit={{ y: '100%' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Iridescent Shimmer Layer */}
            <motion.div
                animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-br from-[#00695C] via-[#009688] to-[#4DB6AC] mix-blend-overlay"
                style={{ backgroundSize: '400% 400%' }}
            />

            {/* Peacock Feather Abstract Textures */}
            <div className="absolute inset-0 opacity-20">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [1, 1.5], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                        className="absolute rounded-full border-2 border-[#1DE9B6]"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 300 + 100}px`,
                            height: `${Math.random() * 300 + 100}px`,
                        }}
                    />
                ))}
            </div>

            {/* Bold Reveal */}
            <div className="relative z-10 p-12 border-8 border-[#1DE9B6] bg-black/20 backdrop-blur-sm">
                {recipientName && (
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-6xl md:text-9xl text-[#1DE9B6] uppercase tracking-tighter leading-none shadow-[10px_10px_0px_#000]"
                    >
                        {recipientName}
                    </motion.h1>
                )}
            </div>
        </motion.div>
    );
}

function BrutalistBlock({ chapter, index }) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0 items-stretch border-8 border-black bg-white shadow-[15px_15px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[15px] hover:translate-y-[15px] transition-all duration-300`}
        >
            {/* VISUAL MODULE */}
            <div className="flex-1 min-h-[400px] border-b-8 md:border-b-0 md:border-r-8 md:last:border-r-0 border-black overflow-hidden group">
                {chapter.media?.length > 0 ? (
                    <motion.img
                        whileHover={{ scale: 1.1, filter: 'contrast(1.5) grayscale(1)' }}
                        src={chapter.media[0].data}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                        alt=""
                    />
                ) : (
                    <div className="w-full h-full bg-[#FF5F1F] flex items-center justify-center">
                        <AlertTriangle size={80} />
                    </div>
                )}
            </div>

            {/* CONTENT MODULE */}
            <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white">
                <div className="flex items-center gap-4 mb-8">
                    <span className="bg-black text-white px-4 py-2 text-xl font-bold">#{index + 1}</span>
                    <div className="h-1 bg-black flex-grow" />
                </div>

                <h3 className="text-5xl md:text-8xl uppercase mb-8 leading-none tracking-tight">
                    {chapter.title}
                </h3>

                <p className="text-2xl leading-[1.1] mb-12 font-bold uppercase tracking-tighter opacity-70">
                    {chapter.content}
                </p>

                <div className="mt-auto flex flex-wrap gap-4">
                    {chapter.voiceNote && (
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-black text-white py-4 px-8 text-xl hover:bg-[#FF5F1F] transition-colors">
                            <Music size={24} /> PLAY_VOX
                        </button>
                    )}
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border-4 border-black py-4 px-8 text-xl hover:bg-[#FFFF00] transition-colors">
                        DETAILS <ArrowRight size={24} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
