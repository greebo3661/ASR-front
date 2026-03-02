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
    <div className="wrap">
      <h2>ASR MVP</h2>

      <div className="card">
        <div className="row">
          <label className="label">Server Status</label>
          <button className="btn" onClick={loadStatus}>Refresh Status</button>
        </div>

        <div className="row small" style={{ marginTop: "1rem" }}>
          {status ? (
            <div>
              backend=<b>{status.backend_state}</b>, queued={status.queued}, inflight={status.inflight}, max_upload_mb={status.max_upload_mb}
            </div>
          ) : (
            <div className="err">{statusErr || "No status available"}</div>
          )}
        </div>
      </div>

      <UploadForm onUpload={handleUpload} isLoading={isUploading} />

      {jobErr ? <div className="err" style={{ marginTop: "1rem" }}>{jobErr}</div> : null}

      {job ? (
        <>
          <JobProgress job={job} />
          <JobResult job={job} />
        </>
      ) : null}

      <div className="footer small">
        Примечание: timestamps сделаны по VAD-сегментам (приблизительно по тишине), не по forced aligner.
      </div>
    </div>
  );
}
