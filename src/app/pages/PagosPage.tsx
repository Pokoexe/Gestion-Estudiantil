import { useState } from "react";
import {
    CreditCard,
    CheckCircle2,
    AlertTriangle,
    Info,
    X,
    Receipt,
    ShieldCheck,
    Landmark,
    Upload,
    Copy,
    Check,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";
import {
    SOLVENT as solvent,
    OWED as owed,
    MONTHS_LABEL as monthsLabel,
    BILLING_DAY,
    FEE_CURRENCY,
} from "../data/solvency";

type PayType = "efectivo" | "manual";
type PayStatus = "confirmed" | "review" | "rejected";

interface Payment {
    id: number;
    amount: number;
    currency: string;
    date: string;
    type: PayType;
    status: PayStatus;
    voucher: string;
    receiptUrl?: string; // foto del comprobante subida por el estudiante
}

const PAYMENTS: Payment[] = [
    { id: 1, amount: 200, currency: "USD", date: "5 jun 2026", type: "efectivo", status: "confirmed", voucher: "" },
    { id: 2, amount: 3000, currency: "Bs.", date: "5 may 2026", type: "manual", status: "confirmed", voucher: "A-1024" },
    { id: 3, amount: 200, currency: "USD", date: "5 abr 2026", type: "manual", status: "confirmed", voucher: "A-0987" },
    { id: 4, amount: 200, currency: "USD", date: "6 mar 2026", type: "manual", status: "rejected", voucher: "A-0955" },
    { id: 5, amount: 780000, currency: "COP", date: "5 feb 2026", type: "efectivo", status: "confirmed", voucher: "" },
];

const STATUS_META: Record<PayStatus, { label: string; cls: string }> = {
    confirmed: { label: "Confirmado", cls: "bg-edu-success-bg text-edu-success" },
    review: { label: "En revisión", cls: "bg-edu-warning-bg text-edu-warning" },
    rejected: { label: "Rechazado", cls: "bg-edu-danger-bg text-edu-danger" },
};

const CURRENCIES = ["USD", "COP", "Bs."];

/** Tasa de cambio desde USD (moneda de la mensualidad) hacia cada moneda de pago. */
const RATES: Record<string, number> = { USD: 1, COP: 4000, "Bs.": 36.5 };

interface PaymentAccount {
    method: string;
    fields: { label: string; value: string }[];
}

/** Cuenta destino según la moneda de pago — datos completos, sin censura. */
const ACCOUNTS_BY_CURRENCY: Record<string, PaymentAccount> = {
    "Bs.": {
        method: "Transferencia o Pago Móvil",
        fields: [
            { label: "Banco", value: "Banco de Venezuela (0102)" },
            { label: "Tipo de cuenta", value: "Cuenta Corriente" },
            { label: "N.º de cuenta", value: "0102 0345 67 8901234567" },
            { label: "Titular", value: "U.E. Colegio EduGestión" },
            { label: "RIF", value: "J-30123456-7" },
            { label: "Pago Móvil", value: "0414-1234567" },
        ],
    },
    USD: {
        method: "Zelle",
        fields: [
            { label: "Titular", value: "EduGestion School LLC" },
            { label: "Correo Zelle", value: "pagos.usd@edugestion.edu" },
            { label: "Banco", value: "Bank of America" },
            { label: "N.º de cuenta", value: "4851 2200 7788" },
            { label: "Routing (ABA)", value: "026009593" },
        ],
    },
    COP: {
        method: "Transferencia o Nequi",
        fields: [
            { label: "Banco", value: "Bancolombia" },
            { label: "Tipo de cuenta", value: "Cuenta de Ahorros" },
            { label: "N.º de cuenta", value: "123-456789-01" },
            { label: "Titular", value: "EduGestión Colombia S.A.S." },
            { label: "NIT", value: "901.234.567-8" },
            { label: "Nequi", value: "300 123 4567" },
        ],
    },
};

const MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const money = (n: number) => n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatDate = (d: Date) => `${d.getDate()} ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;

const PAY_COLS = "grid-cols-[1fr_0.8fr_1fr_1fr_1.1fr_1fr]";
const PAY_HEADERS = ["Monto", "Moneda", "Fecha", "Tipo", "Estado", "Bauche"];

export function PagosPage() {
    const [payments, setPayments] = useState<Payment[]>(PAYMENTS);
    const [showModal, setShowModal] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [form, setForm] = useState({ currency: "USD", voucher: "" });
    const [modalTab, setModalTab] = useState<"cuenta" | "prueba">("cuenta");
    const [copied, setCopied] = useState<string | null>(null);
    const [photo, setPhoto] = useState<{ name: string; url: string } | null>(null);
    const [photoError, setPhotoError] = useState(false);

    const account = ACCOUNTS_BY_CURRENCY[form.currency];
    const amountToPay = owed * (RATES[form.currency] ?? 1);

    const copyValue = (label: string, value: string) => {
        navigator.clipboard?.writeText(value);
        setCopied(label);
        setTimeout(() => setCopied((c) => (c === label ? null : c)), 1500);
    };

    const openModal = () => {
        setForm({ currency: FEE_CURRENCY, voucher: "" });
        setModalTab("cuenta");
        if (photo?.url) URL.revokeObjectURL(photo.url);
        setPhoto(null);
        setPhotoError(false);
        setShowModal(true);
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (photo?.url) URL.revokeObjectURL(photo.url);
        setPhoto({ name: file.name, url: URL.createObjectURL(file) });
        setPhotoError(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!photo) {
            setPhotoError(true);
            return;
        }
        const newPayment: Payment = {
            id: Date.now(),
            amount: amountToPay,
            currency: form.currency,
            date: formatDate(new Date()),
            type: "manual",
            status: "review",
            voucher: form.voucher.trim() || "—",
            receiptUrl: photo.url,
        };
        setPayments([newPayment, ...payments]);
        setShowModal(false);
        setFeedback("Tu pago fue enviado y quedó en estado «En revisión». Administración lo confirmará pronto.");
        setPhoto(null);
        setPhotoError(false);
    };

    return (
        <>
            {/* Confirmación de pago enviado */}
            {feedback && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-edu-control text-sm font-medium bg-edu-success-bg text-edu-success">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{feedback}</span>
                    <button
                        onClick={() => setFeedback(null)}
                        aria-label="Cerrar"
                        className="text-edu-success bg-transparent border-none cursor-pointer p-0 flex items-center"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Bloque de solvencia */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div
                        className={`w-14 h-14 rounded-edu-card flex items-center justify-center shrink-0 ${solvent ? "bg-edu-success-bg" : "bg-edu-danger-bg"}`}
                    >
                        {solvent ? (
                            <ShieldCheck className="w-7 h-7 text-edu-success" />
                        ) : (
                            <AlertTriangle className="w-7 h-7 text-edu-danger" />
                        )}
                    </div>
                    <div>
                        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                            Estado de solvencia
                        </p>
                        <p className={`text-[1.35rem] font-bold mt-0.5 ${solvent ? "text-edu-success" : "text-edu-danger"}`}>
                            {solvent ? "Estás solvente" : "No estás solvente"}
                        </p>
                        <p className="text-edu-ink-400 text-[0.8rem] m-0">
                            El cobro se realiza normalmente el día {BILLING_DAY} de cada mes
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {solvent ? (
                        <>
                            <span className="inline-flex items-center gap-1.5 bg-edu-success-bg text-edu-success text-[0.8rem] font-semibold px-3 py-1.5 rounded-edu-pill">
                                <CheckCircle2 className="w-4 h-4" /> Al día
                            </span>
                            <span className="text-edu-ink-400 text-xs">Próximo cobro: {BILLING_DAY} del próximo mes</span>
                        </>
                    ) : (
                        <>
                            <div className="text-right">
                                <div className="text-edu-ink-400 text-[0.72rem] uppercase tracking-[0.05em] font-medium">
                                    Monto adeudado
                                </div>
                                <div className="text-edu-danger text-[1.35rem] font-bold leading-tight">
                                    {money(owed)} {FEE_CURRENCY}
                                </div>
                                <div className="text-edu-ink-400 text-xs">Equivale a {monthsLabel}</div>
                            </div>
                            <button
                                onClick={openModal}
                                className="inline-flex items-center gap-2 bg-edu-primary text-white text-sm font-semibold px-4 py-2.5 rounded-edu-control border-none cursor-pointer transition-colors hover:bg-edu-primary-hover"
                            >
                                <CreditCard className="w-4 h-4" />
                                Pagar por internet
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Historial de pagos */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Historial de pagos</h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">{payments.length} pagos</span>
                </div>
                <div>
                    <div className={`grid ${PAY_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {PAY_HEADERS.map((h) => (
                            <span
                                key={h}
                                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                            >
                                {h}
                            </span>
                        ))}
                    </div>
                    {payments.map((p, i) => {
                        const st = STATUS_META[p.status];
                        return (
                            <div
                                key={p.id}
                                className={`grid ${PAY_COLS} px-5 py-[13px] items-center ${i < payments.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span className="text-[0.875rem] text-edu-ink font-semibold">{money(p.amount)}</span>
                                <span className="text-[0.875rem] text-edu-ink-700">{p.currency}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{p.date}</span>
                                <span className="text-[0.875rem] text-edu-ink-700 capitalize">{p.type}</span>
                                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}>
                                    {st.label}
                                </span>
                                <span className="text-[0.8125rem] text-edu-ink-500 flex items-center gap-1.5">
                                    {p.voucher && p.voucher !== "—" ? (
                                        p.receiptUrl ? (
                                            <a
                                                href={p.receiptUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-edu-primary font-medium no-underline hover:underline"
                                            >
                                                <Receipt className="w-3.5 h-3.5 shrink-0" />
                                                {p.voucher}
                                            </a>
                                        ) : (
                                            <>
                                                <Receipt className="w-3.5 h-3.5 text-edu-ink-400 shrink-0" />
                                                {p.voucher}
                                            </>
                                        )
                                    ) : (
                                        "—"
                                    )}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal de pago por internet */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Encabezado del modal */}
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-edu-control bg-edu-primary-50 flex items-center justify-center">
                                    <CreditCard className="w-4 h-4 text-edu-primary" />
                                </div>
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Pagar por internet</h3>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                aria-label="Cerrar"
                                className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Pestañas del modal */}
                        <div className="px-5 pt-3 border-b border-edu-border-soft">
                            <div className="flex gap-1">
                                {[
                                    { key: "cuenta", label: "Cuenta a pagar" },
                                    { key: "prueba", label: "Subir prueba" },
                                ].map((t) => (
                                    <button
                                        key={t.key}
                                        type="button"
                                        onClick={() => setModalTab(t.key as "cuenta" | "prueba")}
                                        className={`px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${
                                            modalTab === t.key
                                                ? "border-edu-primary text-edu-primary"
                                                : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"
                                        }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                            {modalTab === "cuenta" && (
                                <>
                                    {/* Moneda de pago */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-edu-ink-700 text-sm font-medium">Moneda de pago</label>
                                        <select
                                            value={form.currency}
                                            onChange={(e) => setForm({ ...form, currency: e.target.value })}
                                            className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary"
                                        >
                                            {CURRENCIES.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Cuenta destino (datos completos) */}
                                    <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                                        <div className="px-3.5 py-2.5 bg-edu-subtle border-b border-edu-border-soft flex items-center gap-2">
                                            <Landmark className="w-4 h-4 text-edu-primary shrink-0" />
                                            <span className="text-[0.8125rem] font-semibold text-edu-ink">
                                                Cuenta a pagar · {account.method}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            {account.fields.map((f, i) => (
                                                <div
                                                    key={f.label}
                                                    className={`flex items-center justify-between gap-3 px-3.5 py-2.5 ${i < account.fields.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                                >
                                                    <div className="min-w-0">
                                                        <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                                                            {f.label}
                                                        </div>
                                                        <div className="text-[0.875rem] text-edu-ink font-medium break-all">
                                                            {f.value}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyValue(f.label, f.value)}
                                                        aria-label={`Copiar ${f.label}`}
                                                        className="shrink-0 w-8 h-8 rounded-edu-chip border border-edu-border bg-edu-surface flex items-center justify-center text-edu-ink-500 cursor-pointer transition-colors hover:border-edu-primary-200 hover:text-edu-primary"
                                                    >
                                                        {copied === f.label ? (
                                                            <Check className="w-3.5 h-3.5 text-edu-success" />
                                                        ) : (
                                                            <Copy className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Monto a pagar */}
                                    <div className="flex items-center justify-between px-3.5 py-3 rounded-edu-control bg-edu-primary-50">
                                        <span className="text-[0.8125rem] font-medium text-edu-primary">
                                            Monto que debes pagar
                                        </span>
                                        <span className="text-[1.1rem] font-bold text-edu-primary">
                                            {money(amountToPay)} {form.currency}
                                        </span>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex gap-2 justify-end pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setModalTab("prueba")}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover"
                                        >
                                            Continuar
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            )}

                            {modalTab === "prueba" && (
                                <>
                                    {/* Contexto del pago */}
                                    <div className="flex items-center justify-between px-3.5 py-2.5 rounded-edu-control bg-edu-subtle text-[0.8125rem]">
                                        <span className="text-edu-ink-500">Pagando a {account.method}</span>
                                        <span className="font-semibold text-edu-ink">
                                            {money(amountToPay)} {form.currency}
                                        </span>
                                    </div>

                                    {/* Comprobante (foto) */}
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-edu-ink-700 text-sm font-medium">Comprobante (foto)</span>
                                        <label
                                            className={`border-[1.5px] border-dashed rounded-edu-control px-3.5 py-4 bg-edu-subtle cursor-pointer flex items-center gap-3 transition-colors hover:border-edu-primary-200 ${photoError ? "border-edu-danger" : "border-edu-border"}`}
                                        >
                                            <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
                                            {photo ? (
                                                <>
                                                    <img
                                                        src={photo.url}
                                                        alt="Comprobante"
                                                        className="w-12 h-12 rounded-edu-chip object-cover border border-edu-border-soft shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0 text-left">
                                                        <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{photo.name}</div>
                                                        <div className="text-[0.72rem] text-edu-primary">Toca para cambiar la imagen</div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1 w-full text-center">
                                                    <Upload className="w-5 h-5 text-edu-ink-400" />
                                                    <span className="text-[0.8125rem] font-medium text-edu-ink-500">
                                                        Toca para subir una foto del comprobante
                                                    </span>
                                                    <span className="text-[0.72rem] text-edu-ink-400">Formatos JPG o PNG</span>
                                                </div>
                                            )}
                                        </label>
                                        {photoError && (
                                            <span className="text-[0.75rem] text-edu-danger font-medium">
                                                Debes subir la foto del comprobante.
                                            </span>
                                        )}
                                    </div>

                                    {/* Bauche */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-edu-ink-700 text-sm font-medium">N.º de comprobante (bauche)</label>
                                        <input
                                            type="text"
                                            value={form.voucher}
                                            onChange={(e) => setForm({ ...form, voucher: e.target.value })}
                                            placeholder="Ej. A-1042"
                                            required
                                            className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary"
                                        />
                                    </div>

                                    {/* Mensaje de revisión */}
                                    <div className="flex items-start gap-2 px-3.5 py-3 rounded-edu-control bg-edu-primary-50 text-edu-primary text-[0.8125rem] leading-[1.5]">
                                        <Info className="w-4 h-4 shrink-0 mt-px" />
                                        <span>
                                            Tu pago quedará en estado <strong>«En revisión»</strong> hasta que Administración
                                            verifique el comprobante. Recibirás una notificación cuando sea confirmado.
                                        </span>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex gap-2 justify-between pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setModalTab("cuenta")}
                                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Atrás
                                        </button>
                                        <button
                                            type="submit"
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover"
                                        >
                                            <CreditCard className="w-4 h-4" />
                                            Enviar pago
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
