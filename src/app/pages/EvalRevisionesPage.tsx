import { useState } from "react";
import {
  ClipboardList,
  ClipboardCheck,
  CheckCircle2,
  MessageSquareWarning,
  Paperclip,
  X,
  FileText,
  Clock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Tipos y datos ficticios                                             */
/* ------------------------------------------------------------------ */

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

type RevTipo = "Exámenes" | "Planes de evaluación" | "Temas de reparación";
type RevEstado = "Pendiente" | "Aprobado" | "Revisión solicitada";

interface Revision {
  id: number;
  docente: string;
  materia: string;
  seccion: string;
  tipo: RevTipo;
  fecha: string;
  estado: RevEstado;
  adjunto: string;
  observacion?: string;
}

const REVISIONES_INI: Revision[] = [
  { id: 1, docente: "Prof. María Fernández", materia: "Biología", seccion: "5.º Año A", tipo: "Planes de evaluación", fecha: "28 jun 2026", estado: "Pendiente", adjunto: "plan_biologia_5A.pdf" },
  { id: 2, docente: "Prof. José Rangel", materia: "Ciencias Naturales", seccion: "4.º Año B", tipo: "Exámenes", fecha: "27 jun 2026", estado: "Pendiente", adjunto: "examen_u3_4B.pdf" },
  { id: 3, docente: "Prof. Carmen Ortega", materia: "Química", seccion: "5.º Año B", tipo: "Planes de evaluación", fecha: "25 jun 2026", estado: "Aprobado", adjunto: "plan_quimica_5B.pdf" },
  { id: 4, docente: "Prof. Luis Guerra", materia: "Física", seccion: "5.º Año A", tipo: "Temas de reparación", fecha: "24 jun 2026", estado: "Revisión solicitada", adjunto: "reparacion_fisica_5A.pdf", observacion: "Faltan los objetivos de la Unidad 2 y el cronograma del período de reparación." },
  { id: 5, docente: "Prof. Ana Díaz", materia: "Matemáticas", seccion: "3.º Año C", tipo: "Exámenes", fecha: "23 jun 2026", estado: "Aprobado", adjunto: "examen_lapso2_3C.pdf" },
  { id: 6, docente: "Prof. Pedro Salas", materia: "Ciencias de la Tierra", seccion: "3.º Año C", tipo: "Temas de reparación", fecha: "22 jun 2026", estado: "Pendiente", adjunto: "reparacion_ct_3C.pdf" },
  { id: 7, docente: "Prof. María Fernández", materia: "Biología", seccion: "4.º Año A", tipo: "Exámenes", fecha: "21 jun 2026", estado: "Pendiente", adjunto: "examen_u2_4A.pdf" },
];

const ESTADO_META: Record<RevEstado, string> = {
  Pendiente: "bg-edu-warning-bg text-edu-warning",
  Aprobado: "bg-edu-success-bg text-edu-success",
  "Revisión solicitada": "bg-edu-danger-bg text-edu-danger",
};

const TABS: RevTipo[] = ["Exámenes", "Planes de evaluación", "Temas de reparación"];
const COLS = "grid-cols-[1.4fr_1.1fr_0.9fr_1.1fr_0.9fr_1fr_1.2fr]";
const HEADERS = ["Docente", "Materia", "Sección", "Tipo", "Fecha", "Estado", "Acciones"];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function EvalRevisionesPage() {
  const [revisiones, setRevisiones] = useState<Revision[]>(REVISIONES_INI);
  const [tab, setTab] = useState<RevTipo>("Exámenes");
  const [modalId, setModalId] = useState<number | null>(null);
  const [obs, setObs] = useState("");

  const filtradas = revisiones.filter((r) => r.tipo === tab);
  const pendientes = revisiones.filter((r) => r.estado === "Pendiente").length;

  const aprobar = (id: number) =>
    setRevisiones((rs) =>
      rs.map((r) => (r.id === id ? { ...r, estado: "Aprobado", observacion: undefined } : r)),
    );

  const solicitarRevision = () => {
    if (modalId === null) return;
    setRevisiones((rs) =>
      rs.map((r) =>
        r.id === modalId
          ? { ...r, estado: "Revisión solicitada", observacion: obs.trim() || "Se solicitaron ajustes." }
          : r,
      ),
    );
    setModalId(null);
    setObs("");
  };

  const KPIS = [
    { label: "Por revisar", value: String(pendientes), icon: ClipboardList, bg: TEAL_BG, fg: TEAL },
    { label: "Aprobados", value: String(revisiones.filter((r) => r.estado === "Aprobado").length), icon: CheckCircle2, bg: "#dcfce7", fg: "#16a34a" },
    { label: "En revisión", value: String(revisiones.filter((r) => r.estado === "Revisión solicitada").length), icon: MessageSquareWarning, bg: "#fee2e2", fg: "#dc2626" },
    { label: "Total de entregas", value: String(revisiones.length), icon: ClipboardCheck, bg: "#ede9fe", fg: "#7c3aed" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {KPIS.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-edu-surface rounded-edu-card p-5 flex justify-between items-start border border-edu-border-soft">
              <div>
                <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">{k.label}</p>
                <p className="text-[1.6rem] font-bold mt-1.5 m-0 text-edu-ink">{k.value}</p>
              </div>
              <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: k.bg }}>
                <Icon style={{ width: "20px", height: "20px", color: k.fg }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tarjeta con tabs + tabla */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Revisiones de docentes</h3>
          <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filtradas.length} entregas</span>
        </div>

        {/* Tabs por tipo */}
        <div className="px-5 pt-3 border-b border-edu-border-soft">
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className="px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent"
                style={tab === t ? { borderColor: TEAL, color: TEAL } : { borderColor: "transparent", color: "#6b7280" }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Cabecera de tabla */}
        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
          {HEADERS.map((h) => (
            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
          ))}
        </div>

        {/* Filas */}
        {filtradas.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-edu-ink-400">No hay entregas de este tipo.</div>
        ) : (
          filtradas.map((r, i) => (
            <div key={r.id} className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < filtradas.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
              <span className="text-sm text-edu-ink font-medium">{r.docente}</span>
              <span className="text-[0.8125rem] text-edu-ink-700">{r.materia}</span>
              <span className="text-[0.8125rem] text-edu-ink-500">{r.seccion}</span>
              <span className="text-[0.8125rem] text-edu-ink-500">{r.tipo}</span>
              <span className="text-[0.8125rem] text-edu-ink-500">{r.fecha}</span>
              <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${ESTADO_META[r.estado]}`}>
                {r.estado}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  title={`Ver ${r.adjunto}`}
                  className="w-8 h-8 rounded-edu-chip border border-edu-border bg-edu-surface flex items-center justify-center text-edu-ink-500 cursor-pointer transition-colors hover:text-edu-ink-700 hover:bg-edu-subtle"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                </button>
                {r.estado !== "Aprobado" && (
                  <button
                    type="button"
                    onClick={() => aprobar(r.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-edu-chip text-[0.72rem] font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
                    style={{ backgroundColor: TEAL }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Aprobar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { setModalId(r.id); setObs(""); }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-edu-chip text-[0.72rem] font-semibold border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 cursor-pointer transition-colors hover:bg-edu-subtle"
                >
                  <MessageSquareWarning className="w-3.5 h-3.5" />
                  Revisión
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: solicitar revisión con observación */}
      {modalId !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setModalId(null)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
                  <MessageSquareWarning className="w-4 h-4" style={{ color: TEAL }} />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Solicitar revisión</h3>
              </div>
              <button onClick={() => setModalId(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {(() => {
                const r = revisiones.find((x) => x.id === modalId);
                return r ? (
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-edu-control bg-edu-subtle text-[0.8125rem]">
                    <FileText className="w-4 h-4 text-edu-ink-400 shrink-0" />
                    <span className="text-edu-ink-700 font-medium">{r.materia} · {r.seccion}</span>
                    <span className="text-edu-ink-400">— {r.docente}</span>
                  </div>
                ) : null;
              })()}
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Observación para el docente</label>
                <textarea
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  rows={4}
                  placeholder="Describe los ajustes que debe realizar el docente…"
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-teal-600"
                  style={{ outlineColor: TEAL }}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setModalId(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
                  Cancelar
                </button>
                <button type="button" onClick={solicitarRevision} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90" style={{ backgroundColor: TEAL }}>
                  <Clock className="w-4 h-4" />
                  Enviar solicitud
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
