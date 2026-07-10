import { Search, Upload, X, Pencil, Users } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import type { Estudiante, EvaluacionPlan } from "@shared/services/actions/docente-eval";
import { Th } from "./Th";
import { notaColor, TYPE_META } from "../functions/useDocenteCalificaciones";
import type { FiltroNota } from "../interfaces";

interface CalificacionesPanelProps {
    query: string;
    setQuery: (v: string) => void;
    filtro: FiltroNota;
    setFiltro: (v: FiltroNota) => void;
    setPage: (v: number) => void;
    filteredStudents: Estudiante[];
    pagedStudents: Estudiante[];
    currentPage: number;
    totalPages: number;
    PLAN: EvaluacionPlan[];
    selectedStudent: Estudiante | null;
    setSelectedStudent: (v: Estudiante | null) => void;
    openGrade: (student: Estudiante, ev: EvaluacionPlan) => void;
    notas: Record<string, string>;
}

export function CalificacionesPanel({
    query,
    setQuery,
    filtro,
    setFiltro,
    setPage,
    filteredStudents,
    pagedStudents,
    currentPage,
    totalPages,
    PLAN,
    selectedStudent,
    setSelectedStudent,
    openGrade,
    notas,
}: CalificacionesPanelProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Izquierda: listado de estudiantes */}
                <div className="lg:col-span-2 border-r border-edu-border-soft">
                    {/* Buscador y filtros */}
                    <div className="px-5 py-3 border-b border-edu-border-soft grid md:flex gap-2 items-center flex-wrap">
                        <div className="relative flex-1 min-w-[160px]">
                            <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                                placeholder="Buscar estudiante…"
                                className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                            />
                        </div>
                        <div className="grid grid-cols-2 md:block gap-2 md:space-x-2">
                            {([
                                { key: "todos", label: "Todos" },
                                { key: "aprobados", label: "Aprobados" },
                                { key: "por_entregar", label: "Por entregar" },
                                { key: "reprobados", label: "Reprobados" },
                            ] as const).map((f) => (
                                <button
                                    key={f.key}
                                    onClick={() => { setFiltro(f.key); setPage(1); }}
                                    className={`px-3 py-[7px] rounded-edu-control border-[1.5px] text-[0.775rem] font-medium cursor-pointer transition-colors ${filtro === f.key ? "border-edu-primary bg-edu-primary-50 text-edu-primary" : "border-edu-border bg-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>


                    {/* Cabecera tabla */}
                    <div className="overflow-x-auto">
                        <div className="min-w-[680px]">
                            <div className="grid grid-cols-[2fr_0.8fr_0.85fr_1fr_0.65fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                                {["Estudiante", "Promedio", "Realizadas", "Estado", ""].map((h) => (
                                    <Th key={h}>{h}</Th>
                                ))}
                            </div>

                            {filteredStudents.length === 0 && (
                                <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                                    No hay estudiantes que coincidan con el filtro.
                                </div>
                            )}

                            {pagedStudents.map((e, i) => {
                                const realizadas = e.grades.filter(g => g !== null).length;
                                const isApproved = e.average >= 10;
                                const isSelected = selectedStudent?.id === e.id;
                                const firstPendingIdx = e.grades.findIndex(g => g === null);
                                const firstActionEval = firstPendingIdx >= 0 ? PLAN[firstPendingIdx] : PLAN[0];

                                return (
                                    <div
                                        key={e.id}
                                        onClick={() => setSelectedStudent(e)}
                                        className={`grid grid-cols-[2fr_0.8fr_0.85fr_1fr_0.65fr] px-5 py-[11px] items-center cursor-pointer transition-colors ${isSelected ? "bg-edu-primary-50 border-l-[3px] border-edu-primary" : "hover:bg-edu-subtle border-l-[3px] border-transparent"} ${i < pagedStudents.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                    >
                                        <div className="min-w-0">
                                            <div className="text-sm text-edu-ink font-medium truncate">{e.name}</div>
                                            <div className="text-[0.75rem] text-edu-ink-400">{e.cedula}</div>
                                        </div>
                                        <span className={`text-sm font-bold ${e.average > 0 ? notaColor(e.average) : "text-edu-ink-300"}`}>
                                            {e.average > 0 ? e.average.toFixed(1) : "—"}
                                        </span>
                                        <span className="text-sm text-edu-ink-700 font-medium">
                                            {realizadas}/{PLAN.length}
                                        </span>
                                        {e.average <= 0 ? (
                                            <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-subtle text-edu-ink-400 border border-edu-border-soft">
                                                Sin notas
                                            </span>
                                        ) : isApproved ? (
                                            <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-success-bg text-edu-success">
                                                Aprobado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-danger-bg text-edu-danger">
                                                Reprobado
                                            </span>
                                        )}
                                        <button
                                            onClick={(evt) => {
                                                evt.stopPropagation();
                                                setSelectedStudent(e);
                                                openGrade(e, firstActionEval);
                                            }}
                                            aria-label={isApproved ? `Modificar nota de ${e.name}` : `Subir nota de ${e.name}`}
                                            className={`w-9 h-9 rounded-edu-control border-[1.5px] flex items-center justify-center cursor-pointer transition-colors shrink-0 ${isApproved
                                                ? "border-edu-border bg-edu-surface text-edu-ink-500 hover:bg-edu-subtle hover:text-edu-ink"
                                                : "border-edu-primary-200 bg-edu-primary-50 text-edu-primary hover:bg-edu-primary-100"
                                                }`}
                                        >
                                            {isApproved ? <Pencil className="w-[15px] h-[15px]" /> : <Upload className="w-[15px] h-[15px]" />}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {totalPages > 1 && (
                        <div className="px-5 py-4 border-t border-edu-border-soft">
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    )}
                </div>

                {/* Derecha: notas del estudiante seleccionado */}
                <div className="flex flex-col min-h-[300px]">
                    {selectedStudent ? (
                        <>
                            <div className="px-4 py-3 border-b border-edu-border-soft flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <h3 className="m-0 text-edu-ink font-semibold text-[0.85rem] truncate">{selectedStudent.name}</h3>
                                    <p className="text-[0.72rem] text-edu-ink-400 m-0 mt-0.5">
                                        {selectedStudent.grades.filter(g => g !== null).length}/{PLAN.length} notas subidas
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    aria-label="Cerrar panel"
                                    className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0 mt-0.5"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <div className="flex flex-col">
                                {PLAN.map((ev, idx) => {
                                    const key = `${selectedStudent.id}_${ev.id}`;
                                    const nota: number | null = key in notas
                                        ? Number(notas[key])
                                        : selectedStudent.grades[idx];
                                    const isPending = nota === null;
                                    const tm = TYPE_META[ev.type];
                                    return (
                                        <div
                                            key={ev.id}
                                            className={`px-4 py-3 flex items-center gap-2.5 ${idx < PLAN.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                        >
                                            <div className="w-7 h-7 rounded-edu-chip flex items-center justify-center shrink-0" style={{ backgroundColor: tm.bg }}>
                                                <tm.icon style={{ width: "12px", height: "12px", color: tm.color }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[0.78rem] font-medium text-edu-ink leading-snug truncate">{ev.name}</div>
                                                <div className="text-[0.68rem] text-edu-ink-400 mt-px">{ev.weight}% · {ev.date}</div>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                {isPending ? (
                                                    <>
                                                        <span className="text-[0.7rem] text-edu-ink-300">Sin subir</span>
                                                        <button
                                                            onClick={() => openGrade(selectedStudent, ev)}
                                                            title="Subir nota"
                                                            className="w-7 h-7 rounded-edu-control border-[1.5px] border-edu-primary-200 bg-edu-primary-50 text-edu-primary flex items-center justify-center cursor-pointer hover:bg-edu-primary-100 transition-colors"
                                                        >
                                                            <Upload className="w-3 h-3" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className={`text-sm font-bold ${notaColor(nota!)}`}>{nota!.toFixed(1)}</span>
                                                        <button
                                                            onClick={() => openGrade(selectedStudent, ev)}
                                                            className="px-2 py-[3px] rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-600 text-[0.68rem] font-medium cursor-pointer hover:bg-edu-subtle transition-colors whitespace-nowrap"
                                                        >
                                                            Modificar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 py-12 px-4 text-center">
                            <div className="w-12 h-12 rounded-edu-control bg-edu-subtle flex items-center justify-center mb-3">
                                <Users className="w-6 h-6 text-edu-ink-300" />
                            </div>
                            <p className="text-edu-ink-500 text-sm font-medium m-0">Selecciona un estudiante</p>
                            <p className="text-edu-ink-400 text-xs mt-1 m-0">para ver y gestionar sus notas</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
