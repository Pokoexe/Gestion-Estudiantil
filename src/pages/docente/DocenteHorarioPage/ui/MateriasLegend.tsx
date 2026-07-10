import type { Materia } from "../interfaces";

interface Props {
    MATERIAS: Materia[];
}

export function MateriasLegend({ MATERIAS }: Props) {
    return (
        /* Leyenda de materias */
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-4 flex flex-wrap gap-4">
            {MATERIAS.map((m) => (
                <div key={m.key} className="flex items-center gap-2">
                    <span
                        className="w-3.5 h-3.5 rounded-edu-chip shrink-0"
                        style={{ backgroundColor: m.bg, border: `1.5px solid ${m.fg}33` }}
                    />
                    <span className="text-[0.8125rem] text-edu-ink-700 font-medium">{m.name}</span>
                </div>
            ))}
        </div>
    );
}
