import React, { useState } from "react";
import { Copy, TerminalSquare, List, CheckCircle2 } from "lucide-react";
import { JobResponse, JobSegment } from "../types";

function fmtMs(ms: number) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
}

interface JobResultProps {
    job: JobResponse | null;
}

export const JobResult: React.FC<JobResultProps> = ({ job }) => {
    const [activeTab, setActiveTab] = useState<'text' | 'segments'>('text');
    const [copiedContent, setCopiedContent] = useState(false);

    // Только показываем, если работа завершена
    if (job?.status !== "done") return null;

    const hasSegments = Array.isArray(job?.segments) && job?.segments!.length > 0;
    const transcribedText = job?.text || "";

    const handleCopy = () => {
        if (!transcribedText) return;

        let contentToCopy = transcribedText;
        if (activeTab === 'segments' && hasSegments) {
            contentToCopy = job.segments!.map(s => `[${fmtMs(s.start_ms)} - ${fmtMs(s.end_ms)}]\n${s.text}`).join('\n\n');
        }

        navigator.clipboard.writeText(contentToCopy).then(() => {
            setCopiedContent(true);
            setTimeout(() => setCopiedContent(false), 2000);
        });
    };

    return (
        <div className="glass-panel p-0 sm:p-2 mt-8 overflow-hidden animate-in fade-in duration-700">
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl">

                {/* Header / Tabs */}
                <div className="bg-slate-800/80 border-b border-slate-700/50 px-4 py-3 flex justify-between items-center sm:overflow-visible overflow-x-auto">
                    <div className="flex gap-2">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === 'text' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                            onClick={() => setActiveTab('text')}
                        >
                            <TerminalSquare className="w-4 h-4" />
                            Plain Text
                        </button>

                        {hasSegments && (
                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === 'segments' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                                onClick={() => setActiveTab('segments')}
                            >
                                <List className="w-4 h-4" />
                                Segments
                            </button>
                        )}
                    </div>

                    <button
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${copiedContent
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-white'
                            }`}
                        onClick={handleCopy}
                    >
                        {copiedContent ? (
                            <><CheckCircle2 className="w-4 h-4" /> Copied!</>
                        ) : (
                            <><Copy className="w-4 h-4" /> Copy</>
                        )}
                    </button>
                </div>

                {/* Content Body */}
                <div className="p-6 bg-[#0B1120] min-h-[300px] h-full">
                    {activeTab === 'text' ? (
                        <div className="text-gray-200 leading-relax tracking-wide text-[1.05rem] font-sans h-full max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            {transcribedText ? (
                                transcribedText.split('\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
                                ))
                            ) : (
                                <div className="text-slate-500 italic flex h-full items-center justify-center">No text available...</div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 h-full max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            {job?.segments?.map((s: JobSegment, idx: number) => (
                                <div key={idx} className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 transition-colors">
                                    <div className="flex shrink-0 items-start">
                                        <div className="font-mono text-xs font-semibold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 shadow-sm">
                                            {fmtMs(s.start_ms)} <span className="text-slate-500 font-normal mx-1">—</span> {fmtMs(s.end_ms)}
                                        </div>
                                    </div>
                                    <div className="text-gray-300 leading-relaxed text-base pt-0.5">
                                        {s.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            <div className="text-center mt-4">
                <p className="text-slate-500 text-xs italic">
                    Timestamps are generated via VAD (Voice Activity Detection), not forced alignment.
                </p>
            </div>
        </div>
    );
};
