import { AlertTriangle, Bell, Check, X } from "lucide-react";
import { color } from "@themes/tokens";
import type { Representative } from "@shared/services/actions/tesoreria";

type Props = {
  representative: Representative;
  notified: Record<number, boolean>;
  onClose: () => void;
  onNotify: () => void;
  money: (n: number) => string;
  initials: (name: string) => string;
  studentYears: (students: string) => string;
  payPattern: (r: Representative) => string;
};

export function RepresentativeModal({
  representative: r,
  notified,
  onClose, onNotify,
  money, initials, studentYears, payPattern,
}: Props) {
  const solvent = r.months === 0;
  const constantDebtor = r.months >= 3;
  const isNotified = notified[r.id];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-edu-subtle border border-edu-border flex items-center justify-center text-sm font-bold text-edu-ink-500 shrink-0">
              {initials(r.rep)}
            </div>
            <div className="min-w-0">
              <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] truncate">{r.rep}</h3>
              <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">Representante</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between px-4 py-3 rounded-edu-control bg-edu-subtle">
            <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Estado de solvencia</div>
            {solvent ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-edu-pill text-[0.8rem] font-semibold bg-edu-success-bg text-edu-success">
                <Check className="w-3.5 h-3.5" /> Solvente
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-edu-pill text-[0.8rem] font-semibold bg-edu-danger-bg text-edu-danger">
                <AlertTriangle className="w-3.5 h-3.5" /> En mora · {r.months} {r.months === 1 ? "mes" : "meses"}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <div className="col-span-2">
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Estudiante(s)</div>
              <div className="text-[0.875rem] text-edu-ink font-medium">{r.students}</div>
            </div>
            <div>
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Año</div>
              <div className="text-[0.875rem] text-edu-ink font-medium">{studentYears(r.students)}</div>
            </div>
            <div>
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Teléfono</div>
              <div className="text-[0.875rem] text-edu-ink font-medium">{r.phone}</div>
            </div>
            <div>
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Adeudado</div>
              <div className={`text-[0.875rem] font-medium ${solvent ? "text-edu-ink" : "text-edu-danger"}`}>
                {solvent ? "Sin deuda" : `${money(r.amount)} ${r.currency}`}
              </div>
            </div>
            <div>
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Meses de atraso</div>
              <div className="text-[0.875rem] text-edu-ink font-medium">{r.months}</div>
            </div>
          </div>

          <div className="rounded-edu-control border border-edu-border-soft p-4 flex flex-col gap-3">
            <div className="text-[0.7rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold">Perfil de pago</div>
            <div className="flex items-center justify-between">
              <span className="text-[0.8125rem] text-edu-ink-700">Moroso constante</span>
              {constantDebtor ? (
                <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-edu-danger">
                  <AlertTriangle className="w-3.5 h-3.5" /> Sí
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-edu-success">
                  <Check className="w-3.5 h-3.5" /> No
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[0.8125rem] text-edu-ink-700">Ha pagado antes</span>
              <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-edu-success">
                <Check className="w-3.5 h-3.5" /> Sí
              </span>
            </div>
            <div className="border-t border-edu-border-soft pt-3">
              <div className="text-[0.72rem] text-edu-ink-400 mb-0.5">Promedio de pago</div>
              <div className="text-[0.875rem] text-edu-ink font-medium">{payPattern(r)}</div>
            </div>
          </div>

          {!solvent && (
            <div className="flex justify-end">
              {isNotified ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-edu-control text-sm font-semibold bg-edu-success-bg text-edu-success">
                  <Check className="w-4 h-4" /> Notificación enviada
                </span>
              ) : (
                <button
                  onClick={onNotify}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-edu-control border-none text-white text-sm font-semibold cursor-pointer transition-colors hover:brightness-95"
                  style={{ backgroundColor: color.whatsapp }}
                >
                  <Bell className="w-4 h-4" /> Enviar notificación
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
