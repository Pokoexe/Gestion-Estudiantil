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
  Search,
} from "lucide-react";
import { Pagination } from "../components/Pagination";
import { ConfirmDialog } from "../components/ConfirmDialog";

/* ------------------------------------------------------------------ */
/* Tipos y datos ficticios                                             */
/* ------------------------------------------------------------------ */

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

type RevTipo = "Exámenes" | "Planes de evaluación" | "Temas de reparación";
type RevEstado = "Pendiente" | "Aprobado" | "Revisión solicitada";
type TabOpt = RevTipo | "Todas";

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
  { id: 8, docente: "Prof. Gabriel Suárez", materia: "Historia", seccion: "4.º Año B", tipo: "Planes de evaluación", fecha: "20 jun 2026", estado: "Revisión solicitada", adjunto: "plan_historia_4B.pdf", observacion: "El peso del examen final supera el 30% permitido. Ajustar la ponderación." },
  { id: 9, docente: "Prof. Ana Díaz", materia: "Matemáticas", seccion: "5.º Año B", tipo: "Exámenes", fecha: "19 jun 2026", estado: "Pendiente", adjunto: "examen_u4_5B.pdf" },
];

const ESTADO_META: Record<RevEstado, string> = {
  Pendiente: "bg-edu-warning-bg text-edu-warning",
  Aprobado: "bg-edu-success-bg text-edu-success",
  "Revisión solicitada": "bg-edu-danger-bg text-edu-danger",
};

const TIPO_META: Record<RevTipo, string> = {
  Exámenes: "text-edu-warning",
  "Planes de evaluación": "text-edu-primary",
  "Temas de reparación": "text-edu-purple",
};

const TABS: TabOpt[] = ["Todas", "Exámenes", "Planes de evaluación", "Temas de reparación"];
const COLS = "grid-cols-[1.4fr_1.1fr_0.9fr_1.1fr_0.9fr_1fr_1.2fr]";
const HEADERS = ["Docente", "Materia", "Sección", "Tipo", "Fecha", "Estado", "Acciones"];
const PER_PAGE = 6;

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function EvalRevisionesPage() {
  const [revisiones, setRevisiones] = useState<Revision[]>(REVISIONES_INI);
  const [tab, setTab] = useState<TabOpt>("Todas");
  const [query, setQuery] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<"todos" | RevEstado>("todos");
  const [page, setPage] = useState(1);
  const [modalId, setModalId] = useState<number | null>(null);
  const [obs, setObs] = useState("");
  const [detail, setDetail] = useState<Revision | null>(null);
  const [confirmAprobar, setConfirmAprobar] = useState<Revision | null>(null);

  const pendientes = revisiones.filter((r) => r.estado === "Pendiente").length;

  const filtradas = revisiones.filter((r) => {
    if (tab !== "Todas" && r.tipo !== tab) return false;
    if (estadoFilter !== "todos" && r.estado !== estadoFilter) return false;
    if (query.trim() && !`${r.docente} ${r.materia} ${r.seccion}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtradas.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtradas.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

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

      {/* Cola de revisiones: tabs + buscador + tabla */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Cola de revisiones</h3>
            <p className="mt-0.5 mb-0 text-edu-ink-400 text-[0.775rem]">Material enviado por los docentes para validación</p>
          </div>
          <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filtradas.length} entregas</span>
        </div>

        {/* Tabs por tipo */}
        <div className="px-5 pt-3 border-b border-edu-border-soft">
          <div className="flex gap-1 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); setPage(1); }}
                className="px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent"
                style={tab === t ? { borderColor: TEAL, color: TEAL } : { borderColor: "transparent", color: "#6b7280" }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Buscador y filtro por estado */}
        <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Buscar docente, materia o sección…"
              className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-teal-600"
            />
          </div>
          <select
            value={estadoFilter}
            onChange={(e) => { setEstadoFilter(e.target.value as "todos" | RevEstado); setPage(1); }}
            className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600"
          >
            <option value="todos">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Revisión solicitada">Revisión solicitada</option>
          </select>
        </div>

        {/* Cabecera de tabla */}
        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
          {HEADERS.map((h) => (
            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
          ))}
        </div>

        {/* Filas */}
        {paged.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-edu-ink-400">No hay entregas que coincidan con el filtro.</div>
        ) : (
          paged.map((r, i) => (
            <div key={r.id} className={`${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
              <div
                onClick={() => setDetail(r)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setDetail(r)}
                className={`grid ${COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle`}
              >
                <span className="text-sm text-edu-ink font-medium">{r.docente}</span>
                <span className="text-[0.8125rem] text-edu-ink-700">{r.materia}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{r.seccion}</span>
                <span className={`text-[0.8125rem] font-bold ${TIPO_META[r.tipo]}`}>{r.tipo}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{r.fecha}</span>
                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${ESTADO_META[r.estado]}`}>{r.estado}</span>
                <div className="flex items-center gap-1.5 justify-end">
                  {r.estado !== "Aprobado" && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setConfirmAprobar(r); }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-edu-chip text-[0.72rem] font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
                      style={{ backgroundColor: TEAL }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Aprobar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setModalId(r.id); setObs(""); }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-edu-chip text-[0.72rem] font-semibold border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 cursor-pointer transition-colors hover:bg-edu-subtle"
                  >
                    <MessageSquareWarning className="w-3.5 h-3.5" />
                    Revisión
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-edu-border-soft">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Modal: ver información de la entrega */}
      {detail && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setDetail(null)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
                  <FileText className="w-4 h-4" style={{ color: TEAL }} />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Detalle de la entrega</h3>
              </div>
              <button onClick={() => setDetail(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold bg-edu-subtle ${TIPO_META[detail.tipo]}`}>{detail.tipo}</span>
                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold ${ESTADO_META[detail.estado]}`}>{detail.estado}</span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Docente</div>
                  <div className="text-[0.875rem] text-edu-ink font-medium">{detail.docente}</div>
                </div>
                <div>
                  <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Materia</div>
                  <div className="text-[0.875rem] text-edu-ink font-medium">{detail.materia}</div>
                </div>
                <div>
                  <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Sección</div>
                  <div className="text-[0.875rem] text-edu-ink font-medium">{detail.seccion}</div>
                </div>
                <div>
                  <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Fecha de envío</div>
                  <div className="text-[0.875rem] text-edu-ink font-medium">{detail.fecha}</div>
                </div>
              </div>

              <div>
                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1">Adjunto</div>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft text-[0.8125rem] transition-colors hover:bg-edu-tint"
                >
                  <Paperclip className="w-4 h-4 text-edu-ink-400 shrink-0" />
                  <span className="text-edu-ink-700 font-medium truncate">{detail.adjunto}</span>
                </a>
              </div>

              {detail.observacion && (
                <div className="px-3.5 py-2.5 bg-edu-danger-bg rounded-edu-chip border-l-[3px] border-edu-danger">
                  <span className="text-[0.7rem] font-bold text-edu-danger">Observación: </span>
                  <span className="text-[0.8125rem] text-edu-ink-700 leading-[1.5]">{detail.observacion}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

      {/* Confirmación: aprobar entrega */}
      {confirmAprobar && (
        <ConfirmDialog
          title="Aprobar entrega"
          message={<>Se aprobará la entrega de <span className="font-semibold text-edu-ink">{confirmAprobar.materia} · {confirmAprobar.seccion}</span> ({confirmAprobar.docente}). ¿Estás seguro?</>}
          confirmLabel="Sí, aprobar"
          icon={CheckCircle2}
          tone="success"
          onConfirm={() => { aprobar(confirmAprobar.id); setConfirmAprobar(null); }}
          onCancel={() => setConfirmAprobar(null)}
        />
      )}
    </div>
  );
}
