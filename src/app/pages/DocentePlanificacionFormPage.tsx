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
    BookOpen,
} from "lucide-react";
import { LAPSO, MIN_SESIONES } from "../datos_maquetados/data/planificaciones";
import { useFetch } from "../datos_maquetados";
import { getMateriaOptions, getSeccionOptions } from "../datos_maquetados/actions/plans";
import {
    getPlanificacionById,
    crearPlanificacion,
    actualizarPlanificacion,
    type PlanifSesion,
    type Planificacion,
} from "../datos_maquetados/actions/planificaciones";

const emptyRow = (id: number): PlanifSesion => ({
    id,
    content: "",
    description: "",
    date: "",
    files: [],
});

export function DocentePlanificacionFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const editing = id != null;

    const { data: MATERIA_OPTIONS } = useFetch(getMateriaOptions, []);
    const { data: SECCION_OPTIONS } = useFetch(getSeccionOptions, []);

    // Carga async de la planificación a editar (undefined mientras carga o si no existe).
    const [planif, setPlanif] = useState<Planificacion | undefined>(undefined);
    const [planifLoaded, setPlanifLoaded] = useState(!editing);
    useEffect(() => {
        if (!editing) return;
        let alive = true;
        getPlanificacionById(id!).then((p) => {
            if (!alive) return;
            setPlanif(p);
            setPlanifLoaded(true);
        });
        return () => { alive = false; };
    }, [editing, id]);

    const [form, setForm] = useState({ subject: "", section: "" });
    const [rows, setRows] = useState<PlanifSesion[]>([emptyRow(1), emptyRow(2), emptyRow(3)]);
    const [activeTab, setActiveTab] = useState<number | "review">(0);

    // Al llegar la planificación (modo edición), rellena el formulario con sus datos.
    useEffect(() => {
        if (!planif) return;
        setForm({ subject: planif.subject ?? "", section: planif.section ?? "" });
        if (planif.sessions && planif.sessions.length) {
            setRows(planif.sessions.map((s) => ({ ...s, files: [...s.files] })));
        } else {
            setRows(Array.from({ length: planif.count }, (_, i) => ({
                ...emptyRow(i + 1),
                content: `Sesión ${i + 1}`,
            })));
        }
    }, [planif]);

    const updateRow = (rid: number, field: keyof PlanifSesion, value: string) => {
        setRows((rs) => rs.map((r) => (r.id === rid ? { ...r, [field]: value } : r)));
    };

    const addRow = () => {
        const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
        setRows([...rows, emptyRow(nextId)]);
        setActiveTab(rows.length);
    };

    const removeRow = (index: number) => {
        if (rows.length <= MIN_SESIONES) return;
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
    const seleccionOk = !!form.subject && !!form.section;
    const sesionesComplete = rows.every((r) => r.content.trim() && r.date);
    const datesInRange = rows.every((r) => !r.date || (r.date >= LAPSO.start && r.date <= LAPSO.end));
    const sortedDates = rows.map((r) => r.date).filter(Boolean).sort();
    let spacingOk = true;
    for (let i = 1; i < sortedDates.length; i++) {
        const diff = (new Date(sortedDates[i]).getTime() - new Date(sortedDates[i - 1]).getTime()) / 86_400_000;
        if (diff < LAPSO.minDays || diff > LAPSO.maxDays) spacingOk = false;
    }
    const allValid = seleccionOk && sesionesComplete && datesInRange && spacingOk;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = { subject: form.subject, section: form.section, sessions: rows };
        if (editing && planif) {
            await actualizarPlanificacion(planif.id, data);
            navigate("/docente/planificacion", { state: { feedback: "La planificación fue actualizada y enviada al coordinador." } });
        } else {
            await crearPlanificacion(data);
            navigate("/docente/planificacion", { state: { feedback: "Planificación creada y enviada al coordinador para su revisión." } });
        }
    };

    const inputCls =
        "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary";
    const labelCls = "text-edu-ink-700 text-sm font-medium";

    // Planificación a editar inexistente
    if (editing && planifLoaded && !planif) {
        return (
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => navigate("/docente/planificacion")}
                    className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a planificación
                </button>
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-12 text-center text-edu-ink-400 text-sm">
                    La planificación que intentas modificar no existe.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Volver */}
            <button
                onClick={() => navigate("/docente/planificacion")}
                className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver a planificación
            </button>

            {/* Encabezado */}
            {editing ? (
                /* En modificar, la materia y sección se muestran en banner azul (no editables) */
                <div className="bg-edu-primary rounded-edu-card px-6 py-[22px] flex justify-between items-center flex-wrap gap-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <BookOpen style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.8)" }} />
                            <span className="text-xs text-[rgba(255,255,255,0.75)] font-medium uppercase tracking-[0.06em]">
                                Modificar planificación · Ciclo escolar 2026-I
                            </span>
                        </div>
                        <h2 className="text-white mb-1.5 text-xl font-bold m-0">{form.subject}</h2>
                        <div className="flex gap-4 flex-wrap">
                            <span className="text-[0.8rem] text-[rgba(255,255,255,0.75)]">{form.section}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-edu-control bg-edu-primary-50 flex items-center justify-center shrink-0">
                        <PlusCircle className="w-5 h-5 text-edu-primary" />
                    </div>
                    <div>
                        <h2 className="m-0 text-edu-ink font-bold text-[1.25rem]">Crear planificación</h2>
                        <p className="text-edu-ink-500 text-sm mt-0.5 m-0">
                            Define las sesiones del lapso y verifica los datos antes de enviarla.
                        </p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-4">
                {/* Materia + sección: selects solo al crear (en modificar van en el banner) */}
                {!editing && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>Materia</label>
                            <select
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                className={`${inputCls} cursor-pointer`}
                            >
                                <option value="">Selecciona una materia</option>
                                {MATERIA_OPTIONS.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>Sección</label>
                            <select
                                value={form.section}
                                onChange={(e) => setForm({ ...form, section: e.target.value })}
                                className={`${inputCls} cursor-pointer`}
                            >
                                <option value="">Selecciona una sección</option>
                                {SECCION_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Aviso del lapso */}
                <div className="flex items-start gap-2 px-3.5 py-3 rounded-edu-control bg-edu-primary-50 text-edu-primary text-[0.8125rem] leading-[1.5]">
                    <Info className="w-4 h-4 shrink-0 mt-px" />
                    <span>
                        El lapso va del <strong>{LAPSO.startLabel}</strong> al <strong>{LAPSO.endLabel}</strong>. Entre una
                        sesión y otra debe haber <strong>mínimo {LAPSO.minDays} días</strong> y{" "}
                        <strong>máximo {LAPSO.maxDays} días</strong> de diferencia.
                    </span>
                </div>

                {/* Pestañas de sesiones + datos colocados */}
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
                                Sesión {i + 1}
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={addRow}
                        title="Añadir sesión"
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

                {/* Contenido de la sesión activa */}
                {typeof activeTab === "number" && rows[activeTab] && (
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <span className="text-edu-ink-700 text-sm font-semibold">Sesión {activeTab + 1}</span>
                            <button
                                type="button"
                                onClick={() => removeRow(activeTab)}
                                disabled={rows.length <= MIN_SESIONES}
                                className="inline-flex items-center gap-1 text-[0.8rem] text-edu-danger font-medium cursor-pointer bg-transparent border-none p-0 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Eliminar
                            </button>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>Tema de la sesión</label>
                            <input
                                type="text"
                                value={rows[activeTab].content}
                                onChange={(e) => updateRow(rows[activeTab].id, "content", e.target.value)}
                                placeholder="Ej. Introducción a la célula"
                                className={inputCls}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>Objetivos y actividades</label>
                            <textarea
                                value={rows[activeTab].description}
                                onChange={(e) => updateRow(rows[activeTab].id, "description", e.target.value)}
                                placeholder="Describe los objetivos y las actividades de la sesión…"
                                rows={2}
                                className={`${inputCls} resize-none`}
                            />
                        </div>

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
                                Adjuntar material de la sesión
                            </label>
                            {rows[activeTab].files.length > 0 && (
                                <div className="flex flex-col gap-1.5 mt-0.5">
                                    {rows[activeTab].files.map((f, fi) => (
                                        <div
                                            key={fi}
                                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-edu-chip bg-edu-subtle border border-edu-border-soft"
                                        >
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
                                <div className="text-[0.875rem] text-edu-ink font-medium">{form.subject || "—"}</div>
                            </div>
                            <div>
                                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Sección</div>
                                <div className="text-[0.875rem] text-edu-ink font-medium">{form.section || "—"}</div>
                            </div>
                        </div>

                        <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                            <div className="overflow-x-auto">
                            <div className="min-w-[600px]">
                            <div className="grid grid-cols-[0.4fr_2fr_1fr_0.7fr] px-3 py-2 bg-edu-subtle border-b border-edu-border-soft">
                                {["#", "Tema", "Fecha", "Archivos"].map((h, idx) => (
                                    <span key={idx} className="text-[0.65rem] font-semibold text-edu-ink-400 uppercase tracking-[0.04em]">
                                        {h}
                                    </span>
                                ))}
                            </div>
                            {rows.map((r, i) => (
                                <div
                                    key={r.id}
                                    className={`grid grid-cols-[0.4fr_2fr_1fr_0.7fr] px-3 py-2 items-center ${i < rows.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <span className="text-[0.8rem] text-edu-ink-500 font-semibold">{i + 1}</span>
                                    <span className="text-[0.8rem] text-edu-ink font-medium truncate pr-2">
                                        {r.content || <span className="text-edu-danger">Sin tema</span>}
                                    </span>
                                    <span className="text-[0.78rem] text-edu-ink-500">{r.date || "—"}</span>
                                    <span className="text-[0.78rem] text-edu-ink-500">{r.files.length} archivo(s)</span>
                                </div>
                            ))}
                            </div>
                            </div>
                        </div>

                        {/* Verificación */}
                        <div className="flex flex-col gap-2">
                            {[
                                { ok: seleccionOk, text: "Materia y sección seleccionadas" },
                                { ok: sesionesComplete, text: "Todas las sesiones tienen tema y fecha" },
                                { ok: datesInRange, text: "Las fechas están dentro del lapso" },
                                { ok: spacingOk, text: `Entre sesiones hay entre ${LAPSO.minDays} y ${LAPSO.maxDays} días` },
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
                        onClick={() => navigate("/docente/planificacion")}
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
                            {editing ? "Guardar cambios" : "Guardar planificación"}
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
