import { useState } from "react";
import {
  Check,
  X,
  Landmark,
  Receipt,
  ClipboardCheck,
  Clock,
  Eye,
} from "lucide-react";
import { BaucheModal } from "../components/BaucheModal";
import { ConfirmDialog } from "../components/ConfirmDialog";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

type Currency = "USD" | "Bs." | "COP";

interface PendingPay {
  id: number;
  rep: string;
  student: string;
  amount: number;
  currency: Currency;
  bank: string;
  ref: string;
  date: string;
}

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const PENDING: PendingPay[] = [
  { id: 1, rep: "María Fernanda Rojas", student: "Diego Rojas · 4.º A", amount: 65, currency: "USD", bank: "Zelle · Bank of America", ref: "4821-0092", date: "2 jul 2026" },
  { id: 2, rep: "Carlos Alberto Guerra", student: "Valentina Guerra · 1.º B", amount: 2400, currency: "Bs.", bank: "Pago Móvil · Banco de Venezuela", ref: "0102-77341", date: "2 jul 2026" },
  { id: 3, rep: "Yohana Piñango", student: "Samuel Piñango · 6.º A", amount: 260000, currency: "COP", bank: "Nequi · Bancolombia", ref: "3390-1187", date: "1 jul 2026" },
  { id: 4, rep: "Ronald Betancourt", student: "Isabella Betancourt · 3.º C", amount: 65, currency: "USD", bank: "Zelle · Chase", ref: "7715-4408", date: "1 jul 2026" },
  { id: 5, rep: "Génesis Alvarado", student: "Mateo Alvarado · 2.º A", amount: 4800, currency: "Bs.", bank: "Transferencia · Banesco", ref: "0134-98220", date: "30 jun 2026" },
];

const money = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2 });

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function TesoreriaConfirmarPage() {
  const [pending, setPending] = useState<PendingPay[]>(PENDING);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selected, setSelected] = useState<PendingPay | null>(null);
  const [confirm, setConfirm] = useState<{ p: PendingPay; ok: boolean } | null>(null);

  const resolve = (p: PendingPay, ok: boolean) => {
    setPending((prev) => prev.filter((x) => x.id !== p.id));
    setSelected(null);
    setFeedback({
      msg: ok
        ? `Pago de ${p.rep} por ${money(p.amount)} ${p.currency} confirmado y sumado a caja.`
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

      {/* Encabezado con contador */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-edu-card bg-edu-warning-bg flex items-center justify-center shrink-0">
          <ClipboardCheck className="w-6 h-6 text-edu-warning" />
        </div>
        <div className="flex-1">
          <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Pagos manuales por confirmar</p>
          <p className="text-edu-ink text-[1.4rem] font-bold mt-0.5 m-0">{pending.length} pendiente{pending.length === 1 ? "" : "s"}</p>
          <p className="text-edu-ink-400 text-[0.8rem] m-0">Transferencias subidas por los representantes en espera de validación</p>
        </div>
      </div>

      {/* Lista de comprobantes */}
      {pending.length === 0 ? (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-full bg-edu-success-bg flex items-center justify-center">
            <Check className="w-6 h-6 text-edu-success" />
          </div>
          <p className="text-edu-ink font-semibold text-[0.95rem] m-0">No quedan pagos por confirmar</p>
          <p className="text-edu-ink-400 text-sm m-0">Todos los comprobantes fueron revisados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {pending.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(p)}
              className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col cursor-pointer transition-colors hover:border-edu-primary focus:outline-none focus-visible:border-edu-primary"
            >
              <div className="flex gap-3.5 p-4">
                {/* Miniatura de comprobante */}
                <div className="group relative w-20 h-20 rounded-edu-control bg-edu-subtle border border-edu-border-soft flex flex-col items-center justify-center gap-1 shrink-0">
                  <Receipt className="w-6 h-6 text-edu-ink-400" />
                  <span className="text-[0.6rem] text-edu-ink-400 font-medium">Comprobante</span>
                  <div className="absolute inset-0 rounded-edu-control bg-edu-ink/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-edu-ink font-semibold m-0 truncate">{p.rep}</p>
                  <p className="text-[0.8125rem] text-edu-ink-500 m-0 truncate">{p.student}</p>
                  <p className="text-[1.15rem] text-edu-ink font-bold mt-1 m-0">{money(p.amount)} <span className="text-[0.8rem] text-edu-ink-500 font-semibold">{p.currency}</span></p>
                  <span className="inline-flex items-center gap-1 text-[0.7rem] text-edu-ink-400 mt-1">
                    <Clock className="w-3 h-3" /> {p.date}
                  </span>
                </div>
              </div>

              {/* Banco / referencia */}
              <div className="mx-4 mb-3 rounded-edu-control bg-edu-subtle px-3.5 py-2.5 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-edu-ink-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{p.bank}</div>
                  <div className="text-[0.72rem] text-edu-ink-400">Referencia (bauche): {p.ref}</div>
                </div>
                <span className="inline-flex items-center gap-1 text-[0.72rem] text-edu-primary font-semibold shrink-0">
                  <Eye className="w-3.5 h-3.5" /> Ver
                </span>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 px-4 pb-4 mt-auto">
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirm({ p, ok: true }); }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-edu-control border-none bg-edu-success text-white text-sm font-semibold cursor-pointer transition-colors hover:brightness-95"
                >
                  <Check className="w-4 h-4" />
                  Aceptar
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirm({ p, ok: false }); }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-edu-control border-[1.5px] border-edu-danger-bg bg-edu-danger-bg text-edu-danger text-sm font-semibold cursor-pointer transition-colors hover:brightness-95"
                >
                  <X className="w-4 h-4" />
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: datos + bauche de la transferencia */}
      {selected && (
        <BaucheModal
          showOptions={true}
          rep={selected.rep}
          student={selected.student}
          amount={`${money(selected.amount)} ${selected.currency}`}
          method={selected.bank}
          reference={selected.ref}
          date={selected.date}
          onClose={() => setSelected(null)}
          onAccept={() => setConfirm({ p: selected, ok: true })}
          onReject={() => setConfirm({ p: selected, ok: false })}
        />
      )}

      {/* Confirmación de aceptar / rechazar */}
      {confirm && (
        <ConfirmDialog
          title={confirm.ok ? "Confirmar pago" : "Rechazar pago"}
          message="¿Está seguro que desea continuar?"
          confirmLabel={confirm.ok ? "Sí, aceptar" : "Sí, rechazar"}
          icon={confirm.ok ? Check : X}
          tone={confirm.ok ? "success" : "danger"}
          onConfirm={() => { resolve(confirm.p, confirm.ok); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
