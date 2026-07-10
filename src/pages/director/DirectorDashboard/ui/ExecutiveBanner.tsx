import { ShieldCheck } from "lucide-react";

export function ExecutiveBanner() {
  return (
    <div className="bg-edu-primary rounded-edu-card px-6 py-[22px] flex justify-between items-center flex-wrap gap-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.85)" }} />
          <span className="text-xs font-medium uppercase tracking-[0.06em]" style={{ color: "rgba(255,255,255,0.75)" }}>
            Panel de Dirección · Período 2026-I
          </span>
        </div>
        <h2 className="text-white m-0 mb-1.5 text-xl font-bold">Visión institucional global</h2>
        <p className="m-0 text-[0.8rem]" style={{ color: "rgba(255,255,255,0.78)" }}>
          Unidad Educativa Simón Rodríguez · Actualizado el 1 jul 2026
        </p>
      </div>
      <div className="flex gap-3">
        {[
          { label: "Solvencia", value: "78 %" },
          { label: "Asistencia", value: "91 %" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[rgba(255,255,255,0.15)] rounded-edu-control px-[18px] py-2.5 text-center">
            <div className="text-[1.3rem] font-bold text-white">{value}</div>
            <div className="text-[0.72rem] mt-px" style={{ color: "rgba(255,255,255,0.75)" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
