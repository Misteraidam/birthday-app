import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { CELEBRATION_TYPES } from '../config/celebrationConfig';

export default function CelebrationSelector({ selected, onSelect, onContinue, onBack }) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface mb-6"
                >
                    <span className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium">Step 1 of 5</span>
                </motion.div>

                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-balance text-foreground">
                    Choose Your Occasion
                </h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Select the type of celebration to get tailored prompts, story hints, and matching themes
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {CELEBRATION_TYPES.map((type, i) => (
                    <motion.button
                        key={type.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => onSelect(type.id)}
                        className={`relative group p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${selected === type.id
                            ? 'border-accent-warm bg-accent-soft ring-1 ring-accent-warm/20'
                            : 'border-border hover:border-muted/30 hover:bg-surface'
                            }`}
                    >
                        {/* Content */}
                        <div className="relative z-10">
                            <motion.div
                                animate={{ scale: selected === type.id ? 1.05 : 1 }}
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                                style={{
                                    background: selected === type.id ? 'var(--color-accent-soft)' : 'var(--color-surface)'
                                }}
                            >
                                {type.icon}
                            </motion.div>

                            <h3 className="font-semibold text-base mb-1 text-foreground">{type.name}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                {type.description}
                            </p>

                            {/* Default Chapters Preview */}
                            {selected === type.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-4 pt-4 border-t border-border"
                                >
                                    <p className="text-[10px] uppercase tracking-[0.15em] text-muted mb-2 font-medium">
                                        Suggested Chapters
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {type.defaultChapters.slice(0, 3).map((chapter, ci) => (
                                            <span
                                                key={ci}
                                                className="px-2.5 py-1 bg-surface border border-border rounded-full text-[11px] text-muted-foreground"
                                            >
                                                {chapter}
                                            </span>
                                        ))}
                                        {type.defaultChapters.length > 3 && (
                                            <span className="px-2 py-1 text-[11px] text-muted">
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
                                className="absolute top-4 right-4 w-7 h-7 bg-accent rounded-full flex items-center justify-center"
                            >
                                <Check size={14} className="text-background" />
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={onBack}
                    className="flex-1 py-4 bg-surface border border-border text-foreground font-medium rounded-xl hover:bg-surface-hover transition"
                >
                    Cancel
                </motion.button>
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={onContinue}
                    disabled={!selected}
                    className="flex-[2] py-4 bg-accent text-background font-semibold text-base rounded-xl flex items-center justify-center gap-2 hover:bg-accent-warm transition disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                    Continue
                    <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
            </div>
        </div>
    );
}
