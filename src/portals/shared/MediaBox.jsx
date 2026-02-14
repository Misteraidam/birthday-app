import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MediaBox({
    media,
    photoIndex,
    className = "",
    containerClassName = "",
    fallbackIcon: FallbackIcon,
    accentColor = "rgba(255,255,255,0.1)"
}) {
    const currentMedia = media?.[photoIndex];
    const mediaUrl = currentMedia?.data || (typeof currentMedia === 'string' ? currentMedia : null);

    return (
        <div className={`relative overflow-hidden ${containerClassName}`}>
            <AnimatePresence mode="wait">
                {mediaUrl ? (
                    <motion.div
                        key={photoIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`relative w-full h-full ${className}`}
                    >
                        {/* Blurred Background Layer (The "Filler") */}
                        <div
                            className="absolute inset-0 z-0 scale-110 blur-2xl opacity-50 grayscale-[0.3]"
                            style={{
                                backgroundImage: `url(${mediaUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />

                        {/* Darkened Overlay for background depth */}
                        <div className="absolute inset-0 z-[1] bg-black/20" />

                        {/* Foreground Image Layer (The "Contained" actual photo) */}
                        <img
                            src={mediaUrl}
                            className="relative z-[2] w-full h-full object-contain"
                            alt=""
                        />
                    </motion.div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                        {FallbackIcon && <FallbackIcon size={64} style={{ color: accentColor, opacity: 0.3 }} />}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
