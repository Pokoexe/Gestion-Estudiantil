import { useState } from "react";
import {
  FileText,
  FilePlus2,
  X,
  UserCheck,
  ClipboardList,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { color } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

type ReportType = "Ausencia de clases" | "Falla de servicios" | "Suspensión" | "Incidente" | "Mantenimiento";
type ReportStatus = "abierto" | "en_proceso" | "cerrado";

interface Report {
  id: number;
  title: string;
  type: ReportType;
  date: string;
  author: string;
  status: ReportStatus;
}

interface TeacherAtt {
  id: number;
  name: string;
  subject: string;
  present: number;
  total: number;
}

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const INITIAL_REPORTS: Report[] = [
  { id: 1, title: "Suspensión de clases por falla eléctrica", type: "Ausencia de clases", date: "1 jul 2026", author: "Prof. Marisela Ríos", status: "cerrado" },
  { id: 2, title: "Corte de agua en sede principal", type: "Falla de servicios", date: "28 jun 2026", author: "Coord. Luis Aponte", status: "en_proceso" },
  { id: 3, title: "Ausencia docente 5.º B (reposo médico)", type: "Ausencia de clases", date: "26 jun 2026", author: "Prof. Marisela Ríos", status: "abierto" },
  { id: 4, title: "Reparación de filtraciones en Aula 204", type: "Mantenimiento", date: "20 jun 2026", author: "Coord. Luis Aponte", status: "en_proceso" },
];

const TEACHER_ATT: TeacherAtt[] = [
  { id: 1, name: "Marisela Ríos", subject: "Matemática", present: 21, total: 22 },
  { id: 2, name: "Luis Aponte", subject: "Castellano", present: 20, total: 22 },
  { id: 3, name: "Yaneth Bravo", subject: "Biología", present: 22, total: 22 },
  { id: 4, name: "Óscar Medina", subject: "Historia", present: 18, total: 22 },
  { id: 5, name: "Karina Suárez", subject: "Inglés", present: 19, total: 22 },
];

const REPORT_TYPES: ReportType[] = ["Ausencia de clases", "Falla de servicios", "Suspensión", "Incidente", "Mantenimiento"];

const REPORT_STATUS: Record<ReportStatus, { label: string; bg: string; fg: string }> = {
  abierto: { label: "Abierto", bg: color.dangerBg, fg: color.danger },
  en_proceso: { label: "En proceso", bg: color.warningBg, fg: color.warning },
  cerrado: { label: "Cerrado", bg: color.successBg, fg: color.success },
};

const RESPONSABLES = ["Coord. Luis Aponte", "Prof. Marisela Ríos", "Aux. Génesis Prieto", "Dir. Ana Belén Ferrer"];

const ATT_COLS = "grid-cols-[1.4fr_1fr_1fr_1fr]";
const REP_COLS = "grid-cols-[2fr_1.1fr_0.9fr_1.2fr_0.9fr]";

/* ------------------------------------------------------------------ */
/* Tooltip de la gráfica                                               */
/* ------------------------------------------------------------------ */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-edu-surface border border-edu-border rounded-edu-chip shadow-[0_4px_16px_rgba(0,0,0,0.08)] px-3 py-2">
      <div style={{ fontSize: "0.7rem", color: color.ink400, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: "0.9rem", color: color.ink, fontWeight: 700, marginTop: "2px" }}>{payload[0].value} % asistencia</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function TesoreriaReportesPage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: REPORT_TYPES[0], date: "3 jul 2026", desc: "" });
  const [responsable, setResponsable] = useState(RESPONSABLES[0]);

  const chartData = TEACHER_ATT.map((t) => ({ name: t.name.split(" ")[0], pct: Math.round((t.present / t.total) * 100) }));

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

  return (
    <div className="flex flex-col gap-5">
      {/* Acción */}
      <div className="flex gap-3 flex-wrap">
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
          <span className="text-[0.8rem] text-edu-ink-400 font-medium">{reports.length} reportes</span>
        </div>
        <div className={`grid ${REP_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
          {["Título", "Tipo", "Fecha", "Autor", "Estado"].map((h) => (
            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
          ))}
        </div>
        {reports.map((r, i) => {
          const st = REPORT_STATUS[r.status];
          return (
            <div key={r.id} className={`grid ${REP_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < reports.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
              <span className="text-sm text-edu-ink font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-edu-ink-400 shrink-0" />
                {r.title}
              </span>
              <span className="text-[0.8125rem] text-edu-ink-700">{r.type}</span>
              <span className="text-[0.8125rem] text-edu-ink-500">{r.date}</span>
              <span className="text-[0.8125rem] text-edu-ink-700">{r.author}</span>
              <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit" style={{ backgroundColor: st.bg, color: st.fg }}>
                {st.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Control de asistencia de docentes */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Control de asistencia de docentes</h3>
            <p className="mt-0.5 text-edu-ink-400 text-[0.78rem]">Resumen del mes · 22 días hábiles</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[0.8125rem] text-edu-ink-500 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-edu-ink-400" />
              Responsable
            </span>
            <select
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.8125rem] cursor-pointer focus:border-edu-success"
            >
              {RESPONSABLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Gráfica de asistencia */}
        <div className="px-4 pt-5 pb-2">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 8, right: 12, left: 4, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid vertical={false} stroke={color.borderSoft} />
              <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: color.border }} tick={{ fill: color.ink400, fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: color.ink400, fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} width={40} />
              <Tooltip cursor={{ fill: color.successBg }} content={<ChartTooltip />} />
              <Bar dataKey="pct" radius={[6, 6, 0, 0]} maxBarSize={46}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.pct >= 90 ? color.success : color.warningStrong} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabla resumen */}
        <div className={`grid ${ATT_COLS} px-5 py-2.5 bg-edu-subtle border-y border-edu-border-soft`}>
          {["Docente", "Materia", "Asistencia", "% del mes"].map((h) => (
            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
          ))}
        </div>
        {TEACHER_ATT.map((t, i) => {
          const pct = Math.round((t.present / t.total) * 100);
          const good = pct >= 90;
          return (
            <div key={t.id} className={`grid ${ATT_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < TEACHER_ATT.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-[34px] h-[34px] rounded-full bg-edu-subtle border border-edu-border flex items-center justify-center text-xs font-bold text-edu-ink-500 shrink-0">
                  {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <span className="text-sm text-edu-ink font-medium">{t.name}</span>
              </div>
              <span className="text-[0.8125rem] text-edu-ink-700">{t.subject}</span>
              <span className="text-[0.8125rem] text-edu-ink-700 flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-edu-ink-400" />
                {t.present} / {t.total} días
              </span>
              <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${good ? "bg-edu-success-bg text-edu-success" : "bg-edu-warning-bg text-edu-warning"}`}>
                {pct} %
              </span>
            </div>
          );
        })}
      </div>

      {/* Modal: generar reporte */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-edu-surface rounded-edu-card w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
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
    </div>
  );
}
