import { FileSpreadsheet, Info } from "lucide-react";
import { notaColor } from "@shared/services/data/boletines";
import { EVAL_COLS } from "../functions/useDocenteConcejoDiscusion";

interface EvalItem {
    nombre: string;
    tipo: string;
    porcentaje: number;
    nota: number;
}

interface Post {
    materia: string;
}

interface NotasMateriaProps {
    post: Post;
    materias: string[];
    viewMateria: string;
    setViewMateria: (m: string) => void;
    viewNota: number;
    viewEvals: EvalItem[];
    viendoDiscusion: boolean;
}

export function NotasMateria({ post, materias, viewMateria, setViewMateria, viewNota, viewEvals, viendoDiscusion }: NotasMateriaProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft grid md:flex md:justify-between items-center gap-3 md:flex-wrap">
                <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-edu-ink-400" />
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Notas de la materia</h3>
                </div>
                <select
                    value={viewMateria}
                    onChange={(e) => setViewMateria(e.target.value)}
                    className="w-full md:w-auto border-[1.5px] border-edu-border rounded-edu-control px-3 py-1.5 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                >
                    {materias.map((m) => (
                        <option key={m} value={m}>
                            {m === post.materia ? `${m} (en discusión)` : m}
                        </option>
                    ))}
                </select>
            </div>

            {/* Aviso: la decisión afecta SIEMPRE a la materia en discusión */}
            <div className="mx-5 mt-4 flex items-start gap-2 px-3.5 py-2.5 rounded-edu-control bg-edu-warning-bg text-edu-warning">
                <Info className="w-4 h-4 shrink-0 mt-px" />
                <p className="m-0 text-[0.78rem] leading-[1.45]">
                    Aceptar o rechazar modifica únicamente la nota de <strong>{post.materia}</strong>.
                    {" "}Este selector solo cambia las notas que estás visualizando
                    {viendoDiscusion ? "." : <> — ahora ves <strong>{viewMateria}</strong>, no la materia en discusión.</>}
                </p>
            </div>

            {/* Nota definitiva de la materia visualizada */}
            <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-[0.875rem] text-edu-ink font-semibold">{viewMateria}</span>
                    {viendoDiscusion && (
                        <span className="inline-flex items-center px-2 py-[2px] rounded-edu-pill text-[0.65rem] font-semibold bg-edu-warning-bg text-edu-warning">En discusión</span>
                    )}
                </div>
                <span className="text-[0.8125rem] text-edu-ink-500">
                    Definitiva: <strong className={`text-[0.95rem] ${notaColor(viewNota)}`}>{viewNota}</strong>
                    <span className="text-edu-ink-400"> / 20</span>
                </span>
            </div>

            {/* Desglose de evaluaciones */}
            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    <div className={`grid ${EVAL_COLS} px-5 py-2.5 bg-edu-subtle border-y border-edu-border-soft`}>
                        {["Evaluación", "Tipo", "%", "Nota"].map((h, j) => (
                            <span key={h} className={`text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] ${j >= 2 ? "text-right" : ""}`}>{h}</span>
                        ))}
                    </div>
                    {viewEvals.map((e, j) => (
                        <div key={j} className={`grid ${EVAL_COLS} px-5 py-[11px] items-center ${j < viewEvals.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                            <span className="text-[0.875rem] text-edu-ink font-medium">{e.nombre}</span>
                            <span className="text-[0.8125rem] text-edu-ink-700">{e.tipo}</span>
                            <span className="text-[0.8125rem] text-edu-ink-500 text-right">{e.porcentaje}%</span>
                            <span className={`text-[0.9rem] font-bold text-right ${notaColor(e.nota)}`}>{e.nota}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
