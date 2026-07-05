import { useState } from "react";
import {
    X,
    Download,
    FileText,
    ClipboardCheck,
    BarChart2,
    Presentation,
    FlaskConical,
    PenLine,
    Paperclip,
    Search,
} from "lucide-react";
import { color } from "../theme/tokens";
import { Pagination } from "../components/Pagination";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LapsoFilter } from "../components/LapsoFilter";
import { useLapso } from "../context/LapsoContext";
import type { LapsoId } from "../data/lapsos";

type EvalType = "presentation" | "exam" | "lab" | "essay";

interface Attachment {
    name: string;
    kind: "image" | "file";
    url: string;
}

interface Grade {
    id: number;
    lapso: LapsoId;
    subject: string;
    teacher: string;
    title: string;
    type: EvalType;
    date: string;
    weight: string;
    grade: number; // sobre 20
    description: string;
    attachment: Attachment;
}

const TYPE_META: Record<EvalType, { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; color: string; label: string }> = {
    presentation: { icon: Presentation, bg: color.primary50, color: color.primary, label: "Exposición" },
    exam: { icon: FileText, bg: color.warningBg, color: color.warning, label: "Examen" },
    lab: { icon: FlaskConical, bg: color.successBg, color: color.success, label: "Laboratorio" },
    essay: { icon: PenLine, bg: color.purpleBg, color: color.purple, label: "Ensayo" },
};

const GRADES: Grade[] = [
    // Lapso II (en curso) — junio 2026
    { id: 1, lapso: 2, subject: "Física", teacher: "Prof. Torres", title: "Examen · Cinemática", type: "exam", date: "12 jun 2026", weight: "30%", grade: 19, description: "Examen escrito sobre movimiento rectilíneo, velocidad y aceleración.", attachment: { name: "Examen_Cinematica.jpg", kind: "image", url: "https://picsum.photos/seed/examfisica/900/1200" } },
    { id: 2, lapso: 2, subject: "Química", teacher: "Prof. Méndez", title: "Informe de laboratorio · Reacciones", type: "lab", date: "10 jun 2026", weight: "25%", grade: 14, description: "Informe del experimento de reacciones ácido-base realizado en el laboratorio.", attachment: { name: "Informe_Reacciones.pdf", kind: "file", url: "#" } },
    { id: 3, lapso: 2, subject: "Literatura", teacher: "Prof. García", title: "Ensayo sobre el Realismo", type: "essay", date: "6 jun 2026", weight: "20%", grade: 17, description: "Ensayo de 600 palabras analizando las características del movimiento realista.", attachment: { name: "Ensayo_Realismo.pdf", kind: "file", url: "#" } },
    { id: 4, lapso: 2, subject: "Historia", teacher: "Prof. Flores", title: "Exposición · Independencia", type: "presentation", date: "4 jun 2026", weight: "25%", grade: 9, description: "Exposición oral sobre el proceso de independencia y sus protagonistas.", attachment: { name: "Diapositivas_Independencia.jpg", kind: "image", url: "https://picsum.photos/seed/histexpo/1200/800" } },
    { id: 5, lapso: 2, subject: "Matemática", teacher: "Prof. Ramírez", title: "Prueba corta · Funciones", type: "exam", date: "2 jun 2026", weight: "15%", grade: 16, description: "Prueba corta sobre dominio, rango y gráficas de funciones.", attachment: { name: "Prueba_Funciones.jpg", kind: "image", url: "https://picsum.photos/seed/matefunc/900/1200" } },
    // Lapso I (finalizado) — mayo 2026
    { id: 6, lapso: 1, subject: "Biología", teacher: "Prof. Ruiz", title: "Laboratorio · Célula", type: "lab", date: "28 may 2026", weight: "20%", grade: 18, description: "Práctica de observación de células vegetales en el microscopio.", attachment: { name: "Practica_Celula.pdf", kind: "file", url: "#" } },
    { id: 7, lapso: 1, subject: "Inglés", teacher: "Prof. Collins", title: "Examen · Present Perfect", type: "exam", date: "26 may 2026", weight: "30%", grade: 8, description: "Examen escrito sobre el uso del present perfect y vocabulario de la unidad.", attachment: { name: "Examen_Ingles.jpg", kind: "image", url: "https://picsum.photos/seed/exingles/900/1200" } },
    { id: 8, lapso: 1, subject: "Arte", teacher: "Prof. Vega", title: "Proyecto · Autorretrato", type: "presentation", date: "22 may 2026", weight: "35%", grade: 20, description: "Presentación del autorretrato realizado con técnica libre.", attachment: { name: "Autorretrato.jpg", kind: "image", url: "https://picsum.photos/seed/autorretrato/1000/1000" } },
    { id: 9, lapso: 1, subject: "Física", teacher: "Prof. Torres", title: "Laboratorio · Péndulo", type: "lab", date: "18 may 2026", weight: "20%", grade: 15, description: "Informe del experimento del péndulo simple y cálculo del período.", attachment: { name: "Lab_Pendulo.pdf", kind: "file", url: "#" } },
    { id: 10, lapso: 1, subject: "Química", teacher: "Prof. Méndez", title: "Examen · Tabla periódica", type: "exam", date: "14 may 2026", weight: "30%", grade: 13, description: "Examen sobre organización de la tabla periódica y propiedades de los elementos.", attachment: { name: "Examen_Tabla.jpg", kind: "image", url: "https://picsum.photos/seed/tablaperiodica/900/1200" } },
    { id: 11, lapso: 1, subject: "Literatura", teacher: "Prof. García", title: "Exposición · Poesía", type: "presentation", date: "10 may 2026", weight: "20%", grade: 12, description: "Exposición grupal sobre recursos literarios en la poesía contemporánea.", attachment: { name: "Poesia.pdf", kind: "file", url: "#" } },
];

const GRADES_PER_PAGE = 6;
const PASS_MARK = 10;

const GRADE_COLS = "grid-cols-[1.2fr_1.7fr_1fr_0.7fr_1fr]";
const GRADE_HEADERS = ["Materia", "Evaluación", "Fecha", "Nota", "Estado"];

const money1 = (n: number) => n.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function CalificacionPage() {
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Grade | null>(null);
    const [query, setQuery] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("todas");
    const [statusFilter, setStatusFilter] = useState<"todos" | "aprobada" | "reprobada">("todos");

    const { selectedId } = useLapso();
    const lapsoGrades = GRADES.filter((g) => g.lapso === selectedId);

    const done = lapsoGrades.length;
    const average = lapsoGrades.reduce((sum, g) => sum + g.grade, 0) / (done || 1);

    const subjects = Array.from(new Set(lapsoGrades.map((g) => g.subject)));

    const filtered = lapsoGrades.filter((g) => {
        if (subjectFilter !== "todas" && g.subject !== subjectFilter) return false;
        const passed = g.grade >= PASS_MARK;
        if (statusFilter === "aprobada" && !passed) return false;
        if (statusFilter === "reprobada" && passed) return false;
        if (query.trim() && !`${g.title} ${g.subject}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
        return true;
    });

    const totalPages = Math.ceil(filtered.length / GRADES_PER_PAGE);
    const currentPage = Math.min(page, Math.max(1, totalPages));
    const paged = filtered.slice((currentPage - 1) * GRADES_PER_PAGE, currentPage * GRADES_PER_PAGE);

    return (
        <>
            {/* Bloques resumen */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                Evaluaciones hechas
                            </p>
                            <p className="text-edu-ink text-[1.4rem] font-bold mt-1">{done}</p>
                        </div>
                        <div className="w-10 h-10 rounded-edu-control bg-edu-primary-100 flex items-center justify-center shrink-0">
                            <ClipboardCheck className="w-5 h-5 text-edu-primary" />
                        </div>
                    </div>
                    <p className="text-edu-ink-400 text-xs m-0">Evaluaciones ya calificadas este lapso</p>
                </div>

                <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                Promedio
                            </p>
                            <p className="text-edu-ink text-[1.4rem] font-bold mt-1">{money1(average)}</p>
                        </div>
                        <div className="w-10 h-10 rounded-edu-control bg-edu-success-bg flex items-center justify-center shrink-0">
                            <BarChart2 className="w-5 h-5 text-edu-success" />
                        </div>
                    </div>
                    <p className="text-edu-ink-400 text-xs m-0">Promedio general sobre 20</p>
                </div>
            </div>

            {/* Tabla de evaluaciones */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Evaluaciones realizadas</h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filtered.length} evaluaciones</span>
                </div>

                {/* Buscador y filtros */}
                <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                    <LapsoFilter />
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                            placeholder="Buscar evaluación o materia…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                    <select
                        value={subjectFilter}
                        onChange={(e) => { setSubjectFilter(e.target.value); setPage(1); }}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                    >
                        <option value="todas">Todas las materias</option>
                        {subjects.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value as "todos" | "aprobada" | "reprobada"); setPage(1); }}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="aprobada">Aprobadas</option>
                        <option value="reprobada">Reprobadas</option>
                    </select>
                </div>

                <div>
                    <div className={`grid ${GRADE_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {GRADE_HEADERS.map((h) => (
                            <span
                                key={h}
                                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                            >
                                {h}
                            </span>
                        ))}
                    </div>
                    {paged.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                            No hay evaluaciones que coincidan con el filtro.
                        </div>
                    )}
                    {paged.map((g, i) => {
                        const t = TYPE_META[g.type];
                        const passed = g.grade >= PASS_MARK;
                        return (
                            <div
                                key={g.id}
                                onClick={() => setSelected(g)}
                                className={`grid ${GRADE_COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span className="text-[0.875rem] text-edu-ink font-medium truncate pr-2">{g.subject}</span>
                                <div className="min-w-0 pr-2">
                                    <div className="text-[0.875rem] text-edu-ink-700 truncate">{g.title}</div>
                                    <span
                                        className="inline-flex mt-0.5 text-[0.62rem] font-semibold px-1.5 py-px rounded-edu-pill"
                                        style={{ backgroundColor: t.bg, color: t.color }}
                                    >
                                        {t.label}
                                    </span>
                                </div>
                                <span className="text-[0.8125rem] text-edu-ink-500">{g.date}</span>
                                <span className={`text-[0.9rem] font-bold ${passed ? "text-edu-ink" : "text-edu-danger"}`}>
                                    {g.grade}
                                    <span className="text-edu-ink-400 font-normal text-[0.75rem]">/20</span>
                                </span>
                                <span
                                    className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${passed ? "bg-edu-success-bg text-edu-success" : "bg-edu-danger-bg text-edu-danger"}`}
                                >
                                    {passed ? "Aprobada" : "Reprobada"}
                                </span>
                            </div>
                        );
                    })}
                </div>
                {totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-edu-border-soft">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                )}
            </div>

            {/* Modal con el detalle de la evaluación */}
            {selected && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {(() => {
                            const t = TYPE_META[selected.type];
                            const TypeIcon = t.icon;
                            const passed = selected.grade >= PASS_MARK;
                            return (
                                <>
                                    {/* Encabezado */}
                                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start gap-3">
                                        <div className="flex items-start gap-3 min-w-0">
                                            <div
                                                className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: t.bg }}
                                            >
                                                <TypeIcon style={{ width: "18px", height: "18px", color: t.color }} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] leading-snug">{selected.title}</h3>
                                                <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{selected.subject}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelected(null)}
                                            aria-label="Cerrar"
                                            className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="p-5 flex flex-col gap-4">
                                        {/* Nota destacada */}
                                        <div className="flex items-center justify-between px-4 py-3 rounded-edu-control bg-edu-subtle">
                                            <div>
                                                <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Calificación</div>
                                                <div className={`text-[1.6rem] font-bold leading-none mt-0.5 ${passed ? "text-edu-success" : "text-edu-danger"}`}>
                                                    {selected.grade}<span className="text-edu-ink-400 font-normal text-base">/20</span>
                                                </div>
                                            </div>
                                            <span
                                                className={`inline-flex items-center justify-center px-3 py-1.5 rounded-edu-pill text-[0.8rem] font-semibold ${passed ? "bg-edu-success-bg text-edu-success" : "bg-edu-danger-bg text-edu-danger"}`}
                                            >
                                                {passed ? "Aprobada" : "Reprobada"}
                                            </span>
                                        </div>

                                        {/* Datos */}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                            {[
                                                { label: "Tipo", value: t.label },
                                                { label: "Docente", value: selected.teacher },
                                                { label: "Fecha", value: selected.date },
                                                { label: "Peso", value: selected.weight },
                                            ].map((d) => (
                                                <div key={d.label}>
                                                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">{d.label}</div>
                                                    <div className="text-[0.875rem] text-edu-ink font-medium">{d.value}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Descripción */}
                                        <div>
                                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1">Descripción</div>
                                            <p className="text-sm text-edu-ink-700 leading-[1.6] m-0">{selected.description}</p>
                                        </div>

                                        {/* Prueba adjunta */}
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <Paperclip className="w-3.5 h-3.5 text-edu-ink-400" />
                                                <span className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                                                    Prueba adjunta
                                                </span>
                                            </div>
                                            {selected.attachment.kind === "image" ? (
                                                <a
                                                    href={selected.attachment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block rounded-edu-control overflow-hidden border border-edu-border-soft"
                                                >
                                                    <ImageWithFallback
                                                        src={selected.attachment.url}
                                                        alt={selected.attachment.name}
                                                        className="w-full max-h-[320px] object-contain bg-edu-subtle"
                                                    />
                                                </a>
                                            ) : (
                                                <div className="flex items-center gap-3 p-3 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                                                    <div className="w-10 h-10 rounded-edu-chip bg-edu-danger-bg flex items-center justify-center shrink-0">
                                                        <FileText className="w-5 h-5 text-edu-danger" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium text-edu-ink truncate">{selected.attachment.name}</div>
                                                        <div className="text-xs text-edu-ink-400">Documento adjunto</div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-edu-control border-[1.5px] border-edu-primary-200 bg-edu-primary-50 text-edu-primary text-[0.8125rem] font-semibold cursor-pointer transition-colors hover:bg-edu-primary-100 shrink-0"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                        Descargar
                                                    </button>
                                                </div>
                                            )}
                                            <div className="text-[0.72rem] text-edu-ink-400 mt-1.5">{selected.attachment.name}</div>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
        </>
    );
}
