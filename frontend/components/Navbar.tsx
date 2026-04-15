import { Activity } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Activity size={24} />
        <span>Rate Limiter Dashboard</span>
      </div>
      <div>
        <span className="badge badge-success">System Online</span>
      </div>
    </nav>
  );
}
