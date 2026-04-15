"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSummary, fetchLogs, fetchRules, createRule } from "@/lib/api";
import "../dashboard.css";

import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import ChartSection from "@/components/ChartSection";
import RulesPanel from "@/components/RulesPanel";
import LogsTable from "@/components/LogsTable";
import ApiTester from "@/components/ApiTester";
import ProgressBar from "@/components/ProgressBar";

import { Activity, ShieldAlert, FileSliders, Copy, LogOut } from "lucide-react";

export default function Dashboard() {
  const [userName, setUserName] = useState("Developer");
  const [apiKey, setApiKey] = useState("");
  const [userRole, setUserRole] = useState("USER");
  const router = useRouter();

  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [logs, setLogs] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [summaryRes, logsRes, rulesRes] = await Promise.all([
        fetchSummary().catch(() => 0),
        fetchLogs().catch(() => []),
        fetchRules().catch(() => []),
      ]);

      setTotalRequests(typeof summaryRes === "number" ? summaryRes : typeof summaryRes.count === "number" ? summaryRes.count : logsRes.length);
      setLogs(logsRes);
      setRules(rulesRes);
    } catch (err) {
      console.error("Dashboard data load failed", err);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    const storedKey = localStorage.getItem("apiKey");
    if (!storedKey) {
      router.push("/login");
      return;
    }
    setApiKey(storedKey);
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
    
    const storedRole = localStorage.getItem("role");
    if (storedRole) setUserRole(storedRole);

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loading, router]);

  const handleCreateRule = async (limitCount: number, timeWindow: number, endpoint: string, targetType: string, targetValue: string) => {
    try {
      await createRule({ limitCount, timeWindow, endpoint, targetType, targetValue });
      await loadData();
    } catch (e: any) {
      alert(e.message || "Failed to create rule.");
    }
  };

  const blockedRequests = logs.filter((l) => l.status === 429).length;
  const activeRules = rules.length;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "var(--primary)" }}>
        Loading Dashboard...
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    alert("API Key copied to clipboard!");
  };

  const handleLogout = () => {
    localStorage.removeItem("apiKey");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    router.push("/login");
  };

  // Calculate generic usage
  const endpointUsage: Record<string, number> = {};
  logs.forEach((log) => {
    endpointUsage[log.endpoint] = (endpointUsage[log.endpoint] || 0) + 1;
  });

  const progressBars = Object.keys(endpointUsage).map((ep) => {
    const rule = rules[0]; 
    const limit = rule ? rule.limitCount : 100;
    return {
      endpoint: ep,
      used: endpointUsage[ep],
      limit: limit,
    };
  }).slice(0, 5);

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <Activity size={24} />
          <span>Rate Limiter Dashboard</span>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span className={`badge ${userRole === "ADMIN" ? "badge-danger" : "badge-success"}`}>
            {userRole} MODE
          </span>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--danger)", background: "rgba(239, 68, 68, 0.1)", padding: "0.4rem 0.8rem", borderRadius: "var(--border-radius)", fontSize: "0.875rem", fontWeight: 600 }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h1 style={{ fontSize: "1.8rem" }}>{userRole === "ADMIN" ? "Admin Control Panel" : "User Dashboard"}</h1>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.5rem", borderRadius: "4px", backgroundColor: userRole === "ADMIN" ? "var(--danger)" : "var(--primary)", color: "white" }}>
                {userRole === "ADMIN" ? "SYSTEM ADMIN" : "DEVELOPER"}
              </span>
            </div>
            <p style={{ color: "var(--text-muted)" }}>
              {userRole === "ADMIN" 
                ? "Monitor system traffic, manage global rate limits, and audit request logs."
                : "Monitor your API consumption, active limits, and request history."}
            </p>
          </div>

          {userRole === "USER" && (
            <div className="card glass-panel" style={{ padding: "0.75rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", margin: 0 }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.1rem" }}>Your API Key</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.9rem", fontWeight: 600 }}>
                  {apiKey.substring(0, 8)}••••••••••••
                </div>
              </div>
              <button onClick={handleCopy} className="btn-primary" style={{ padding: "0.3rem 0.6rem", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem" }}>
                <Copy size={14} /> Copy
              </button>
            </div>
          )}
        </div>

        <div className="grid-stats" style={{ gridTemplateColumns: userRole === "ADMIN" ? "repeat(3, 1fr)" : "repeat(2, 1fr)" }}>
          <StatCard title="Total Requests" value={totalRequests} icon={<Activity size={20} />} />
          <StatCard title="Blocked Requests (429)" value={blockedRequests} icon={<ShieldAlert size={20} />} />
          {userRole === "ADMIN" && <StatCard title="Active Rules" value={activeRules} icon={<FileSliders size={20} />} />}
        </div>

        <div className="grid-main">
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <ChartSection logs={logs} />
            

            {userRole === "ADMIN" ? (
              <RulesPanel rules={rules} onCreateRule={handleCreateRule} />
            ) : (
              <div className="card glass-panel">
                <div className="section-header">
                  <span className="section-title">Applied Rate Limit Rules</span>
                </div>
                <div className="table-container">
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Rule ID</th>
                        <th>Endpoint</th>
                        <th>Limit Count</th>
                        <th>Time Window (sec)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rules.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)" }}>No rules applied to your account</td></tr>
                      ) : (
                        rules.map((rule) => (
                          <tr key={rule.id}>
                            <td>#{rule.id}</td>
                            <td><code>{rule.endpoint}</code></td>
                            <td>{rule.limitCount} requests</td>
                            <td>{rule.timeWindow} s</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <LogsTable logs={logs} isAdmin={userRole === "ADMIN"} />
          </div>
        </div>
      </main>
    </div>
  );
}