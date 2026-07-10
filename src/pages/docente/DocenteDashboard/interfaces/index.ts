import React from "react";

export interface DashboardKpi {
  label: string;
  value: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  hint: string;
  alert?: boolean;
}

export interface QuickAction {
  label: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  to: string;
  primary?: boolean;
}
