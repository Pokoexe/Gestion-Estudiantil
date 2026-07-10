import type React from "react";

export interface Kpi {
  label: string;
  value: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  hint: string;
}

export interface AttStat {
  label: string;
  value: string;
  ac: { bg: string; fg: string };
  icon: React.FC<{ style?: React.CSSProperties }>;
}
