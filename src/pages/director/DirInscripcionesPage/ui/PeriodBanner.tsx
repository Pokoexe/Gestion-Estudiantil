import { ClipboardList, Wallet } from "lucide-react";
import { accent } from "@themes/tokens";

interface PeriodBannerProps {
    abiertas: boolean;
    setAbiertas: (fn: (a: boolean) => boolean) => void;
    activas: number;
    total: number;
    INSCRIPCION_FEE: string;
}

export function PeriodBanner({ abiertas, setAbiertas, activas, total, INSCRIPCION_FEE }: PeriodBannerProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex justify-between items-center flex-wrap gap-5">
            <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-edu-card flex items-center justify-center shrink-0 ${abiertas ? "bg-edu-success-bg" : "bg-edu-subtle"}`}>
                    <ClipboardList className={`w-7 h-7 ${abiertas ? "text-edu-success" : "text-edu-ink-400"}`} />
                </div>
                <div>
                    <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Período de inscripciones</p>
                    <p className={`text-[1.35rem] font-bold mt-0.5 mb-0 ${abiertas ? "text-edu-success" : "text-edu-ink-500"}`}>
                        {abiertas ? "Inscripciones abiertas" : "Inscripciones cerradas"}
                    </p>
                    <p className="text-edu-ink-400 text-[0.8rem] m-0">
                        {abiertas
                            ? "Los representantes pueden inscribir desde el formulario público"
                            : "El formulario público de inscripción está deshabilitado"}
                    </p>
                </div>
                {/* Interruptor abrir/cerrar */}
                <button
                    onClick={() => setAbiertas((a) => !a)}
                    role="switch"
                    aria-checked={abiertas}
                    aria-label="Abrir o cerrar inscripciones"
                    className={`relative w-12 h-7 rounded-edu-pill shrink-0 border-none cursor-pointer transition-colors ${abiertas ? "bg-edu-success" : "bg-edu-ink-300"}`}
                >
                    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${abiertas ? "left-6" : "left-1"}`} />
                </button>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <div className="text-edu-ink-400 text-[0.72rem] uppercase tracking-[0.05em] font-medium">Solicitudes activas</div>
                    <div className="text-edu-ink text-[1.35rem] font-bold leading-tight">{activas}</div>
                    <div className="text-edu-ink-400 text-xs">de {total} inscripciones</div>
                </div>
                <div className="w-px h-12 bg-edu-border-soft" />
                <div className="text-right">
                    <div className="text-edu-ink-400 text-[0.72rem] uppercase tracking-[0.05em] font-medium">Valor de la inscripción</div>
                    <div className="text-[1.35rem] font-bold leading-tight" style={{ color: accent.amber.fg }}>{INSCRIPCION_FEE}</div>
                    <div className="text-edu-ink-400 text-xs inline-flex items-center gap-1 justify-end">
                        <Wallet className="w-3 h-3" /> Cuota única por estudiante
                    </div>
                </div>
            </div>
        </div>
    );
}
