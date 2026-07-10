import { Eye, Save, X } from "lucide-react";
import { LandingView } from "@/pages/Auth/LandingPage/ui/LandingView";
import type { LandingConfig } from "@/pages/Auth/LandingPage/interfaces/types";
import type { Device, Confirm } from "../interfaces";
import { DeviceToggle } from "./DeviceToggle";
import { PreviewSurface } from "./PreviewSurface";

export function FullscreenPreview({
  device,
  setDevice,
  config,
  setFullscreen,
  setConfirm,
  publish,
  previewLogin,
  previewEnroll,
}: {
  device: Device;
  setDevice: (d: Device) => void;
  config: LandingConfig;
  setFullscreen: (v: boolean) => void;
  setConfirm: (c: Confirm) => void;
  publish: () => void;
  previewLogin: () => void;
  previewEnroll: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-slate-950">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-900 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <Eye className="h-4 w-4" />
          <span className="text-[0.9rem] font-semibold">Vista previa</span>
          <span className="hidden text-[0.78rem] text-slate-400 sm:inline">— así se verá antes de publicar</span>
        </div>
        <div className="flex items-center gap-2">
          <DeviceToggle device={device} onChange={setDevice} />
          <button onClick={() => setFullscreen(false)} className="inline-flex items-center gap-1.5 rounded-edu-control border border-white/15 bg-transparent px-3 py-2 text-[0.82rem] font-semibold text-white cursor-pointer hover:bg-white/10">
            <X className="h-4 w-4" /> Cerrar
          </button>
          <button onClick={() => setConfirm({ title: "Guardar y publicar", tone: "success", icon: Save, confirmLabel: "Publicar", onConfirm: publish })} className="inline-flex items-center gap-1.5 rounded-edu-control border-none bg-edu-primary px-4 py-2 text-[0.82rem] font-semibold text-white cursor-pointer hover:bg-edu-primary-hover">
            <Save className="h-4 w-4" /> Guardar y publicar
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto lp-noscrollbar bg-[#0b1020] p-4">
        <PreviewSurface device={device}>
          <LandingView config={config} onLogin={previewLogin} onEnroll={previewEnroll} />
        </PreviewSurface>
      </div>
    </div>
  );
}
