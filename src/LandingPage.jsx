import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Send, ArrowRight, Play, Star, Gift, Music, Camera, MessageCircle, Menu, X, ChevronDown } from 'lucide-react';
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
        <div className="min-h-screen bg-background text-foreground overflow-hidden relative font-sans">

            {/* Background texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                    backgroundSize: '48px 48px'
                }}
            />

            {/* Navigation */}
            <header className="relative z-50 border-b border-border">
                <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-2.5"
                    >
                        <Sparkles size={18} className="text-accent-warm" />
                        <span className="text-sm font-medium tracking-wide uppercase">
                            Celebration Portal
                        </span>
                    </motion.div>

                    {/* Desktop nav */}
                    <motion.nav
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="hidden md:flex items-center gap-10"
                    >
                        <a href="#occasions" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase">Occasions</a>
                        <a href="#templates" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase">Templates</a>
                        <a href="#how-it-works" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase">Process</a>
                        <button
                            onClick={() => setShowViewInput(true)}
                            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase flex items-center gap-2"
                        >
                            View Story
                        </button>
                    </motion.nav>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 text-muted-foreground hover:text-foreground transition"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden border-t border-border"
                        >
                            <div className="flex flex-col px-6 py-4 gap-1">
                                <a href="#occasions" className="py-3 text-sm text-muted-foreground hover:text-foreground transition" onClick={() => setMobileMenuOpen(false)}>Occasions</a>
                                <a href="#templates" className="py-3 text-sm text-muted-foreground hover:text-foreground transition" onClick={() => setMobileMenuOpen(false)}>Templates</a>
                                <a href="#how-it-works" className="py-3 text-sm text-muted-foreground hover:text-foreground transition" onClick={() => setMobileMenuOpen(false)}>Process</a>
                                <button
                                    onClick={() => { setMobileMenuOpen(false); setShowViewInput(true); }}
                                    className="py-3 text-sm text-muted-foreground hover:text-foreground transition text-left flex items-center gap-2"
                                >
                                    <Send size={13} /> View a Story
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 px-6 md:px-10 pt-24 md:pt-40 pb-32 md:pb-48">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        {/* Eyebrow */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-[11px] md:text-xs tracking-[0.35em] uppercase text-muted-foreground mb-10 md:mb-14"
                        >
                            Immersive Celebration Experiences
                        </motion.p>

                        {/* Hero heading */}
                        <h1 className="font-serif text-5xl md:text-7xl lg:text-[6rem] leading-[1.05] tracking-tight mb-8 md:mb-10 text-balance">
                            Create Moments
                            <br />
                            <span className="italic text-accent">
                                Worth Keeping
                            </span>
                        </h1>

                        <p className="text-base md:text-lg text-muted leading-relaxed max-w-lg mx-auto mb-14 md:mb-16">
                            Transform your celebrations into cinematic, shareable stories with photos, music, and heartfelt chapters.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onCreateNew}
                                className="group px-8 py-4 bg-accent text-background font-medium text-sm tracking-wide rounded-full flex items-center gap-3 hover:bg-accent-warm transition-colors"
                            >
                                Create a Celebration
                                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowViewInput(true)}
                                className="px-8 py-4 bg-transparent border border-border text-foreground font-medium text-sm tracking-wide rounded-full flex items-center gap-3 hover:bg-surface-hover transition-colors"
                            >
                                <Send size={14} />
                                View a Shared Story
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Scroll hint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="flex justify-center mt-24 md:mt-32"
                    >
                        <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            className="flex flex-col items-center gap-3 text-muted"
                        >
                            <span className="text-[10px] tracking-[0.3em] uppercase">Scroll to explore</span>
                            <ChevronDown size={14} />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Celebration Types */}
            <section id="occasions" className="relative z-10 px-6 md:px-10 py-24 md:py-32">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20">
                            <div>
                                <p className="text-[11px] tracking-[0.35em] uppercase text-muted-foreground mb-4">For Every Occasion</p>
                                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
                                    Choose Your <span className="italic text-accent">Moment</span>
                                </h2>
                            </div>
                            <p className="text-sm text-muted max-w-sm leading-relaxed">
                                From birthdays to memorials, each celebration type comes with curated chapters and themes.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                            {CELEBRATION_TYPES.map((type, i) => (
                                <motion.button
                                    key={type.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.06, duration: 0.5 }}
                                    onMouseEnter={() => setHoveredType(type.id)}
                                    onMouseLeave={() => setHoveredType(null)}
                                    onClick={() => onCreateNew(type.id)}
                                    className="group relative flex flex-col items-center gap-4 p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-accent-warm/20 transition-all duration-300"
                                >
                                    <motion.div
                                        animate={{
                                            scale: hoveredType === type.id ? 1.15 : 1,
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="text-3xl md:text-4xl"
                                    >
                                        {type.icon}
                                    </motion.div>
                                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight font-medium tracking-wide">
                                        {type.name}
                                    </span>

                                    {/* Valentine Demo - Mobile */}
                                    {['valentine'].includes(type.id) && (
                                        <a
                                            href={`/?demo=${type.id}`}
                                            className="md:hidden px-3 py-1.5 bg-accent-warm text-background text-[9px] font-semibold uppercase tracking-widest rounded-full flex items-center gap-1.5"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Play size={8} fill="currentColor" /> Demo
                                        </a>
                                    )}

                                    {/* Tooltip - Desktop */}
                                    <AnimatePresence>
                                        {hoveredType === type.id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                                transition={{ duration: 0.15 }}
                                                className="hidden md:flex absolute top-full mt-3 p-4 bg-card border border-border rounded-xl whitespace-nowrap z-50 flex-col items-center gap-3 shadow-2xl shadow-black/60"
                                            >
                                                <p className="text-xs text-muted">{type.description}</p>
                                                {['valentine'].includes(type.id) && (
                                                    <a
                                                        href={`/?demo=${type.id}`}
                                                        className="px-4 py-2 bg-accent-warm text-background text-[9px] font-semibold uppercase tracking-widest rounded-full hover:opacity-90 transition flex items-center gap-2"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Play size={8} fill="currentColor" /> Watch Demo
                                                    </a>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Template Previews */}
            <section
                id="templates"
                className="relative z-10 px-6 md:px-10 py-24 md:py-32"
                onMouseEnter={() => setCarouselPaused(true)}
                onMouseLeave={() => setCarouselPaused(false)}
                onTouchStart={() => setCarouselPaused(true)}
                onTouchEnd={() => { setTimeout(() => setCarouselPaused(false), 5000); }}
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="text-center mb-16 md:mb-20">
                            <p className="text-[11px] tracking-[0.35em] uppercase text-muted-foreground mb-4">Stunning Themes</p>
                            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
                                Beautiful <span className="italic text-accent">Templates</span>
                            </h2>
                        </div>

                        {/* Template cards */}
                        <div className="flex gap-5 md:gap-6 overflow-x-auto md:overflow-visible md:justify-center px-4 md:px-0 pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide">
                            {featuredTemplates.map((template, i) => (
                                <motion.div
                                    key={template.id}
                                    animate={{
                                        scale: activeTemplateIndex === i ? 1.03 : 0.95,
                                        opacity: activeTemplateIndex === i ? 1 : 0.4,
                                        y: activeTemplateIndex === i ? -6 : 0
                                    }}
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    onClick={() => {
                                        setActiveTemplateIndex(i);
                                        setCarouselPaused(true);
                                        setTimeout(() => setCarouselPaused(false), 8000);
                                    }}
                                    className="relative flex-shrink-0 w-56 h-80 md:w-64 md:h-96 rounded-2xl overflow-hidden border border-border bg-card snap-center cursor-pointer"
                                    style={{
                                        boxShadow: activeTemplateIndex === i
                                            ? `0 40px 80px -20px ${template.primaryColor}25`
                                            : 'none'
                                    }}
                                >
                                    {/* Template Preview */}
                                    {TEMPLATE_PREVIEWS[template.id] ? (
                                        React.createElement(TEMPLATE_PREVIEWS[template.id], { isActive: activeTemplateIndex === i })
                                    ) : (
                                        <div className={`absolute inset-0 ${template.preview}`} />
                                    )}

                                    {/* Bottom overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <h3 className="text-sm font-semibold mb-1 text-white">{template.name}</h3>
                                        <p className="text-[10px] text-white/50 line-clamp-2">{template.description}</p>
                                    </div>

                                    {/* Play badge */}
                                    <div className="absolute top-3 right-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                                            <Play size={10} className="text-white ml-0.5" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Dots */}
                        <div className="flex justify-center gap-2 mt-10">
                            {featuredTemplates.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setActiveTemplateIndex(i);
                                        setCarouselPaused(true);
                                        setTimeout(() => setCarouselPaused(false), 8000);
                                    }}
                                    className={`h-1 rounded-full transition-all duration-500 ${activeTemplateIndex === i ? 'bg-accent w-8' : 'bg-muted/20 w-1'}`}
                                    aria-label={`View template ${i + 1}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* How it Works */}
            <section id="how-it-works" className="relative z-10 px-6 md:px-10 py-24 md:py-32">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="text-center mb-16 md:mb-20">
                            <p className="text-[11px] tracking-[0.35em] uppercase text-muted-foreground mb-4">Simple Process</p>
                            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
                                How It <span className="italic text-accent">Works</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
                            {[
                                { icon: <Heart size={24} />, title: 'Choose', desc: 'Select a celebration type or craft your own', num: '01' },
                                { icon: <Camera size={24} />, title: 'Create', desc: 'Add chapters, photos, videos, and music', num: '02' },
                                { icon: <Music size={24} />, title: 'Customize', desc: 'Pick a stunning theme to match the mood', num: '03' },
                                { icon: <Send size={24} />, title: 'Share', desc: 'Send the magic link to your loved one', num: '04' },
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className="bg-card p-8 md:p-10 flex flex-col group"
                                >
                                    <span className="text-[10px] tracking-[0.3em] uppercase text-muted mb-8 font-medium">
                                        Step {step.num}
                                    </span>
                                    <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-accent-warm mb-6 group-hover:bg-accent-soft group-hover:border-accent-warm/20 transition-all duration-300">
                                        {step.icon}
                                    </div>
                                    <h3 className="font-serif text-xl md:text-2xl mb-3 tracking-tight">{step.title}</h3>
                                    <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Bottom CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-center mt-16 md:mt-20"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onCreateNew}
                                className="group px-10 py-4 bg-accent text-background font-medium text-sm tracking-wide rounded-full inline-flex items-center gap-3 hover:bg-accent-warm transition-colors"
                            >
                                Start Creating
                                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-border">
                <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2.5">
                        <Sparkles size={14} className="text-accent-warm" />
                        <span className="text-xs text-muted-foreground tracking-wide uppercase">CelebrationPortal</span>
                    </div>
                    <div className="flex items-center gap-8">
                        <button onClick={() => setLegalView('privacy')} className="text-xs text-muted-foreground hover:text-foreground transition tracking-wide uppercase">Privacy</button>
                        <button onClick={() => setLegalView('terms')} className="text-xs text-muted-foreground hover:text-foreground transition tracking-wide uppercase">Terms</button>
                        <a href="mailto:elijahaidam.ea@gmail.com" className="text-xs text-muted-foreground hover:text-foreground transition tracking-wide uppercase">Contact</a>
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
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={() => setShowViewInput(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.96, opacity: 0, y: 8 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.96, opacity: 0, y: 8 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-black/50"
                        >
                            <h2 className="font-serif text-2xl mb-2">View a Shared Story</h2>
                            <p className="text-muted text-sm mb-8">Enter the portal ID or paste the full link</p>

                            <input
                                type="text"
                                value={viewCode}
                                onChange={(e) => setViewCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleViewStory()}
                                placeholder="Enter portal ID or link..."
                                className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 mb-5 outline-none focus:border-accent-warm/40 transition text-foreground placeholder:text-muted/40 text-sm"
                                autoFocus
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowViewInput(false)}
                                    className="flex-1 py-3.5 bg-surface text-muted-foreground rounded-xl font-medium text-sm hover:bg-surface-hover hover:text-foreground transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleViewStory}
                                    disabled={!viewCode.trim()}
                                    className="flex-1 py-3.5 bg-accent text-background rounded-xl font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent-warm transition"
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
