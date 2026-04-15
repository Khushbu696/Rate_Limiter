const BASE_URL = "http://localhost:8080";

export function getApiKey() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("apiKey");
  }
  return null;
}

function getHeaders() {
  const apiKey = getApiKey();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers["API-KEY"] = apiKey;
  }
  return headers;
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export async function registerUser(data: { name: string; email: string; password: string }) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

// Fetch all rules from GET /rate-limit
export async function fetchRules() {
  const res = await fetch(`${BASE_URL}/rate-limit`, { headers: getHeaders(), cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch rules");
  return res.json();
}

// Create new rule POST /rate-limit
export async function createRule(data: { targetType: string; targetValue: string; endpoint: string; limitCount: number; timeWindow: number }) {
  const res = await fetch(`${BASE_URL}/rate-limit/create`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to create rule");
  }
  return res.json();
}

// Analytics summary
export async function fetchSummary() {
  const res = await fetch(`${BASE_URL}/analytics/summary`, { headers: getHeaders(), cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

// Fetch all logs from GET /logs
export async function fetchLogs() {
  const res = await fetch(`${BASE_URL}/logs`, { headers: getHeaders(), cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch logs");
  return res.json();
}

export async function testApiEndpoint(endpoint: string, method: string) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
    });
    const contentType = res.headers.get("content-type");
    let data = null;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    return {
      status: res.status,
      data,
    };
  } catch (error: any) {
    return {
      status: 500,
      data: error.message || "Failed to make request",
    };
  }
}