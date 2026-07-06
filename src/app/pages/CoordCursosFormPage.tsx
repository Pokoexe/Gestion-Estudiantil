import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
    ArrowLeft, PlusCircle, Trash2, Upload, FileText,
    ClipboardCheck, CheckCircle2, BookOpen, ImageIcon, X,
} from "lucide-react";
import { color } from "../theme/tokens";
import { useFetch } from "../datos_maquetados";
import { getCursosDocentesOpciones } from "../datos_maquetados/actions/coordinador";

const MIN_EVALS = 1;

interface EvalRow {
    id: number;
    nombre: string;
    descripcion: string;
    ponderacion: string;
    fecha: string;
    archivos: string[];
}

const emptyEval = (id: number): EvalRow => ({
    id, nombre: "", descripcion: "", ponderacion: "", fecha: "", archivos: [],
});

export function CoordCursosFormPage() {
    const navigate = useNavigate();
    const { data: DOCENTES_OPCIONES } = useFetch(getCursosDocentesOpciones, []);

    const [mainTab, setMainTab] = useState<"info" | "evaluaciones">("info");

    /* Información */
    const [titulo,      setTitulo]      = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [cupos,       setCupos]       = useState("");
    const [docente,     setDocente]     = useState("");
    const [imgPreview,  setImgPreview]  = useState<string | null>(null);
    const imgRef = useRef<HTMLInputElement>(null);

    /* Evaluaciones */
    const [evalRows, setEvalRows] = useState<EvalRow[]>([emptyEval(1), emptyEval(2)]);
    const [evalTab,  setEvalTab]  = useState<number | "review">(0);

    const totalPond = evalRows.reduce((s, r) => s + (parseFloat(r.ponderacion) || 0), 0);
    const weightOk  = totalPond === 100;
    const evalsOk   = evalRows.every((r) => r.nombre.trim() && r.ponderacion);
    const infoOk    = titulo.trim() && cupos && docente;

    /* Imagen */
    const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImgPreview(URL.createObjectURL(file));
    };

    /* Evaluaciones */
    const updateEval = (rid: number, field: keyof EvalRow, value: string) =>
        setEvalRows((rs) => rs.map((r) => r.id === rid ? { ...r, [field]: value } : r));

    const addEval = () => {
        const nextId = Math.max(0, ...evalRows.map((r) => r.id)) + 1;
        setEvalRows([...evalRows, emptyEval(nextId)]);
        setEvalTab(evalRows.length);
    };

    const removeEval = (idx: number) => {
        if (evalRows.length <= MIN_EVALS) return;
        setEvalRows(evalRows.filter((_, i) => i !== idx));
        setEvalTab((t) => typeof t === "number" ? Math.max(0, Math.min(t, evalRows.length - 2)) : t);
    };

    const addArchivos = (rid: number, files: FileList) => {
        const names = Array.from(files).map((f) => f.name);
        setEvalRows((rs) => rs.map((r) => r.id === rid ? { ...r, archivos: [...r.archivos, ...names] } : r));
    };

    const removeArchivo = (rid: number, idx: number) =>
        setEvalRows((rs) => rs.map((r) => r.id === rid ? { ...r, archivos: r.archivos.filter((_, i) => i !== idx) } : r));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/coordinador/cursos");
    };

    const inputCls = "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary";
    const labelCls = "text-edu-ink-700 text-sm font-medium";

    return (
        <div className="flex flex-col gap-5">
            {/* Volver */}
            <button
                type="button"
                onClick={() => navigate("/coordinador/cursos")}
                className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver a cursos
            </button>

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: "#eff6ff" }}>
                    <PlusCircle className="w-5 h-5 text-edu-primary" />
                </div>
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.25rem]">Crear curso extracurricular</h2>
                    <p className="text-edu-ink-500 text-sm mt-0.5 m-0">Completa la información del curso y define sus evaluaciones</p>
                </div>
            </div>

            {/* Tarjeta principal */}
            <form onSubmit={handleSubmit} className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">

                {/* Tabs principales */}
                <div className="flex border-b border-edu-border-soft px-5">
                    {(["info", "evaluaciones"] as const).map((t) => {
                        const label = t === "info" ? "Información" : "Evaluaciones";
                        const active = mainTab === t;
                        return (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setMainTab(t)}
                                className={`px-4 py-3.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${active ? "border-edu-primary text-edu-primary" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* ── Pestaña Información ── */}
                {mainTab === "info" && (
                    <div className="p-5 flex flex-col gap-5">
                        {/* Imagen */}
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>
                                Imagen del curso <span className="text-edu-ink-400 font-normal">(opcional)</span>
                            </label>
                            <div
                                onClick={() => imgRef.current?.click()}
                                className="relative border-[1.5px] border-dashed border-edu-border rounded-edu-control overflow-hidden cursor-pointer flex items-center justify-center transition-colors hover:border-edu-primary"
                                style={{ height: imgPreview ? "200px" : "110px" }}
                            >
                                {imgPreview ? (
                                    <>
                                        <img src={imgPreview} alt="preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-white text-xs font-semibold">Cambiar imagen</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-edu-ink-400">
                                        <ImageIcon className="w-7 h-7" />
                                        <span className="text-[0.8rem]">Haz clic para subir una imagen</span>
                                    </div>
                                )}
                            </div>
                            <input ref={imgRef} type="file" accept="image/*" onChange={handleImg} className="sr-only" />
                        </div>

                        {/* Título */}
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>
                                Título del curso <span className="text-edu-danger text-xs">requerido</span>
                            </label>
                            <input
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                placeholder="Ej. Robótica y automatización"
                                className={inputCls}
                                required
                            />
                        </div>

                        {/* Descripción */}
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>Descripción</label>
                            <textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Describe brevemente el contenido y objetivos del curso…"
                                rows={4}
                                className={`${inputCls} resize-none`}
                            />
                        </div>

                        {/* Cupos + Docente */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className={labelCls}>
                                    Cupos disponibles <span className="text-edu-danger text-xs">requerido</span>
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={cupos}
                                    onChange={(e) => setCupos(e.target.value)}
                                    placeholder="20"
                                    className={inputCls}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className={labelCls}>
                                    Docente a cargo <span className="text-edu-danger text-xs">requerido</span>
                                </label>
                                <select
                                    value={docente}
                                    onChange={(e) => setDocente(e.target.value)}
                                    className={`${inputCls} cursor-pointer`}
                                    required
                                >
                                    <option value="">Seleccionar docente</option>
                                    {DOCENTES_OPCIONES.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Pestaña Evaluaciones ── */}
                {mainTab === "evaluaciones" && (
                    <div className="p-5 flex flex-col gap-4">
                        {/* Sub-tabs */}
                        <div className="flex items-center gap-1 flex-wrap border-b border-edu-border-soft -mx-5 px-5">
                            {evalRows.map((r, i) => {
                                const active = evalTab === i;
                                return (
                                    <button
                                        key={r.id}
                                        type="button"
                                        onClick={() => setEvalTab(i)}
                                        className={`px-3 py-2.5 text-[0.8rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${active ? "border-edu-primary text-edu-primary" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
                                    >
                                        Evaluación {i + 1}
                                    </button>
                                );
                            })}
                            <button
                                type="button"
                                onClick={addEval}
                                title="Añadir evaluación"
                                className="px-2 py-2.5 -mb-px text-edu-primary cursor-pointer bg-transparent border-none flex items-center"
                            >
                                <PlusCircle className="w-4 h-4" />
                            </button>
                            <div className="flex-1" />
                            <button
                                type="button"
                                onClick={() => setEvalTab("review")}
                                className={`px-3 py-2.5 text-[0.8rem] font-semibold border-b-2 -mb-px inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent ${evalTab === "review" ? "border-edu-primary text-edu-primary" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
                            >
                                <ClipboardCheck className="w-3.5 h-3.5" />
                                Datos colocados
                            </button>
                        </div>

                        {/* Formulario de la evaluación activa */}
                        {typeof evalTab === "number" && evalRows[evalTab] && (
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-edu-ink-700 text-sm font-semibold">Evaluación {evalTab + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeEval(evalTab)}
                                        disabled={evalRows.length <= MIN_EVALS}
                                        className="inline-flex items-center gap-1 text-[0.8rem] text-edu-danger font-medium cursor-pointer bg-transparent border-none p-0 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Eliminar
                                    </button>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className={labelCls}>Nombre de la evaluación</label>
                                    <input
                                        type="text"
                                        value={evalRows[evalTab].nombre}
                                        onChange={(e) => updateEval(evalRows[evalTab].id, "nombre", e.target.value)}
                                        placeholder="Ej. Proyecto final · Unidad 1"
                                        className={inputCls}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className={labelCls}>Descripción</label>
                                    <textarea
                                        value={evalRows[evalTab].descripcion}
                                        onChange={(e) => updateEval(evalRows[evalTab].id, "descripcion", e.target.value)}
                                        placeholder="Describe en qué consiste la evaluación…"
                                        rows={3}
                                        className={`${inputCls} resize-none`}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className={labelCls}>Ponderación (%)</label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={evalRows[evalTab].ponderacion}
                                            onChange={(e) => updateEval(evalRows[evalTab].id, "ponderacion", e.target.value)}
                                            placeholder="20"
                                            className={inputCls}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className={labelCls}>Fecha</label>
                                        <input
                                            type="date"
                                            value={evalRows[evalTab].fecha}
                                            onChange={(e) => updateEval(evalRows[evalTab].id, "fecha", e.target.value)}
                                            className={inputCls}
                                        />
                                    </div>
                                </div>

                                {/* Archivos */}
                                <div className="flex flex-col gap-1.5">
                                    <label className={labelCls}>
                                        Archivos <span className="text-edu-ink-400 font-normal">(opcional · uno o varios)</span>
                                    </label>
                                    <label className="border-[1.5px] border-dashed border-edu-border rounded-edu-control px-3.5 py-3 bg-edu-subtle cursor-pointer flex items-center justify-center gap-2 transition-colors hover:border-edu-primary text-edu-ink-500 text-[0.8125rem]">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={(e) => e.target.files && addArchivos(evalRows[evalTab].id, e.target.files)}
                                            className="sr-only"
                                        />
                                        <Upload className="w-4 h-4" />
                                        Adjuntar archivos de apoyo
                                    </label>
                                    {evalRows[evalTab].archivos.length > 0 && (
                                        <div className="flex flex-col gap-1.5 mt-0.5">
                                            {evalRows[evalTab].archivos.map((f, fi) => (
                                                <div key={fi} className="flex items-center gap-2 px-2.5 py-1.5 rounded-edu-chip bg-edu-subtle border border-edu-border-soft">
                                                    <FileText className="w-3.5 h-3.5 text-edu-primary shrink-0" />
                                                    <span className="text-[0.8rem] text-edu-ink flex-1 truncate">{f}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArchivo(evalRows[evalTab].id, fi)}
                                                        className="text-edu-ink-400 hover:text-edu-danger bg-transparent border-none cursor-pointer p-0 flex items-center"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Pestaña "Datos colocados" */}
                        {evalTab === "review" && (
                            <div className="flex flex-col gap-4">
                                <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                                    <div className="overflow-x-auto">
                                    <div className="min-w-[520px]">
                                    <div className="grid grid-cols-[0.4fr_1.6fr_0.6fr_1fr_0.7fr] px-3 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                                        {["#", "Evaluación", "%", "Fecha", "Archivos"].map((h) => (
                                            <span key={h} className="text-[0.65rem] font-semibold text-edu-ink-400 uppercase tracking-[0.04em]">{h}</span>
                                        ))}
                                    </div>
                                    {evalRows.map((r, i) => (
                                        <div
                                            key={r.id}
                                            className={`grid grid-cols-[0.4fr_1.6fr_0.6fr_1fr_0.7fr] px-3 py-2.5 items-center ${i < evalRows.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                        >
                                            <span className="text-[0.8rem] text-edu-ink-500 font-semibold">{i + 1}</span>
                                            <span className="text-[0.8rem] text-edu-ink font-medium truncate pr-2">
                                                {r.nombre || <span className="text-edu-danger">Sin nombre</span>}
                                            </span>
                                            <span className="text-[0.8rem] text-edu-ink-700 font-semibold">{r.ponderacion || "—"} %</span>
                                            <span className="text-[0.78rem] text-edu-ink-500">{r.fecha || "—"}</span>
                                            <span className="text-[0.78rem] text-edu-ink-500">{r.archivos.length} arch.</span>
                                        </div>
                                    ))}
                                    <div className="px-3 py-2.5 bg-edu-subtle border-t border-edu-border-soft flex justify-between text-[0.8125rem]">
                                        <span className="text-edu-ink-500">Ponderación total</span>
                                        <span className={`font-semibold ${weightOk ? "text-edu-success" : "text-edu-warning"}`}>{totalPond} %</span>
                                    </div>
                                    </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {[
                                        { ok: infoOk,   text: "Información del curso completa (título, cupos, docente)" },
                                        { ok: evalsOk,  text: "Todas las evaluaciones tienen nombre y ponderación" },
                                        { ok: weightOk, text: `La ponderación total es 100 % (actual: ${totalPond} %)` },
                                    ].map((c, i) => (
                                        <div key={i} className="flex items-center gap-2 text-[0.8125rem]">
                                            {c.ok
                                                ? <CheckCircle2 className="w-4 h-4 text-edu-success shrink-0" />
                                                : <div className="w-4 h-4 rounded-full border-2 shrink-0" style={{ borderColor: color.warning }} />
                                            }
                                            <span className={c.ok ? "text-edu-ink-700" : "text-edu-warning"}>{c.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Acciones */}
                <div className="flex gap-2 justify-end border-t border-edu-border-soft px-5 py-4">
                    <button
                        type="button"
                        onClick={() => navigate("/coordinador/cursos")}
                        className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer hover:bg-edu-primary-hover"
                    >
                        <BookOpen className="w-4 h-4" />
                        Crear curso
                    </button>
                </div>
            </form>
        </div>
    );
}
