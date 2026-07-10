import type { Device } from "../interfaces";

export function PreviewSurface({ device, children }: { device: Device; children: React.ReactNode }) {
  if (device === "mobile") {
    return (
      <div className="mx-auto w-[390px] max-w-full overflow-hidden rounded-[2.2rem] border-[9px] border-slate-800 bg-black shadow-2xl" style={{ height: 680 }}>
        <div className="h-full w-full overflow-y-auto lp-noscrollbar">{children}</div>
      </div>
    );
  }
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black" style={{ minHeight: "100%" }}>
      {children}
    </div>
  );
}
