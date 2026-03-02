import React, { useMemo } from "react";
import { Download, Terminal, Clock, Settings, FileText, CheckCircle2 } from "lucide-react";
import { JobResponse } from "../types";
import { getDownloadUrls } from "../api";

interface JobProgressProps {
    job: JobResponse;
}

export const JobProgress: React.FC<JobProgressProps> = ({ job }) => {
    const progress = useMemo(() => {
        if (!job) return 0;
        return typeof job.progress === "number" ? job.progress : 0;
    }, [job]);

    const jobId = job.job_id || job.id || "";
    const canDownload = job.status === "done" && jobId;
    const hasSegments = Array.isArray(job.segments) && job.segments.length > 0;
    const isError = job.status === "error";

    const handleDownloadTxt = () => {
        if (jobId) window.open(getDownloadUrls(jobId).txt, "_blank");
    };

    const handleDownloadSrt = () => {
        if (jobId) window.open(getDownloadUrls(jobId).srt, "_blank");
    };

    const StatusIcon = () => {
        if (isError) return <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse mt-0.5" />;
        if (canDownload) return <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />;
        return <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse mt-0.5" />;
    };

    return (
        <div className="glass-panel p-6 mt-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-start gap-3">
                    <StatusIcon />
                    <div>
                        <h3 className="text-white font-medium text-lg leading-tight">Transcription Status</h3>
                        <p className="text-slate-400 font-mono text-xs mt-1 bg-slate-900/50 px-2 py-0.5 rounded">ID: {jobId}</p>
                    </div>
                </div>

                <div className="flex gap-4 text-sm bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-slate-300">{job.status || "pending"}</span>
                    </div>
                    {job.stage && (
                        <>
                            <div className="w-px h-4 bg-slate-700 mx-1"></div>
                            <div className="flex items-center gap-2">
                                <Settings className="w-4 h-4 text-slate-400" />
                                <span className="font-mono text-slate-300">{job.stage}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 mb-6">
                <div className="flex justify-between text-sm mb-3">
                    <span className="text-slate-300 font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        Processing...
                    </span>
                    <span className="text-blue-400 font-semibold font-mono">
                        {(progress * 100).toFixed(1)}%
                    </span>
                </div>

                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner relative">
                    <div
                        style={{ width: `${progress * 100}%` }}
                        className={`h-full absolute left-0 top-0 transition-all duration-300 ease-out flex items-center justify-end pr-2
                                    ${isError ? 'bg-red-500' : canDownload ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    >
                        {/* Optional animated shimmer effect */}
                        {!canDownload && !isError && (
                            <div className="absolute top-0 right-0 bottom-0 left-0 overflow-hidden rounded-full">
                                <div className="h-full bg-white/20 blur-sm transform -skew-x-12 translate-x-[-150%] animate-[shimmer_2s_infinite]"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6 flex items-start gap-3">
                    <div className="mt-0.5 bg-red-500/20 rounded-full p-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    </div>
                    {job.error}
                </div>
            )}

            <div className={`flex flex-col sm:flex-row justify-end gap-3 transition-all duration-500 ${canDownload ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2 pointer-events-none'}`}>
                <button
                    className="btn-secondary flex items-center justify-center gap-2 group hover:bg-slate-700 hover:text-white"
                    disabled={!canDownload}
                    onClick={handleDownloadTxt}
                >
                    <FileText className="w-4 h-4 group-hover:scale-110 transition-transform text-slate-400" />
                    TXT Format
                </button>
                <button
                    className="btn-primary flex items-center justify-center gap-2 group"
                    disabled={!canDownload || !hasSegments}
                    onClick={handleDownloadSrt}
                >
                    <Download className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:scale-110 transition-transform" />
                    SRT Subtitles
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    100% {
                        transform: translate(150%) skewX(-12deg);
                    }
                }
            `}} />
        </div>
    );
};
