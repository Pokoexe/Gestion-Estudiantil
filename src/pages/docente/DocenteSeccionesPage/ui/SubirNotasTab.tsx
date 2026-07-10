import { Search, Upload } from "lucide-react";
import { Th } from "./Th";
import type { Estudiante, EvaluacionPlan, EvalTipo, FiltroNota } from "../interfaces";

interface Props {
    query: string;
    setQuery: (q: string) => void;
    filtro: FiltroNota;
    setFiltro: (f: FiltroNota) => void;
    filteredStudents: Estudiante[];
    porEntregarNames: Set<string>;
    notas: Record<number, string>;
    onOpenGrade: (e: Estudiante) => void;
    PLAN: EvaluacionPlan[];
    selectedEvalId: number;
    setSelectedEvalId: (id: number) => void;
    TYPE_META: Record<EvalTipo, { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; color: string; label: string }>;
    notaColor: (n: number) => string;
}

export function SubirNotasTab({
    query,
    setQuery,
    filtro,
    setFiltro,
    filteredStudents,
    porEntregarNames,
    notas,
    onOpenGrade,
    PLAN,
    selectedEvalId,
    setSelectedEvalId,
    TYPE_META,
    notaColor,
}: Props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Izquierda: estudiantes con buscador y filtro */}
            <div className="lg:col-span-2 border-r border-edu-border-soft">
                <div className="px-5 py-3 border-b border-edu-border-soft flex gap-2 items-center flex-wrap">
                    <div className="relative flex-1 min-w-[160px]">
                        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar estudiante…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                    {([
                        { key: "todos", label: "Todos" },
                        { key: "aprobados", label: "Aprobados" },
                        { key: "por_entregar", label: "Por entregar" },
                        { key: "reprobados", label: "Reprobados" },
                    ] as const).map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFiltro(f.key)}
                            className={`px-3 py-[7px] rounded-edu-control border-[1.5px] text-[0.775rem] font-medium cursor-pointer transition-colors ${filtro === f.key ? "border-edu-primary bg-edu-primary-50 text-edu-primary" : "border-edu-border bg-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[520px]">
                        <div className="grid grid-cols-[2fr_0.9fr_1fr_0.6fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                            {["Estudiante", "Nota", "Estado", "Subir"].map((h) => (
                                <Th key={h}>{h}</Th>
                            ))}
                        </div>

                        {filteredStudents.length === 0 && (
                            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                                No hay estudiantes que coincidan con el filtro.
                            </div>
                        )}

                        {filteredStudents.map((e, i) => {
                            const pendiente = porEntregarNames.has(e.name);
                            const nota = notas[e.id];
                            return (
                                <div
                                    key={e.id}
                                    className={`grid grid-cols-[2fr_0.9fr_1fr_0.6fr] px-5 py-[11px] items-center ${i < filteredStudents.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <div className="min-w-0">
                                        <div className="text-sm text-edu-ink font-medium truncate">{e.name}</div>
                                        <div className="text-[0.75rem] text-edu-ink-400">{e.cedula}</div>
                                    </div>
                                    <span className={`text-sm font-bold ${nota ? notaColor(Number(nota)) : "text-edu-ink-300"}`}>
                                        {nota ? Number(nota).toFixed(1) : "—"}
                                    </span>
                                    {pendiente ? (
                                        <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-warning-bg text-edu-warning">
                                            Por entregar
                                        </span>
                                    ) : e.average >= 10 ? (
                                        <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-success-bg text-edu-success">
                                            Aprobado
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-danger-bg text-edu-danger">
                                            Reprobado
                                        </span>
                                    )}
                                    <button
                                        onClick={() => onOpenGrade(e)}
                                        aria-label={`Subir nota de ${e.name}`}
                                        className="w-9 h-9 rounded-edu-control border-[1.5px] border-edu-primary-200 bg-edu-primary-50 text-edu-primary flex items-center justify-center cursor-pointer transition-colors hover:bg-edu-primary-100"
                                    >
                                        <Upload className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Derecha: plan de evaluación (visual, seleccionable) */}
            <div>
                <div className="px-4 py-3 border-b border-edu-border-soft">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.85rem]">Plan de evaluación</h3>
                    <p className="text-[0.72rem] text-edu-ink-400 m-0 mt-0.5">Selecciona la evaluación a calificar</p>
                </div>
                <div className="p-3 flex flex-col gap-2">
                    {PLAN.map((ev) => {
                        const tm = TYPE_META[ev.type];
                        const active = ev.id === selectedEvalId;
                        return (
                            <button
                                key={ev.id}
                                onClick={() => setSelectedEvalId(ev.id)}
                                className={`text-left rounded-edu-control border-[1.5px] p-3 flex items-start gap-2.5 cursor-pointer transition-colors ${active ? "border-edu-primary bg-edu-primary-50" : "border-edu-border-soft bg-edu-surface hover:border-edu-primary-200"}`}
                            >
                                <div className="w-8 h-8 rounded-edu-chip flex items-center justify-center shrink-0" style={{ backgroundColor: tm.bg }}>
                                    <tm.icon style={{ width: "15px", height: "15px", color: tm.color }} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[0.8rem] font-semibold text-edu-ink leading-snug">{ev.name}</div>
                                    <div className="text-[0.72rem] text-edu-ink-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                                        <span>{ev.weight} %</span>
                                        <span>·</span>
                                        <span>{ev.date}</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
