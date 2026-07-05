import { useState } from "react";
import {
  AlertTriangle,
  UserCheck,
  Wallet,
  TrendingDown,
  Search,
  Phone,
  Bell,
  Check,
  X,
} from "lucide-react";
import { color, accent } from "../theme/tokens";
import { Pagination } from "../components/Pagination";
import { ConfirmDialog } from "../components/ConfirmDialog";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

type Currency = "USD" | "Bs." | "COP";

interface Representative {
  id: number;
  rep: string;
  students: string;
  months: number; // 0 = solvente
  amount: number; // 0 = solvente
  currency: Currency;
  phone: string;
}

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const REPRESENTATIVES: Representative[] = [
  // En mora
  { id: 1, rep: "Pedro Nava", students: "Andrés Nava · 5.º B", months: 3, amount: 195, currency: "USD", phone: "0414-1122334" },
  { id: 2, rep: "Luisana Mendoza", students: "Camila Mendoza · 1.º A", months: 3, amount: 7200, currency: "Bs.", phone: "0424-5566778" },
  { id: 3, rep: "Jorge Emilio Castro", students: "Sofía Castro · 4.º C, Luis Castro · 2.º B", months: 2, amount: 260, currency: "USD", phone: "0412-9988776" },
  { id: 4, rep: "Neida Contreras", students: "Luis Contreras · 3.º A", months: 5, amount: 650000, currency: "COP", phone: "0416-3344556" },
  { id: 5, rep: "Wilmer Ochoa", students: "Gabriel Ochoa · 6.º B", months: 1, amount: 65, currency: "USD", phone: "0426-7788990" },
  { id: 6, rep: "Aracelis Duque", students: "Daniela Duque · 2.º C", months: 4, amount: 9600, currency: "Bs.", phone: "0414-2211009" },
  { id: 7, rep: "Freddy Colmenares", students: "Yeison Colmenares · 5.º A, Ana Colmenares · 3.º B", months: 2, amount: 130, currency: "USD", phone: "0424-6655443" },
  // Solventes
  { id: 8, rep: "María Fernanda Rojas", students: "Diego Rojas · 4.º A", months: 0, amount: 0, currency: "USD", phone: "0414-3216549" },
  { id: 9, rep: "Carlos Alberto Guerra", students: "Valentina Guerra · 1.º B", months: 0, amount: 0, currency: "Bs.", phone: "0424-1472583" },
  { id: 10, rep: "Yohana Piñango", students: "Samuel Piñango · 6.º A", months: 0, amount: 0, currency: "COP", phone: "0412-7539514" },
  { id: 11, rep: "Ronald Betancourt", students: "Isabella Betancourt · 3.º C", months: 0, amount: 0, currency: "USD", phone: "0416-9515357" },
  { id: 12, rep: "Génesis Alvarado", students: "Mateo Alvarado · 2.º A", months: 0, amount: 0, currency: "Bs.", phone: "0426-3571592" },
  { id: 13, rep: "Douglas Sánchez", students: "Andrea Sánchez · 5.º B", months: 0, amount: 0, currency: "USD", phone: "0414-8529637" },
  { id: 14, rep: "Marbella Quintero", students: "Josué Quintero · 1.º A", months: 0, amount: 0, currency: "COP", phone: "0424-9637418" },
  { id: 15, rep: "Alexis Parra", students: "Camila Parra · 4.º B", months: 0, amount: 0, currency: "Bs.", phone: "0412-1593574" },
  { id: 16, rep: "Rosa Elena Díaz", students: "Miguel Díaz · 3.º A, Laura Díaz · 1.º C", months: 0, amount: 0, currency: "USD", phone: "0416-7412589" },
  { id: 17, rep: "Héctor Villalba", students: "Fabiana Villalba · 6.º B", months: 0, amount: 0, currency: "Bs.", phone: "0426-8523697" },
  { id: 18, rep: "Nancy Peralta", students: "Emilio Peralta · 2.º B", months: 0, amount: 0, currency: "USD", phone: "0414-3698521" },
  { id: 19, rep: "Oswaldo Rincón", students: "Gabriela Rincón · 4.º A", months: 0, amount: 0, currency: "COP", phone: "0424-1234567" },
  { id: 20, rep: "Yelitza Moreno", students: "Santiago Moreno · 5.º C", months: 0, amount: 0, currency: "Bs.", phone: "0412-7654321" },
];

const money = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2 });

function monthsBadge(m: number): { bg: string; fg: string } {
  if (m >= 4) return { bg: color.dangerBg, fg: color.danger };
  if (m >= 2) return { bg: color.warningBg, fg: color.warning };
  return { bg: color.primary50, fg: color.primary };
}

const initials = (name: string) => name.split(" ").map((n) => n[0]).slice(0, 2).join("");

/** Extrae el/los año(s) escolar(es) del texto de estudiantes: "Nombre · 5.º B" → "5.º B". */
function studentYears(students: string): string {
  return students
    .split(",")
    .map((s) => s.split("·")[1]?.trim())
    .filter(Boolean)
    .join(", ");
}

/** Describe el hábito de pago del representante según su atraso. */
function payPattern(r: Representative): string {
  if (r.months === 0) return "Paga puntualmente todos los meses.";
  if (r.months >= 4) return "Suele acumular y pagar el total cada 4–5 meses.";
  if (r.months >= 2) return "Normalmente paga el total cada 2–3 meses.";
  return "Suele ponerse al día al mes siguiente.";
}

const COLS = "grid-cols-[1.3fr_1.6fr_0.9fr_1fr_1fr_1.1fr]";
const HEADERS = ["Representante", "Estudiante(s)", "Meses", "Adeudado", "Teléfono", "Acción"];

/* ------------------------------------------------------------------ */
/* Métricas de solvencia                                               */
/* ------------------------------------------------------------------ */

const morososCount = REPRESENTATIVES.filter((r) => r.months > 0).length;
const solventesCount = REPRESENTATIVES.filter((r) => r.months === 0).length;
const payRate = Math.round((solventesCount / REPRESENTATIVES.length) * 100);

const SUMMARY: {
  label: string;
  value: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  hint: string;
  trend?: string;
}[] = [
    { label: "Representantes en mora", value: String(morososCount), icon: AlertTriangle, ac: accent.red, hint: "Con una o más mensualidades" },
    { label: "Representantes solventes", value: String(solventesCount), icon: UserCheck, ac: accent.green, hint: "Al día con sus pagos" },
    { label: "Por cobrar (USD)", value: "$ 650", icon: Wallet, ac: accent.amber, hint: "Equivalente aproximado total" },
    { label: "Representantes que pagan", value: `${payRate} %`, icon: TrendingDown, ac: accent.blue, hint: "Promedio mensual de pago" },
  ];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

const PER_PAGE = 7;

export function TesoreriaSolvenciaPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | "solvente" | "mora">("todos");
  const [page, setPage] = useState(1);
  const [notified, setNotified] = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<Representative | null>(null);
  const [confirmNotify, setConfirmNotify] = useState<Representative | null>(null);

  const filtered = REPRESENTATIVES.filter((r) => {
    const solvent = r.months === 0;
    if (statusFilter === "solvente" && !solvent) return false;
    if (statusFilter === "mora" && solvent) return false;
    if (query.trim() && !`${r.rep} ${r.students}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const notify = (id: number) => setNotified((prev) => ({ ...prev, [id]: true }));

  return (
    <div className="flex flex-col gap-5">
      {/* Resumen de solvencia */}
      <div className="grid grid-cols-4 gap-4">
        {SUMMARY.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">{k.label}</p>
                  <p className="text-edu-ink text-[1.6rem] font-bold mt-1 m-0">{k.value}</p>
                </div>
                <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: k.ac.bg }}>
                  <Icon style={{ width: "20px", height: "20px", color: k.ac.fg }} />
                </div>
              </div>
              <p className="text-edu-ink-400 text-xs m-0">{k.hint}</p>
              {k.trend && (
                <span className="inline-flex items-center gap-[5px] text-[0.7rem] font-semibold px-[9px] py-[3px] rounded-edu-pill w-fit bg-edu-danger-bg text-edu-danger">
                  <TrendingDown style={{ width: "11px", height: "11px" }} />
                  {k.trend}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Tabla de solvencia de representantes */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Solvencia de representantes</h3>
          <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filtered.length} representante{filtered.length === 1 ? "" : "s"}</span>
        </div>

        {/* Buscador y filtros */}
        <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Buscar representante o estudiante…"
              className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as "todos" | "solvente" | "mora"); setPage(1); }}
            className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
          >
            <option value="todos">Todos</option>
            <option value="solvente">Solventes</option>
            <option value="mora">En mora</option>
          </select>
        </div>

        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
          {HEADERS.map((h) => (
            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
          ))}
        </div>

        {paged.length === 0 && (
          <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay representantes que coincidan con el filtro.</div>
        )}

        {paged.map((r, i) => {
          const solvent = r.months === 0;
          const badge = monthsBadge(r.months);
          const isNotified = notified[r.id];
          return (
            <div
              key={r.id}
              onClick={() => setSelected(r)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(r)}
              className={`grid ${COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-[34px] h-[34px] rounded-full bg-edu-subtle border border-edu-border flex items-center justify-center text-xs font-bold text-edu-ink-500 shrink-0">
                  {r.rep.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <span className="text-sm text-edu-ink font-medium">{r.rep}</span>
              </div>
              <span className="text-[0.8125rem] text-edu-ink-700">{r.students}</span>
              {solvent ? (
                <span className="inline-flex items-center justify-center px-3 py-[3px] rounded-edu-pill text-[0.72rem] font-semibold w-fit bg-edu-success-bg text-edu-success">Al día</span>
              ) : (
                <span className="inline-flex items-center justify-center px-3 py-[3px] rounded-edu-pill text-[0.72rem] font-semibold w-fit" style={{ backgroundColor: badge.bg, color: badge.fg }}>
                  {r.months} {r.months === 1 ? "mes" : "meses"}
                </span>
              )}
              {solvent ? (
                <span className="text-[0.8125rem] text-edu-ink-400">—</span>
              ) : (
                <span className="text-sm text-edu-danger font-bold">{money(r.amount)} {r.currency}</span>
              )}
              <span className="text-[0.8125rem] text-edu-ink-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-edu-ink-400 shrink-0" />
                {r.phone}
              </span>
              {solvent ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-edu-chip text-[0.775rem] font-semibold w-fit bg-edu-success-bg text-edu-success">
                  <Check style={{ width: "13px", height: "13px" }} />
                  Solvente
                </span>
              ) : isNotified ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-edu-chip text-[0.775rem] font-semibold w-fit bg-edu-success-bg text-edu-success">
                  <Check style={{ width: "13px", height: "13px" }} />
                  Notificado
                </span>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmNotify(r); }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-edu-chip border-none text-white text-[0.775rem] font-semibold cursor-pointer w-fit transition-colors hover:brightness-95"
                  style={{ backgroundColor: color.whatsapp }}
                >
                  <Bell style={{ width: "13px", height: "13px" }} />
                  Enviar notificación
                </button>
              )}
            </div>
          );
        })}

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-edu-border-soft">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Modal: perfil del representante */}
      {selected && (() => {
        const solvent = selected.months === 0;
        const constantDebtor = selected.months >= 3;
        const isNotified = notified[selected.id];
        return (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
              {/* Encabezado */}
              <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-edu-subtle border border-edu-border flex items-center justify-center text-sm font-bold text-edu-ink-500 shrink-0">
                    {initials(selected.rep)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] truncate">{selected.rep}</h3>
                    <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">Representante</div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Estado de solvencia */}
                <div className="flex items-center justify-between px-4 py-3 rounded-edu-control bg-edu-subtle">
                  <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Estado de solvencia</div>
                  {solvent ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-edu-pill text-[0.8rem] font-semibold bg-edu-success-bg text-edu-success">
                      <Check className="w-3.5 h-3.5" /> Solvente
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-edu-pill text-[0.8rem] font-semibold bg-edu-danger-bg text-edu-danger">
                      <AlertTriangle className="w-3.5 h-3.5" /> En mora · {selected.months} {selected.months === 1 ? "mes" : "meses"}
                    </span>
                  )}
                </div>

                {/* Datos */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="col-span-2">
                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Estudiante(s)</div>
                    <div className="text-[0.875rem] text-edu-ink font-medium">{selected.students}</div>
                  </div>
                  <div>
                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Año</div>
                    <div className="text-[0.875rem] text-edu-ink font-medium">{studentYears(selected.students)}</div>
                  </div>
                  <div>
                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Teléfono</div>
                    <div className="text-[0.875rem] text-edu-ink font-medium">{selected.phone}</div>
                  </div>
                  <div>
                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Adeudado</div>
                    <div className={`text-[0.875rem] font-medium ${solvent ? "text-edu-ink" : "text-edu-danger"}`}>{solvent ? "Sin deuda" : `${money(selected.amount)} ${selected.currency}`}</div>
                  </div>
                  <div>
                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Meses de atraso</div>
                    <div className="text-[0.875rem] text-edu-ink font-medium">{selected.months}</div>
                  </div>
                </div>

                {/* Perfil de pago */}
                <div className="rounded-edu-control border border-edu-border-soft p-4 flex flex-col gap-3">
                  <div className="text-[0.7rem] text-edu-ink-400 uppercase tracking-[0.05em] font-semibold">Perfil de pago</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.8125rem] text-edu-ink-700">Moroso constante</span>
                    {constantDebtor ? (
                      <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-edu-danger"><AlertTriangle className="w-3.5 h-3.5" /> Sí</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-edu-success"><Check className="w-3.5 h-3.5" /> No</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.8125rem] text-edu-ink-700">Ha pagado antes</span>
                    <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-edu-success"><Check className="w-3.5 h-3.5" /> Sí</span>
                  </div>
                  <div className="border-t border-edu-border-soft pt-3">
                    <div className="text-[0.72rem] text-edu-ink-400 mb-0.5">Promedio de pago</div>
                    <div className="text-[0.875rem] text-edu-ink font-medium">{payPattern(selected)}</div>
                  </div>
                </div>

                {/* Acción (solo morosos) */}
                {!solvent && (
                  <div className="flex justify-end">
                    {isNotified ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-edu-control text-sm font-semibold bg-edu-success-bg text-edu-success">
                        <Check className="w-4 h-4" /> Notificación enviada
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmNotify(selected)}
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
      })()}

      {/* Confirmación de envío de notificación */}
      {confirmNotify && (
        <ConfirmDialog
          title="Enviar notificación de cobro"
          message={<>Se enviará un recordatorio de pago a <span className="font-semibold text-edu-ink">{confirmNotify.rep}</span> por WhatsApp al {confirmNotify.phone}. ¿Está seguro que desea continuar?</>}
          confirmLabel="Enviar notificación"
          icon={Bell}
          tone="success"
          confirmStyle={{ backgroundColor: color.whatsapp }}
          onConfirm={() => { notify(confirmNotify.id); setConfirmNotify(null); }}
          onCancel={() => setConfirmNotify(null)}
        />
      )}
    </div>
  );
}
