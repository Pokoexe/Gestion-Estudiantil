import { X, User, CircleAlert, Clock, CheckCircle2 } from "lucide-react";
import { TEAL, TEAL_BG, MAT_STATUS_META, studentStatus } from "../functions/useEvalReparaciones";
import type { StudentRow } from "@shared/services/actions/evaluador-discusion";

interface Props {
  selected: StudentRow;
  onClose: () => void;
}

export function EstudianteDetalleModal({ selected, onClose }: Props) {
  const st = studentStatus(selected);
  const reprobadas = selected.materias.filter((m) => m.status === "reprobada");
  const pendientes = selected.materias.filter((m) => m.status === "pendiente");
  const aprobadas = selected.materias.filter((m) => m.status === "aprobada" || m.status === "reparando");
  const initials = selected.name.split(" ").slice(0, 2).map((w) => w[0]).join("");

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold" style={{ backgroundColor: TEAL_BG, color: TEAL }}>
              {initials || <User className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] truncate">{selected.name}</h3>
              <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{selected.cedula} · {selected.anio} Año Secc. {selected.seccion}</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-edu-control bg-edu-subtle">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-edu-pill text-[0.75rem] font-semibold ${st.cls}`}>{st.label}</span>
            <div className="flex gap-3 ml-auto text-[0.8125rem]">
              <span className="text-edu-danger font-semibold">{reprobadas.length} reprobada{reprobadas.length !== 1 ? "s" : ""}</span>
              <span className="text-edu-ink-300">·</span>
              <span className="text-edu-warning font-semibold">{pendientes.length} pendiente{pendientes.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
          {reprobadas.length > 0 && (
            <div>
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold mb-2">Materias reprobadas</div>
              <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                {reprobadas.map((m, i) => (
                  <div key={m.name} className={`flex items-center justify-between px-3.5 py-2.5 ${i < reprobadas.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                    <div className="flex items-center gap-2">
                      <CircleAlert className="w-3.5 h-3.5 text-edu-danger shrink-0" />
                      <span className="text-[0.875rem] text-edu-ink font-medium">{m.name}</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-[2px] rounded-edu-pill text-[0.68rem] font-semibold bg-edu-danger-bg text-edu-danger">Reprobada</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {pendientes.length > 0 && (
            <div>
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold mb-2">Materias pendientes</div>
              <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                {pendientes.map((m, i) => (
                  <div key={m.name} className={`flex items-center justify-between px-3.5 py-2.5 ${i < pendientes.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-edu-warning shrink-0" />
                      <span className="text-[0.875rem] text-edu-ink font-medium">{m.name}</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-[2px] rounded-edu-pill text-[0.68rem] font-semibold bg-edu-warning-bg text-edu-warning">Pendiente</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {aprobadas.length > 0 && (
            <div>
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold mb-2">Materias aprobadas</div>
              <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                {aprobadas.map((m, i) => {
                  const meta = MAT_STATUS_META[m.status];
                  return (
                    <div key={m.name} className={`flex items-center justify-between px-3.5 py-2.5 ${i < aprobadas.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-edu-success shrink-0" />
                        <span className="text-[0.875rem] text-edu-ink-700">{m.name}</span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-[2px] rounded-edu-pill text-[0.68rem] font-semibold ${meta.cls}`}>{meta.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
