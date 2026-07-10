import { CreditCard, Landmark, Copy, Check, Upload, Info } from "lucide-react";
import type { FotoFile } from "../interfaces";
import { StepTitle } from "./fields";

interface PagoStepProps {
    INSCRIPCION_FEE: string;
    BANCO_INSCRIPCION: {
        method: string;
        fields: { label: string; value: string }[];
    };
    payProof: FotoFile | null;
    payError: boolean;
    bauche: string;
    setBauche: React.Dispatch<React.SetStateAction<string>>;
    copied: string | null;
    copyValue: (label: string, value: string) => void;
    pickPayProof: (e: React.ChangeEvent<HTMLInputElement>) => void;
    labelCls: string;
}

export function PagoStep({
    INSCRIPCION_FEE,
    BANCO_INSCRIPCION,
    payProof,
    payError,
    bauche,
    setBauche,
    copied,
    copyValue,
    pickPayProof,
    labelCls,
}: PagoStepProps) {
    return (
        <div className="p-5 flex flex-col gap-4">
            <StepTitle icon={CreditCard} title="Pago de inscripción" subtitle="Realiza el pago y sube el comprobante" />

            {/* Cuenta a pagar */}
            <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                <div className="px-3.5 py-2.5 bg-edu-subtle border-b border-edu-border-soft flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-edu-primary shrink-0" />
                    <span className="text-[0.8125rem] font-semibold text-edu-ink">
                        Cuenta a pagar · {BANCO_INSCRIPCION.method}
                    </span>
                </div>
                <div className="flex flex-col">
                    {BANCO_INSCRIPCION.fields.map((f, i) => (
                        <div
                            key={f.label}
                            className={`flex items-center justify-between gap-3 px-3.5 py-2.5 ${i < BANCO_INSCRIPCION.fields.length - 1 ? "border-b border-edu-border-soft" : ""
                                }`}
                        >
                            <div className="min-w-0">
                                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                                    {f.label}
                                </div>
                                <div className="text-[0.875rem] text-edu-ink font-medium break-all">{f.value}</div>
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
                <span className="text-[0.8125rem] font-medium text-edu-primary">Cuota de inscripción</span>
                <span className="text-[1.1rem] font-bold text-edu-primary">{INSCRIPCION_FEE}</span>
            </div>

            {/* Comprobante (foto) */}
            <div className="flex flex-col gap-1.5">
                <span className={labelCls}>
                    Comprobante de pago (foto) <span className="text-edu-danger text-xs">requerido</span>
                </span>
                <label
                    className={`border-[1.5px] border-dashed rounded-edu-control px-3.5 py-4 bg-edu-subtle cursor-pointer flex items-center gap-3 transition-colors hover:border-edu-primary-200 ${payError ? "border-edu-danger" : "border-edu-border"
                        }`}
                >
                    <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={pickPayProof}
                    />
                    {payProof ? (
                        <>
                            <img
                                src={payProof.url}
                                alt="Comprobante"
                                className="w-12 h-12 rounded-edu-chip object-cover border border-edu-border-soft shrink-0"
                            />
                            <div className="flex-1 min-w-0 text-left">
                                <div className="text-[0.8125rem] text-edu-ink font-medium truncate">
                                    {payProof.name}
                                </div>
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
                {payError && (
                    <span className="text-[0.75rem] text-edu-danger font-medium">
                        Debes subir la foto del comprobante para enviar la inscripción.
                    </span>
                )}
            </div>

            {/* N.º de comprobante */}
            <div className="flex flex-col gap-1.5">
                <label className={labelCls}>N.º de comprobante (bauche)</label>
                <input
                    type="text"
                    value={bauche}
                    onChange={(e) => setBauche(e.target.value)}
                    placeholder="Ej. A-1042"
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary transition-colors"
                />
            </div>

            {/* Aviso */}
            <div className="flex items-start gap-2 px-3.5 py-3 rounded-edu-control bg-edu-primary-50 text-edu-primary text-[0.8125rem] leading-[1.5]">
                <Info className="w-4 h-4 shrink-0 mt-px" />
                <span>
                    Al enviar, tu inscripción quedará <strong>en revisión</strong>. Verificaremos los datos y
                    el comprobante, y te llamaremos para confirmar la inscripción.
                </span>
            </div>
        </div>
    );
}
