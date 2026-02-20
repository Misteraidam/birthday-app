import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Music, Radio, Quote } from 'lucide-react';
import MediaBox from './shared/MediaBox';

export default function NeonGlow({ formData, templateConfig }) {
    const chapters = formData.chapters || [];
    const [introComplete, setIntroComplete] = useState(false);

    const primaryColor = templateConfig?.primaryColor || '#00FFFF';
    const accentColor = templateConfig?.accentColor || '#FF00FF';
    const fontFamily = templateConfig?.fontFamily || "'Orbitron', sans-serif";

    const recipientName = formData.recipientName && formData.recipientName !== 'Someone Special'
        ? String(formData.recipientName)
        : null;

    const celebrationType = formData.celebrationType
        ? (typeof formData.celebrationType === 'object' ? formData.celebrationType.name : String(formData.celebrationType))
        : null;

    return (
        <div
            className="min-h-screen bg-[#020202] text-[#00FFFF] selection:bg-cyan-500 selection:text-black relative overflow-x-hidden"
            style={{ fontFamily }}
        >
            <AnimatePresence mode="wait">
                {!introComplete && (
                    <NeonIntro
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
                        {/* Cyber Scanline Overlay */}
                        <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.05]" style={{
                            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                            backgroundSize: '100% 2px, 3px 100%'
                        }} />

                        {/* Pulsing Neural Grid */}
                        <div className="fixed inset-0 pointer-events-none opacity-20" style={{
                            backgroundImage: `linear-gradient(${primaryColor}11 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}11 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }} />

                        {/* Header */}
                        <header className="relative z-10 pt-32 pb-40 px-6 text-center border-b border-cyan-500/20">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="mb-12"
                            >
                                <Zap size={48} className="mx-auto" style={{ color: primaryColor, filter: `drop-shadow(0 0 20px ${primaryColor})` }} />
                            </motion.div>
                            {recipientName && (
                                <motion.h1
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-7xl md:text-[14rem] font-black tracking-tighter mb-8 leading-none"
                                    style={{ textShadow: `0 0 40px ${primaryColor}80` }}
                                >
                                    {recipientName.toUpperCase()}
                                </motion.h1>
                            )}
                            {(formData.customOccasion || celebrationType) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-center gap-6"
                                >
                                    <div className="h-px w-20 bg-cyan-500/30" />
                                    <p className="text-[10px] uppercase tracking-[0.6em] text-cyan-400 font-black">
                                        {(formData.customOccasion || celebrationType).toUpperCase()}
                                    </p>
                                    <div className="h-px w-20 bg-cyan-500/30" />
                                </motion.div>
                            )}
                            {formData.eventVenue && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-6 text-sm tracking-wide" style={{ color: `${primaryColor}66` }}
                                >
                                    📍 {formData.eventVenue}
                                </motion.p>
                            )}
                        </header>

                        {/* Main Feed */}
                        <main className="max-w-6xl mx-auto px-6 space-y-32 pb-60 relative z-10 pt-20">
                            {chapters.map((chapter, index) => (
                                <NeonChapter
                                    key={chapter.id || index}
                                    chapter={chapter}
                                    index={index}
                                    primaryColor={primaryColor}
                                    accentColor={accentColor}
                                />
                            ))}
                        </main>

                        {/* Final Transmission */}
                        {formData.secretMessage && (
                            <footer className="relative z-10 py-60 px-6 text-center border-t border-cyan-500/20 bg-gradient-to-t from-cyan-900/10 to-transparent">
                                <Radio size={40} className="mx-auto mb-10" style={{ color: accentColor, filter: `drop-shadow(0 0 20px ${accentColor}80)` }} />
                                <p className="text-4xl md:text-7xl font-black tracking-tight text-white leading-tight max-w-5xl mx-auto uppercase"
                                    style={{ textShadow: `0 0 30px ${accentColor}80` }}>
                                    "{formData.secretMessage}"
                                </p>
                                <div className="mt-20 text-[10px] uppercase tracking-[1em] text-cyan-500 opacity-40">
                                    Transmission Complete
                                </div>
                            </footer>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function NeonIntro({ onComplete, recipientName, primaryColor, accentColor }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 4000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-[#020202] flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            {/* Neural Network Background */}
            <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `radial-gradient(${primaryColor} 1px, transparent 1px)`,
                backgroundSize: '30px 30px'
            }} />

            {/* Center Pulse */}
            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-8 p-6 rounded-full border"
                    style={{ borderColor: primaryColor, boxShadow: `0 0 50px ${primaryColor}` }}
                >
                    <Zap size={64} style={{ color: primaryColor }} />
                </motion.div>

                {recipientName && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-center"
                    >
                        <div className="text-xs tracking-[0.5em] mb-4" style={{ color: `${primaryColor}80` }}>INITIALIZING NEURAL LINK...</div>
                        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r uppercase tracking-tighter filter"
                            style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${accentColor})`, filter: `drop-shadow(0 0 10px ${primaryColor}80)` }}>
                            {recipientName}
                        </h1>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

function NeonChapter({ chapter, index, primaryColor, accentColor }) {
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
            initial={{ opacity: 0, x: isEven ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-20 items-stretch`}
        >
            {/* Neural Data Content */}
            <div className={`flex-1 flex flex-col justify-center ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                <div className="flex items-center gap-4 mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: primaryColor }}>MEMORY_NODE_{String(index + 1).padStart(2, '0')}</span>
                    <div className="flex-grow h-px" style={{ backgroundColor: `${primaryColor}33` }} />
                </div>
                <h2 className="text-5xl md:text-8xl font-black mb-10 leading-[0.85] tracking-tighter uppercase"
                    style={{ textShadow: `0 0 20px ${primaryColor}4D` }}>
                    {chapter.title}
                </h2>
                <p className="text-xl md:text-2xl font-mono leading-relaxed mb-12" style={{ color: `${primaryColor}99` }}>
                    {chapter.content}
                </p>

                {chapter.voiceNote && (
                    <div className="inline-flex items-center gap-4 p-4 border" style={{ borderColor: `${accentColor}80`, backgroundColor: `${accentColor}0D`, color: `${accentColor}CC` }}>
                        <Music size={20} className="animate-pulse" />
                        <span className="text-[10px] uppercase font-black tracking-widest">Synthetic Audio Stream Synced</span>
                    </div>
                )}
            </div>

            {/* Visual Visor */}
            <div className={`flex-1 w-full bg-black/40 border rounded-lg p-1.5 shadow-[0_0_50px_rgba(0,255,255,0.1)] group`} style={{ borderColor: `${primaryColor}4D` }}>
                <div className="w-full h-full min-h-[400px] overflow-hidden relative rounded-md">
                    <MediaBox
                        media={chapter.media}
                        photoIndex={photoIndex}
                        containerClassName="w-full h-full relative"
                        className=""
                        fallbackIcon={Zap}
                        accentColor={primaryColor}
                    />
                    {/* CRT Scanline overlay for image */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,255,0,0.06),rgba(0,0,255,0.02),rgba(255,0,0,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
                </div>
            </div>
        </motion.section>
    );
}
