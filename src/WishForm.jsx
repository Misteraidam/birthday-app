import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
    ChevronRight, ChevronLeft, Plus, Image, X, Mic, StopCircle,
    Edit2, Play, Download, Upload, Video, Music, Lock, Eye, EyeOff,
    Calendar, GripVertical, Trash2, MessageSquare, ArrowLeft, Check,
    Clock, Key, Scroll, Volume2, VolumeX, Camera, Pause, ExternalLink, Sparkles
} from 'lucide-react';
import { CELEBRATION_TYPES, TEMPLATES, STORY_TEMPLATES, getCelebrationType, getTemplatesForCelebration, getMusicInLibrary } from './config/celebrationConfig';
import CelebrationSelector from './components/CelebrationSelector';
import PortalManager from './portals/PortalManager';
// TODO: Re-enable payment when ready
// import PaymentModal from './components/PaymentModal';

import { supabase } from './config/supabaseClient';
import heic2any from 'heic2any';
import { v4 as uuidv4 } from 'uuid';
import ChapterEditor from './components/ChapterEditor';

export default function WishForm({ onGenerate, onBack, initialCelebrationType }) {
    // Multi-step form control (0: Celebration, 1: Details, 2: Chapters, 3: Template, 4: Preview)
    const [step, setStep] = useState(initialCelebrationType ? 1 : 0);
    const [musicSearch, setMusicSearch] = useState('');
    const [musicResults, setMusicResults] = useState([]);
    const [isSearchingMusic, setIsSearchingMusic] = useState(false);
    const [activePreview, setActivePreview] = useState(null);
    const audioRef = useRef(null);

    // Form data state
    const [formData, setFormData] = useState({
        celebrationType: initialCelebrationType || null,
        recipientName: "",
        senderName: "",
        birthday: "",
        portalBg: null,
        musicUrl: "",
        secretMessage: "",
        chapters: [],
        template: null,
        opener: 'none',
        customOccasion: ""
    });

    // Current chapter being edited
    const [currentChapter, setCurrentChapter] = useState({
        id: null,
        title: "",
        content: "",
        media: [],
        videoMessage: null,
        voiceNote: null,
        musicUrl: "",
        messageAnchors: [],
    });

    // Recording states
    const [isRecordingAudio, setIsRecordingAudio] = useState(false);
    const [isRecordingVideo, setIsRecordingVideo] = useState(false);
    const [audioRecorder, setAudioRecorder] = useState(null);
    const [videoRecorder, setVideoRecorder] = useState(null);
    const videoPreviewRef = useRef(null);
    const [editingChapterId, setEditingChapterId] = useState(null);
    // TODO: Re-enable when payment is ready
    // const [showPayment, setShowPayment] = useState(false);

    // Initialize with celebration type defaults
    useEffect(() => {
        if (formData.celebrationType && formData.chapters.length === 0) {
            const celebType = getCelebrationType(formData.celebrationType);
            const defaultChapters = celebType.defaultChapters.map((ch, i) => ({
                id: Date.now() + i,
                title: ch.title,
                content: "",
                hint: ch.hint, // Store hint for placeholder
                media: [],
                videoMessage: null,
                voiceNote: null,
                musicUrl: "",
                messageAnchors: [],
            }));
            setFormData(prev => ({
                ...prev,
                chapters: defaultChapters,
                template: celebType.primaryTheme || prev.template
            }));
        }
    }, [formData.celebrationType]);

    const celebrationConfig = getCelebrationType(formData.celebrationType);
    const availableTemplates = formData.celebrationType
        ? getTemplatesForCelebration(formData.celebrationType)
        : TEMPLATES;

    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [pendingUploads, setPendingUploads] = useState(0);

    // Watch pending uploads to close overlay
    useEffect(() => {
        if (pendingUploads === 0 && isUploading) {
            setIsUploading(false);
            setUploadStatus('');
        }
    }, [pendingUploads]);

    // --- COMPRESSION HELPER (Optimized with HEIC support) ---
    const compressImage = async (file, maxWidth = 1200, quality = 0.6) => {
        return new Promise(async (resolve, reject) => {
            let processingFile = file;

            // Handle HEIC/HEIF (iPhones)
            if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic')) {
                try {
                    setUploadStatus('Converting HEIC...');
                    const convertedBlob = await heic2any({
                        blob: file,
                        toType: 'image/jpeg',
                        quality: quality
                    });
                    processingFile = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                } catch (err) {
                    console.error("HEIC conversion failed:", err);
                    // Fallback: try to process as normal, but likely will fail
                }
            }

            const url = URL.createObjectURL(processingFile);
            const img = new window.Image();
            img.src = url;
            img.onload = () => {
                URL.revokeObjectURL(url);
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((resultBlob) => {
                    resolve(resultBlob);
                }, 'image/jpeg', quality);
            };
            img.onerror = (err) => {
                URL.revokeObjectURL(url);
                reject(err);
            };
        });
    };

    // --- UPLOAD HELPER (Direct to Supabase - Refactored for concurrency) ---
    const uploadToCloud = async (blob, filename) => {
        try {
            setPendingUploads(prev => prev + 1);
            setIsUploading(true);

            // Sanitize filename for Supabase Storage
            const sanitizedName = (filename || 'upload.bin').replace(/[^a-zA-Z0-9.-]/g, '_');
            const uniqueFilename = `${Date.now()}-${sanitizedName}`;

            const { data, error } = await supabase.storage
                .from('portals')
                .upload(uniqueFilename, blob, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            const { data: urlData } = supabase.storage
                .from('portals')
                .getPublicUrl(uniqueFilename);

            return urlData.publicUrl;

        } catch (e) {
            console.error("Upload error:", e);
            alert("Error uploading media: " + e.message);
            return null;
        } finally {
            setPendingUploads(prev => Math.max(0, prev - 1));
        }
    };

    // --- AUDIO RECORDING ---
    const startAudioRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const url = await uploadToCloud(blob, `audio-${Date.now()}.webm`);
                if (url) setCurrentChapter(prev => ({ ...prev, voiceNote: url }));
            };

            recorder.start();
            setAudioRecorder(recorder);
            setIsRecordingAudio(true);
        } catch (err) {
            console.error("Mic access denied:", err);
            alert("Could not access microphone! Please check permissions.");
        }
    };

    const stopAudioRecording = () => {
        if (audioRecorder) {
            audioRecorder.stop();
            setIsRecordingAudio(false);
            audioRecorder.stream.getTracks().forEach(track => track.stop());
            setAudioRecorder(null);
        }
    };

    // --- VIDEO RECORDING ---
    const startVideoRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            if (videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = stream;
                videoPreviewRef.current.play();
            }

            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            const chunks = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                const url = await uploadToCloud(blob, `video-${Date.now()}.webm`);
                if (url) setCurrentChapter(prev => ({ ...prev, videoMessage: url }));
                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            setVideoRecorder(recorder);
            setIsRecordingVideo(true);
        } catch (err) {
            console.error("Camera access denied:", err);
            alert("Could not access camera! Please check permissions.");
        }
    };

    const stopVideoRecording = () => {
        if (videoRecorder) {
            videoRecorder.stop();
            setIsRecordingVideo(false);
            setVideoRecorder(null);
        }
    };

    // --- CHAPTER MANAGEMENT ---
    const saveChapter = () => {
        if (!currentChapter.title) return;

        if (editingChapterId) {
            setFormData(prev => ({
                ...prev,
                chapters: prev.chapters.map(ch =>
                    ch.id === editingChapterId ? { ...currentChapter, id: editingChapterId } : ch
                )
            }));
            setEditingChapterId(null);
        } else {
            setFormData(prev => ({
                ...prev,
                chapters: [...prev.chapters, { ...currentChapter, id: `ch-${Date.now()}` }]
            }));
        }

        resetCurrentChapter();
    };

    const editChapter = (chapter) => {
        setCurrentChapter(chapter);
        setEditingChapterId(chapter.id);
    };

    const deleteChapter = (id) => {
        setFormData(prev => ({
            ...prev,
            chapters: prev.chapters.filter(ch => ch.id !== id)
        }));
        if (editingChapterId === id) {
            resetCurrentChapter();
        }
    };

    const resetCurrentChapter = () => {
        setCurrentChapter({
            id: null,
            title: "",
            content: "",
            media: [],
            videoMessage: null,
            voiceNote: null,
            musicUrl: "",
            messageAnchors: [],
            revealSettings: { type: 'always', value: null }
        });
        setEditingChapterId(null);
    };

    // --- IMAGE HANDLING ---
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadStatus('Processing...');
        try {
            const successfulUploads = [];

            // Process uploads SEQUENTIALLY for mobile stability
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                try {
                    setUploadStatus(`Processing ${i + 1}/${files.length}...`);
                    const compressedBlob = await compressImage(file);

                    setUploadStatus(`Uploading ${i + 1}/${files.length}...`);
                    const url = await uploadToCloud(compressedBlob, file.name || `image-${Date.now()}.jpg`);

                    if (url) {
                        successfulUploads.push({ type: 'image', data: url, anchor: null });
                    }
                } catch (err) {
                    console.error(`Error processing file ${i}:`, err);
                    alert(`Failed to upload ${file.name || 'image'}. It might be too large or an unsupported format.`);
                }
            }

            if (successfulUploads.length > 0) {
                setCurrentChapter(prev => ({
                    ...prev,
                    media: [...prev.media, ...successfulUploads]
                }));
            }
        } catch (err) {
            console.error("Batch upload error", err);
        } finally {
            setUploadStatus(null);
        }
    };

    const removeMedia = (index) => {
        setCurrentChapter(prev => ({
            ...prev,
            media: prev.media.filter((_, i) => i !== index)
        }));
    };

    // --- EXPORT/IMPORT ---
    const exportData = () => {
        const dataStr = JSON.stringify(formData);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportName = `${formData.recipientName || 'celebration'}_portal.json`;

        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', exportName);
        link.click();
    };

    const importData = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                setFormData(importedData);
                alert("Portal loaded successfully!");
            } catch (err) {
                alert("Invalid file format");
            }
        };
        reader.readAsText(file);
    };

    // --- GENERATE HANDLER ---
    const handleGenerateClick = () => {
        if (!formData.recipientName) {
            alert("Please enter the recipient's name!");
            setStep(1);
            return;
        }
        if (formData.chapters.length === 0) {
            alert("Please add at least one chapter!");
            setStep(2);
            return;
        }
        // TODO: Re-enable payment when ready
        // setShowPayment(true);
        // For now, skip payment and generate directly
        onGenerate(formData);
    };

    // TODO: Re-enable when payment is ready
    // const handlePaymentSuccess = (paymentDetails) => {
    //     setShowPayment(false);
    //     const dataWithPayment = {
    //         ...formData,
    //         payment: paymentDetails
    //     };
    //     onGenerate(dataWithPayment);
    // };

    // --- MUSIC SEARCH ---
    const searchMusic = async (query) => {
        if (!query || query.length < 2) return;
        setIsSearchingMusic(true);
        try {
            // Use our own server-side proxy to avoid CORS/Network issues on mobile
            const response = await fetch(`/api/music_search?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error("Search failed");

            const json = await response.json();
            setMusicResults(json.results || []);
        } catch (err) {
            console.error("Music search failed:", err);
            // alert("Tips: Try a simpler search term"); // Optional feedback
        } finally {
            setIsSearchingMusic(false);
        }
    };

    const toggleMusicPreview = (track) => {
        if (activePreview?.trackId === track.trackId) {
            audioRef.current.pause();
            setActivePreview(null);
        } else {
            setActivePreview(track);
            // Small timeout to ensure src is updated before playing
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.src = track.previewUrl;
                    audioRef.current.play().catch(e => console.error("Playback failed:", e));
                }
            }, 50);
        }
    };

    const selectMusic = (track) => {
        setFormData(prev => ({ ...prev, musicUrl: track.previewUrl }));
        setMusicResults([]);
        setMusicSearch("");
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setActivePreview(null);
    };

    const canAccessStep = (target) => {
        if (target <= step) return true;
        if (target === 1) return !!formData.celebrationType;
        if (target === 2) return !!formData.celebrationType && !!formData.recipientName;
        if (target === 3) return !!formData.celebrationType && !!formData.recipientName && formData.chapters.length > 0;
        if (target === 4) return !!formData.celebrationType && !!formData.recipientName && formData.chapters.length > 0 && !!formData.template;
        return false;
    };

    // --- STEP LABELS ---
    // Theme selection is now available for ALL celebration types
    const steps = [
        { num: 1, label: 'Occasion', target: 0 },
        { num: 2, label: 'Basics', target: 1 },
        { num: 3, label: 'Story', target: 2 },
        { num: 4, label: 'Theme', target: 3 },
        { num: 5, label: 'Review', target: 4 }
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-purple-500 selection:text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => {
                            if (step > 0) setStep(step - 1);
                            else onBack();
                        }}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition"
                    >
                        <ArrowLeft size={18} />
                        <span className="hidden md:inline text-sm font-medium">Back</span>
                    </button>

                    {/* Step Indicator — shows label on active step for mobile */}
                    <div className="flex items-center gap-1 md:gap-2">
                        {steps.map((s, i) => (
                            <React.Fragment key={s.num}>
                                <button
                                    onClick={() => setStep(s.target)}
                                    disabled={!canAccessStep(s.target)}
                                    className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 rounded-full text-xs font-bold transition ${step === s.target
                                        ? 'bg-white text-black'
                                        : step > s.target
                                            ? 'bg-purple-500/30 text-purple-300'
                                            : 'bg-white/10 text-white/40'
                                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                                >
                                    {step > i ? <Check size={12} /> : s.num}
                                    {/* Show label on desktop always, on mobile only for active step */}
                                    <span className={`text-[10px] md:text-xs ${step === s.target ? 'inline' : 'hidden md:inline'}`}>{s.label}</span>
                                </button>
                                {i < steps.length - 1 && (
                                    <div className={`w-4 md:w-8 h-0.5 ${step > i ? 'bg-purple-500/50' : 'bg-white/10'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Tools */}
                    <div className="flex gap-2">
                        <label className="cursor-pointer p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition">
                            <Upload size={16} />
                            <input type="file" accept=".json" className="hidden" onChange={importData} />
                        </label>
                        <button
                            onClick={exportData}
                            className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition"
                        >
                            <Download size={16} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Uploading Overlay */}
            <AnimatePresence>
                {isUploading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-6"
                    >
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full"></div>
                            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-white font-bold tracking-widest uppercase text-xs">{uploadStatus}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="pt-20 pb-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        {/* Step 0: Celebration Type Selection */}
                        {step === 0 && (
                            <motion.div
                                key="step-0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <CelebrationSelector
                                    selected={formData.celebrationType}
                                    onSelect={(type) => {
                                        setFormData(prev => ({ ...prev, celebrationType: type }));
                                        // Auto-advance with delay for visual feedback
                                        setTimeout(() => setStep(1), 600);
                                    }}
                                    onContinue={() => setStep(1)}
                                    onBack={onBack}
                                />
                            </motion.div>
                        )}

                        {/* Step 1: Basic Details */}
                        {step === 1 && (
                            <motion.div
                                key="step-1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                                        style={{ background: celebrationConfig?.gradient || 'rgba(255,255,255,0.1)' }}
                                    >
                                        <span className="text-lg">{celebrationConfig?.icon}</span>
                                        <span className="text-xs font-bold">{celebrationConfig?.name}</span>
                                    </motion.div>

                                    <h2 className="text-4xl md:text-5xl font-black mb-4">Who's this for?</h2>
                                    <p className="text-white/50">Let's personalize their experience</p>
                                </div>

                                {/* Recipient Name */}
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-8">
                                    <label className="text-[10px] md:text-xs uppercase tracking-wider text-white/40 block mb-4">
                                        Recipient's Name *
                                    </label>
                                    <input
                                        className="w-full bg-transparent text-2xl md:text-5xl font-bold outline-none placeholder:text-white/30 text-white"
                                        placeholder="Enter their name..."
                                        value={formData.recipientName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                                        autoFocus
                                    />
                                </div>

                                {/* Custom Occasion Type (Only for 'custom' type) */}
                                {formData.celebrationType === 'custom' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-6 md:p-8"
                                    >
                                        <label className="text-[10px] md:text-xs uppercase tracking-wider text-purple-400 block mb-4 flex items-center gap-2">
                                            <Sparkles size={14} /> What are we celebrating?
                                        </label>
                                        <input
                                            className="w-full bg-transparent text-xl md:text-4xl font-bold outline-none placeholder:text-white/10 text-white"
                                            placeholder="e.g. New Home, Promotion, Graduation..."
                                            value={formData.customOccasion}
                                            onChange={(e) => setFormData(prev => ({ ...prev, customOccasion: e.target.value }))}
                                        />
                                        <p className="text-[10px] text-white/30 mt-2 font-medium tracking-wide">THIS WILL BE THE MAIN HEADING IN THE PORTAL</p>
                                    </motion.div>
                                )}

                                {/* Story Vibe Selection */}
                                <div className="bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-6 md:p-8">
                                    <label className="text-[10px] md:text-xs uppercase tracking-wider text-purple-400 block mb-4 flex items-center gap-2">
                                        <Sparkles size={14} /> Choose the Story Vibe
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {(STORY_TEMPLATES[celebrationConfig?.id] || STORY_TEMPLATES.default).map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => {
                                                    const newChapters = t.chapters.map(c => ({
                                                        ...c,
                                                        id: uuidv4(),
                                                        media: [],
                                                        voiceNote: null,
                                                        videoMessage: null
                                                    }));
                                                    setFormData(prev => ({ ...prev, chapters: newChapters, storyTemplate: t.id }));
                                                }}
                                                className={`p-4 rounded-xl border text-left transition relative overflow-hidden group ${formData.storyTemplate === t.id
                                                    ? 'bg-purple-500 border-purple-400 text-white'
                                                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white'
                                                    }`}
                                            >
                                                <div className="text-2xl mb-2">{t.icon}</div>
                                                <div className="font-bold text-sm mb-1">{t.label}</div>
                                                <div className="text-[10px] opacity-60 leading-tight">{t.description}</div>
                                                {formData.storyTemplate === t.id && (
                                                    <div className="absolute top-2 right-2 bg-white text-purple-600 rounded-full p-0.5">
                                                        <Check size={10} strokeWidth={4} />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sender Name & Date */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
                                        <label className="text-xs uppercase tracking-wider text-white/40 block mb-3">
                                            From (Your Name)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter your name..."
                                            className="w-full bg-transparent text-xl font-bold outline-none placeholder:text-white/20 text-white"
                                            value={formData.senderName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, senderName: e.target.value }))}
                                        />
                                    </div>

                                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 relative group hover:border-white/20 transition">
                                        <label className="text-xs uppercase tracking-wider text-white/40 block mb-3 pointer-events-none">
                                            Special Date {celebrationConfig?.id === 'birthday' && '🎂'}
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full bg-transparent text-xl font-bold outline-none [color-scheme:dark] cursor-pointer text-white"
                                            value={formData.birthday || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
                                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                        />
                                    </div>
                                </div>

                                {/* Background Music */}
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
                                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><Music size={14} /> Background Music</div>
                                        {formData.musicUrl && <span className="text-[10px] text-green-400 font-bold">✓ Track Selected</span>}
                                    </label>

                                    {/* Mood Suggestion */}
                                    <div className="mb-6">
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3 font-black">Search World Music Library (iTunes)</p>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                searchMusic(musicSearch);
                                            }}
                                            className="flex gap-2"
                                        >
                                            <div className="relative flex-1">
                                                <input
                                                    type="search"
                                                    placeholder="Search song or artist..."
                                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-sm outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10 text-white"
                                                    value={musicSearch}
                                                    onChange={(e) => setMusicSearch(e.target.value)}
                                                    enterKeyHint="search"
                                                />
                                                <button
                                                    type="submit"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-purple-500 rounded-xl text-[10px] font-bold hover:bg-purple-600 transition-colors"
                                                >
                                                    {isSearchingMusic ? '...' : 'Search'}
                                                </button>
                                            </div>
                                        </form>

                                        {/* Search Results */}
                                        <AnimatePresence>
                                            {musicResults.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar"
                                                >
                                                    {musicResults.map(track => (
                                                        <div
                                                            key={track.trackId || track.id}
                                                            className={`p-3 rounded-2xl border flex items-center justify-between gap-4 transition-all ${formData.musicUrl === track.previewUrl
                                                                ? 'bg-purple-500/20 border-purple-500'
                                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative group">
                                                                    <img src={track.artworkUrl100} alt="" className="w-full h-full object-cover opacity-60" />
                                                                    <button
                                                                        onClick={() => toggleMusicPreview(track)}
                                                                        className="absolute inset-0 flex items-center justify-center bg-black/40 text-white"
                                                                    >
                                                                        {activePreview?.trackId === track.trackId ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
                                                                    </button>
                                                                </div>
                                                                <div className="overflow-hidden">
                                                                    <p className="text-xs font-black truncate">{track.trackName}</p>
                                                                    <p className="text-[10px] text-white/40 truncate">{track.artistName}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => selectMusic(track)}
                                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${formData.musicUrl === track.previewUrl
                                                                    ? 'bg-green-500 text-white'
                                                                    : 'bg-white/10 text-white/60 hover:bg-white'
                                                                    }`}
                                                            >
                                                                {formData.musicUrl === track.previewUrl ? 'Selected' : 'Select'}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Audio Preview Element (Persistent) */}
                                        <audio
                                            ref={audioRef}
                                            className="hidden"
                                            onEnded={() => setActivePreview(null)}
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3 font-black">Quick Recommendations</p>
                                        <div className="flex flex-wrap gap-2">
                                            {getMusicInLibrary(celebrationConfig?.musicMood || 'joyful').map(track => (
                                                <button
                                                    key={track.id}
                                                    onClick={() => setFormData(prev => ({ ...prev, musicUrl: track.url }))}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${formData.musicUrl === track.url
                                                        ? 'bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/20'
                                                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {track.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Custom URL */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Or use your own link (YouTube/SoundCloud/MP3)</p>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                placeholder="Paste URL here..."
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-sm font-medium outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10 font-mono text-white"
                                                value={formData.musicUrl || ""}
                                                onChange={(e) => setFormData({ ...formData, musicUrl: e.target.value })}
                                            />
                                            {formData.musicUrl && (
                                                <button
                                                    onClick={() => window.open(formData.musicUrl, '_blank')}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition"
                                                    title="Test Link"
                                                >
                                                    <ExternalLink size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2 text-[10px] text-white/30 italic">
                                        <Sparkles size={10} className="text-yellow-500" />
                                        <span>Testing is recommended! Some YouTube songs are restricted for embedding.</span>
                                    </div>
                                </div>

                                {/* Cover Image */}
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
                                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-4">
                                        Cover Image (Optional)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        {formData.portalBg ? (
                                            <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                                                <img src={formData.portalBg} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => setFormData(prev => ({ ...prev, portalBg: null }))}
                                                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-white/40 transition">
                                                <Image size={24} className="text-white/30" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (!file) return;

                                                        try {
                                                            setUploadStatus('Compressing Cover...');
                                                            const compressedBlob = await compressImage(file);
                                                            setUploadStatus('Uploading Cover...');
                                                            const url = await uploadToCloud(compressedBlob, file.name);
                                                            if (url) {
                                                                setFormData(prev => ({ ...prev, portalBg: url }));
                                                            }
                                                        } catch (err) {
                                                            console.error("Cover upload failed", err);
                                                            alert("Failed to upload cover image");
                                                        } finally {
                                                            setUploadStatus(null);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        )}
                                        <p className="text-sm text-white/40">Leave empty for auto-generated gradient</p>
                                    </div>
                                </div>

                                {/* Navigation */}
                                <div className="mt-12 mb-8">
                                    <div className="flex gap-4 max-w-4xl mx-auto">
                                        <button
                                            onClick={() => setStep(0)}
                                            className="flex-1 py-4 md:py-5 bg-white/10 text-white font-bold rounded-xl md:rounded-2xl hover:bg-white/20 transition flex items-center justify-center gap-2 text-sm md:text-base"
                                        >
                                            <ChevronLeft size={20} /> Back
                                        </button>
                                        <button
                                            onClick={() => canAccessStep(2) && setStep(2)}
                                            disabled={!canAccessStep(2)}
                                            className="flex-[2] py-4 md:py-5 bg-white text-black font-bold text-sm md:text-lg rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            Continue <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Story Chapters */}
                        {step === 2 && (
                            <motion.div
                                key="step-2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl md:text-5xl font-black mb-4">Build Your Story</h2>
                                    <p className="text-white/50">
                                        Craft chapters filled with memories for {formData.recipientName}
                                    </p>
                                </div>

                                {/* Chapters List */}
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">
                                            Chapters ({formData.chapters.length})
                                        </h3>
                                    </div>

                                    <AnimatePresence mode="popLayout">
                                        {formData.chapters.length > 0 ? (
                                            <Reorder.Group
                                                axis="y"
                                                values={formData.chapters}
                                                onReorder={(newOrder) => setFormData(prev => ({ ...prev, chapters: newOrder }))}
                                                className="space-y-2"
                                                key="chapter-list"
                                            >
                                                {formData.chapters.map((chapter) => (
                                                    <Reorder.Item
                                                        key={chapter.id}
                                                        value={chapter}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className={`bg-white/5 border rounded-xl p-4 flex items-center gap-4 cursor-move ${editingChapterId === chapter.id
                                                            ? 'border-purple-500 bg-purple-500/10'
                                                            : 'border-white/10'
                                                            }`}
                                                    >
                                                        <GripVertical size={16} className="text-white/30 flex-shrink-0" />

                                                        <div className="flex-1 min-w-0" onClick={() => editChapter(chapter)}>
                                                            <p className="font-medium truncate">{chapter.title}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {chapter.media.length > 0 && (
                                                                    <span className="text-xs text-white/40 flex items-center gap-1">
                                                                        <Image size={10} /> {chapter.media.length}
                                                                    </span>
                                                                )}
                                                                {chapter.voiceNote && (
                                                                    <span className="text-xs text-green-400 flex items-center gap-1">
                                                                        <Mic size={10} /> Voice
                                                                    </span>
                                                                )}
                                                                {chapter.videoMessage && (
                                                                    <span className="text-xs text-blue-400 flex items-center gap-1">
                                                                        <Video size={10} /> Video
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => editChapter(chapter)}
                                                                className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteChapter(chapter.id)}
                                                                className="p-2 hover:bg-red-500/20 rounded-lg text-white/60 hover:text-red-400"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </Reorder.Item>
                                                ))}
                                            </Reorder.Group>
                                        ) : (
                                            <motion.div
                                                key="empty-state"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="text-center py-8 text-white/40"
                                            >
                                                <p>No chapters yet. Add your first chapter below!</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Chapter Editor Component - extracted for cleaner architecture */}
                                <ChapterEditor
                                    chapter={currentChapter}
                                    onChange={setCurrentChapter}
                                    onSave={saveChapter}
                                    onReset={resetCurrentChapter}
                                    isEditing={!!editingChapterId}
                                    mediaHandlers={{
                                        removeMedia,
                                        handleImageUpload,
                                        startAudio: startAudioRecording,
                                        stopAudio: stopAudioRecording,
                                        startVideo: startVideoRecording,
                                        stopVideo: stopVideoRecording,
                                        clearVoice: () => setCurrentChapter(prev => ({ ...prev, voiceNote: null })),
                                        clearVideo: () => setCurrentChapter(prev => ({ ...prev, videoMessage: null }))
                                    }}
                                    recordingState={{
                                        isRecordingAudio,
                                        isRecordingVideo
                                    }}
                                    videoRef={videoPreviewRef}
                                />

                                {/* Navigation */}
                                <div className="mt-12 mb-8">
                                    <div className="flex gap-4 max-w-4xl mx-auto">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="flex-1 py-4 md:py-5 bg-white/10 text-white font-bold rounded-xl md:rounded-2xl hover:bg-white/20 transition flex items-center justify-center gap-2 text-sm md:text-base"
                                        >
                                            <ChevronLeft size={20} /> Back
                                        </button>
                                        <button
                                            onClick={() => canAccessStep(3) && setStep(3)}
                                            disabled={!canAccessStep(3)}
                                            className="flex-[2] py-4 md:py-5 bg-white text-black font-bold text-sm md:text-lg rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            Continue <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Template Selection */}
                        {step === 3 && (
                            <motion.div
                                key="step-3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl md:text-5xl font-black mb-4">Choose Your Theme</h2>
                                    <p className="text-white/50">Pick the perfect look for {formData.recipientName}'s story</p>
                                </div>

                                {/* Template Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {TEMPLATES.map((template, i) => (
                                        <motion.button
                                            key={template.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => setFormData({
                                                ...formData,
                                                template: template.id,
                                                opener: template.defaultOpener || 'none'
                                            })}
                                            className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden h-48 ${formData.template === template.id
                                                ? 'border-white scale-[1.02] shadow-2xl'
                                                : 'border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <div className={`absolute inset-0 ${template.preview} opacity-40`} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                            <div className="relative z-10 h-full flex flex-col justify-end">
                                                <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                                                <p className="text-xs text-white/60 line-clamp-2">{template.description}</p>
                                            </div>

                                            {formData.template === template.id && (
                                                <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                                    <Check size={14} className="text-black" />
                                                </div>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>



                                {/* Final Message */}
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-4 flex items-center gap-2">
                                        <Lock size={14} /> Final Message
                                    </label>
                                    <textarea
                                        placeholder="Write a heartfelt closing message..."
                                        className="w-full bg-transparent border-none rounded-xl p-0 h-32 outline-none text-lg resize-none"
                                        value={formData.secretMessage}
                                        onChange={(e) => setFormData(prev => ({ ...prev, secretMessage: e.target.value }))}
                                    />
                                </div>

                                {/* Navigation */}
                                <div className="mt-12 mb-8">
                                    <div className="flex gap-4 max-w-4xl mx-auto">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="flex-1 py-4 md:py-5 bg-white/10 text-white font-bold rounded-xl md:rounded-2xl hover:bg-white/20 transition flex items-center justify-center gap-2 text-sm md:text-base"
                                        >
                                            <ChevronLeft size={20} /> Back
                                        </button>
                                        <button
                                            onClick={() => canAccessStep(4) && setStep(4)}
                                            disabled={!canAccessStep(4)}
                                            className="flex-[2] py-4 md:py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-sm md:text-lg rounded-xl md:rounded-2xl hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <Eye size={20} /> Preview Story
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {/* Step 4: Live Preview */}
                        {step === 4 && (
                            <motion.div
                                key="step-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[60] bg-[#0A0A0A] flex flex-col"
                            >
                                {/* Preview Header Overlay - Repositioned for visibility */}
                                <div className="absolute top-10 inset-x-0 z-[70] px-6 md:px-12 pointer-events-none">
                                    <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
                                        <button
                                            onClick={() => setStep(3)}
                                            className="px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full font-bold text-white hover:bg-black/80 transition flex items-center gap-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] active:scale-95"
                                        >
                                            <ArrowLeft size={18} /> <span>Back to Edit</span>
                                        </button>

                                        <div className="hidden md:flex items-center gap-3 bg-black/40 backdrop-blur-lg px-5 py-2.5 rounded-full border border-white/10">
                                            <div className="bg-purple-500/20 p-1.5 rounded-lg">
                                                <Eye size={16} className="text-purple-400" />
                                            </div>
                                            <div>
                                                <h2 className="font-black text-sm uppercase tracking-widest">Preview</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* The Actual Portal Preview */}
                                <div className="flex-1 overflow-auto">
                                    <PortalManager formData={formData} />
                                </div>

                                {/* Preview Footer Action */}
                                <div className="p-8 bg-gradient-to-t from-black to-transparent pointer-events-none">
                                    <div className="max-w-xl mx-auto pointer-events-auto">
                                        <button
                                            onClick={handleGenerateClick}
                                            className="w-full py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-black text-xl rounded-2xl shadow-2xl shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-3"
                                        >
                                            <Sparkles size={24} /> Confirm & Generate Link
                                        </button>
                                        <p className="text-center text-white/40 text-xs mt-4">
                                            Tip: Test the interactive content before sharing!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>



            {/* TODO: Re-enable Payment Modal when ready */}
            {/* <PaymentModal
                show={showPayment}
                onClose={() => setShowPayment(false)}
                onSuccess={handlePaymentSuccess}
                amount={10} // 10 GHS
            /> */}
        </div >
    );
}