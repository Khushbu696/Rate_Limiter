interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="card stat-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="stat-title">{title}</span>
        {icon && <span style={{ color: "var(--primary)" }}>{icon}</span>}
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
