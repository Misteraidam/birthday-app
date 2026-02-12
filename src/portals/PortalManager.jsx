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

    const handleOpenerComplete = () => {
        setShowOpener(false);
        setOpenerComplete(true);
        setIsPlaying(true);
    };

    return (
        <div
            className="min-h-screen relative overflow-hidden bg-[#0A0A0A]"
            style={formData.portalBg ? {
                backgroundImage: `url(${formData.portalBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            } : {}}
        >
            {/* Background Overlay to ensure readability if there is a custom image */}
            {formData.portalBg && (
                <div className="absolute inset-0 bg-black/40 z-[1] pointer-events-none" />
            )}

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
                        <TemplateComponent formData={formData} />
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
                        className="fixed inset-0 z-[100] bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 flex flex-col items-center justify-center cursor-pointer"
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
                        hasMusic={!!formData.musicUrl}
                    />
                )}
            </AnimatePresence>

            {/* Background Music Player (Global) - High Visibility positioning */}
            {formData.musicUrl && (
                <>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 bg-black/80 hover:bg-black/90 p-2 pr-4 rounded-full border border-white/20 backdrop-blur-xl transition-all group scale-100 md:scale-110 shadow-2xl`}
                    >
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center">
                            {isPlaying ? <Volume2 size={18} className="text-white animate-pulse" /> : <VolumeX size={18} className="text-white/50" />}
                        </div>
                        <div className="flex flex-col items-start pr-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/50 leading-none mb-1">Background</span>
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

            {/* High Visibility Sound Prompt - Always on top */}
            <AnimatePresence>
                {!showOpener && !isPlaying && showSoundPrompt && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="fixed inset-x-0 bottom-12 md:bottom-auto md:top-24 flex justify-center z-[10000] px-6 pointer-events-none"
                    >
                        <motion.button
                            onClick={() => {
                                setIsPlaying(true);
                                setShowSoundPrompt(false);
                                if (isDirectFile && audioRef.current) {
                                    audioRef.current.play();
                                }
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="pointer-events-auto flex items-center gap-5 bg-white text-black px-8 py-4 rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/20 group"
                        >
                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                                <Play size={20} fill="currentColor" />
                            </div>
                            <div className="flex flex-col items-start pr-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-0.5">Audio Detected</span>
                                <span className="font-bold text-base tracking-tight">Tap to Enable Music</span>
                            </div>
                        </motion.button>

                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -inset-2 bg-purple-500/20 blur-2xl rounded-full z-[-1]"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back Button - HIDE IN DEMO MODE */}
            {onBack && !isDemo && (
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
            onClick={onComplete}
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
