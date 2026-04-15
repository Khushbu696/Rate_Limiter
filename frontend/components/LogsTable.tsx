"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface Log {
  id: number;
  userId: number;
  apiKey: string;
  endpoint: string;
  method: string;
  status: number;
  timestamp: string;
}

interface LogsTableProps {
  logs: Log[];
  isAdmin?: boolean;
}

export default function LogsTable({ logs, isAdmin = false }: LogsTableProps) {
  const [filter, setFilter] = useState<"All" | "Success" | "Blocked">("All");
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter((log) => {
    if (filter === "Success" && log.status === 429) return false;
    if (filter === "Blocked" && log.status !== 429) return false;
    
    if (search) {
      const s = search.toLowerCase();
      return (
        log.endpoint.toLowerCase().includes(s) || 
        log.apiKey?.toLowerCase().includes(s) || 
        log.userId?.toString().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="card">
      <div className="section-header">
        <span className="section-title">Live Request Logs</span>
        <div style={{ display: "flex", gap: "1rem" }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search path or user..."
              style={{ paddingLeft: "2rem", width: "230px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Filter */}
          <select className="input-field" style={{ width: "120px" }} value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="All">All Traffic</option>
            <option value="Success">Success</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="table-container" style={{ maxHeight: "500px", overflowY: "auto" }}>
        <table>
          <thead style={{ position: "sticky", top: 0, backgroundColor: "var(--card-bg)", zIndex: 1 }}>
            <tr>
              {isAdmin && <th>ID</th>}
              {isAdmin && <th>User/API Key</th>}
              <th>Endpoint</th>
              <th>Method</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 4} style={{ textAlign: "center", padding: "1rem", color: "var(--text-muted)" }}>
                  No logs found
                </td>
              </tr>
            ) : (
              [...filteredLogs].reverse().map((log) => (
                <tr key={log.id}>
                  {isAdmin && <td>{log.id}</td>}
                  {isAdmin && (
                    <td>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>User: {log.userId}</div>
                      <div style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "var(--text-muted)" }}>
                        {log.apiKey ? `${log.apiKey.substring(0, 12)}...` : "NONE"}
                      </div>
                    </td>
                  )}
                  <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{log.endpoint}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: "#334155" }}>{log.method}</span>
                  </td>
                  <td>
                    <span className={`badge ${log.status === 429 ? "badge-danger" : "badge-success"}`}>
                      {log.status === 429 ? "429 Limited" : `${log.status} OK`}
                    </span>
                  </td>
                  <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
