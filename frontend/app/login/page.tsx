"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import Link from "next/link";
import "../dashboard.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("apiKey", data.apiKey);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "var(--background)" }}>
      <div className="card glass-panel" style={{ width: "100%", maxWidth: "400px", padding: "2rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h2>
        {error && <div style={{ color: "var(--danger)", marginBottom: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.5rem", borderRadius: "var(--border-radius)", fontSize: "0.875rem" }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", marginTop: "1rem" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Don't have an account? <Link href="/signup" style={{ color: "var(--primary)" }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
