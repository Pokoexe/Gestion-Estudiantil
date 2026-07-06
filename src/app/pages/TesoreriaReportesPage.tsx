import { useState, useEffect } from "react";
import {
  FileText,
  FilePlus2,
  X,
  Clock,
  CalendarDays,
  Search,
  Pencil,
} from "lucide-react";
import { color } from "../theme/tokens";
import { Pagination } from "../components/Pagination";
import { useFetch } from "../datos_maquetados";
import {
  getReportes,
  type ReportType,
  type ReportStatus,
  type Report,
} from "../datos_maquetados/actions/tesoreria";

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const REPORT_TYPES: ReportType[] = ["Ausencia de clases", "Falla de servicios", "Suspensión", "Incidente", "Mantenimiento"];

const REPORT_STATUS: Record<ReportStatus, { label: string; bg: string; fg: string }> = {
  abierto: { label: "Abierto", bg: color.dangerBg, fg: color.danger },
  en_proceso: { label: "En proceso", bg: color.warningBg, fg: color.warning },
  cerrado: { label: "Cerrado", bg: color.successBg, fg: color.success },
};

const RESPONSABLES = ["Coord. Luis Aponte", "Prof. Marisela Ríos", "Aux. Génesis Prieto", "Dir. Ana Belén Ferrer"];

const REP_COLS = "grid-cols-[2fr_1.1fr_0.9fr_1.2fr_0.9fr]";
const REP_HEADERS = ["Título", "Tipo", "Fecha", "Autor", "Estado"];

const PER_PAGE = 6;

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function TesoreriaReportesPage() {
  const { data: fetchedReports } = useFetch(getReportes, []);

  const [reports, setReports] = useState<Report[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: REPORT_TYPES[0], date: "3 jul 2026", desc: "" });
  const [responsable, setResponsable] = useState(RESPONSABLES[0]);

  // Modificar reporte
  const [editReport, setEditReport] = useState<Report | null>(null);
  const [editForm, setEditForm] = useState({ title: "", type: REPORT_TYPES[0], date: "", author: RESPONSABLES[0], status: "abierto" as ReportStatus });

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"todos" | ReportType>("todos");
  const [statusFilter, setStatusFilter] = useState<"todos" | ReportStatus>("todos");
  const [page, setPage] = useState(1);

  useEffect(() => setReports(fetchedReports), [fetchedReports]);

  // Métricas de los 3 bloques
  const total = reports.length;
  const last = reports[0];
  const thisMonth = reports.filter((r) => r.date.includes("jul")).length;

  const filtered = reports.filter((r) => {
    if (typeFilter !== "todos" && r.type !== typeFilter) return false;
    if (statusFilter !== "todos" && r.status !== statusFilter) return false;
    if (query.trim() && !`${r.title} ${r.type} ${r.author}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const openModal = () => {
    setForm({ type: REPORT_TYPES[0], date: "3 jul 2026", desc: "" });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: Report = {
      id: Date.now(),
      title: form.desc.trim() ? form.desc.trim().slice(0, 60) : form.type,
      type: form.type,
      date: form.date,
      author: responsable,
      status: "abierto",
    };
    setReports([nuevo, ...reports]);
    setShowModal(false);
  };

  const openEdit = (r: Report) => {
    setEditForm({ title: r.title, type: r.type, date: r.date, author: r.author, status: r.status });
    setEditReport(r);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editReport) return;
    setReports((prev) => prev.map((x) => (x.id === editReport.id ? { ...x, title: editForm.title.trim() || x.title, type: editForm.type, date: editForm.date, author: editForm.author, status: editForm.status } : x)));
    setEditReport(null);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Bloques de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Reportes hechos</p>
              <p className="text-edu-ink text-[1.6rem] font-bold mt-1 m-0">{total}</p>
            </div>
            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: color.primary50 }}>
              <FileText style={{ width: "20px", height: "20px", color: color.primary }} />
            </div>
          </div>
          <p className="text-edu-ink-400 text-xs m-0">Reportes generados en total</p>
        </div>

        <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Último hecho</p>
              <p className="text-edu-ink text-[1.6rem] font-bold mt-1 m-0">{last ? last.date : "—"}</p>
            </div>
            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: color.warningBg }}>
              <Clock style={{ width: "20px", height: "20px", color: color.warning }} />
            </div>
          </div>
          <p className="text-edu-ink-400 text-xs m-0 truncate" title={last?.title}>{last ? last.title : "Sin reportes aún"}</p>
        </div>

        <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Este mes</p>
              <p className="text-edu-ink text-[1.6rem] font-bold mt-1 m-0">{thisMonth}</p>
            </div>
            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: color.successBg }}>
              <CalendarDays style={{ width: "20px", height: "20px", color: color.success }} />
            </div>
          </div>
          <p className="text-edu-ink-400 text-xs m-0">Generados en julio 2026</p>
        </div>
      </div>

      {/* Acción */}
      <div className="flex gap-3 flex-wrap justify-end">
        <button
          onClick={openModal}
          className="inline-flex items-center gap-[9px] px-5 py-[11px] rounded-edu-control text-sm font-semibold cursor-pointer transition-colors border-none bg-edu-success text-white hover:brightness-95"
        >
          <FilePlus2 style={{ width: "16px", height: "16px" }} />
          Generar reporte
        </button>
      </div>

      {/* Reportes generados */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Reportes ante eventualidades</h3>
          <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filtered.length} reporte{filtered.length === 1 ? "" : "s"}</span>
        </div>

        {/* Buscador y filtros */}
        <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Buscar reporte, tipo o autor…"
              className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value as "todos" | ReportType); setPage(1); }}
            className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
          >
            <option value="todos">Todos los tipos</option>
            {REPORT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as "todos" | ReportStatus); setPage(1); }}
            className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
          >
            <option value="todos">Todos los estados</option>
            <option value="abierto">Abierto</option>
            <option value="en_proceso">En proceso</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
        <div className={`grid ${REP_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
          {REP_HEADERS.map((h) => (
            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
          ))}
        </div>

        {paged.length === 0 && (
          <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay reportes que coincidan con el filtro.</div>
        )}

        {paged.map((r, i) => {
          const st = REPORT_STATUS[r.status];
          return (
            <div
              key={r.id}
              onClick={() => openEdit(r)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openEdit(r)}
              className={`grid ${REP_COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              <span className="text-sm text-edu-ink font-medium flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-edu-ink-400 shrink-0" />
                <span className="truncate">{r.title}</span>
              </span>
              <span className="text-[0.8125rem] text-edu-ink-700">{r.type}</span>
              <span className="text-[0.8125rem] text-edu-ink-500">{r.date}</span>
              <span className="text-[0.8125rem] text-edu-ink-700">{r.author}</span>
              <span className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit" style={{ backgroundColor: st.bg, color: st.fg }}>
                  {st.label}
                </span>
                <Pencil className="w-3.5 h-3.5 text-edu-ink-300 shrink-0" />
              </span>
            </div>
          );
        })}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-edu-border-soft">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Modal: generar reporte */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control bg-edu-success-bg flex items-center justify-center">
                  <FilePlus2 className="w-4 h-4 text-edu-success" />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Generar reporte</h3>
              </div>
              <button onClick={() => setShowModal(false)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Tipo de eventualidad</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as ReportType })}
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-success"
                >
                  {REPORT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Fecha</label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="Ej. 3 jul 2026"
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-success"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Responsable</label>
                  <select
                    value={responsable}
                    onChange={(e) => setResponsable(e.target.value)}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-success"
                  >
                    {RESPONSABLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Descripción</label>
                <textarea
                  required
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  placeholder="Describe la eventualidad, causa y medidas tomadas…"
                  rows={4}
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-edu-success"
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
                  Cancelar
                </button>
                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-success text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:brightness-95">
                  <FilePlus2 className="w-4 h-4" />
                  Generar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: modificar reporte */}
      {editReport && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEditReport(null)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control bg-edu-primary-50 flex items-center justify-center">
                  <Pencil className="w-4 h-4 text-edu-primary" />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Modificar reporte</h3>
              </div>
              <button onClick={() => setEditReport(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Tipo de eventualidad</label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value as ReportType })}
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary"
                >
                  {REPORT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Fecha</label>
                  <input
                    type="text"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    placeholder="Ej. 3 jul 2026"
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Estado</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as ReportStatus })}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary"
                  >
                    {(Object.keys(REPORT_STATUS) as ReportStatus[]).map((s) => (
                      <option key={s} value={s}>{REPORT_STATUS[s].label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Responsable</label>
                <select
                  value={editForm.author}
                  onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary"
                >
                  {RESPONSABLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Descripción</label>
                <textarea
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Describe la eventualidad, causa y medidas tomadas…"
                  rows={4}
                  className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-edu-primary"
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => setEditReport(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
                  Cancelar
                </button>
                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover">
                  <Pencil className="w-4 h-4" />
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
