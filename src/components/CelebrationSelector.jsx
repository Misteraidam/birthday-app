import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { CELEBRATION_TYPES } from '../config/celebrationConfig';

export default function CelebrationSelector({ selected, onSelect, onContinue, onBack }) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center mb-12">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
                >
                    <Sparkles size={14} className="text-purple-400" />
                    <span className="text-xs text-purple-300">Step 1 of 4</span>
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-black mb-4">
                    Choose Your Celebration
                </h2>
                <p className="text-white/50 max-w-md mx-auto">
                    Select the type of celebration to get tailored prompts, story hints, and matching themes
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CELEBRATION_TYPES.map((type, i) => (
                    <motion.button
                        key={type.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => onSelect(type.id)}
                        className={`relative group p-6 rounded-3xl border-2 text-left transition-all duration-300 overflow-hidden ${selected === type.id
                            ? 'border-white bg-white/10 scale-[1.02]'
                            : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                            }`}
                    >
                        {/* Gradient Background */}
                        <div
                            className={`absolute inset-0 opacity-20 transition-opacity ${selected === type.id ? 'opacity-30' : 'group-hover:opacity-25'
                                }`}
                            style={{ background: type.gradient }}
                        />

                        {/* Glow Effect */}
                        {selected === type.id && (
                            <motion.div
                                layoutId="celebrationGlow"
                                className="absolute inset-0 rounded-3xl"
                                style={{
                                    boxShadow: `0 0 60px ${type.color}40, inset 0 0 60px ${type.color}10`
                                }}
                            />
                        )}

                        {/* Content */}
                        <div className="relative z-10">
                            <motion.div
                                animate={{ scale: selected === type.id ? 1.1 : 1 }}
                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4"
                                style={{
                                    background: selected === type.id ? type.gradient : 'rgba(255,255,255,0.1)'
                                }}
                            >
                                {type.icon}
                            </motion.div>

                            <h3 className="font-bold text-lg mb-2">{type.name}</h3>
                            <p className="text-sm text-white/50 leading-relaxed">
                                {type.description}
                            </p>

                            {/* Default Chapters Preview */}
                            {selected === type.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-4 pt-4 border-t border-white/10"
                                >
                                    <p className="text-xs uppercase tracking-wider text-white/40 mb-2">
                                        Suggested Chapters
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {type.defaultChapters.slice(0, 3).map((chapter, ci) => (
                                            <span
                                                key={ci}
                                                className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70"
                                            >
                                                {chapter}
                                            </span>
                                        ))}
                                        {type.defaultChapters.length > 3 && (
                                            <span className="px-2 py-1 text-xs text-white/40">
                                                +{type.defaultChapters.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Selected Checkmark */}
                        {selected === type.id && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center"
                            >
                                <span className="text-black text-sm">✓</span>
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={onBack}
                    className="flex-1 py-5 bg-white/5 text-white/60 font-bold text-lg rounded-2xl hover:bg-white/10 transition"
                >
                    Cancel
                </motion.button>
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={onContinue}
                    disabled={!selected}
                    className="flex-[2] py-5 bg-white text-black font-bold text-lg rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 transition disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                    Continue
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        </div>
    );
}
