import React from "react";
import { JobResponse } from "../types";

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
    const hasSegments = Array.isArray(job?.segments) && job?.segments!.length > 0;

    return (
        <div className="card" style={{ marginTop: "1rem" }}>
            <textarea
                className="textarea"
                value={job?.text || ""}
                readOnly
                placeholder="Транскрипция появится тут..."
                style={{ minHeight: "150px" }}
            />

            {hasSegments ? (
                <div className="card" style={{ marginTop: 12 }}>
                    <div className="small">Segments (VAD timestamps)</div>
                    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8, maxHeight: "400px", overflowY: "auto" }}>
                        {job!.segments!.map((s, idx) => (
                            <div key={idx} style={{ border: "1px solid #1f2937", borderRadius: 10, padding: 10, background: "#0b1220" }}>
                                <div className="small"><code>{fmtMs(s.start_ms)} - {fmtMs(s.end_ms)}</code></div>
                                <div style={{ marginTop: 6 }}>{s.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};
