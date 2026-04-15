"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

interface ChartSectionProps {
  logs: any[];
}

export default function ChartSection({ logs }: ChartSectionProps) {
  // Compute chart data
  const allowedCount = logs.filter((l) => l.status < 400).length;
  const blockedCount = logs.filter((l) => l.status === 429).length;
  
  const allowedVsBlocked = [
    { name: "Allowed", value: allowedCount },
    { name: "Blocked", value: blockedCount },
  ];

  const COLORS = ["#10b981", "#ef4444"]; 

  // Group requests over time
  const timeDataMap: Record<string, number> = {};
  logs.slice(-50).forEach((log) => {
    const d = new Date(log.timestamp);
    const timeKey = `${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
    timeDataMap[timeKey] = (timeDataMap[timeKey] || 0) + 1;
  });

  const timeData = Object.keys(timeDataMap)
    .sort()
    .map((time) => ({ time, Requests: timeDataMap[time] }));

  // Top Endpoints
  const endpointCounts: Record<string, number> = {};
  logs.forEach(log => {
      endpointCounts[log.endpoint] = (endpointCounts[log.endpoint] || 0) + 1;
  });
  const topEndpoints = Object.entries(endpointCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="chart-section" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
      <div className="card" style={{ gridColumn: "span 2" }}>
        <div className="section-header">
          <span className="section-title">Traffic Throughput (Last 50 Events)</span>
        </div>
        <div className="chart-container" style={{ height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" allowDecimals={false} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f8fafc",
                }}
              />
              <Line type="monotone" dataKey="Requests" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <span className="section-title">Filtering Efficiency</span>
        </div>
        <div className="chart-container" style={{ height: "250px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allowedVsBlocked}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {allowedVsBlocked.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f8fafc",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <span className="section-title">Top Targeted Endpoints</span>
        </div>
        <div className="chart-container" style={{ height: "250px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topEndpoints} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={100} />
              <Tooltip
                 contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
