import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Send, ArrowRight, Play, Star, Gift, Music, Camera, MessageCircle, Menu, X, ArrowDown } from 'lucide-react';
import { CELEBRATION_TYPES, TEMPLATES } from './config/celebrationConfig';
import { TEMPLATE_PREVIEWS } from './components/TemplatePreviews';

import Terms from './components/legal/Terms';
import Privacy from './components/legal/Privacy';

export default function LandingPage({ onCreateNew, onViewStory, onOpenLegal }) {
    const [viewCode, setViewCode] = useState('');
    const [legalView, setLegalView] = useState(null);
    const [showViewInput, setShowViewInput] = useState(false);
    const [hoveredType, setHoveredType] = useState(null);
    const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [carouselPaused, setCarouselPaused] = useState(false);

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

    const featuredTemplates = TEMPLATES.slice(0, 3);

    if (legalView === 'terms') return <Terms onBack={() => setLegalView(null)} />;
    if (legalView === 'privacy') return <Privacy onBack={() => setLegalView(null)} />;

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden relative">

            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent/[0.04] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[100px]" />
            </div>

            {/* Subtle grid overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '80px 80px'
                }}
            />

            {/* Header */}
            <header className="relative z-50 px-6 py-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                            <Sparkles size={16} className="text-accent" />
                        </div>
                        <span className="text-base font-semibold tracking-tight">
                            <span className="text-accent">Celebration</span>
                            <span className="text-foreground">Portal</span>
                        </span>
                    </motion.div>

                    {/* Desktop nav */}
                    <motion.nav
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden md:flex items-center gap-8"
                    >
                        <a href="#how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">How it Works</a>
                        <a href="#templates" className="text-sm text-muted hover:text-foreground transition-colors">Templates</a>
                        <button
                            onClick={() => setShowViewInput(true)}
                            className="text-sm text-muted hover:text-foreground transition-colors flex items-center gap-2"
                        >
                            <Send size={13} /> View a Story
                        </button>
                    </motion.nav>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 text-muted hover:text-foreground transition rounded-lg hover:bg-surface-hover"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
                            <div className="flex flex-col gap-1 pt-4 pb-2">
                                <a
                                    href="#how-it-works"
                                    className="px-4 py-3 text-sm text-muted hover:text-foreground hover:bg-surface-hover rounded-xl transition"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    How it Works
                                </a>
                                <a
                                    href="#templates"
                                    className="px-4 py-3 text-sm text-muted hover:text-foreground hover:bg-surface-hover rounded-xl transition"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Templates
                                </a>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setShowViewInput(true);
                                    }}
                                    className="px-4 py-3 text-sm text-muted hover:text-foreground hover:bg-surface-hover rounded-xl transition flex items-center gap-2 text-left"
                                >
                                    <Send size={13} /> View a Story
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 px-6 pt-16 md:pt-24 pb-24">
                <div className="max-w-6xl mx-auto">
                    {/* Main Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-24"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.15, duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border mb-10"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            <span className="text-xs text-muted tracking-wide">Immersive celebration experiences</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black mb-8 leading-[0.92] tracking-tight text-balance">
                            Create a story
                            <br />
                            <span className="text-accent font-serif italic font-normal">
                                worth remembering
                            </span>
                        </h1>

                        <p className="text-base md:text-lg text-muted max-w-xl mx-auto mb-14 leading-relaxed">
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
                                className="group px-8 py-4 bg-foreground text-background font-semibold text-base rounded-xl flex items-center gap-3 shadow-2xl shadow-foreground/5 hover:shadow-foreground/10 transition-all"
                            >
                                <Gift size={18} />
                                Create a Celebration
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowViewInput(true)}
                                className="px-8 py-4 bg-transparent border border-border text-foreground font-semibold text-base rounded-xl flex items-center gap-3 hover:border-foreground/20 hover:bg-surface transition-all"
                            >
                                <MessageCircle size={18} />
                                View a Shared Story
                            </motion.button>
                        </div>

                        {/* Scroll indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="mt-20 flex justify-center"
                        >
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="text-muted/40"
                            >
                                <ArrowDown size={18} />
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Celebration Types */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <p className="text-[11px] uppercase tracking-[0.25em] text-accent/70 mb-3 font-medium">For Every Occasion</p>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Choose your moment</h2>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                            {CELEBRATION_TYPES.map((type, i) => (
                                <motion.button
                                    key={type.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.08 }}
                                    onMouseEnter={() => setHoveredType(type.id)}
                                    onMouseLeave={() => setHoveredType(null)}
                                    onClick={() => onCreateNew(type.id)}
                                    className="group relative flex flex-col items-center gap-2.5 px-5 py-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-border hover:bg-surface"
                                >
                                    <motion.div
                                        animate={{
                                            scale: hoveredType === type.id ? 1.1 : 1,
                                            y: hoveredType === type.id ? -3 : 0
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border border-border"
                                        style={{
                                            background: hoveredType === type.id ? type.gradient : 'var(--color-surface)',
                                        }}
                                    >
                                        {type.icon}
                                    </motion.div>
                                    <span className="text-xs text-muted group-hover:text-foreground transition-colors max-w-[80px] text-center leading-tight font-medium">
                                        {type.name}
                                    </span>

                                    {/* Valentine Demo - Mobile visible */}
                                    {['valentine'].includes(type.id) && (
                                        <a
                                            href={`/?demo=${type.id}`}
                                            className="md:hidden px-3 py-1.5 bg-accent text-background text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 mt-1"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Play size={10} fill="currentColor" /> Demo
                                        </a>
                                    )}

                                    {/* Tooltip - Desktop only */}
                                    <AnimatePresence>
                                        {hoveredType === type.id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                                transition={{ duration: 0.15 }}
                                                className="hidden md:flex absolute top-full mt-3 p-4 bg-background/95 backdrop-blur-xl border border-border rounded-xl whitespace-nowrap z-50 flex-col items-center gap-3 shadow-2xl shadow-black/40"
                                            >
                                                <p className="text-xs text-muted">{type.description}</p>
                                                {['valentine'].includes(type.id) && (
                                                    <a
                                                        href={`/?demo=${type.id}`}
                                                        className="px-4 py-2 bg-accent text-background text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
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
                        className="mb-32"
                        onMouseEnter={() => setCarouselPaused(true)}
                        onMouseLeave={() => setCarouselPaused(false)}
                        onTouchStart={() => setCarouselPaused(true)}
                        onTouchEnd={() => {
                            setTimeout(() => setCarouselPaused(false), 5000);
                        }}
                    >
                        <div className="text-center mb-12">
                            <p className="text-[11px] uppercase tracking-[0.25em] text-accent/70 mb-3 font-medium">Stunning Themes</p>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Beautiful Templates</h2>
                        </div>

                        {/* Template cards */}
                        <div className="flex gap-5 md:gap-6 overflow-x-auto md:overflow-visible md:justify-center px-4 md:px-0 pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide">
                            {featuredTemplates.map((template, i) => (
                                <motion.div
                                    key={template.id}
                                    animate={{
                                        scale: activeTemplateIndex === i ? 1.04 : 0.96,
                                        opacity: activeTemplateIndex === i ? 1 : 0.5,
                                        y: activeTemplateIndex === i ? -8 : 0
                                    }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    onClick={() => {
                                        setActiveTemplateIndex(i);
                                        setCarouselPaused(true);
                                        setTimeout(() => setCarouselPaused(false), 8000);
                                    }}
                                    className="relative flex-shrink-0 w-52 h-72 md:w-64 md:h-80 rounded-2xl overflow-hidden border border-border bg-surface snap-center cursor-pointer"
                                    style={{
                                        boxShadow: activeTemplateIndex === i
                                            ? `0 30px 60px -15px ${template.primaryColor}30, 0 0 0 1px ${template.primaryColor}20`
                                            : 'none'
                                    }}
                                >
                                    {/* Animated Preview */}
                                    {TEMPLATE_PREVIEWS[template.id] ? (
                                        React.createElement(TEMPLATE_PREVIEWS[template.id], { isActive: activeTemplateIndex === i })
                                    ) : (
                                        <div className={`absolute inset-0 ${template.preview}`} />
                                    )}
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <h3 className="text-sm md:text-base font-bold mb-1 text-white">{template.name}</h3>
                                        <p className="text-[10px] md:text-xs text-white/50 line-clamp-2">{template.description}</p>
                                    </div>

                                    {/* Preview badge */}
                                    <div className="absolute top-3 right-3">
                                        <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center border border-white/10">
                                            <Play size={10} className="text-white ml-0.5" />
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
                                    onClick={() => {
                                        setActiveTemplateIndex(i);
                                        setCarouselPaused(true);
                                        setTimeout(() => setCarouselPaused(false), 8000);
                                    }}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${activeTemplateIndex === i ? 'bg-accent w-8' : 'bg-muted/30 w-1.5'
                                        }`}
                                    aria-label={`View template ${i + 1}`}
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
                        className="max-w-4xl mx-auto mb-16"
                    >
                        <div className="text-center mb-14">
                            <p className="text-[11px] uppercase tracking-[0.25em] text-accent/70 mb-3 font-medium">Simple Process</p>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How it Works</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                            {[
                                { icon: <Heart size={22} />, title: 'Choose', desc: 'Select a celebration type or create your own', num: '01' },
                                { icon: <Camera size={22} />, title: 'Create', desc: 'Add chapters, photos, videos and music', num: '02' },
                                { icon: <Music size={22} />, title: 'Customize', desc: 'Pick a beautiful theme to match the mood', num: '03' },
                                { icon: <Send size={22} />, title: 'Share', desc: 'Send the magic link to your loved one', num: '04' },
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + i * 0.1 }}
                                    className="text-center group"
                                >
                                    <div className="relative w-16 h-16 mx-auto mb-5 rounded-2xl bg-surface border border-border flex items-center justify-center text-accent group-hover:border-accent/30 group-hover:bg-accent-soft transition-all duration-300">
                                        {step.icon}
                                        <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-background border border-border text-[10px] font-bold text-muted flex items-center justify-center">
                                            {step.num}
                                        </span>
                                    </div>
                                    <h3 className="font-bold mb-1.5 text-foreground">{step.title}</h3>
                                    <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-border py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted">
                        {'© 2026 CelebrationPortal. Crafted with ❤️'}
                    </p>
                    <div className="flex gap-6 text-xs text-muted">
                        <button onClick={() => setLegalView('privacy')} className="hover:text-foreground transition">Privacy</button>
                        <button onClick={() => setLegalView('terms')} className="hover:text-foreground transition">Terms</button>
                        <a href="mailto:elijahaidam.ea@gmail.com" className="hover:text-foreground transition">Contact</a>
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
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
                        onClick={() => setShowViewInput(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-background border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-black/50"
                        >
                            <h2 className="text-2xl font-bold mb-2 text-foreground">View a Shared Story</h2>
                            <p className="text-muted text-sm mb-6">Enter the portal ID or paste the full link</p>

                            <input
                                type="text"
                                value={viewCode}
                                onChange={(e) => setViewCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleViewStory()}
                                placeholder="Enter portal ID or link..."
                                className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 mb-4 outline-none focus:border-accent/50 transition text-foreground placeholder:text-muted/50"
                                autoFocus
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowViewInput(false)}
                                    className="flex-1 py-3.5 bg-surface text-muted rounded-xl font-semibold hover:bg-surface-hover hover:text-foreground transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleViewStory}
                                    disabled={!viewCode.trim()}
                                    className="flex-1 py-3.5 bg-accent text-background rounded-xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent/90 transition"
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
