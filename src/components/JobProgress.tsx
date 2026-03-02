import React, { useMemo } from "react";
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

    const handleDownloadTxt = () => {
        if (jobId) window.open(getDownloadUrls(jobId).txt, "_blank");
    };

    const handleDownloadSrt = () => {
        if (jobId) window.open(getDownloadUrls(jobId).srt, "_blank");
    };

    return (
        <div className="card">
            <div className="row small">
                <div>job: <code>{jobId || "-"}</code></div>
                <div>status: <code>{job.status || "-"}</code></div>
                <div>stage: <code>{job.stage || "-"}</code></div>
            </div>

            <div className="row" style={{ marginTop: "1rem", alignItems: "center" }}>
                <progress value={progress} max={1} style={{ width: "100%", height: "20px", borderRadius: "4px" }}></progress>
                <div style={{ marginLeft: "10px", minWidth: "120px" }} className="small">
                    {(progress * 100).toFixed(1)}% / 100%
                </div>
            </div>

            <div className="row" style={{ justifyContent: "flex-end", marginTop: "1rem" }}>
                <button className="btn" disabled={!canDownload} onClick={handleDownloadTxt}>
                    Download TXT
                </button>
                <button className="btn" disabled={!canDownload || !hasSegments} onClick={handleDownloadSrt}>
                    Download SRT
                </button>
            </div>

            {job.error ? <div className="err" style={{ marginTop: "1rem" }}>{job.error}</div> : null}
        </div>
    );
};
