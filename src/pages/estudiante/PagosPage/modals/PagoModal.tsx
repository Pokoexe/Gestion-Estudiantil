import {
    CreditCard,
    Info,
    X,
    Landmark,
    Upload,
    Copy,
    Check,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";
import { money } from "../functions/usePagos";
import type { PaymentAccount } from "../interfaces";

interface PagoModalProps {
    form: { currency: string; voucher: string };
    setForm: (v: { currency: string; voucher: string }) => void;
    modalTab: "cuenta" | "prueba";
    setModalTab: (v: "cuenta" | "prueba") => void;
    copied: string | null;
    photo: { name: string; url: string } | null;
    photoError: boolean;
    account: PaymentAccount;
    amountToPay: number;
    currencies: string[];
    copyValue: (label: string, value: string) => void;
    handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

/** Modal de pago por internet: pestaña de cuenta destino y pestaña de subir prueba. */
export function PagoModal({
    form, setForm,
    modalTab, setModalTab,
    copied,
    photo,
    photoError,
    account,
    amountToPay,
    currencies,
    copyValue,
    handleFile,
    handleSubmit,
    onClose,
}: PagoModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={onClose}
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
                        onClick={onClose}
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
                                className={`px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${modalTab === t.key
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
                                    {currencies.map((c) => (
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
                                    onClick={onClose}
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
    );
}
