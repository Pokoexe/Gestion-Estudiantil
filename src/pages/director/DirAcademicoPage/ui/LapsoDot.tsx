import React from "react";
import { color } from "@themes/tokens";

/** Punto del gráfico de lapsos; resalta el lapso actualmente seleccionado. */
export function LapsoDot({ cx, cy, index, selectedIndex }: any) {
  if (cx == null || cy == null) return null;
  const sel = index === selectedIndex;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={sel ? 7 : 4}
      fill={color.warning}
      stroke={sel ? color.primary : "transparent"}
      strokeWidth={sel ? 2.5 : 0}
    />
  );
}
