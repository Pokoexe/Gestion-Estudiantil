import { useState } from "react";
import {
  AlertTriangle,
  Users,
  Wallet,
  Search,
  Phone,
  Bell,
  Check,
} from "lucide-react";
import { color, accent } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

type Currency = "USD" | "Bs." | "COP";

interface Debtor {
  id: number;
  rep: string;
  students: string;
  months: number;
  amount: number;
  currency: Currency;
  phone: string;
}

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const DEBTORS: Debtor[] = [
  { id: 1, rep: "Pedro Nava", students: "Andrés Nava · 5.º B", months: 3, amount: 195, currency: "USD", phone: "0414-1122334" },
  { id: 2, rep: "Luisana Mendoza", students: "Camila Mendoza · 1.º A", months: 3, amount: 7200, currency: "Bs.", phone: "0424-5566778" },
  { id: 3, rep: "Jorge Emilio Castro", students: "Sofía Castro · 4.º C, Luis Castro · 2.º B", months: 2, amount: 260, currency: "USD", phone: "0412-9988776" },
  { id: 4, rep: "Neida Contreras", students: "Luis Contreras · 3.º A", months: 5, amount: 650000, currency: "COP", phone: "0416-3344556" },
  { id: 5, rep: "Wilmer Ochoa", students: "Gabriel Ochoa · 6.º B", months: 1, amount: 65, currency: "USD", phone: "0426-7788990" },
  { id: 6, rep: "Aracelis Duque", students: "Daniela Duque · 2.º C", months: 4, amount: 9600, currency: "Bs.", phone: "0414-2211009" },
  { id: 7, rep: "Freddy Colmenares", students: "Yeison Colmenares · 5.º A, Ana Colmenares · 3.º B", months: 2, amount: 130, currency: "USD", phone: "0424-6655443" },
];

const money = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2 });

function monthsBadge(m: number): { bg: string; fg: string } {
  if (m >= 4) return { bg: color.dangerBg, fg: color.danger };
  if (m >= 2) return { bg: color.warningBg, fg: color.warning };
  return { bg: color.primary50, fg: color.primary };
}

const COLS = "grid-cols-[1.3fr_1.6fr_0.9fr_1fr_1fr_1.1fr]";
const HEADERS = ["Representante", "Estudiante(s)", "Meses", "Adeudado", "Teléfono", "Acción"];

/* ------------------------------------------------------------------ */
/* Resumen de morosidad                                                */
/* ------------------------------------------------------------------ */

const SUMMARY: { label: string; value: string; icon: React.FC<{ style?: React.CSSProperties }>; ac: { bg: string; fg: string }; hint: string }[] = [
  { label: "Representantes en mora", value: String(DEBTORS.length), icon: AlertTriangle, ac: accent.red, hint: "Con una o más mensualidades" },
  { label: "Estudiantes afectados", value: "9", icon: Users, ac: accent.amber, hint: "Requieren notificación" },
  { label: "Por cobrar (USD)", value: "$ 650", icon: Wallet, ac: accent.green, hint: "Equivalente aproximado total" },
];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function TesoreriaSolvenciaPage() {
  const [query, setQuery] = useState("");
  const [notified, setNotified] = useState<Record<number, boolean>>({});

  const filtered = DEBTORS.filter(
    (d) =>
      d.rep.toLowerCase().includes(query.toLowerCase()) ||
      d.students.toLowerCase().includes(query.toLowerCase()),
  );

  const notify = (id: number) => setNotified((prev) => ({ ...prev, [id]: true }));

  return (
    <div className="flex flex-col gap-5">
      {/* Resumen de morosidad */}
      <div className="grid grid-cols-3 gap-4">
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
            </div>
          );
        })}
      </div>

      {/* Tabla de representantes sin solvencia */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-4 flex-wrap">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Representantes sin solvencia</h3>
          <div className="flex items-center gap-2 border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 bg-edu-subtle focus-within:border-edu-success">
            <Search className="w-4 h-4 text-edu-ink-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar representante o estudiante"
              className="bg-transparent border-none outline-none text-[0.8125rem] text-edu-ink w-56 placeholder:text-edu-ink-400"
            />
          </div>
        </div>

        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
          {HEADERS.map((h) => (
            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-edu-ink-400 text-sm">Sin coincidencias para «{query}».</div>
        )}

        {filtered.map((d, i) => {
          const badge = monthsBadge(d.months);
          const isNotified = notified[d.id];
          return (
            <div key={d.id} className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < filtered.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-[34px] h-[34px] rounded-full bg-edu-subtle border border-edu-border flex items-center justify-center text-xs font-bold text-edu-ink-500 shrink-0">
                  {d.rep.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <span className="text-sm text-edu-ink font-medium">{d.rep}</span>
              </div>
              <span className="text-[0.8125rem] text-edu-ink-700">{d.students}</span>
              <span className="inline-flex items-center justify-center px-3 py-[3px] rounded-edu-pill text-[0.72rem] font-semibold w-fit" style={{ backgroundColor: badge.bg, color: badge.fg }}>
                {d.months} {d.months === 1 ? "mes" : "meses"}
              </span>
              <span className="text-sm text-edu-danger font-bold">{money(d.amount)} {d.currency}</span>
              <span className="text-[0.8125rem] text-edu-ink-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-edu-ink-400 shrink-0" />
                {d.phone}
              </span>
              {isNotified ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-edu-chip text-[0.775rem] font-semibold w-fit bg-edu-success-bg text-edu-success">
                  <Check style={{ width: "13px", height: "13px" }} />
                  Notificado
                </span>
              ) : (
                <button
                  onClick={() => notify(d.id)}
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
      </div>
    </div>
  );
}
