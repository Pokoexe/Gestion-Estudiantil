import { Menu } from "lucide-react";
import { LandingView } from "@/pages/Auth/LandingPage/ui/LandingView";
import type { LandingConfig } from "@/pages/Auth/LandingPage/interfaces/types";
import type { Device } from "../interfaces";
import { PreviewSurface } from "./PreviewSurface";

export function PreviewPanel({
  device,
  config,
  optionsOpen,
  setOptionsOpen,
  previewLogin,
  previewEnroll,
}: {
  device: Device;
  config: LandingConfig;
  optionsOpen: boolean;
  setOptionsOpen: (open: boolean) => void;
  previewLogin: () => void;
  previewEnroll: () => void;
}) {
  return (
    <div className="relative flex flex-[2] flex-col overflow-hidden border-r border-edu-border bg-[#0e1424]" style={{ height: "calc(100vh - 60px)" }}>
      {/* Botón flotante de opciones (solo móvil) */}
      <button
        onClick={() => setOptionsOpen(true)}
        aria-label="Abrir opciones de presentación"
        className={`fixed bottom-4 right-4 z-[49] w-9 h-9 rounded-full border-[1.5px] border-edu-border bg-edu-subtle cursor-pointer flex items-center justify-center text-edu-ink-500 shrink-0 shadow-md transition-opacity duration-200 lg:hidden ${optionsOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1 overflow-y-auto lp-noscrollbar bg-[#0b1020] p-3 isolate">
        <PreviewSurface device={device}>
          <LandingView config={config} onLogin={previewLogin} onEnroll={previewEnroll} />
        </PreviewSurface>
      </div>
    </div>
  );
}
