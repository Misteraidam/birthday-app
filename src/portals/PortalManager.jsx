import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import { Music, Volume2, VolumeX, Play } from 'lucide-react';

// Import all portal templates
import RoseGarden from './RoseGarden';
import GoldenJubilee from './GoldenJubilee';
import EternalVow from './EternalVow';
import CapAndGown from './CapAndGown';
import SoftMemorial from './SoftMemorial';
import CelebrationPop from './CelebrationPop';
import MinimalStory from './MinimalStory';
import CosmicDream from './CosmicDream';
import VintageFilm from './VintageFilm';
import NeonNights from './NeonNights';
import KineticBento from './KineticBento';
import MuseumCore from './MuseumCore';
import DopamineDream from './DopamineDream';
import NeoBrutalistFlow from './NeoBrutalistFlow';

// Legacy templates (keeping for backward compatibility)
import EditorialClassic from './EditorialClassic';
import MidnightLuxe from './MidnightLuxe';
import SoftGradient from './SoftGradient';
import NeonGlow from './NeonGlow';
import CosmicReveal from './CosmicReveal';
import LuxuryGold from './LuxuryGold';

// Import openers
import EnvelopeOpener from '../components/EnvelopeOpener';
import BalloonPopper from '../components/BalloonPopper';
import GlobalParticles from '../components/GlobalParticles';
import { getTemplate } from '../config/celebrationConfig';

// Template mapping
const TEMPLATES = {
    // New templates
    RoseGarden: RoseGarden,
    GoldenJubilee: GoldenJubilee,
    EternalVow: EternalVow,
    CapAndGown: CapAndGown,
    SoftMemorial: SoftMemorial,
    CelebrationPop: CelebrationPop,
    MinimalStory: MinimalStory,
    CosmicDream: CosmicDream,
    VintageFilm: VintageFilm,
    NeonNights: NeonNights,
    KineticBento: KineticBento,
    MuseumCore: MuseumCore,
    DopamineDream: DopamineDream,
    NeoBrutalistFlow: NeoBrutalistFlow,

    // Legacy templates (for backward compatibility)
    editorial: EditorialClassic,
    'midnight-luxe': MidnightLuxe,
    'soft-gradient': SoftGradient,
    'neon-glow': NeonGlow,
    'cosmic-reveal': CosmicReveal,
    'luxury-gold': LuxuryGold,
};

// Opener mapping
const OPENERS = {
    envelope: EnvelopeOpener,
    balloons: BalloonPopper,
    // Other openers can use default behavior
};

export default function PortalManager({ formData, onBack, isDemo = false }) {
    // State management
    const [showOpener, setShowOpener] = useState(!!formData.opener && formData.opener !== 'none');
    const [openerComplete, setOpenerComplete] = useState(!formData.opener || formData.opener === 'none');
    const [isPlaying, setIsPlaying] = useState(false);
    const [showSoundPrompt, setShowSoundPrompt] = useState(false);
    const [demoStarted, setDemoStarted] = useState(!isDemo); // For demo mode, require click first
    const audioRef = React.useRef(null);

    // Sync state with formData changes (important for demo mode refreshes)
    useEffect(() => {
        const hasOpener = !!formData.opener && formData.opener !== 'none';
        setShowOpener(hasOpener);
        setOpenerComplete(!hasOpener);
        setIsPlaying(false); // Reset playback state on data change
    }, [formData.opener, formData.template]);

    // Handle demo start - enables music and starts the experience
    const handleDemoStart = () => {
        console.log("Demo starting! Music URL:", formData.musicUrl);
        setDemoStarted(true);
        setIsPlaying(true);

        // Immediate play attempt to satisfy browser interaction requirement
        if (isDirectFile && audioRef.current) {
            audioRef.current.play().catch(e => console.log("Direct play attempt failed", e));
        }
    };

    const OpenerComponent = OPENERS[formData.opener];

    // Detect if the music is a direct file (Apple Music, MP3, M4A) or a service (YouTube)
    const isDirectFile = formData.musicUrl && (
        formData.musicUrl.includes('itunes.apple.com') ||
        formData.musicUrl.includes('audio-ssl.itunes.apple.com') ||
        formData.musicUrl.includes('mzstatic.com') ||
        formData.musicUrl.includes('pixabay.com') ||
        formData.musicUrl.toLowerCase().includes('.mp3') ||
        formData.musicUrl.toLowerCase().includes('.m4a') ||
        formData.musicUrl.toLowerCase().includes('.wav')
    );

    // Get the selected template component
    const templateConfig = getTemplate(formData.template);
    const TemplateComponent = TEMPLATES[formData.template] || GoldenJubilee;

    // Play music when demo starts (after audio element mounts)
    useEffect(() => {
        if (demoStarted && isPlaying && isDirectFile && audioRef.current) {
            const playAudio = () => {
                audioRef.current.volume = 1.0;
                audioRef.current.play().catch(e => {
                    console.log("Audio play failed, requiring interaction:", e);
                    if (!isDemo) setShowSoundPrompt(true);
                });
            };

            // Small delay to ensure browser handles the transition
            const timer = setTimeout(playAudio, 150);
            return () => clearTimeout(timer);
        }
    }, [demoStarted, isPlaying, isDirectFile]);

    // Sync manual play/pause with native audio
    useEffect(() => {
        if (isDirectFile && audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log("Manual play failed", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, isDirectFile]);

    const startMusic = (e) => {
        if (e) e.stopPropagation();
        console.log("Starting music...");
        setIsPlaying(true);
        setShowSoundPrompt(false);

        if (isDirectFile && audioRef.current) {
            audioRef.current.play().catch(err => {
                console.log("Direct play failed, showing prompt:", err);
                setShowSoundPrompt(true);
            });
        }
    };

    const toggleMusic = (e) => {
        if (e) e.stopPropagation();
        if (isPlaying) {
            setIsPlaying(false);
            if (isDirectFile && audioRef.current) {
                audioRef.current.pause();
            }
        } else {
            startMusic(e);
        }
    };

    const handleOpenerComplete = () => {
        setShowOpener(false);
        setOpenerComplete(true);
        // Fallback: set playing if it wasn't already started by a direct click inside the opener
        setIsPlaying(true);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0A0A0A]">
            {/* Global Particle System */}
            {!showOpener && demoStarted && <GlobalParticles type={templateConfig?.particles} />}

            {/* Portal Content */}
            <AnimatePresence>
                {!showOpener && demoStarted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="w-full"
                    >
                        <TemplateComponent formData={formData} templateConfig={templateConfig} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Demo Start Screen (Overlay) */}
            <AnimatePresence>
                {isDemo && !demoStarted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                        onClick={handleDemoStart}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="text-center"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-8xl mb-8"
                            >
                                💖
                            </motion.div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                {formData.recipientName}'s Story
                            </h1>
                            <p className="text-white/60 text-lg mb-12">
                                For {formData.recipientName}
                            </p>
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="flex items-center gap-3 text-white/80"
                            >
                                <Play size={20} fill="white" />
                                <span className="text-sm uppercase tracking-[0.3em]">Tap to Begin</span>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Opener Layer */}
            <AnimatePresence>
                {showOpener && OpenerComponent && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-50"
                    >
                        <OpenerComponent
                            recipientName={formData.recipientName}
                            celebrationType={formData.celebrationType}
                            onComplete={handleOpenerComplete}
                            onStartMusic={startMusic}
                            hasMusic={!!formData.musicUrl}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Simple Openers */}
            <AnimatePresence>
                {showOpener && !OpenerComponent && formData.opener && formData.opener !== 'none' && (
                    <SimpleOpener
                        type={formData.opener}
                        recipientName={formData.recipientName}
                        onComplete={handleOpenerComplete}
                        onStartMusic={startMusic}
                        hasMusic={!!formData.musicUrl}
                    />
                )}
            </AnimatePresence>

            {/* Background Music Player (Global) - High Visibility positioning */}
            {formData.musicUrl && (
                <>
                    <button
                        onClick={toggleMusic}
                        className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 bg-black/80 hover:bg-black/90 p-2 pr-4 rounded-full border border-white/20 backdrop-blur-xl transition-all group scale-100 md:scale-110 shadow-2xl ${!isPlaying ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-black' : ''}`}
                    >
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center">
                            {isPlaying ? <Volume2 size={18} className="text-white animate-pulse" /> : <Play size={18} className="text-purple-400 fill-purple-400" />}
                        </div>
                        <div className="flex flex-col items-start pr-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/50 leading-none mb-1">
                                {!isPlaying ? 'Play Music' : 'Experience'}
                            </span>
                            <div className="flex gap-[2px] items-end h-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: isPlaying ? [4, 12, 6, 12, 4] : 4 }}
                                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                        className={`w-[2px] rounded-full ${isPlaying ? 'bg-purple-400' : 'bg-white/20'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </button>

                    {/* ... (Keep audio players) ... */}
                    {isDirectFile ? (
                        <audio
                            ref={audioRef}
                            src={formData.musicUrl}
                            loop
                            className="hidden"
                        />
                    ) : (
                        <div className="fixed bottom-0 right-0 w-[1px] h-[1px] pointer-events-none overflow-hidden opacity-0 z-[-1]">
                            <ReactPlayer
                                url={formData.musicUrl}
                                playing={isPlaying}
                                muted={false}
                                loop={true}
                                volume={1.0}
                                playsinline
                                width="100%"
                                height="100%"
                                onReady={() => console.log("Music Ready")}
                                onStart={() => console.log("Music Started")}
                                onPlay={() => console.log("Music Playing")}
                                onError={(e) => console.error("Music Error:", e)}
                                config={{
                                    youtube: {
                                        playerVars: {
                                            autoplay: 1,
                                            controls: 0,
                                            modestbranding: 1,
                                            rel: 0,
                                            showinfo: 0,
                                            ecver: 2
                                        }
                                    }
                                }}
                            />
                        </div>
                    )}
                </>
            )}

            {/* High Visibility Sound Prompt - Centered Alert as requested */}
            <AnimatePresence>
                {!showOpener && !isPlaying && (showSoundPrompt || !openerComplete) && formData.musicUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center px-6 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-zinc-900 border border-white/10 p-8 rounded-[40px] max-w-sm w-full text-center shadow-[0_0_100px_rgba(168,85,247,0.2)]"
                        >
                            <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20">
                                <Music size={32} className="text-white" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">Sound Recommended</h2>
                            <p className="text-white/60 text-sm mb-8">
                                For the full immersive experience, we recommend playing the curated soundtrack.
                            </p>

                            <motion.button
                                onClick={startMusic}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-full shadow-xl transition-all flex items-center justify-center gap-3"
                            >
                                <Play size={18} fill="black" />
                                Play Music for Experience
                            </motion.button>

                            <button
                                onClick={() => {
                                    setIsPlaying(false);
                                    setShowSoundPrompt(false);
                                    setOpenerComplete(true);
                                }}
                                className="mt-6 text-white/30 text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors"
                            >
                                Continue without sound
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back Button - SHOW ALWAYS IF onBack IS PROVIDED */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="fixed bottom-6 left-6 z-40 px-4 py-2 bg-black/50 backdrop-blur-md text-white/80 rounded-full text-sm hover:bg-black/70 transition flex items-center gap-2"
                >
                    ← Home
                </button>
            )}
        </div>
    );
}

// Simple opener animations for types without dedicated components
function SimpleOpener({ type, recipientName, onComplete, hasMusic }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 2500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    const openerStyles = {
        petals: {
            bg: 'bg-gradient-to-br from-rose-400 to-pink-600',
            icon: '🌹',
            text: 'For You'
        },
        stars: {
            bg: 'bg-gradient-to-br from-purple-900 to-indigo-900',
            icon: '⭐',
            text: 'A Wish'
        },
        book: {
            bg: 'bg-gradient-to-br from-amber-100 to-amber-200',
            icon: '📖',
            text: 'Turn the Page'
        },
        curtain: {
            bg: 'bg-gradient-to-br from-red-900 to-red-950',
            icon: '🎭',
            text: 'The Show Begins'
        }
    };

    const style = openerStyles[type] || openerStyles.stars;

    return (
        <motion.div
            exit={{ opacity: 0, scale: 1.1 }}
            className={`fixed inset-0 z-50 ${style.bg} flex flex-col items-center justify-center text-white cursor-pointer`}
            onClick={() => {
                if (onStartMusic) onStartMusic();
                onComplete();
            }}
        >
            {hasMusic && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-12 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
                >
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <Volume2 size={14} className="text-white" />
                    </motion.div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Sound Recommended</span>
                </motion.div>
            )}

            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="text-8xl mb-8"
            >
                {style.icon}
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm uppercase tracking-[0.4em] opacity-70 mb-4"
            >
                {style.text}
            </motion.p>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-5xl md:text-7xl font-bold"
            >
                {recipientName}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.7, 0] }}
                transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}
                className="absolute bottom-12 text-sm"
            >
                Tap to continue
            </motion.p>
        </motion.div>
    );
}
