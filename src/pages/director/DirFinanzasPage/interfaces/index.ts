import type React from "react";

export interface IncomeKpi {
  label: string;
  value: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  hint: string;
}

export interface InventoryItem {
  label: string;
  value: string;
  ac: { bg: string; fg: string };
}
