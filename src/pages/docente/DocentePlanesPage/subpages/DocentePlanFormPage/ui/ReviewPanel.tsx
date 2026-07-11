import { CheckCircle2, AlertTriangle } from "lucide-react";
import { LAPSO } from "@shared/services/data/plans";
import { type PlanEvaluacion } from "@shared/services/actions/plans";

interface ReviewPanelProps {
    form: { subject: string; section: string };
    rows: PlanEvaluacion[];
    totalWeight: number;
    seleccionOk: boolean;
    evalsComplete: boolean;
    weightOk: boolean;
    datesInRange: boolean;
    spacingOk: boolean;
}

export function ReviewPanel({
    form,
    rows,
    totalWeight,
    seleccionOk,
    evalsComplete,
    weightOk,
    datesInRange,
    spacingOk,
}: ReviewPanelProps) {
    return (
        /* Pestaña "Datos colocados" (revisión) */
        <div className="flex flex-col gap-4">
            <div className="rounded-edu-control border border-edu-border-soft p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Materia</div>
                    <div className="text-[0.875rem] text-edu-ink font-medium">{form.subject || "—"}</div>
                </div>
                <div>
                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Sección</div>
                    <div className="text-[0.875rem] text-edu-ink font-medium">{form.section || "—"}</div>
                </div>
            </div>

            <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[680px]">
                        <div className="grid grid-cols-[0.4fr_1.6fr_0.5fr_1fr_0.7fr] px-3 py-2 bg-edu-subtle border-b border-edu-border-soft">
                            {["#", "Evaluación", "%", "Fecha", "Archivos"].map((h, idx) => (
                                <span key={idx} className="text-[0.65rem] font-semibold text-edu-ink-400 uppercase tracking-[0.04em]">
                                    {h}
                                </span>
                            ))}
                        </div>
                        {rows.map((r, i) => (
                            <div
                                key={r.id}
                                className={`grid grid-cols-[0.4fr_1.6fr_0.5fr_1fr_0.7fr] px-3 py-2 items-center ${i < rows.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span className="text-[0.8rem] text-edu-ink-500 font-semibold">{i + 1}</span>
                                <span className="text-[0.8rem] text-edu-ink font-medium truncate pr-2">
                                    {r.content || <span className="text-edu-danger">Sin nombre</span>}
                                </span>
                                <span className="text-[0.8rem] text-edu-ink-700 font-semibold">{r.weight || "—"}%</span>
                                <span className="text-[0.78rem] text-edu-ink-500">{r.date || "—"}</span>
                                <span className="text-[0.78rem] text-edu-ink-500">{r.files.length} archivo(s)</span>
                            </div>
                        ))}
                        <div className="px-3 py-2 bg-edu-subtle border-t border-edu-border-soft flex justify-between text-[0.8125rem]">
                            <span className="text-edu-ink-500">Ponderación total</span>
                            <span className={`font-semibold ${weightOk ? "text-edu-success" : "text-edu-warning"}`}>{totalWeight}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verificación */}
            <div className="flex flex-col gap-2">
                {[
                    { ok: seleccionOk, text: "Materia y sección seleccionadas" },
                    { ok: evalsComplete, text: "Todas las evaluaciones tienen nombre, ponderación y fecha" },
                    { ok: weightOk, text: `La ponderación total es 100% (actual: ${totalWeight}%)` },
                    { ok: datesInRange, text: "Las fechas están dentro del lapso" },
                    { ok: spacingOk, text: `Entre evaluaciones hay entre ${LAPSO.minDays} y ${LAPSO.maxDays} días` },
                ].map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-[0.8125rem]">
                        {c.ok ? (
                            <CheckCircle2 className="w-4 h-4 text-edu-success shrink-0" />
                        ) : (
                            <AlertTriangle className="w-4 h-4 text-edu-warning shrink-0" />
                        )}
                        <span className={c.ok ? "text-edu-ink-700" : "text-edu-warning"}>{c.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
