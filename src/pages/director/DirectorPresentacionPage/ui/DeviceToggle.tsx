import { Monitor, Smartphone } from "lucide-react";
import type { Device } from "../interfaces";

export function DeviceToggle({ device, onChange }: { device: Device; onChange: (d: Device) => void }) {
  return (
    <div className="flex items-center gap-0.5 rounded-full bg-white/10 p-0.5">
      {([["desktop", Monitor], ["mobile", Smartphone]] as const).map(([d, Icon]) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          aria-label={d === "desktop" ? "Escritorio" : "Móvil"}
          className={`flex h-7 w-7 items-center justify-center rounded-full cursor-pointer transition-colors ${device === d ? "bg-white text-slate-900" : "text-slate-300 hover:text-slate-500"}`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
