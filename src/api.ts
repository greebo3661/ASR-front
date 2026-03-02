import { JobResponse, StatusResponse } from "./types";

function getApiBase(): string {
    // Use proxy path by default in Vite and Nginx
    return "";
}

export async function fetchStatus(): Promise<StatusResponse> {
    const r = await fetch(`${getApiBase()}/api/status`, { method: "GET" });
    if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
    return r.json();
}

export async function startTranscribeJob(file: File, language: string): Promise<JobResponse> {
    const fd = new FormData();
    fd.append("file", file);
    if (language) fd.append("language", language);

    const r = await fetch(`${getApiBase()}/api/transcribe?wait=0`, { method: "POST", body: fd });
    if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
    return r.json();
}

export async function fetchJob(jobId: string, signal?: AbortSignal): Promise<JobResponse> {
    const r = await fetch(`${getApiBase()}/api/jobs/${jobId}`, { method: "GET", signal });
    if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
    return r.json();
}

export function getDownloadUrls(jobId: string) {
    const base = getApiBase();
    return {
        txt: `${base}/api/jobs/${jobId}/download.txt`,
        srt: `${base}/api/jobs/${jobId}/download.srt`,
    };
}
