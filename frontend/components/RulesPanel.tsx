"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Rule {
  id: number;
  targetType: string;
  targetValue: string;
  endpoint: string;
  limitCount: number;
  timeWindow: number;
}

interface RulesPanelProps {
  rules: Rule[];
  onCreateRule: (limit: number, timeWindow: number, endpoint: string, targetType: string, targetValue: string) => Promise<void>;
  onDeleteRule?: (id: number) => Promise<void>;
}

export default function RulesPanel({ rules, onCreateRule, onDeleteRule }: RulesPanelProps) {
  const [endpoint, setEndpoint] = useState("/api/v1/*");
  const [limitCount, setLimitCount] = useState("");
  const [timeWindow, setTimeWindow] = useState("");
  const [targetType, setTargetType] = useState("GLOBAL");
  const [targetValue, setTargetValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!limitCount || !timeWindow || !endpoint) return;
    setIsLoading(true);
    await onCreateRule(
      parseInt(limitCount, 10), 
      parseInt(timeWindow, 10), 
      endpoint, 
      targetType, 
      targetType === "GLOBAL" ? "SYSTEM" : targetValue
    );
    setLimitCount("");
    setTimeWindow("");
    setEndpoint("");
    setTargetValue("");
    setIsLoading(false);
  };

  return (
    <div className="card glass-panel" style={{ gridColumn: "1 / -1" }}>
      <div className="section-header">
        <span className="section-title">Rate Limit Rules Management</span>
      </div>

      <div className="grid-main" style={{ gridTemplateColumns: "1fr 2fr", gap: "2rem", marginBottom: 0 }}>
        {/* Create Rule Form */}
        <div>
          <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "1rem" }}>Create New Rule</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Target Type</label>
              <select 
                className="input-field" 
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
              >
                <option value="GLOBAL">Global System</option>
                <option value="USER">Specific User ID</option>
                <option value="API_KEY">Specific API Key</option>
              </select>
            </div>

            {targetType !== "GLOBAL" && (
              <div className="form-group">
                <label className="form-label">{targetType === "USER" ? "User ID" : "API Key"}</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder={targetType === "USER" ? "e.g. 1" : "e.g. your-api-key-here"}
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)} 
                  required 
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Endpoint Path</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="/api/v1/resource"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)} 
                required 
              />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Limit Count</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Requests"
                  value={limitCount}
                  onChange={(e) => setLimitCount(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Window (sec)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Seconds"
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
              <Plus size={16} />
              {isLoading ? "Provisioning..." : "Create Rule"}
            </button>
          </form>
        </div>

        {/* Existing Rules Table */}
        <div className="table-container">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Rule ID</th>
                <th>Target</th>
                <th>Endpoint</th>
                <th>Limit</th>
                <th>Window</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "1rem", color: "var(--text-muted)" }}>
                    No rate limit rules found
                  </td>
                </tr>
              ) : (
                rules.map((rule) => (
                  <tr key={rule.id}>
                    <td>#{rule.id}</td>
                    <td>
                      <span className={`badge ${rule.targetType === "GLOBAL" ? "badge-success" : "badge-secondary"}`} style={{ fontSize: "0.7rem", padding: "0.1rem 0.4rem" }}>
                        {rule.targetType}
                      </span>
                      <div style={{ fontSize: "0.75rem", marginTop: "0.25rem", fontFamily: "monospace", color: "var(--text-muted)" }}>
                        {rule.targetValue === "SYSTEM" ? "ALL TRAFFIC" : rule.targetValue}
                      </div>
                    </td>
                    <td><code>{rule.endpoint}</code></td>
                    <td>{rule.limitCount} req</td>
                    <td>{rule.timeWindow}s</td>
                    <td>
                      <button
                        title="Remove Rule"
                        onClick={() => onDeleteRule && onDeleteRule(rule.id)}
                        style={{ color: "var(--danger)", padding: "0.25rem", borderRadius: "4px" }}
                        className="hover-bg-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
