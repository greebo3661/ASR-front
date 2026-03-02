import React, { useState } from "react";

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
        <div className="card">
            <div className="row">
                <label className="label">Language</label>
                <select
                    className="input"
                    style={{ maxWidth: 160 }}
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={isLoading}
                >
                    <option value="">auto</option>
                    <option value="ru">ru</option>
                    <option value="en">en</option>
                </select>
            </div>

            <div
                className={`dropzone ${dragOver ? "drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                onDrop={handleDrop}
                style={{
                    border: dragOver ? "2px dashed #3b82f6" : "2px dashed #4b5563",
                    borderRadius: "8px",
                    padding: "2rem",
                    textAlign: "center",
                    cursor: "pointer",
                    marginTop: "1rem",
                    transition: "all 0.2s ease"
                }}
                onClick={() => document.getElementById("file-input")?.click()}
            >
                <input
                    id="file-input"
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    disabled={isLoading}
                />
                {file ? (
                    <div>
                        <div style={{ fontWeight: "bold", color: "#60a5fa" }}>{file.name}</div>
                        <div className="small">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                ) : (
                    <div style={{ color: "#9ca3af" }}>
                        Drag and drop an audio/video file here, or click to browse
                    </div>
                )}
            </div>

            <div className="row" style={{ marginTop: "1rem", justifyContent: "flex-end" }}>
                <button
                    className="btn primary"
                    onClick={handleUploadClick}
                    disabled={!file || isLoading}
                >
                    {isLoading ? "Transcribing..." : "Transcribe"}
                </button>
            </div>
        </div>
    );
};
