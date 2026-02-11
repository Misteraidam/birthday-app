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
                alert("Failed to generate digital card image.");
            };

            img.onload = () => {
                // Background
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#050505');
                gradient.addColorStop(1, '#111111');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Artistic Glow — using radial gradient instead of ctx.filter (Safari compat)
                ctx.globalAlpha = 0.3;
                const glow = ctx.createRadialGradient(canvas.width, 0, 0, canvas.width, 0, 600);
                glow.addColorStop(0, template.primaryColor);
                glow.addColorStop(1, 'transparent');
                ctx.fillStyle = glow;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Frame
                ctx.globalAlpha = 1.0;
                ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                ctx.lineWidth = 2;
                ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

                // Title
                ctx.fillStyle = '#FFFFFF';
                ctx.textAlign = 'center';
                ctx.font = 'bold 30px sans-serif';
                ctx.globalAlpha = 0.5;
                ctx.fillText('A DIGITAL STORY FOR', canvas.width / 2, 250);

                // Recipient — auto-scale font for long names
                ctx.globalAlpha = 1.0;
                const recipient = formData.recipientName.toUpperCase();
                let fontSize = 100;
                ctx.font = `900 ${fontSize}px sans-serif`;
                // Shrink font until text fits within canvas width with padding
                while (ctx.measureText(recipient).width > canvas.width - 160 && fontSize > 40) {
                    fontSize -= 4;
                    ctx.font = `900 ${fontSize}px sans-serif`;
                }
                ctx.fillText(recipient, canvas.width / 2, 400);

                // Sender
                if (formData.senderName) {
                    ctx.font = 'italic 40px sans-serif';
                    ctx.fillStyle = template.primaryColor;
                    ctx.fillText(`From ${formData.senderName}`, canvas.width / 2, 500);
                }

                // QR Code — centered horizontally
                const qrSize = 500;
                const qrX = (canvas.width - qrSize) / 2;
                ctx.drawImage(img, qrX, 650, qrSize, qrSize);

                // Footer
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 30px sans-serif';
                ctx.fillText('SCAN TO ENTER', canvas.width / 2, 1250);

                ctx.font = '20px sans-serif';
                ctx.globalAlpha = 0.3;
                ctx.fillText('Interactive Celebration Portal', canvas.width / 2, 1450);

                const link = document.createElement('a');
                link.download = `Invite-${formData.recipientName}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            };

            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            img.src = URL.createObjectURL(svgBlob);
        } catch (e) {
            console.error(e);
            alert("Could not generate card.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4 md:p-6 relative overflow-x-hidden">
            {/* Subtle Gradient Spot */}
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] rounded-full blur-[80px] md:blur-[120px] pointer-events-none opacity-20 md:opacity-10"
                style={{ background: template.primaryColor }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-12 shadow-2xl relative z-10 flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
                {/* Left: Digital Card Preview */}
                <div className="relative w-full max-w-[350px] md:max-w-none aspect-[4/5] bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between overflow-hidden group mx-auto">
                    <div className={`absolute inset-0 opacity-20 ${template.preview}`} />

                    <div className="relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/60 mb-4 md:mb-6">
                            <Sparkles size={12} className={template.textColor} />
                            Digital Invite
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none mb-2" style={{ color: template.primaryColor }}>
                            {formData.recipientName}
                        </h2>
                        {formData.senderName && (
                            <p className="text-sm font-medium italic text-white/50">From {formData.senderName}</p>
                        )}
                    </div>

                    <div className="relative z-10 bg-white p-3 md:p-4 rounded-2xl w-fit shadow-xl mx-auto my-4">
                        <QRCodeSVG
                            id="portal-qr-code"
                            value={portalUrl}
                            size={100}
                            level="M"
                        />
                    </div>

                    <div className="relative z-10 text-center space-y-3">
                        <button
                            onClick={handleDownload}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                        >
                            <Download size={14} /> Download Card
                        </button>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="w-full space-y-6 md:space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center border border-green-500/20">
                                <CheckCircle2 size={20} />
                            </div>
                            <span className="text-sm font-bold text-white/80">Successfully Created</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">Ready to Share</h1>
                        <p className="text-white/40 text-sm leading-relaxed text-center md:text-left">
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
                            className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 ${copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-white/90'}`}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>

                    {/* Share Buttons */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-3 text-center md:text-left">Quick Share</p>
                        <div className="flex gap-2 justify-center md:justify-start">
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

                    <div className="pt-6 border-t border-white/5 flex gap-4">
                        <a
                            href={portalUrl}
                            target="_blank"
                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                        >
                            <ExternalLink size={16} /> Open
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
