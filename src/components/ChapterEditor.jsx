import React from 'react';
import { X, Plus, Mic, StopCircle, Camera, Check, Video } from 'lucide-react';

export default function ChapterEditor({
    chapter,
    onChange,
    onSave,
    onReset,
    isEditing,
    mediaHandlers,
    recordingState,
    videoRef
}) {
    const {
        removeMedia,
        handleImageUpload,
        startAudio,
        stopAudio,
        startVideo,
        stopVideo,
        clearVoice,
        clearVideo
    } = mediaHandlers;

    const { isRecordingAudio, isRecordingVideo } = recordingState;

    return (
        <div className={`bg-transparent p-0 space-y-6 relative overflow-hidden ${isEditing ? 'px-6 py-6 pb-8' : 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8'}`}>
            {isEditing && (
                <div className="absolute top-0 inset-x-0 h-1 bg-purple-500 animate-pulse" />
            )}

            {!isEditing && (
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">
                        Add New Chapter
                    </h3>
                </div>
            )}

            {/* Chapter Title */}
            <input
                placeholder="Chapter Title..."
                className="w-full bg-white/5 border border-white/10 text-xl font-bold outline-none p-4 rounded-xl focus:border-purple-500 transition text-white"
                value={chapter.title}
                onChange={(e) => onChange({ ...chapter, title: e.target.value })}
            />

            {/* Chapter Content */}
            <textarea
                placeholder={chapter.hint || "Tell the story..."}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl h-32 focus:border-purple-500 outline-none transition resize-none items-start text-white"
                value={chapter.content}
                onChange={e => onChange({ ...chapter, content: e.target.value })}
            />

            {/* Media Upload */}
            <div>
                <label className="text-xs uppercase tracking-wider text-white/40 block mb-3">
                    Photos & Media
                </label>
                <div className="flex flex-wrap gap-3">
                    {chapter.media.map((item, i) => (
                        <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden group">
                            <img src={item.data} alt="" className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeMedia(i)}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ))}
                    <label className="w-24 h-24 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 transition bg-black/20">
                        <Plus size={20} className="text-white/30 mb-1" />
                        <span className="text-xs text-white/30">Add</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </label>
                </div>
            </div>

            {/* Voice Note */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${chapter.voiceNote ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'
                        }`}>
                        <Mic size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-sm">Voice Note</p>
                        <p className="text-xs text-white/40">
                            {chapter.voiceNote ? 'Audio recorded' : 'Add a voice message'}
                        </p>
                    </div>
                </div>

                {isRecordingAudio ? (
                    <button
                        onClick={stopAudio}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full font-bold text-xs flex items-center gap-2 animate-pulse"
                    >
                        <StopCircle size={14} /> Stop
                    </button>
                ) : (
                    <div className="flex gap-2">
                        {chapter.voiceNote && (
                            <button
                                onClick={clearVoice}
                                className="p-2 hover:bg-white/10 rounded-full text-white/40"
                            >
                                <X size={14} />
                            </button>
                        )}
                        <button
                            onClick={startAudio}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full font-bold text-xs flex items-center gap-2"
                        >
                            <Mic size={14} /> {chapter.voiceNote ? 'Re-record' : 'Record'}
                        </button>
                    </div>
                )}
            </div>

            {/* Video Message */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${chapter.videoMessage ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/40'
                            }`}>
                            <Video size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Video Message</p>
                            <p className="text-xs text-white/40">Record a personal video</p>
                        </div>
                    </div>

                    {isRecordingVideo ? (
                        <button
                            onClick={stopVideo}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full font-bold text-xs flex items-center gap-2 animate-pulse"
                        >
                            <StopCircle size={14} /> Stop Recording
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            {chapter.videoMessage && (
                                <button
                                    onClick={clearVideo}
                                    className="p-2 hover:bg-white/10 rounded-full text-white/40"
                                >
                                    <X size={14} />
                                </button>
                            )}
                            <button
                                onClick={startVideo}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-bold text-xs flex items-center gap-2"
                            >
                                <Camera size={14} /> {chapter.videoMessage ? 'Re-record' : 'Record Video'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Video Preview */}
                {(isRecordingVideo || chapter.videoMessage) && (
                    <div className="mt-4 rounded-xl overflow-hidden bg-black aspect-video">
                        {isRecordingVideo ? (
                            <video ref={videoRef} className="w-full h-full object-cover" muted />
                        ) : chapter.videoMessage ? (
                            <video src={chapter.videoMessage} controls className="w-full h-full object-cover" />
                        ) : null}
                    </div>
                )}
            </div>

            {/* Save Chapter Button */}
            {!isEditing ? (
                <button
                    onClick={onSave}
                    disabled={!chapter.title}
                    className="w-full py-4 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Plus size={18} /> Add Chapter
                </button>
            ) : (
                <div className="flex items-center justify-center gap-2 py-4 text-green-400 text-xs font-bold uppercase tracking-widest bg-green-500/5 rounded-xl border border-green-500/20">
                    <Check size={14} /> Changes saved automatically
                </div>
            )}
        </div>
    );
}
