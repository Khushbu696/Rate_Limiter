"use client";

import { useState } from "react";
import { Send, Terminal } from "lucide-react";
import { testApiEndpoint } from "@/lib/api";

export default function ApiTester() {
  const [endpoint, setEndpoint] = useState("/rate-limit");
  const [method, setMethod] = useState("GET");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ status: number; data: any } | null>(null);

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await testApiEndpoint(endpoint, method);
    setResponse(res);
    setLoading(false);
  };

  return (
    <div className="card glass-panel" style={{ gridColumn: "1 / -1" }}>
      <div className="section-header">
        <span className="section-title">
          <Terminal size={18} /> API Testing Panel
        </span>
      </div>

      <form className="form-row" onSubmit={handleTest} style={{ alignItems: "flex-end" }}>
        <div className="form-group" style={{ marginBottom: 0, flex: "0 0 150px" }}>
          <label className="form-label">Method</label>
          <select className="select-field" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
          <label className="form-label">Endpoint</label>
          <input
            type="text"
            className="input-field"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="/api/v1/resource"
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading} style={{ display: "flex", alignItems: "center", gap: "0.5rem", height: "38px" }}>
          <Send size={16} />
          {loading ? "Sending..." : "Send Request"}
        </button>
      </form>

      {response && (
        <div className="response-block" style={{ borderColor: response.status === 429 ? "var(--danger)" : "var(--card-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontWeight: 600, color: "var(--text-muted)" }}>Response</span>
            <span className={`badge ${response.status === 429 ? "badge-danger" : response.status >= 200 && response.status < 300 ? "badge-success" : "badge-warning"}`}>
              Status: {response.status}
            </span>
          </div>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {typeof response.data === "object" ? JSON.stringify(response.data, null, 2) : response.data}
          </pre>
        </div>
      )}
    </div>
  );
}
