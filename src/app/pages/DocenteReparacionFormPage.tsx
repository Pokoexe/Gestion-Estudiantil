import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
    PlusCircle,
    X,
    Trash2,
    Upload,
    FileText,
    Info,
    CheckCircle2,
    AlertTriangle,
    ClipboardCheck,
    ArrowLeft,
    Wrench,
} from "lucide-react";
import { LAPSO, MIN_REP } from "../datos_maquetados/data/reparaciones";
import { useFetch } from "../datos_maquetados";
import { getReparacionById, guardarReparacion, type ReparacionEval } from "../datos_maquetados/actions/reparaciones";

const emptyRow = (id: number): ReparacionEval => ({
    id,
    content: "",
    description: "",
    date: "",
    horario: "",
    files: [],
});

export function DocenteReparacionFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: reparacion, loading } = useFetch(() => getReparacionById(id ?? ""), undefined, [id]);

    const [rows, setRows] = useState<ReparacionEval[]>([]);
    useEffect(() => {
        if (reparacion?.evaluations && reparacion.evaluations.length) {
            setRows(reparacion.evaluations.map((e) => ({ ...e, files: [...e.files] })));
        } else {
            setRows(Array.from({ length: MIN_REP }, (_, i) => ({ ...emptyRow(i + 1), content: `Evaluación ${i + 1}` })));
        }
    }, [reparacion]);
    const [activeTab, setActiveTab] = useState<number | "review">(0);

    const updateRow = (rid: number, field: keyof ReparacionEval, value: string) => {
        setRows((rs) => rs.map((r) => (r.id === rid ? { ...r, [field]: value } : r)));
    };

    const addRow = () => {
        const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
        setRows([...rows, emptyRow(nextId)]);
        setActiveTab(rows.length);
    };

    const removeRow = (index: number) => {
        if (rows.length <= MIN_REP) return;
        setRows(rows.filter((_, i) => i !== index));
        setActiveTab((t) => (typeof t === "number" ? Math.max(0, Math.min(t, rows.length - 2)) : t));
    };

    const addFiles = (rid: number, files: FileList) => {
        const names = Array.from(files).map((f) => f.name);
        setRows((rs) => rs.map((r) => (r.id === rid ? { ...r, files: [...r.files, ...names] } : r)));
    };

    const removeFile = (rid: number, idx: number) => {
        setRows((rs) => rs.map((r) => (r.id === rid ? { ...r, files: r.files.filter((_, i) => i !== idx) } : r)));
    };

    // Validaciones para "Datos colocados"
    const evalsComplete = rows.every((r) => r.content.trim() && r.date && r.horario.trim());
    const datesInRange = rows.every((r) => !r.date || (r.date >= LAPSO.start && r.date <= LAPSO.end));
    const sortedDates = rows.map((r) => r.date).filter(Boolean).sort();
    let spacingOk = true;
    for (let i = 1; i < sortedDates.length; i++) {
        const diff = (new Date(sortedDates[i]).getTime() - new Date(sortedDates[i - 1]).getTime()) / 86_400_000;
        if (diff < LAPSO.minDays || diff > LAPSO.maxDays) spacingOk = false;
    }
    const allValid = evalsComplete && datesInRange && spacingOk;

    const inputCls =
        "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary";
    const labelCls = "text-edu-ink-700 text-sm font-medium";

    if (loading) return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

    // Reparación inexistente
    if (!reparacion) {
        return (
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => navigate("/docente/reparaciones")}
                    className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a reparaciones
                </button>
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-12 text-center text-edu-ink-400 text-sm">
                    La reparación no existe.
                </div>
            </div>
        );
    }

    const yaCreada = reparacion.status === "creada";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await guardarReparacion(reparacion.id, rows);
        navigate("/docente/reparaciones", {
            state: { feedback: yaCreada ? "La reparación fue actualizada." : "Reparación creada correctamente." },
        });
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Volver */}
            <button
                onClick={() => navigate("/docente/reparaciones")}
                className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver a reparaciones
            </button>

            {/* Banner de la materia en reparación */}
            <div className="bg-edu-primary rounded-edu-card px-6 py-[22px] flex justify-between items-center flex-wrap gap-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Wrench style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.8)" }} />
                        <span className="text-xs text-[rgba(255,255,255,0.75)] font-medium uppercase tracking-[0.06em]">
                            {yaCreada ? "Modificar reparación" : "Crear reparación"} · Ciclo escolar 2026-I
                        </span>
                    </div>
                    <h2 className="text-white mb-1.5 text-xl font-bold m-0">{reparacion.subject}</h2>
                    <div className="flex gap-4 flex-wrap">
                        <span className="text-[0.8rem] text-[rgba(255,255,255,0.75)]">{reparacion.section}</span>
                        <span className="text-[0.8rem] text-[rgba(255,255,255,0.75)]">Materia reprobada</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-4">
                {/* Aviso del lapso */}
                <div className="flex items-start gap-2 px-3.5 py-3 rounded-edu-control bg-edu-primary-50 text-edu-primary text-[0.8125rem] leading-[1.5]">
                    <Info className="w-4 h-4 shrink-0 mt-px" />
                    <span>
                        El período de reparación va del <strong>{LAPSO.startLabel}</strong> al <strong>{LAPSO.endLabel}</strong>. Entre una
                        evaluación y otra debe haber <strong>mínimo {LAPSO.minDays} días</strong> y{" "}
                        <strong>máximo {LAPSO.maxDays} días</strong> de diferencia.
                    </span>
                </div>

                {/* Pestañas de evaluaciones + datos colocados */}
                <div className="flex items-center gap-1 flex-wrap border-b border-edu-border-soft">
                    {rows.map((r, i) => {
                        const active = activeTab === i;
                        return (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setActiveTab(i)}
                                className={`px-3 py-2 text-[0.8rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${active ? "border-edu-primary text-edu-primary" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
                            >
                                Evaluación {i + 1}
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={addRow}
                        title="Añadir evaluación"
                        className="px-2 py-2 -mb-px text-edu-primary cursor-pointer bg-transparent border-none flex items-center"
                    >
                        <PlusCircle className="w-4 h-4" />
                    </button>
                    <div className="flex-1" />
                    <button
                        type="button"
                        onClick={() => setActiveTab("review")}
                        className={`px-3 py-2 text-[0.8rem] font-semibold border-b-2 -mb-px inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent ${activeTab === "review" ? "border-edu-primary text-edu-primary" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
                    >
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        Datos colocados
                    </button>
                </div>

                {/* Contenido de la evaluación activa */}
                {typeof activeTab === "number" && rows[activeTab] && (
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <span className="text-edu-ink-700 text-sm font-semibold">Evaluación {activeTab + 1}</span>
                            <button
                                type="button"
                                onClick={() => removeRow(activeTab)}
                                disabled={rows.length <= MIN_REP}
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
                                value={rows[activeTab].content}
                                onChange={(e) => updateRow(rows[activeTab].id, "content", e.target.value)}
                                placeholder="Ej. Examen final de recuperación"
                                className={inputCls}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>Descripción</label>
                            <textarea
                                value={rows[activeTab].description}
                                onChange={(e) => updateRow(rows[activeTab].id, "description", e.target.value)}
                                placeholder="Describe la evaluación de recuperación…"
                                rows={2}
                                className={`${inputCls} resize-none`}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className={labelCls}>Fecha</label>
                                <input
                                    type="date"
                                    min={LAPSO.start}
                                    max={LAPSO.end}
                                    value={rows[activeTab].date}
                                    onChange={(e) => updateRow(rows[activeTab].id, "date", e.target.value)}
                                    className={inputCls}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className={labelCls}>Horario</label>
                                <input
                                    type="text"
                                    value={rows[activeTab].horario}
                                    onChange={(e) => updateRow(rows[activeTab].id, "horario", e.target.value)}
                                    placeholder="Ej. Lun · 07:00 – 08:30"
                                    className={inputCls}
                                />
                            </div>
                        </div>

                        {/* Archivos opcionales (uno o varios) */}
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>
                                Archivos <span className="text-edu-ink-400 font-normal">(opcional · uno o varios)</span>
                            </label>
                            <label className="border-[1.5px] border-dashed border-edu-border rounded-edu-control px-3.5 py-3 bg-edu-subtle cursor-pointer flex items-center justify-center gap-2 transition-colors hover:border-edu-primary-200 text-edu-ink-500 text-[0.8125rem]">
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => e.target.files && addFiles(rows[activeTab].id, e.target.files)}
                                    className="sr-only"
                                />
                                <Upload className="w-4 h-4" />
                                Adjuntar material de la evaluación
                            </label>
                            {rows[activeTab].files.length > 0 && (
                                <div className="flex flex-col gap-1.5 mt-0.5">
                                    {rows[activeTab].files.map((f, fi) => (
                                        <div key={fi} className="flex items-center gap-2 px-2.5 py-1.5 rounded-edu-chip bg-edu-subtle border border-edu-border-soft">
                                            <FileText className="w-3.5 h-3.5 text-edu-primary shrink-0" />
                                            <span className="text-[0.8rem] text-edu-ink flex-1 truncate">{f}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(rows[activeTab].id, fi)}
                                                aria-label="Quitar archivo"
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

                {/* Pestaña "Datos colocados" (revisión) */}
                {activeTab === "review" && (
                    <div className="flex flex-col gap-4">
                        <div className="rounded-edu-control border border-edu-border-soft p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Materia</div>
                                <div className="text-[0.875rem] text-edu-ink font-medium">{reparacion.subject}</div>
                            </div>
                            <div>
                                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Sección</div>
                                <div className="text-[0.875rem] text-edu-ink font-medium">{reparacion.section}</div>
                            </div>
                        </div>

                        <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                          <div className="overflow-x-auto">
                            <div className="min-w-[680px]">
                            <div className="grid grid-cols-[0.4fr_1.6fr_1fr_1.2fr_0.7fr] px-3 py-2 bg-edu-subtle border-b border-edu-border-soft">
                                {["#", "Evaluación", "Fecha", "Horario", "Archivos"].map((h, idx) => (
                                    <span key={idx} className="text-[0.65rem] font-semibold text-edu-ink-400 uppercase tracking-[0.04em]">{h}</span>
                                ))}
                            </div>
                            {rows.map((r, i) => (
                                <div
                                    key={r.id}
                                    className={`grid grid-cols-[0.4fr_1.6fr_1fr_1.2fr_0.7fr] px-3 py-2 items-center ${i < rows.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <span className="text-[0.8rem] text-edu-ink-500 font-semibold">{i + 1}</span>
                                    <span className="text-[0.8rem] text-edu-ink font-medium truncate pr-2">
                                        {r.content || <span className="text-edu-danger">Sin nombre</span>}
                                    </span>
                                    <span className="text-[0.78rem] text-edu-ink-500">{r.date || "—"}</span>
                                    <span className="text-[0.78rem] text-edu-ink-500 truncate pr-2">{r.horario || "—"}</span>
                                    <span className="text-[0.78rem] text-edu-ink-500">{r.files.length} archivo(s)</span>
                                </div>
                            ))}
                            </div>
                          </div>
                        </div>

                        {/* Verificación */}
                        <div className="flex flex-col gap-2">
                            {[
                                { ok: evalsComplete, text: "Todas las evaluaciones tienen nombre, fecha y horario" },
                                { ok: datesInRange, text: "Las fechas están dentro del período de reparación" },
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
                )}

                {/* Acciones */}
                <div className="flex gap-2 justify-end border-t border-edu-border-soft -mx-5 px-5 pt-4 mt-1">
                    <button
                        type="button"
                        onClick={() => navigate("/docente/reparaciones")}
                        className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
                    >
                        Cancelar
                    </button>
                    {activeTab === "review" ? (
                        <button
                            type="submit"
                            disabled={!allValid}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            {yaCreada ? "Guardar cambios" : "Crear reparación"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setActiveTab("review")}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover"
                        >
                            <ClipboardCheck className="w-4 h-4" />
                            Verificar datos
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
