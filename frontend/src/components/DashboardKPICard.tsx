import type { ReactNode } from 'react';
export function DashboardKPICard({ label, value }: { label: string; value: ReactNode }) {
  return <div className="kpi"><span>{label}</span><strong>{value}</strong></div>;
}
