export interface JobSegment {
    start_ms: number;
    end_ms: number;
    text: string;
}

export interface JobResponse {
    job_id?: string;
    id?: string;
    status: string;
    stage?: string;
    progress?: number;
    text?: string;
    error?: string;
    segments?: JobSegment[];
}

export interface StatusResponse {
    backend_state: string;
    queued: number;
    inflight: number;
    max_upload_mb: number;
}
