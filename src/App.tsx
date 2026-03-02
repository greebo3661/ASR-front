import React, { useEffect, useState } from "react";
import { fetchStatus, startTranscribeJob, fetchJob } from "./api";
import { JobResponse, StatusResponse } from "./types";
import { UploadForm } from "./components/UploadForm";
import { JobProgress } from "./components/JobProgress";
import { JobResult } from "./components/JobResult";

export default function App() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [statusErr, setStatusErr] = useState("");
  const [job, setJob] = useState<JobResponse | null>(null);
  const [jobErr, setJobErr] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const jobId = job?.job_id || job?.id;

  async function loadStatus() {
    setStatusErr("");
    try {
      setStatus(await fetchStatus());
    } catch (e: any) {
      setStatus(null);
      setStatusErr(String(e?.message || e));
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  async function handleUpload(file: File, language: string) {
    setJobErr("");
    setJob(null);
    setIsUploading(true);

    try {
      const res = await startTranscribeJob(file, language);
      setJob(res);
    } catch (e: any) {
      setJobErr(String(e?.message || e));
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    if (!jobId || job?.status === "done" || job?.status === "error") return;

    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const j = await fetchJob(jobId, controller.signal);
        setJob(j);

        if (j.status !== "done" && j.status !== "error") {
          timeoutId = setTimeout(poll, 1500); // Poll every 1.5s
        } else if (j.status === "error") {
          setJobErr(j.error || "unknown error");
        }
      } catch (e: any) {
        if (e.name === "AbortError") return;
        setJobErr(String(e?.message || e));
        timeoutId = setTimeout(poll, 3000); // Retry with delay
      }
    };

    poll();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [jobId, job?.status]); // Re-run effect only when ID or status changes

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans pb-16">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
              ASR Studio
            </h1>
          </div>

          <div className="flex items-center">
            {status ? (
              <div className="group relative flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors" onClick={loadStatus}>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-slate-300">System Ready</span>

                {/* Tooltip with technical details */}
                <div className="absolute top-10 right-0 w-64 p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  <div className="text-slate-400 mb-2 font-semibold">Server Diagnostics</div>
                  <div className="flex justify-between mb-1"><span className="text-slate-500">Backend:</span><span className="font-mono text-emerald-400">{status.backend_state}</span></div>
                  <div className="flex justify-between mb-1"><span className="text-slate-500">Queue:</span><span className="font-mono text-white">{status.queued}</span></div>
                  <div className="flex justify-between mb-1"><span className="text-slate-500">Inflight:</span><span className="font-mono text-white">{status.inflight}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Max Upload:</span><span className="font-mono text-white">{status.max_upload_mb} MB</span></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer" onClick={loadStatus}>
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-red-400">Offline</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 mt-8 sm:mt-12">
        <UploadForm onUpload={handleUpload} isLoading={isUploading} />

        {jobErr ? (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-start gap-3">
            <div className="mt-0.5 bg-red-500/20 rounded-full p-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            {jobErr}
          </div>
        ) : null}

        {job ? (
          <div className="mt-8 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <JobProgress job={job} />
            <JobResult job={job} />
          </div>
        ) : null}
      </main>
    </div>
  );
}
