import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Wallet,
  AlertTriangle,
  HandCoins,
  BellRing,
  PackagePlus,
  Check,
  X,
  Eye,
  TrendingUp,
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
import { color, radius, shadow, accent } from "../theme/tokens";
import { BaucheModal } from "../components/BaucheModal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useFetch } from "../datos_maquetados";
import {
  getRecaudoMensual,
  getPagosPorConfirmarResumen,
  getMorosos,
  type DashboardPendingPay,
} from "../datos_maquetados/actions/tesoreria";

/* ---------- Datos ficticios ---------- */

const KPIS: {
  label: string;
  value: string;
  hint: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  trend?: string;
}[] = [
    {
      label: "Recaudado este mes",
      value: "$ 8.450",
      hint: "USD · 68 pagos confirmados",
      icon: Wallet,
      ac: accent.green,
      trend: "+12,4 % vs. mayo",
    },
    {
      label: "Sin solvencia",
      value: "14",
      hint: "representantes con mora",
      icon: AlertTriangle,
      ac: accent.red,
      trend: "$ 2.310 por cobrar",
    },
  ];

const QUICK_ACTIONS: {
  label: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  primary: boolean;
  to: string;
}[] = [
    { label: "Registrar pago", icon: HandCoins, primary: true, to: "/tesoreria/pagos" },
    { label: "Enviar recordatorios", icon: BellRing, primary: false, to: "/tesoreria/solvencia" },
    { label: "Agregar inventario", icon: PackagePlus, primary: false, to: "/tesoreria/inventario" },
  ];

type PendingPay = DashboardPendingPay;

/* ---------- Metadatos semánticos ---------- */

function monthsBadge(m: number): { bg: string; fg: string } {
  if (m >= 4) return { bg: color.dangerBg, fg: color.danger };
  if (m >= 2) return { bg: color.warningBg, fg: color.warning };
  return { bg: color.primary50, fg: color.primary };
}

/* ---------- Subcomponentes ---------- */

function SectionHeader({ title, link, subtitle, onLink }: { title: string; link?: string; subtitle?: string; onLink?: () => void }) {
  return (
    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
      <div>
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{title}</h3>
        {subtitle && <p className="mt-0.5 text-edu-ink-400 text-[0.78rem]">{subtitle}</p>}
      </div>
      {link && <span onClick={onLink} className="text-[0.8rem] text-edu-primary cursor-pointer font-medium hover:underline">{link} →</span>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-edu-surface border border-edu-border rounded-edu-chip shadow-[0_4px_16px_rgba(0,0,0,0.08)] px-3 py-2">
      <div style={{ fontSize: "0.7rem", color: color.ink400, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label} 2026</div>
      <div style={{ fontSize: "0.9rem", color: color.ink, fontWeight: 700, marginTop: "2px" }}>
        $ {payload[0].value.toLocaleString("es-ES")}
      </div>
    </div>
  );
}

/* ---------- Vista principal ---------- */

export function TesoreriaDashboard() {
  const navigate = useNavigate();
  const { data: MONTHLY_COLLECTION } = useFetch(getRecaudoMensual, []);
  const { data: fetchedPending } = useFetch(getPagosPorConfirmarResumen, []);
  const { data: DEBTORS } = useFetch(getMorosos, []);

  const [tab, setTab] = useState<"pagos" | "solvencia">("pagos");
  const [pending, setPending] = useState<PendingPay[]>([]);
  const [selectedPay, setSelectedPay] = useState<PendingPay | null>(null);
  const [confirmPay, setConfirmPay] = useState<{ p: PendingPay; ok: boolean } | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => setPending(fetchedPending), [fetchedPending]);

  const resolvePay = (p: PendingPay, ok: boolean) => {
    setPending((prev) => prev.filter((x) => x.id !== p.id));
    setSelectedPay(null);
    setConfirmPay(null);
    setFeedback({
      msg: ok
        ? `Pago de ${p.rep} por ${p.amount} confirmado y sumado a caja.`
        : `Pago de ${p.rep} rechazado. Se notificó al representante para reenviar el comprobante.`,
      ok,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Confirmación de acción */}
      {feedback && (
        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-edu-control text-sm font-medium ${feedback.ok ? "bg-edu-success-bg text-edu-success" : "bg-edu-danger-bg text-edu-danger"}`}>
          {feedback.ok ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
          <span className="flex-1">{feedback.msg}</span>
          <button onClick={() => setFeedback(null)} aria-label="Cerrar" className="bg-transparent border-none cursor-pointer p-0 flex items-center opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Fila superior: KPIs + panel por confirmar / sin solvencia */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="space-y-4">
          {/* Pagos del mes — gráfico a ancho completo */}
          <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <SectionHeader title="Pagos del mes" subtitle="Recaudo en USD · últimos 6 meses" link="Ver reporte completo" onLink={() => navigate("/tesoreria/pagos")} />
            <div className="px-4 pt-5 pb-3">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={MONTHLY_COLLECTION} margin={{ top: 8, right: 12, left: 4, bottom: 0 }} barCategoryGap="32%">
                  <CartesianGrid vertical={false} stroke={color.borderSoft} />
                  <XAxis
                    dataKey="mes"
                    tickLine={false}
                    axisLine={{ stroke: color.border }}
                    tick={{ fill: color.ink400, fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: color.ink400, fontSize: 12 }}
                    tickFormatter={(v) => `$ ${(v / 1000).toLocaleString("es-ES")}k`}
                    width={48}
                  />
                  <Tooltip cursor={{ fill: color.primary50 }} content={<CustomTooltip />} />
                  <Bar dataKey="monto" radius={[6, 6, 0, 0]} maxBarSize={46}>
                    {MONTHLY_COLLECTION.map((entry, i) => (
                      <Cell key={i} fill={i === MONTHLY_COLLECTION.length - 1 ? color.primary : color.primary200} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            {KPIS.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.label}
                  className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                        {kpi.label}
                      </p>
                      <p className="text-edu-ink text-[1.4rem] font-bold mt-1">{kpi.value}</p>
                    </div>
                    <div
                      className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                      style={{ backgroundColor: kpi.ac.bg }}
                    >
                      <Icon style={{ width: "20px", height: "20px", color: kpi.ac.fg }} />
                    </div>
                  </div>
                  <p className="text-edu-ink-400 text-xs m-0">{kpi.hint}</p>
                  {kpi.trend && (
                    <span
                      className="inline-flex items-center gap-[5px] text-[0.7rem] font-semibold px-[9px] py-[3px] rounded-edu-pill w-fit"
                      style={{ color: kpi.ac.fg, backgroundColor: kpi.ac.bg }}
                    >
                      <TrendingUp style={{ width: "11px", height: "11px" }} />
                      {kpi.trend}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {/* Acciones rápidas */}
          <div className="flex flex-wrap gap-3 ">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.to)}
                  className={`w-full inline-flex justify-center items-center gap-[9px] px-5 py-[11px] rounded-edu-control text-sm font-semibold cursor-pointer transition-colors ${action.primary
                    ? "border-none bg-edu-primary text-white hover:bg-edu-primary-hover"
                    : "border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 hover:bg-edu-subtle"
                    }`}
                >
                  <Icon style={{ width: "16px", height: "16px" }} />
                  {action.label}
                </button>
              );
            })}
          </div>

          {/* Panel con 2 pestañas: por confirmar / sin solvencia (ocupa las 2 cols liberadas) */}
          <div className="c bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
            <div className="px-2 pt-2 border-b border-edu-border-soft flex gap-1">
              {([
                { key: "pagos", label: "Por confirmar" },
                { key: "solvencia", label: "Sin solvencia" },
              ] as const).map((t) => {
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex-1 px-2 py-2.5 text-[0.78rem] font-semibold border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${active ? "border-edu-primary text-edu-primary" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"
                      }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Pagos manuales por confirmar */}
            {tab === "pagos" && (
              <div className="flex flex-col">
                {pending.length === 0 && (
                  <div className="px-4 py-8 text-center text-edu-ink-400 text-sm">No quedan pagos por confirmar.</div>
                )}
                {pending.slice(0, 5).map((p, i, arr) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPay(p)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedPay(p)}
                    className={`px-4 py-3 flex flex-col gap-2 cursor-pointer transition-colors hover:bg-edu-subtle focus:outline-none focus-visible:bg-edu-subtle ${i < arr.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{p.rep}</div>
                        <div className="text-[0.72rem] text-edu-ink-400 truncate">{p.student}</div>
                      </div>
                      <span className="text-[0.8125rem] text-edu-ink font-bold shrink-0">{p.amount}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[0.7rem] text-edu-primary font-semibold truncate inline-flex items-center gap-1"><Eye className="w-3 h-3 shrink-0" /> Ver comprobante</span>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={(e) => { e.stopPropagation(); setConfirmPay({ p, ok: true }); }} aria-label="Aceptar" className="w-7 h-7 rounded-edu-chip border-none bg-edu-success text-white flex items-center justify-center cursor-pointer transition-colors hover:brightness-95">
                          <Check style={{ width: "13px", height: "13px" }} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setConfirmPay({ p, ok: false }); }} aria-label="Rechazar" className="w-7 h-7 rounded-edu-chip border-none bg-edu-danger-bg text-edu-danger flex items-center justify-center cursor-pointer transition-colors hover:brightness-95">
                          <X style={{ width: "13px", height: "13px" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Representantes sin solvencia */}
            {tab === "solvencia" && (
              <div className="flex flex-col">
                {DEBTORS.slice(0, 5).map((d, i, arr) => {
                  const badge = monthsBadge(d.months);
                  return (
                    <div
                      key={d.id}
                      className={`px-4 py-3 flex items-center gap-2.5 ${i < arr.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-edu-subtle border border-edu-border flex items-center justify-center text-[0.68rem] font-bold text-edu-ink-500 shrink-0">
                        {d.rep.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{d.rep}</div>
                        <div className="text-[0.72rem] text-edu-ink-400 truncate">{d.student}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[0.8125rem] text-edu-danger font-bold">{d.amount}</span>
                        <span
                          className="inline-flex items-center justify-center px-2 py-[1px] rounded-edu-pill text-[0.65rem] font-semibold"
                          style={{ backgroundColor: badge.bg, color: badge.fg }}
                        >
                          {d.months} {d.months === 1 ? "mes" : "meses"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>



      {/* Modal: datos + bauche de la transferencia seleccionada */}
      {selectedPay && (
        <BaucheModal
          showOptions={true}
          rep={selectedPay.rep}
          student={selectedPay.student}
          amount={selectedPay.amount}
          method={selectedPay.method}
          reference={selectedPay.ref}
          date={selectedPay.date}
          onClose={() => setSelectedPay(null)}
          onAccept={() => setConfirmPay({ p: selectedPay, ok: true })}
          onReject={() => setConfirmPay({ p: selectedPay, ok: false })}
        />
      )}

      {/* Confirmación de aceptar / rechazar */}
      {confirmPay && (
        <ConfirmDialog
          title={confirmPay.ok ? "Confirmar pago" : "Rechazar pago"}
          message="¿Está seguro que desea continuar?"
          confirmLabel={confirmPay.ok ? "Sí, aceptar" : "Sí, rechazar"}
          icon={confirmPay.ok ? Check : X}
          tone={confirmPay.ok ? "success" : "danger"}
          onConfirm={() => resolvePay(confirmPay.p, confirmPay.ok)}
          onCancel={() => setConfirmPay(null)}
        />
      )}
    </div>
  );
}
