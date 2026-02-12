import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Send, ArrowRight, Play, Star, Gift, Music, Camera, MessageCircle, Menu, X } from 'lucide-react';
import { CELEBRATION_TYPES, TEMPLATES } from './config/celebrationConfig';
import { TEMPLATE_PREVIEWS } from './components/TemplatePreviews';

import Terms from './components/legal/Terms';
import Privacy from './components/legal/Privacy';



const featuredTemplates = TEMPLATES.slice(0, 3);

const StaggeredText = ({ text, className, delay = 0, style }) => {
    const letters = text.split("");
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: delay * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.8,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
    };

    return (
        <motion.span
            style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", ...style }}
            variants={container}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {letters.map((letter, index) => (
                <motion.span variants={child} key={index} className="inline-block">
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.span>
    );
};

export default function LandingPage({ onCreateNew, onViewStory, onOpenLegal }) {
    const [viewCode, setViewCode] = useState('');
    const [legalView, setLegalView] = useState(null); // 'terms' | 'privacy' | null
    const [showViewInput, setShowViewInput] = useState(false);
    const [hoveredType, setHoveredType] = useState(null);
    const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [carouselPaused, setCarouselPaused] = useState(false);

    // Auto-rotate template previews
    useEffect(() => {
        if (carouselPaused) return;
        const interval = setInterval(() => {
            setActiveTemplateIndex(prev => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, [carouselPaused]);

    const handleViewStory = () => {
        if (viewCode.trim()) {
            onViewStory(viewCode.trim());
        }
    };

    if (legalView === 'privacy') return <Privacy onBack={() => setLegalView(null)} />;
    if (legalView === 'terms') return <Terms onBack={() => setLegalView(null)} />;

    return (
        <div className="min-h-screen bg-[#000] text-white overflow-hidden relative font-sans">
            {/* Vercel-style Minimal Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Subtle Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Cinematic Mesh Glows */}
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />

                {/* Central Soft Glow for content focus */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
            </div>

            {/* Floating Particles — Now subtle white/silver points */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-[1px] h-[1px] bg-white/40 rounded-full"
                        style={{ left: `${(i * 7.7 + 5) % 100}%` }}
                        initial={{
                            y: '100vh',
                            opacity: 0
                        }}
                        animate={{
                            y: '-10px',
                            opacity: [0, 0.3, 0],
                        }}
                        transition={{
                            duration: 15 + (i % 5) * 3,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <header className="relative z-50 px-6 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center relative border border-white/20 group hover:border-white/40 transition-colors">
                            <Sparkles size={20} className="text-white relative z-10" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            Celebration<span className="text-white/40">Portal</span>
                        </span>
                    </motion.div>

                    {/* Desktop nav */}
                    <motion.nav
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden md:flex items-center gap-8"
                    >
                        <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition">How it Works</a>
                        <a href="#templates" className="text-sm text-white/60 hover:text-white transition">Templates</a>
                        <button
                            onClick={() => setShowViewInput(true)}
                            className="text-sm text-white/60 hover:text-white transition flex items-center gap-2"
                        >
                            <Send size={14} /> View a Story
                        </button>
                    </motion.nav>

                    {/* Mobile hamburger button */}
                    <button
                        className="md:hidden p-2 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile menu dropdown */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="flex flex-col gap-2 pt-4 pb-2">
                                <a
                                    href="#how-it-works"
                                    className="px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    How it Works
                                </a>
                                <a
                                    href="#templates"
                                    className="px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Templates
                                </a>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setShowViewInput(true);
                                    }}
                                    className="px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition flex items-center gap-2 text-left"
                                >
                                    <Send size={14} /> View a Story
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 px-6 pt-4 pb-24">
                <div className="max-w-7xl mx-auto">
                    {/* Main Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-medium">Magic at your fingertips</span>
                        </motion.div>

                        <h1 className="text-[2.1rem] md:text-6xl lg:text-8xl font-bold mb-4 leading-none tracking-[-0.04em] px-4 flex flex-col items-center">
                            <StaggeredText
                                text="Create a story"
                                className="text-white font-serif tracking-tight whitespace-nowrap"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                                delay={0.2}
                            />
                            <StaggeredText
                                text="worth remembering"
                                className="text-[#C5A059] italic font-serif mt-4 whitespace-nowrap"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                                delay={0.6}
                            />
                        </h1>

                        <p className="text-sm md:text-base text-white/40 max-w-xl mx-auto mb-8 font-light leading-relaxed tracking-wide">
                            Curate moments. Craft memories. Share stories.
                            <br className="hidden md:block" />
                            Transform your celebrations into cinematic experiences.
                        </p>

                        {/* CTA Buttons */}
                        {/* CTA Buttons - Stacked on Mobile */}
                        <div className="flex flex-col md:flex-row justify-center gap-4 mb-4 px-4 md:px-0">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onCreateNew()}
                                className="w-full md:w-auto px-8 py-5 rounded-xl bg-white text-black flex items-center justify-center gap-3 transition-colors hover:bg-white/90 shadow-lg shadow-white/10"
                            >
                                <Gift size={20} />
                                <span className="font-bold text-lg tracking-tight">Create a Celebration</span>
                                <ArrowRight size={18} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    const newUrl = `${window.location.pathname}?demo=agradaa`;
                                    window.history.pushState({ path: newUrl }, '', newUrl);
                                    window.dispatchEvent(new PopStateEvent('popstate'));
                                    window.location.href = newUrl;
                                }}
                                className="w-full md:w-auto px-8 py-5 rounded-xl bg-red-600/20 backdrop-blur-md border border-red-500 text-white flex items-center justify-center gap-3 transition-all hover:bg-red-600/30"
                            >
                                <span>🔥</span>
                                <span className="font-bold text-lg tracking-tight">Trending: Agradaa Story</span>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Celebration Types */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        id="celebrations"
                        className="mb-16"
                    >
                        <p className="text-center text-xs uppercase tracking-[0.3em] text-white/40 mb-8">
                            What are we celebrating?
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                            {CELEBRATION_TYPES.map((type, i) => (
                                <motion.button
                                    key={type.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    onMouseEnter={() => setHoveredType(type.id)}
                                    onMouseLeave={() => setHoveredType(null)}
                                    onClick={() => onCreateNew(type.id)}
                                    className="group relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:bg-white/5"
                                >
                                    <motion.div
                                        animate={{
                                            scale: hoveredType === type.id ? 1.1 : 1,
                                            y: hoveredType === type.id ? -4 : 0
                                        }}
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-colors"
                                        style={{
                                            background: hoveredType === type.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                                            border: '1px solid',
                                            borderColor: hoveredType === type.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'
                                        }}
                                    >
                                        {type.icon}
                                    </motion.div>
                                    <span className="text-xs text-white/60 group-hover:text-white transition max-w-[80px] text-center leading-tight">
                                        {type.name}
                                    </span>

                                    {/* Tooltip - Desktop only */}
                                    <AnimatePresence>
                                        {hoveredType === type.id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                                className="hidden md:flex absolute top-full mt-2 p-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl whitespace-nowrap z-50 flex-col items-center gap-2"
                                            >
                                                <p className="text-xs text-white/80">{type.description}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Template Preview Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        id="templates"
                        className="mb-24"
                        onMouseEnter={() => setCarouselPaused(true)}
                        onMouseLeave={() => setCarouselPaused(false)}
                        onTouchStart={() => setCarouselPaused(true)}
                        onTouchEnd={() => {
                            // Resume after a delay on touch
                            setTimeout(() => setCarouselPaused(false), 5000);
                        }}
                    >
                        <p className="text-center text-[10px] uppercase tracking-[0.4em] text-white/30 mb-8 font-bold">
                            End Product Gallery
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8 px-6">
                            {/* Template Content (Compact Gallery) */}
                            <div className="flex gap-4 md:gap-8 overflow-x-auto md:overflow-visible md:justify-center px-4 md:px-0 pb-6 snap-x snap-mandatory scrollbar-hide w-full">
                                {featuredTemplates.map((template, i) => (
                                    <div
                                        key={template.id}
                                        className={`snap-center cursor-pointer transition-all duration-700 min-w-[220px] md:min-w-[240px] ${activeTemplateIndex === i ? 'scale-100' : 'scale-90 opacity-30 grayscale'}`}
                                        onClick={() => {
                                            setActiveTemplateIndex(i);
                                            setCarouselPaused(true);
                                            setTimeout(() => setCarouselPaused(false), 8000);
                                        }}
                                    >
                                        <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] shadow-2xl group">
                                            {TEMPLATE_PREVIEWS[template.id] ? (
                                                React.createElement(TEMPLATE_PREVIEWS[template.id], { isActive: activeTemplateIndex === i })
                                            ) : (
                                                <div className={`absolute inset-0 ${template.preview}`} />
                                            )}

                                            {/* Minimal Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                                            <div className="absolute inset-x-0 bottom-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform">
                                                <motion.div
                                                    animate={activeTemplateIndex === i ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <h3 className="text-lg font-bold mb-0.5">{template.name}</h3>
                                                    <p className="text-[9px] text-white/40 uppercase tracking-[0.2em]">Story Example</p>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Experience Description */}
                        <div className="max-w-md mx-auto text-center mt-6 px-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTemplateIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <p className="text-sm text-white/40 leading-relaxed font-light">
                                        {featuredTemplates[activeTemplateIndex].description}
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onCreateNew(featuredTemplates[activeTemplateIndex].id)}
                                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-white/90 transition-all"
                                    >
                                        Start Creating <ArrowRight size={14} />
                                    </motion.button>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Pagination dots */}
                        <div className="flex justify-center gap-3 mt-8">
                            {featuredTemplates.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setActiveTemplateIndex(i);
                                        setCarouselPaused(true);
                                        setTimeout(() => setCarouselPaused(false), 8000);
                                    }}
                                    className={`w-1 h-1 rounded-full transition-all duration-500 ${activeTemplateIndex === i ? 'bg-white scale-[2.5]' : 'bg-white/20'
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* How it Works */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        id="how-it-works"
                        className="max-w-4xl mx-auto"
                    >
                        <p className="text-center text-[10px] uppercase tracking-[0.3em] text-white/20 mb-12 font-bold">
                            The process
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                            {[
                                { number: '01', icon: <Heart size={24} />, title: 'Choose', desc: 'Select a celebration type or create your own' },
                                { number: '02', icon: <Camera size={24} />, title: 'Create', desc: 'Add chapters, photos, videos and music' },
                                { number: '03', icon: <Music size={24} />, title: 'Customize', desc: 'Pick a beautiful theme to match the mood' },
                                { number: '04', icon: <Send size={24} />, title: 'Share', desc: 'Send the magic link to your loved one' },
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + i * 0.1 }}
                                    className="text-center group"
                                >
                                    <div className="relative w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/30 group-hover:bg-white/[0.05] transition-all duration-500">
                                        <span className="absolute -top-2 -right-2 text-[10px] font-black bg-white text-black px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                            {step.number}
                                        </span>
                                        {step.icon}
                                    </div>
                                    <h3 className="font-bold mb-2 text-sm text-white/80">{step.title}</h3>
                                    <p className="text-[11px] text-white/30 leading-relaxed px-4">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/40">
                        © 2026 CelebrationPortal. Crafted with ❤️
                    </p>
                    <div className="flex gap-6 text-xs text-white/40">
                        <button onClick={() => setLegalView('privacy')} className="hover:text-white transition">Privacy</button>
                        <button onClick={() => setLegalView('terms')} className="hover:text-white transition">Terms</button>
                        <a href="mailto:elijahaidam.ea@gmail.com" className="hover:text-white transition">Contact</a>
                    </div>
                </div>
            </footer>

            {/* View Story Modal */}
            <AnimatePresence>
                {showViewInput && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={() => setShowViewInput(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 max-w-md w-full"
                        >
                            <h2 className="text-2xl font-bold mb-2">View a Shared Story</h2>
                            <p className="text-white/50 mb-6">Enter the portal ID or paste the full link</p>

                            <input
                                type="text"
                                value={viewCode}
                                onChange={(e) => setViewCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleViewStory()}
                                placeholder="Enter portal ID or link..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4 outline-none focus:border-yellow-500/50 transition"
                                autoFocus
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowViewInput(false)}
                                    className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleViewStory}
                                    disabled={!viewCode.trim()}
                                    className="flex-1 py-3 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 transition"
                                >
                                    View Story
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
