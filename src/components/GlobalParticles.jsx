import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * GlobalParticles Component
 * Renders high-performance, lightweight nature-inspired effects.
 * Supports: 'snow', 'galaxy', 'petals', 'confetti', 'rain', 'birds', 'feathers', 
 *           'sparks-up', 'fireflies', 'mist', 'sunbeams', 'dandelions', 'none'
 */
export default function GlobalParticles({ type = 'none' }) {
    const particleCount = useMemo(() => {
        switch (type) {
            case 'snow': return 40;
            case 'galaxy': return 80;
            case 'petals': return 25;
            case 'confetti': return 35;
            case 'rain': return 60;
            case 'birds': return 8;
            case 'feathers': return 15;
            case 'sparks-up': return 40;
            case 'fireflies': return 20;
            case 'mist': return 5;
            case 'sunbeams': return 6;
            case 'dandelions': return 15;
            default: return 0;
        }
    }, [type]);

    if (type === 'none' || particleCount === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
            {[...Array(particleCount)].map((_, i) => (
                <Particle key={i} type={type} index={i} />
            ))}
        </div>
    );
}

function Particle({ type, index }) {
    const randomX = Math.random() * 100;
    const randomDelay = Math.random() * 10;
    const randomDuration = 10 + Math.random() * 20;
    const randomSize = 2 + Math.random() * 4;

    // Different behaviors based on type
    let variants = {};
    let style = {};
    let content = null;

    switch (type) {
        case 'snow':
            variants = {
                animate: {
                    y: ['-10vh', '110vh'],
                    x: [`${randomX}vw`, `${randomX + (Math.random() * 10 - 5)}vw`],
                    rotate: [0, 360],
                    opacity: [0, 0.8, 0],
                }
            };
            style = {
                width: randomSize,
                height: randomSize,
                background: 'white',
                borderRadius: '50%',
                filter: 'blur(1px)',
            };
            break;

        case 'galaxy':
            const isTwinkler = Math.random() > 0.7;
            variants = {
                animate: {
                    opacity: isTwinkler ? [0, 1, 0] : [0.2, 0.4, 0.2],
                    scale: isTwinkler ? [0.5, 1.2, 0.5] : [1, 1, 1],
                    x: [`${randomX}vw`, `${randomX + (Math.random() * 2 - 1)}vw`],
                    y: [`${Math.random() * 100}vh`, `${Math.random() * 100 + (Math.random() * 2 - 1)}vh`],
                }
            };
            style = {
                width: isTwinkler ? randomSize : randomSize / 2,
                height: isTwinkler ? randomSize : randomSize / 2,
                background: isTwinkler ? '#C4B5FD' : 'white',
                borderRadius: '50%',
                left: `${randomX}vw`,
                top: `${Math.random() * 100}vh`,
                boxShadow: isTwinkler ? '0 0 10px white' : 'none',
            };
            break;

        case 'petals':
            const petalColors = ['#FECDD3', '#FDA4AF', '#F9A8D4', '#F472B6'];
            variants = {
                animate: {
                    y: ['-10vh', '110vh'],
                    x: [`${randomX}vw`, `${randomX + (Math.random() * 20 - 10)}vw`],
                    rotate: [0, 720],
                    rotateY: [0, 360],
                    opacity: [0, 0.7, 0],
                }
            };
            style = {
                width: randomSize * 3,
                height: randomSize * 2,
                background: petalColors[index % petalColors.length],
                borderRadius: '40% 60% 50% 50% / 60% 40% 60% 40%',
            };
            break;

        case 'confetti':
            const confettiColors = ['#FFD700', '#FF69B4', '#00FFFF', '#7C3AED', '#FF4500'];
            variants = {
                animate: {
                    y: ['-10vh', '110vh'],
                    x: [`${randomX}vw`, `${randomX + (Math.random() * 30 - 15)}vw`],
                    rotate: [0, 1080],
                    opacity: [0, 1, 0],
                }
            };
            style = {
                width: randomSize * 2,
                height: randomSize * 2,
                background: confettiColors[index % confettiColors.length],
                borderRadius: index % 2 === 0 ? '2px' : '50%',
            };
            break;

        case 'rain':
            variants = {
                animate: {
                    y: ['-20vh', '120vh'],
                    opacity: [0, 0.4, 0],
                }
            };
            style = {
                width: '1px',
                height: 20 + Math.random() * 40,
                background: 'rgba(255, 255, 255, 0.3)',
                left: `${randomX}vw`,
            };
            break;

        case 'birds':
            variants = {
                animate: {
                    x: ['-20vw', '120vw'],
                    y: [`${30 + Math.random() * 40}vh`, `${20 + Math.random() * 60}vh`],
                    opacity: [0, 1, 0],
                }
            };
            content = (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
                    <path d="M4 10s4-2 8 0 8 0 8 0" />
                    <motion.path
                        d="M4 10s4 2 8 0 8-2 8-2"
                        animate={{ d: ["M4 10s4-2 8 0 8 0 8 0", "M4 10s4 2 8 0 8-2 8-2"] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                </svg>
            );
            style = {
                color: 'rgba(255, 255, 255, 0.5)',
            };
            break;

        case 'feathers':
            variants = {
                animate: {
                    y: ['-10vh', '110vh'],
                    x: [`${randomX}vw`, `${randomX + Math.sin(index) * 20}vw`],
                    rotate: [0, 360],
                    opacity: [0, 0.5, 0],
                }
            };
            style = {
                width: randomSize * 4,
                height: randomSize,
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '50% 50% 50% 50% / 80% 80% 20% 20%',
                filter: 'blur(1px)',
            };
            break;

        case 'sparks-up':
            variants = {
                animate: {
                    y: ['110vh', '-10vh'],
                    x: [`${randomX}vw`, `${randomX + (Math.random() * 4 - 2)}vw`],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                }
            };
            style = {
                width: 2,
                height: 2,
                background: '#FFD700',
                borderRadius: '50%',
                boxShadow: '0 0 10px #FFD700',
                left: `${randomX}vw`,
            };
            break;

        case 'fireflies':
            variants = {
                animate: {
                    x: [`${randomX}vw`, `${randomX + (Math.random() * 20 - 10)}vw`],
                    y: [`${Math.random() * 100}vh`, `${Math.random() * 100 - 20}vh`],
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.2, 0.5],
                }
            };
            style = {
                width: 4,
                height: 4,
                background: '#A3E635',
                borderRadius: '50%',
                boxShadow: '0 0 15px #A3E635',
                filter: 'blur(1px)',
            };
            break;

        case 'mist':
            variants = {
                animate: {
                    x: ['-20vw', '120vw'],
                    opacity: [0, 0.2, 0],
                }
            };
            style = {
                width: '40vw',
                height: '40vh',
                background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                bottom: `${Math.random() * 20}vh`,
                filter: 'blur(60px)',
            };
            break;

        case 'sunbeams':
            variants = {
                animate: {
                    opacity: [0, 0.15, 0],
                    rotate: [0, 45],
                }
            };
            style = {
                width: '100vw',
                height: '20vh',
                background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent)',
                top: `${index * 20}vh`,
                left: '-50vw',
                transform: 'rotate(-45deg)',
            };
            break;

        case 'dandelions':
            variants = {
                animate: {
                    y: ['110vh', '-10vh'],
                    x: [`${randomX}vw`, `${randomX + Math.sin(index) * 30}vw`],
                    rotate: [0, 360],
                    opacity: [0, 0.6, 0],
                }
            };
            style = {
                width: 6,
                height: 6,
                background: 'white',
                borderRadius: '50%',
                filter: 'blur(0.5px)',
                boxShadow: '0 0 5px white',
            };
            break;

        default: break;
    }

    return (
        <motion.div
            className="absolute"
            initial={{ y: type === 'sparks-up' || type === 'dandelions' ? '110vh' : (type === 'mist' ? undefined : '-10vh'), opacity: 0 }}
            animate={variants.animate}
            transition={{
                duration: type === 'birds' ? 8 + Math.random() * 4 :
                    type === 'sparks-up' ? 3 + Math.random() * 4 :
                        type === 'fireflies' ? 5 + Math.random() * 5 :
                            type === 'mist' ? 15 + Math.random() * 10 :
                                type === 'sunbeams' ? 4 + Math.random() * 4 :
                                    type === 'galaxy' ? 3 + Math.random() * 5 : randomDuration,
                repeat: Infinity,
                delay: randomDelay,
                ease: (type === 'galaxy' || type === 'birds' || type === 'mist') ? "easeInOut" : "linear"
            }}
            style={style}
        >
            {content}
        </motion.div>
    );
}
