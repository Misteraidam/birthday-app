import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, Copy, Share2, Download, ExternalLink,
    MessageCircle, Facebook, Twitter, Phone,
    CheckCircle2, Sparkles, Smartphone, QrCode, ArrowDown,
    ShieldCheck, Zap, Globe, ArrowLeft, Heart
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { getTemplate } from '../config/celebrationConfig';

export default function SuccessScreen({ portalId, formData, onBackToHome }) {
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const portalUrl = `${window.location.origin}${window.location.pathname}?id=${portalId}`;
    const template = getTemplate(formData.template);

    useEffect(() => {
        // Initial celebration burst
        const timer = setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: [template.primaryColor, template.accentColor, '#FFFFFF']
            });
            setShowQR(true);
        }, 800);
        return () => clearTimeout(timer);
    }, [template]);

    const handleCopy = () => {
        navigator.clipboard.writeText(portalUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.8 },
            colors: [template.primaryColor, '#FFFFFF']
        });
    };

    const handleShare = (platform) => {
        const text = `Hey! I've created a special celebration story for ${formData.recipientName}. Check it out here: ${portalUrl}`;
        let url = '';
        switch (platform) {
            case 'whatsapp': url = `https://wa.me/?text=${encodeURIComponent(text)}`; break;
            case 'twitter': url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`; break;
            case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(portalUrl)}`; break;
            default: break;
        }
        if (url) window.open(url, '_blank');
    };

    const handleDownload = () => {
        try {
            const svgElement = document.getElementById('portal-qr-code');
            if (!svgElement) {
                alert("QR Code not ready yet. Please wait a moment.");
                return;
            }

            const svgData = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            canvas.width = 1200;
            canvas.height = 1600;

            img.onerror = () => {
                alert("Failed to generate digital card image. Please try copying the link instead.");
            };

            img.onload = () => {
                try {
                    // High-end background
                    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                    gradient.addColorStop(0, '#050505');
                    gradient.addColorStop(1, '#111111');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Artistic Glows
                    ctx.globalAlpha = 0.4;
                    ctx.fillStyle = template.primaryColor;
                    ctx.filter = 'blur(100px)';
                    ctx.beginPath();
                    ctx.arc(canvas.width, 0, 600, 0, Math.PI * 2);
                    ctx.fill();

                    // Premium Frame
                    ctx.globalAlpha = 1.0;
                    ctx.filter = 'none';
                    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

                    // Typography
                    ctx.fillStyle = '#FFFFFF';
                    ctx.textAlign = 'center';
                    ctx.font = 'bold 30px sans-serif';
                    ctx.globalAlpha = 0.3;
                    ctx.fillText('A DIGITAL STORY FOR', canvas.width / 2, 200);

                    ctx.globalAlpha = 1.0;
                    ctx.font = '900 120px sans-serif';
                    ctx.fillText(formData.recipientName.toUpperCase(), canvas.width / 2, 350);

                    // QR Card Shadowy Effect
                    ctx.shadowColor = 'rgba(0,0,0,0.5)';
                    ctx.shadowBlur = 50;
                    ctx.fillStyle = '#FFFFFF';
                    ctx.beginPath();
                    if (ctx.roundRect) {
                        ctx.roundRect(250, 500, 700, 800, [60]);
                    } else {
                        // Fallback for older browsers
                        ctx.rect(250, 500, 700, 800);
                    }
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // Draw QR
                    ctx.drawImage(img, 350, 650, 500, 500);

                    ctx.fillStyle = '#000000';
                    ctx.font = 'bold 24px sans-serif';
                    ctx.fillText('SCAN TO EXPERIENCE', canvas.width / 2, 1220);

                    ctx.fillStyle = '#FFFFFF';
                    ctx.globalAlpha = 0.2;
                    ctx.font = 'italic 20px sans-serif';
                    ctx.fillText('Powered by WishCraft Studio // 2026', canvas.width / 2, 1500);

                    const link = document.createElement('a');
                    link.download = `Invite-${formData.recipientName}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                } catch (e) {
                    console.error(e);
                    alert("Error processing card image.");
                }
            };

            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            img.src = URL.createObjectURL(svgBlob);
        } catch (e) {
            console.error(e);
            alert("Could not start digital card generation.");
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-purple-500/30">
            {/* Pulsating Immersive Backdrop */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] rounded-full blur-[150px]"
                    style={{ background: `radial-gradient(circle, ${template.primaryColor}88 0%, transparent 70%)` }}
                />
            </div>

            <div className="max-w-[1200px] mx-auto px-6 pt-32 pb-24 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">Created Successfully</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tight mb-4"
                    >
                        It's ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">sparkle.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 text-lg max-w-lg mx-auto"
                    >
                        Your special story for <span className="text-white font-medium">{formData.recipientName}</span> is live.
                        Share the magic link below.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left: Content & Actions */}
                    <div className="order-2 lg:order-1 space-y-12">


                        {/* URL Box */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 md:p-10"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 block mb-6">Permanent Magic Link</span>
                            <div className="flex flex-col md:flex-row gap-4 p-2 bg-black/40 rounded-3xl border border-white/10">
                                <span className="flex-1 px-4 py-4 text-white/60 font-mono truncate text-sm flex items-center">{portalUrl}</span>
                                <motion.button
                                    onClick={handleCopy}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${copied ? 'bg-green-500 text-white' : 'bg-white text-black'}`}
                                >
                                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied' : 'Duplicate'}
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Share Row */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mr-2">Share via</span>
                            {[
                                { id: 'whatsapp', icon: <MessageCircle size={18} />, color: 'hover:bg-green-500/20 hover:text-green-400' },
                                { id: 'twitter', icon: <Twitter size={18} />, color: 'hover:bg-blue-400/20 hover:text-blue-400' },
                                { id: 'facebook', icon: <Facebook size={18} />, color: 'hover:bg-blue-600/20 hover:text-blue-600' },
                            ].map((p, i) => (
                                <motion.button
                                    key={p.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    onClick={() => handleShare(p.id)}
                                    className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all ${p.color}`}
                                >
                                    {p.icon}
                                </motion.button>
                            ))}
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex flex-col md:flex-row gap-4 pt-6">
                            <motion.a
                                href={portalUrl} target="_blank"
                                whileHover={{ y: -5 }}
                                className="flex-1 py-6 bg-white/5 border border-white/10 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                            >
                                <ExternalLink size={18} /> View Portal
                            </motion.a>
                            <motion.button
                                onClick={onBackToHome}
                                whileHover={{ y: -5 }}
                                className="flex-1 py-6 bg-white/[0.03] rounded-3xl font-black uppercase tracking-widest text-xs text-white/40 hover:text-white transition-all"
                            >
                                <ArrowLeft size={18} className="inline mr-2" /> Home
                            </motion.button>
                        </div>
                    </div>

                    {/* Right: The Card Reveal */}
                    <div className="order-1 lg:order-2 flex justify-center">
                        <AnimatePresence>
                            {showQR && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                    className="relative group w-full max-w-[450px]"
                                >
                                    {/* Glass Invitation Card */}
                                    <div className="relative aspect-[4/5] bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/20 rounded-[3rem] p-8 flex flex-col items-center justify-between text-center backdrop-blur-3xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] group">
                                        <div className={`absolute inset-0 opacity-10 pointer-events-none ${template.preview}`} />

                                        {/* Animated Shine Effect */}
                                        <motion.div
                                            animate={{ x: ['-200%', '200%'] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                                        />

                                        <div className="relative z-10">
                                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-6 mx-auto bg-white/5">
                                                <Sparkles size={18} className="text-purple-400" />
                                            </div>
                                            <h2 className="text-3xl font-black tracking-tight mb-2" style={{ fontFamily: template.fontFamily }}>
                                                {formData.recipientName}
                                            </h2>
                                            <p className="text-[10px] uppercase tracking-widest text-white/40">Exclusive Digital Entry</p>
                                        </div>

                                        {/* QR Code Section */}
                                        <div className="relative z-10">
                                            <div className="relative group/qr">
                                                <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover/qr:opacity-100 transition-opacity" />
                                                <div className="relative bg-white p-5 rounded-[2.5rem] shadow-2xl transition-transform duration-500 group-hover:scale-110">
                                                    <QRCodeSVG
                                                        id="portal-qr-code"
                                                        value={portalUrl}
                                                        size={160}
                                                        level="H"
                                                        fgColor="#000000"
                                                        bgColor="#FFFFFF"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-6 font-mono text-[9px] text-white/20 tracking-widest">TOKEN: {portalId.toUpperCase()}</div>
                                        </div>

                                        <div className="relative z-10 w-full space-y-3">
                                            <p className="text-[10px] text-white/30 font-medium">Scan or click below to save</p>
                                            <motion.button
                                                onClick={handleDownload}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all"
                                            >
                                                <Download size={14} /> Download Digital Card
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Floating Decorations */}
                                    <motion.div
                                        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl"
                                    />
                                    <motion.div
                                        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                                        transition={{ duration: 5, repeat: Infinity }}
                                        className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl "
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
