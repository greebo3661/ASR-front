import React, { useState } from "react";
import { UploadCloud, FileAudio, CheckCircle2 } from "lucide-react";

interface UploadFormProps {
    onUpload: (file: File, language: string) => void;
    isLoading: boolean;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onUpload, isLoading }) => {
    const [file, setFile] = useState<File | null>(null);
    const [language, setLanguage] = useState("ru");
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (file) {
            onUpload(file, language);
        }
    };

    return (
        <div className="glass-panel p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-white">Upload Media</h2>
                    <p className="text-slate-400 text-sm mt-1">Select an audio or video file to transcribe</p>
                </div>

                <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-xl border border-slate-700/50">
                    <label className="text-sm font-medium text-slate-300 ml-2">Language:</label>
                    <select
                        className="bg-transparent text-white focus:outline-none focus:ring-0 [&>option]:bg-slate-800 cursor-pointer pl-1 pr-3"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="">Auto-detect</option>
                        <option value="ru">Russian</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </div>

            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
                className={`
                    relative group flex flex-col items-center justify-center p-10 mt-4
                    border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
                    ${dragOver
                        ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                        : "border-slate-600 hover:border-blue-500/50 hover:bg-slate-800/50"
                    }
                    ${isLoading ? "opacity-50 pointer-events-none" : ""}
                `}
            >
                <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    disabled={isLoading}
                />

                {file ? (
                    <div className="flex flex-col items-center text-center animate-in zoom-in duration-300">
                        <div className="bg-blue-500/20 p-4 rounded-full mb-4">
                            <FileAudio className="w-10 h-10 text-blue-400" />
                        </div>
                        <div className="font-semibold text-white text-lg truncate max-w-[250px] sm:max-w-sm">
                            {file.name}
                        </div>
                        <div className="text-slate-400 font-medium mt-2">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>

                        <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 p-1.5 rounded-full">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-slate-800 p-4 rounded-full mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                            <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="text-slate-300 text-lg font-medium">
                            Drag & drop your file here
                        </div>
                        <div className="text-slate-500 mt-2">
                            or click to browse from your computer
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    className="btn-primary flex items-center gap-2 group"
                    onClick={handleUploadClick}
                    disabled={!file || isLoading}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Transcribing...
                        </>
                    ) : (
                        "Start Transcription"
                    )}
                </button>
            </div>
        </div>
    );
};
