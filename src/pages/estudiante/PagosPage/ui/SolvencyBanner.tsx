import { CreditCard, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import {
    SOLVENT as solvent,
    OWED as owed,
    MONTHS_LABEL as monthsLabel,
    BILLING_DAY,
    FEE_CURRENCY,
} from "@shared/services/data/solvency";
import { money } from "../functions/usePagos";

interface SolvencyBannerProps {
    onPayClick: () => void;
}

/** Bloque de solvencia: estado al día / adeudado y botón para pagar por internet. */
export function SolvencyBanner({ onPayClick }: SolvencyBannerProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 lg:flex justify-between items-center lg:flex-wrap gap-4">
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

            <div className="flex items-center lg:flex-col justify-center lg:justify-end lg:items-end gap-4 lg:gap-2 mt-4 lg:mt-1 ">
                {solvent ? (
                    <>
                        <span className="inline-flex items-center gap-1.5 bg-edu-success-bg text-edu-success text-[0.8rem] font-semibold px-3 py-1.5 rounded-edu-pill">
                            <CheckCircle2 className="w-4 h-4" /> Al día
                        </span>
                        <span className="text-edu-ink-400 text-xs">Próximo cobro: {BILLING_DAY} del próximo mes</span>
                    </>
                ) : (
                    <>
                        <div className="text-center lg:w-auto">
                            <div className="text-edu-ink-400 text-[0.72rem] uppercase tracking-[0.05em] font-medium">
                                Monto adeudado
                            </div>
                            <div className="text-edu-danger text-[1.35rem] font-bold leading-tight">
                                {money(owed)} {FEE_CURRENCY}
                            </div>
                            <div className="text-edu-ink-400 text-xs">Equivale a {monthsLabel}</div>
                        </div>
                        <button
                            onClick={onPayClick}
                            className="justify-center lg:justify-start lg:w-auto inline-flex items-center gap-2 bg-edu-primary text-white text-sm font-semibold px-4 py-2.5 rounded-edu-control border-none cursor-pointer transition-colors hover:bg-edu-primary-hover"
                        >
                            <CreditCard className="w-4 h-4" />
                            Pagar por internet
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
