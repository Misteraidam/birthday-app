import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, Copy, Share2, Download, ExternalLink,
    MessageCircle, Facebook, Twitter, CheckCircle2,
    Sparkles, ArrowLeft,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getTemplate } from '../config/celebrationConfig';

export default function SuccessScreen({ portalId, formData, onBackToHome, createdPortals = [] }) {
    const [copiedId, setCopiedId] = useState(null);
    const template = getTemplate(formData.template);

    // Filter to ensure we don't have duplicates if history is messy, 
    // though setCreatedPortals handles it.
    const displayPortals = createdPortals.length > 0 ? createdPortals : [{ id: portalId, data: formData }];

    const handleCopy = (id) => {
        const url = `${window.location.origin}${window.location.pathname}?id=${id}`;
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleShare = (id, data, platform) => {
        const url = `${window.location.origin}${window.location.pathname}?id=${id}`;
        const text = `Hey! I've created a special celebration story for ${data.recipientName}. Check it out here: ${url}`;
        let shareUrl = '';
        switch (platform) {
            case 'whatsapp': shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`; break;
            case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`; break;
            case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
            default: break;
        }
        if (shareUrl) window.open(shareUrl, '_blank');
    };

    const handleDownload = (id, data) => {
        try {
            const svgElement = document.getElementById(`qr-${id}`);
            if (!svgElement) {
                alert("QR Code not ready yet. Please wait a moment.");
                return;
            }

            const svgData = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            const portalTemplate = getTemplate(data.template);

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

                // Artistic Glow
                ctx.globalAlpha = 0.3;
                const glow = ctx.createRadialGradient(canvas.width, 0, 0, canvas.width, 0, 600);
                glow.addColorStop(0, portalTemplate.primaryColor);
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

                // Recipient
                ctx.globalAlpha = 1.0;
                const recipient = data.recipientName.toUpperCase();
                let fontSize = 100;
                ctx.font = `900 ${fontSize}px sans-serif`;
                while (ctx.measureText(recipient).width > canvas.width - 160 && fontSize > 40) {
                    fontSize -= 4;
                    ctx.font = `900 ${fontSize}px sans-serif`;
                }
                ctx.fillText(recipient, canvas.width / 2, 400);

                // Sender
                if (data.senderName) {
                    ctx.font = 'italic 40px sans-serif';
                    ctx.fillStyle = portalTemplate.primaryColor;
                    ctx.fillText(`From ${data.senderName}`, canvas.width / 2, 500);
                }

                // QR Code
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
                link.download = `Invite-${data.recipientName}.png`;
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
        <div className="min-h-screen bg-[#0A0A0A] text-white py-12 px-4 md:px-6 relative overflow-x-hidden flex flex-col items-center">
            {/* Subtle Gradient Spot */}
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] rounded-full blur-[80px] md:blur-[120px] pointer-events-none opacity-20 md:opacity-10"
                style={{ background: template.primaryColor }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-6xl relative z-10"
            >
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-500 rounded-full border border-green-500/20 mb-6">
                        <CheckCircle2 size={20} />
                        <span className="text-sm font-bold">Portals Ready to Share</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4">You're All Set!</h1>
                    <p className="text-white/40 max-w-xl mx-auto">
                        Your immersive stories are live. You can share the links below or download digital cards for each.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {displayPortals.map((portal, index) => {
                        const pData = portal.data;
                        const pId = portal.id;
                        const pTemplate = getTemplate(pData.template);
                        const pUrl = `${window.location.origin}${window.location.pathname}?id=${pId}`;

                        return (
                            <motion.div
                                key={pId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 flex flex-col justify-between shadow-2xl overflow-hidden group"
                            >
                                <div className={`absolute inset-0 opacity-10 ${pTemplate.preview} group-hover:scale-110 transition-transform duration-700`} />

                                <div className="relative z-10 mb-8">
                                    <h2 className="text-2xl font-black tracking-tight mb-1 truncate" style={{ color: pTemplate.primaryColor }}>
                                        {pData.recipientName}
                                    </h2>
                                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                                        {pData.celebrationType} Portal
                                    </p>
                                </div>

                                <div className="relative z-10 bg-white p-3 rounded-2xl w-fit shadow-xl mx-auto mb-8">
                                    <QRCodeSVG
                                        id={`qr-${pId}`}
                                        value={pUrl}
                                        size={120}
                                        level="M"
                                    />
                                </div>

                                <div className="relative z-10 space-y-4">
                                    {/* Copy Link */}
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-1.5 pl-3 flex items-center gap-2">
                                        <div className="flex-1 truncate text-[10px] font-mono text-white/40">
                                            {pUrl}
                                        </div>
                                        <button
                                            onClick={() => handleCopy(pId)}
                                            className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 flex-shrink-0 ${copiedId === pId ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-white/90'}`}
                                        >
                                            {copiedId === pId ? <Check size={12} /> : <Copy size={12} />}
                                            {copiedId === pId ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDownload(pId, pData)}
                                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Download size={14} /> Download
                                        </button>
                                        <a
                                            href={pUrl}
                                            target="_blank"
                                            className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-all"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>

                                    {/* Quick Share */}
                                    <div className="flex gap-1.5 justify-center border-t border-white/5 pt-4">
                                        {[
                                            { id: 'whatsapp', icon: <MessageCircle size={16} />, color: 'hover:bg-[#25D366] hover:text-white' },
                                            { id: 'twitter', icon: <Twitter size={16} />, color: 'hover:bg-[#1DA1F2] hover:text-white' },
                                            { id: 'facebook', icon: <Facebook size={16} />, color: 'hover:bg-[#1877F2] hover:text-white' },
                                        ].map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => handleShare(pId, pData, p.id)}
                                                className={`w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/30 transition-all ${p.color}`}
                                            >
                                                {p.icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-center pt-8 border-t border-white/5">
                    <button
                        onClick={onBackToHome}
                        className="w-full md:w-auto px-8 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 transition flex items-center justify-center gap-2"
                    >
                        Return Home
                    </button>
                    <button
                        onClick={() => {
                            // Trigger "Create New" flow directly
                            onBackToHome();
                            // Note: handleBackToLanding in App.jsx sets view to 'landing', 
                            // but the user might want a more direct "Create Another" which 
                            // we can handle by allowing handleBackToLanding to optionally 
                            // trigger handleCreateNew or just letting them click from landing.
                            // For now, simpler to just go home.
                        }}
                        className="w-full md:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition"
                    >
                        Create Another Story
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
