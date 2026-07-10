import { useNavigate } from "react-router";
import {
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  Phone,
  User,
  Users,
  X,
} from "lucide-react";
import { promedio, notaColor, notasDe } from "@shared/services/data/boletines";
import type { Boletin } from "@shared/services/actions/boletines";
import type { LapsoId } from "@shared/services/data/lapsos";
import { TEAL, TEAL_BG } from "../functions/useEvalBoletines";

interface Props {
  selected: Boletin;
  selectedId: LapsoId;
  MATERIAS: string[];
  onClose: () => void;
  onDescargar: (b: Boletin) => void;
}

export function BoletinDetalleModal({
  selected,
  selectedId,
  MATERIAS,
  onClose,
  onDescargar,
}: Props) {
  const navigate = useNavigate();
  const notasSel = notasDe(selected, selectedId);
  const p = promedio(notasSel);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: TEAL_BG }}
            >
              <User className="w-5 h-5" style={{ color: TEAL }} />
            </div>
            <div className="min-w-0">
              <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] truncate">
                {selected.student}
              </h3>
              <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">
                {selected.anio} · Sección {selected.seccion} · {selected.cedula}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between px-4 py-3 rounded-edu-control bg-edu-subtle">
            <div>
              <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                Promedio
              </div>
              <div
                className={`text-[1.6rem] font-bold leading-none mt-0.5 ${p >= 10 ? "text-edu-success" : "text-edu-danger"}`}
              >
                {p.toFixed(2)}
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-pill text-[0.8rem] font-semibold ${selected.retirado ? "bg-edu-success-bg text-edu-success" : "bg-edu-warning-bg text-edu-warning"}`}
            >
              {selected.retirado ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
              {selected.retirado ? "Recibido" : "Por entregar"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-edu-ink-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                  Representante
                </div>
                <div className="text-[0.875rem] text-edu-ink font-medium">
                  {selected.representante}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-edu-ink-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                  Teléfono
                </div>
                <div className="text-[0.875rem] text-edu-ink font-medium">
                  {selected.telefono}
                </div>
              </div>
            </div>
            <div>
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                Cédula
              </div>
              <div className="text-[0.875rem] text-edu-ink font-medium">{selected.cedula}</div>
            </div>
            <div>
              <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                ¿Retirado?
              </div>
              <div className="text-[0.875rem] text-edu-ink font-medium">
                {selected.retirado ? "Sí, ya lo retiró" : "No, pendiente de entrega"}
              </div>
            </div>
          </div>

          <div>
            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1.5">
              Notas por materia
            </div>
            <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
              {MATERIAS.map((m, i) => (
                <div
                  key={m}
                  className={`flex items-center justify-between px-3.5 py-2 text-[0.8125rem] ${i < MATERIAS.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                >
                  <span className="text-edu-ink-700">{m}</span>
                  <span className={`font-semibold ${notaColor(notasSel[i])}`}>
                    {notasSel[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => onDescargar(selected)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
              style={{ backgroundColor: TEAL }}
            >
              <Download className="w-4 h-4" />
              Descargar boletín (PDF)
            </button>
            <button
              onClick={() => navigate(`/evaluador/boletines/${selected.id}/sabana`)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-edu-control text-sm font-semibold border-[1.5px] bg-edu-surface cursor-pointer transition-colors hover:bg-edu-subtle"
              style={{ borderColor: TEAL, color: TEAL }}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Sábana de notas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
