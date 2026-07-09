import { Upload, ClipboardList, CheckCircle2 } from "lucide-react";
import { color } from "../theme/tokens";

/**
 * Bloques de resumen para los listados de planes / planificaciones:
 * cuántos se han subido, cuántos están por revisar y cuántos aprobados.
 */
export function PlanStats({
    subidos,
    porRevisar,
    aprobados,
}: {
    subidos: number;
    porRevisar: number;
    aprobados: number;
}) {
    const items = [
        { label: "Subidos", value: subidos, icon: Upload, bg: color.primary100, fg: color.primary, hint: "Enviados para revisión" },
        { label: "Por revisar", value: porRevisar, icon: ClipboardList, bg: color.warningBg, fg: color.warningStrong, hint: "En espera de aprobación" },
        { label: "Aprobados", value: aprobados, icon: CheckCircle2, bg: color.successBg, fg: color.success, hint: "Listos para aplicar" },
    ];

    return (
        <div className="grid  md:grid-cols-3 gap-4">
            {items.map((s) => {
                const Icon = s.icon;
                return (
                    <div key={s.label} className={`bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">{s.label}</p>
                                <p className="text-edu-ink text-[1.4rem] font-bold mt-1">{s.value}</p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg }}>
                                <Icon className="w-5 h-5" style={{ color: s.fg }} />
                            </div>
                        </div>
                        <p className="text-edu-ink-400 text-xs m-0">{s.hint}</p>
                    </div>
                );
            })}
        </div>
    );
}
