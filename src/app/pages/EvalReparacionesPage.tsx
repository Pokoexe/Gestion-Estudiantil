import { useState } from "react";
import { Search, Users, CircleAlert, ChevronRight, X, User, CheckCircle2, Clock } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Pagination } from "../components/Pagination";
import { useFetch } from "../datos_maquetados";
import { getEstudiantesReparacion, type StudentRow, type MatStatus } from "../datos_maquetados/actions/evaluador-discusion";

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const PER_PAGE = 8;

const DONUT_COLORS = [
  "#f43f5e", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#8b5cf6", "#ec4899", "#64748b",
];

function buildDonutData(riesgo: StudentRow[]) {
  const map = new Map<string, number>();
  for (const s of riesgo) {
    for (const m of s.materias) {
      if (m.status === "reprobada" || m.status === "pendiente") {
        map.set(m.name, (map.get(m.name) ?? 0) + 1);
      }
    }
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function studentStatus(s: StudentRow): { label: string; cls: string } {
  const rep = s.materias.filter((m) => m.status === "reprobada").length;
  if (rep >= 3) return { label: "Crítico", cls: "bg-edu-danger-bg text-edu-danger" };
  if (rep >= 1) return { label: "En riesgo", cls: "bg-edu-warning-bg text-edu-warning" };
  return { label: "Pendiente", cls: "bg-edu-primary-50 text-edu-primary" };
}

const COLS = "grid-cols-[1.8fr_0.9fr_1fr_1fr_1.1fr_0.4fr]";
const HEADERS = ["Estudiante", "Año / Secc.", "Mat. reprobadas", "Mat. pendientes", "Estado", ""];

const MAT_STATUS_META: Record<MatStatus, { label: string; cls: string; dot: string }> = {
  reprobada: { label: "Reprobada",  cls: "bg-edu-danger-bg text-edu-danger",   dot: "#ef4444" },
  pendiente: { label: "Pendiente",  cls: "bg-edu-warning-bg text-edu-warning", dot: "#f59e0b" },
  reparando: { label: "Reparando",  cls: "bg-edu-primary-50 text-edu-primary", dot: TEAL },
  aprobada:  { label: "Aprobada",   cls: "bg-edu-success-bg text-edu-success", dot: "#22c55e" },
};

export function EvalReparacionesPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<StudentRow | null>(null);

  const { data: estudiantes, loading } = useFetch(getEstudiantesReparacion, []);

  const RIESGO_STUDENTS = estudiantes.filter(
    (s) => s.materias.some((m) => m.status === "reprobada" || m.status === "pendiente"),
  );

  const pendienteCount = RIESGO_STUDENTS.filter(
    (s) => s.materias.some((m) => m.status === "pendiente"),
  ).length;

  const totalReprobadas = RIESGO_STUDENTS.reduce(
    (acc, s) => acc + s.materias.filter((m) => m.status === "reprobada").length,
    0,
  );

  const DONUT_DATA = buildDonutData(RIESGO_STUDENTS);

  const rows = RIESGO_STUDENTS.filter(
    (s) =>
      !query.trim() ||
      s.name.toLowerCase().includes(query.trim().toLowerCase()) ||
      s.cedula.includes(query.trim()),
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = rows.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  if (loading) return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

  return (
    <div className="flex flex-col gap-5">
      {/* Top: 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Left: 2 KPIs stacked */}
        <div className="flex flex-col gap-4">
          <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                  Estudiantes con mat. pendiente
                </p>
                <p className="text-edu-ink text-[1.4rem] font-bold mt-1 m-0">
                  {pendienteCount}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                style={{ backgroundColor: TEAL_BG }}
              >
                <Users style={{ width: "20px", height: "20px", color: TEAL }} />
              </div>
            </div>
            <p className="text-edu-ink-400 text-xs m-0">
              Con al menos una materia sin nota definitiva
            </p>
          </div>

          <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                  Materias reprobadas
                </p>
                <p className="text-edu-ink text-[1.4rem] font-bold mt-1 m-0">
                  {totalReprobadas}
                </p>
              </div>
              <div className="w-10 h-10 rounded-edu-control bg-edu-danger-bg flex items-center justify-center shrink-0">
                <CircleAlert className="w-5 h-5 text-edu-danger" />
              </div>
            </div>
            <p className="text-edu-ink-400 text-xs m-0">
              Total de materias reprobadas en el lapso actual
            </p>
          </div>
        </div>

        {/* Right: Donut chart */}
        <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-4">
          <div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
              Materias con reprobados
            </h3>
            <p className="m-0 text-edu-ink-400 text-xs mt-0.5">
              Incluye materias pendientes
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 items-center flex-1">
            <div className="shrink-0" style={{ width: 150, height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DONUT_DATA}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="52%"
                    outerRadius="82%"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {DONUT_DATA.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number, n: string) => [`${v} estudiantes`, n]}
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              {DONUT_DATA.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                    />
                    <span className="text-[0.8rem] text-edu-ink-700 truncate">{d.name}</span>
                  </div>
                  <span className="text-[0.8rem] font-bold text-edu-ink shrink-0">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Estudiantes en riesgo</h3>
          <span className="text-[0.8rem] text-edu-ink-400 font-medium">{rows.length} estudiantes</span>
        </div>

        <div className="px-5 py-3 border-b border-edu-border-soft">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar estudiante o cédula…"
              className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-teal-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
              {HEADERS.map((h) => (
                <span
                  key={h}
                  className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                >
                  {h}
                </span>
              ))}
            </div>

            {rows.length === 0 && (
              <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                No hay estudiantes que coincidan con la búsqueda.
              </div>
            )}

            {paged.map((s, i) => {
              const repCount = s.materias.filter((m) => m.status === "reprobada").length;
              const penCount = s.materias.filter((m) => m.status === "pendiente").length;
              const st = studentStatus(s);
              return (
                <div
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`grid ${COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${
                    i < paged.length - 1 ? "border-b border-edu-border-soft" : ""
                  }`}
                >
                  <div>
                    <div className="text-[0.875rem] text-edu-ink font-medium">{s.name}</div>
                    <div className="text-[0.75rem] text-edu-ink-400 mt-0.5">{s.cedula}</div>
                  </div>
                  <span className="text-[0.875rem] text-edu-ink-700">
                    {s.anio} {s.seccion}
                  </span>
                  <span
                    className={`text-[0.875rem] font-semibold ${
                      repCount > 0 ? "text-edu-danger" : "text-edu-ink-400"
                    }`}
                  >
                    {repCount}
                  </span>
                  <span
                    className={`text-[0.875rem] font-semibold ${
                      penCount > 0 ? "text-edu-warning" : "text-edu-ink-400"
                    }`}
                  >
                    {penCount}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}
                  >
                    {st.label}
                  </span>
                  <div className="flex justify-end">
                    <ChevronRight className="w-4 h-4 text-edu-ink-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-edu-border-soft">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Modal: detalle del estudiante */}
      {selected && (() => {
        const st = studentStatus(selected);
        const reprobadas = selected.materias.filter((m) => m.status === "reprobada");
        const pendientes = selected.materias.filter((m) => m.status === "pendiente");
        const aprobadas  = selected.materias.filter((m) => m.status === "aprobada" || m.status === "reparando");
        const initials = selected.name.split(" ").slice(0, 2).map((w) => w[0]).join("");
        return (
          <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Encabezado */}
              <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{ backgroundColor: TEAL_BG, color: TEAL }}
                  >
                    {initials || <User className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] truncate">
                      {selected.name}
                    </h3>
                    <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">
                      {selected.cedula} · {selected.anio} Año Secc. {selected.seccion}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Cerrar"
                  className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Estado + contadores */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-edu-control bg-edu-subtle">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-edu-pill text-[0.75rem] font-semibold ${st.cls}`}>
                    {st.label}
                  </span>
                  <div className="flex gap-3 ml-auto text-[0.8125rem]">
                    <span className="text-edu-danger font-semibold">
                      {reprobadas.length} reprobada{reprobadas.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-edu-ink-300">·</span>
                    <span className="text-edu-warning font-semibold">
                      {pendientes.length} pendiente{pendientes.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Materias reprobadas */}
                {reprobadas.length > 0 && (
                  <div>
                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold mb-2">
                      Materias reprobadas
                    </div>
                    <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                      {reprobadas.map((m, i) => (
                        <div
                          key={m.name}
                          className={`flex items-center justify-between px-3.5 py-2.5 ${
                            i < reprobadas.length - 1 ? "border-b border-edu-border-soft" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <CircleAlert className="w-3.5 h-3.5 text-edu-danger shrink-0" />
                            <span className="text-[0.875rem] text-edu-ink font-medium">{m.name}</span>
                          </div>
                          <span className="inline-flex items-center px-2 py-[2px] rounded-edu-pill text-[0.68rem] font-semibold bg-edu-danger-bg text-edu-danger">
                            Reprobada
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Materias pendientes */}
                {pendientes.length > 0 && (
                  <div>
                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold mb-2">
                      Materias pendientes
                    </div>
                    <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                      {pendientes.map((m, i) => (
                        <div
                          key={m.name}
                          className={`flex items-center justify-between px-3.5 py-2.5 ${
                            i < pendientes.length - 1 ? "border-b border-edu-border-soft" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-edu-warning shrink-0" />
                            <span className="text-[0.875rem] text-edu-ink font-medium">{m.name}</span>
                          </div>
                          <span className="inline-flex items-center px-2 py-[2px] rounded-edu-pill text-[0.68rem] font-semibold bg-edu-warning-bg text-edu-warning">
                            Pendiente
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Materias aprobadas */}
                {aprobadas.length > 0 && (
                  <div>
                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold mb-2">
                      Materias aprobadas
                    </div>
                    <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                      {aprobadas.map((m, i) => {
                        const meta = MAT_STATUS_META[m.status];
                        return (
                          <div
                            key={m.name}
                            className={`flex items-center justify-between px-3.5 py-2.5 ${
                              i < aprobadas.length - 1 ? "border-b border-edu-border-soft" : ""
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-edu-success shrink-0" />
                              <span className="text-[0.875rem] text-edu-ink-700">{m.name}</span>
                            </div>
                            <span className={`inline-flex items-center px-2 py-[2px] rounded-edu-pill text-[0.68rem] font-semibold ${meta.cls}`}>
                              {meta.label}
                            </span>
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
      })()}
    </div>
  );
}
