import { Package } from "lucide-react";
import { SectionCard } from "./SectionCard";
import type { InventoryItem } from "../interfaces";

export function InventorySummaryCard({ INVENTORY }: { INVENTORY: InventoryItem[] }) {
  return (
    <SectionCard title="Resumen de inventario" hint="Almacén general">
      <div className="p-4 flex flex-col gap-3 flex-1">
        {INVENTORY.map((it) => (
          <div key={it.label} className="flex items-center gap-3.5 bg-edu-subtle rounded-edu-control px-4 py-3 border border-edu-border-soft">
            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: it.ac.bg }}>
              <Package style={{ width: "20px", height: "20px", color: it.ac.fg }} />
            </div>
            <div>
              <div className="text-[1.25rem] font-bold text-edu-ink leading-none">{it.value}</div>
              <div className="text-[0.78rem] text-edu-ink-500 mt-1">{it.label}</div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
