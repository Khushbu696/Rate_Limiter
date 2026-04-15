"use client";

interface ProgressBarProps {
  endpoint: string;
  used: number;
  limit: number;
}

export default function ProgressBar({ endpoint, used, limit }: ProgressBarProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  let colorVar = "var(--primary)";
  
  if (percentage >= 100) {
    colorVar = "var(--danger)";
  } else if (percentage >= 80) {
    colorVar = "var(--warning)";
  }

  return (
    <div className="progress-wrapper">
      <div className="progress-label">
        <span style={{ fontFamily: "monospace" }}>{endpoint}</span>
        <span>{used} / {limit} requests</span>
      </div>
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill"
          style={{ width: `${percentage}%`, backgroundColor: colorVar }}
        ></div>
      </div>
    </div>
  );
}
