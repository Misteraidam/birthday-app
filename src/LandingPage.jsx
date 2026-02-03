import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Send, ArrowRight, Play, Star, Gift, Music, Camera, MessageCircle } from 'lucide-react';
import { CELEBRATION_TYPES, TEMPLATES } from './config/celebrationConfig';
import { TEMPLATE_PREVIEWS } from './components/TemplatePreviews';

import Terms from './components/legal/Terms';
import Privacy from './components/legal/Privacy';

export default function LandingPage({ onCreateNew, onViewStory, onOpenLegal }) {
    const [viewCode, setViewCode] = useState('');
    const [legalView, setLegalView] = useState(null); // 'terms' | 'privacy' | null
    const [showViewInput, setShowViewInput] = useState(false);
    const [hoveredType, setHoveredType] = useState(null);
    const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);

    // Auto-rotate template previews
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTemplateIndex(prev => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleViewStory = () => {
        if (viewCode.trim()) {
            onViewStory(viewCode.trim());
        }
    };

    const featuredTemplates = TEMPLATES.slice(0, 3);



    if (legalView === 'terms') return <Terms onBack={() => setLegalView(null)} />;
    if (legalView === 'privacy') return <Privacy onBack={() => setLegalView(null)} />;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden relative">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            {/* Floating Particles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: window.innerHeight + 10,
                            opacity: 0
                        }}
                        animate={{
                            y: -10,
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: 8 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 5,
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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            <span className="text-purple-400">Celebration</span>Portal
                        </span>
                    </motion.div>

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
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 px-6 pt-12 pb-24">
                <div className="max-w-7xl mx-auto">
                    {/* Main Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
                        >
                            <Star size={14} className="text-yellow-400" />
                            <span className="text-xs text-white/60">Create immersive celebration experiences</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9]">
                            Create a story
                            <br />
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                                worth remembering
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12">
                            Curate moments. Craft memories. Share stories.
                            <br className="hidden md:block" />
                            Transform your celebrations into cinematic experiences.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onCreateNew}
                                className="group px-8 py-4 bg-white text-black font-bold text-lg rounded-2xl flex items-center gap-3 shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all"
                            >
                                <Gift size={20} />
                                Create a Celebration
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowViewInput(true)}
                                className="px-8 py-4 bg-transparent border-2 border-white/20 text-white font-bold text-lg rounded-2xl flex items-center gap-3 hover:border-white/40 hover:bg-white/5 transition-all"
                            >
                                <MessageCircle size={20} />
                                View a Shared Story
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Celebration Types */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mb-24"
                    >
                        <p className="text-center text-xs uppercase tracking-[0.3em] text-white/40 mb-8">
                            For Every Occasion
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
                                            scale: hoveredType === type.id ? 1.15 : 1,
                                            y: hoveredType === type.id ? -4 : 0
                                        }}
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                                        style={{
                                            background: hoveredType === type.id ? type.gradient : 'rgba(255,255,255,0.05)',
                                        }}
                                    >
                                        {type.icon}
                                    </motion.div>
                                    <span className="text-xs text-white/60 group-hover:text-white transition">
                                        {type.name.split(' ')[0]}
                                    </span>

                                    {/* Valentine Demo - Always visible on mobile, tooltip on desktop */}
                                    {['valentine'].includes(type.id) && (
                                        <a
                                            href={`/?demo=${type.id}`}
                                            className="md:hidden px-3 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 mt-1"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Play size={10} fill="currentColor" /> Demo
                                        </a>
                                    )}

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
                                                {['valentine'].includes(type.id) && (
                                                    <a
                                                        href={`/?demo=${type.id}`}
                                                        className="px-3 py-1.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-purple-400 hover:text-white transition-colors flex items-center gap-2"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Play size={10} fill="currentColor" /> Watch Demo
                                                    </a>
                                                )}
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
                    >
                        <p className="text-center text-xs uppercase tracking-[0.3em] text-white/40 mb-8">
                            Beautiful Templates
                        </p>
                        {/* Mobile: horizontal scroll carousel, Desktop: centered flex */}
                        <div className="flex gap-4 md:gap-6 overflow-x-auto md:overflow-visible md:justify-center px-4 md:px-0 pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide">
                            {featuredTemplates.map((template, i) => (
                                <motion.div
                                    key={template.id}
                                    animate={{
                                        scale: activeTemplateIndex === i ? 1.05 : 0.95,
                                        opacity: activeTemplateIndex === i ? 1 : 0.5,
                                        y: activeTemplateIndex === i ? -10 : 0
                                    }}
                                    transition={{ duration: 0.5 }}
                                    onClick={() => setActiveTemplateIndex(i)}
                                    className="relative flex-shrink-0 w-48 h-64 md:w-64 md:h-80 rounded-3xl overflow-hidden border border-white/10 bg-gray-900 snap-center cursor-pointer"
                                    style={{
                                        boxShadow: activeTemplateIndex === i
                                            ? `0 25px 50px -12px ${template.primaryColor}40`
                                            : 'none'
                                    }}
                                >
                                    {/* Animated Preview */}
                                    {TEMPLATE_PREVIEWS[template.id] ? (
                                        React.createElement(TEMPLATE_PREVIEWS[template.id], { isActive: activeTemplateIndex === i })
                                    ) : (
                                        <div className={`absolute inset-0 ${template.preview}`} />
                                    )}
                                    {/* Glass overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                                        <h3 className="text-base md:text-lg font-bold mb-1">{template.name}</h3>
                                        <p className="text-[10px] md:text-xs text-white/60 line-clamp-2">{template.description}</p>
                                    </div>

                                    {/* Preview badge */}
                                    <div className="absolute top-3 right-3 md:top-4 md:right-4">
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center">
                                            <Play size={10} className="text-white ml-0.5 md:hidden" />
                                            <Play size={12} className="text-white ml-0.5 hidden md:block" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination dots */}
                        <div className="flex justify-center gap-2 mt-8">
                            {featuredTemplates.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTemplateIndex(i)}
                                    className={`w-2 h-2 rounded-full transition-all ${activeTemplateIndex === i ? 'bg-white w-6' : 'bg-white/30'
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
                        <p className="text-center text-xs uppercase tracking-[0.3em] text-white/40 mb-12">
                            How it Works
                        </p>
                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                { icon: <Heart size={24} />, title: 'Choose', desc: 'Select a celebration type or create your own' },
                                { icon: <Camera size={24} />, title: 'Create', desc: 'Add chapters, photos, videos and music' },
                                { icon: <Music size={24} />, title: 'Customize', desc: 'Pick template' },
                                { icon: <Send size={24} />, title: 'Share', desc: 'Send the magic link' },
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + i * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center text-purple-400">
                                        {step.icon}
                                    </div>
                                    <h3 className="font-bold mb-1">{step.title}</h3>
                                    <p className="text-sm text-white/50">{step.desc}</p>
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
                                placeholder="Enter portal ID or link..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4 outline-none focus:border-purple-500 transition"
                                autoFocus
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowViewInput(false)}
                                    className="flex-1 py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleViewStory}
                                    disabled={!viewCode.trim()}
                                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
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
