import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, Copy, Share2, Download, ExternalLink,
    MessageCircle, Facebook, Twitter, CheckCircle2,
    Sparkles, ArrowLeft,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getTemplate } from '../config/celebrationConfig';

export default function SuccessScreen({ portalId, formData, onBackToHome }) {
    const [copied, setCopied] = useState(false);
    const portalUrl = `${window.location.origin}${window.location.pathname}?id=${portalId}`;
    const template = getTemplate(formData.template);

    const handleCopy = () => {
        navigator.clipboard.writeText(portalUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Subtle Gradient Spot */}
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none opacity-10"
                style={{ background: template.primaryColor }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative z-10 grid md:grid-cols-2 gap-12 items-center"
            >
                {/* Left: Digital Card Preview */}
                <div className="relative aspect-[4/5] bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden group">
                    <div className={`absolute inset-0 opacity-20 ${template.preview}`} />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6">
                            <Sparkles size={12} className={template.textColor} />
                            Digital Invite
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none" style={{ color: template.primaryColor }}>
                            {formData.recipientName}
                        </h2>
                    </div>

                    <div className="relative z-10 bg-white p-4 rounded-2xl w-fit shadow-xl">
                        <QRCodeSVG
                            value={portalUrl}
                            size={120}
                            level="M"
                        />
                    </div>

                    <div className="relative z-10 space-y-1">
                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Access Token</p>
                        <p className="text-sm font-bold font-mono text-white/60">{portalId}</p>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center border border-green-500/20">
                                <CheckCircle2 size={20} />
                            </div>
                            <span className="text-sm font-bold text-white/80">Successfully Created</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Ready to Share</h1>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Your immersive story is live. Share the link below or let them scan the QR code to enter the portal.
                        </p>
                    </div>

                    {/* Copy Link */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-2 pl-4 flex items-center gap-3">
                        <div className="flex-1 truncate text-xs font-mono text-white/50">
                            {portalUrl}
                        </div>
                        <button
                            onClick={handleCopy}
                            className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-white/90'}`}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>

                    {/* Share Buttons */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-3">Quick Share</p>
                        <div className="flex gap-2">
                            {[
                                { id: 'whatsapp', icon: <MessageCircle size={18} />, color: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]' },
                                { id: 'twitter', icon: <Twitter size={18} />, color: 'hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]' },
                                { id: 'facebook', icon: <Facebook size={18} />, color: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]' },
                            ].map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => handleShare(p.id)}
                                    className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 transition-all ${p.color}`}
                                >
                                    {p.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex gap-4">
                        <a
                            href={portalUrl}
                            target="_blank"
                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                        >
                            <ExternalLink size={16} /> Open Portal
                        </a>
                        <button
                            onClick={onBackToHome}
                            className="px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Home
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
