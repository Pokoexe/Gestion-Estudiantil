import { useState } from "react";
import {
    PlusCircle,
    Pencil,
    X,
    Trash2,
    Upload,
    FileText,
    Info,
    CheckCircle2,
    AlertTriangle,
    ClipboardCheck,
} from "lucide-react";
import { color } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Tipos e interfaces locales                                          */
/* ------------------------------------------------------------------ */

type PlanEstado = "approved" | "review" | "draft" | "changes";

interface Plan {
    id: number;
    subject: string;
    section: string;
    count: number;
    status: PlanEstado;
    note?: string;
}

interface EvalRow {
    id: number;
    content: string;
    description: string;
    weight: string;
    date: string;
    files: string[];
}

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const STATUS_META: Record<PlanEstado, { label: string; bg: string; fg: string }> = {
    approved: { label: "Aprobado", bg: color.successBg, fg: color.success },
    review: { label: "En revisión", bg: color.primary100, fg: color.primary },
    draft: { label: "Borrador", bg: color.subtle, fg: color.ink500 },
    changes: { label: "Cambios solicitados", bg: color.dangerBg, fg: color.danger },
};

const INITIAL_PLANS: Plan[] = [
    { id: 1, subject: "Biología", section: "5.º Año A", count: 5, status: "approved" },
    {
        id: 2,
        subject: "Ciencias Naturales",
        section: "4.º Año B",
        count: 5,
        status: "review",
        note: "En espera de aprobación del evaluador",
    },
    {
        id: 3,
        subject: "Química",
        section: "5.º Año B",
        count: 4,
        status: "changes",
        note: "El evaluador solicitó ajustar la ponderación de la Unidad 2",
    },
    { id: 4, subject: "Ciencias de la Tierra", section: "3.º Año C", count: 4, status: "draft" },
];

const MATERIA_OPTIONS = ["Ciencias Naturales", "Biología", "Ciencias de la Tierra", "Química"];
const SECCION_OPTIONS = ["3.º Año C", "4.º Año A", "4.º Año B", "5.º Año A", "5.º Año B"];

/** Ventana del lapso académico y separación permitida entre evaluaciones. */
const LAPSO = {
    start: "2026-07-01",
    end: "2026-09-30",
    startLabel: "1 de julio de 2026",
    endLabel: "30 de septiembre de 2026",
    minDays: 5,
    maxDays: 30,
};

const MIN_EVALS = 4;

const emptyRow = (id: number): EvalRow => ({
    id,
    content: "",
    description: "",
    weight: "",
    date: "",
    files: [],
});

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DocentePlanesPage() {
    const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState({ subject: "", section: "" });
    const [rows, setRows] = useState<EvalRow[]>([emptyRow(1), emptyRow(2), emptyRow(3), emptyRow(4)]);
    const [activeTab, setActiveTab] = useState<number | "review">(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    const totalWeight = rows.reduce((a, r) => a + (parseFloat(r.weight) || 0), 0);

    const openCreate = () => {
        setEditingId(null);
        setForm({ subject: "", section: "" });
        setRows([emptyRow(1), emptyRow(2), emptyRow(3), emptyRow(4)]);
        setActiveTab(0);
        setShowModal(true);
    };

    const openEdit = (plan: Plan) => {
        setEditingId(plan.id);
        setForm({ subject: plan.subject, section: plan.section });
        setRows(
            Array.from({ length: plan.count }, (_, i) => ({
                ...emptyRow(i + 1),
                content: `Evaluación ${i + 1}`,
            })),
        );
        setActiveTab(0);
        setShowModal(true);
    };

    const updateRow = (id: number, field: keyof EvalRow, value: string) => {
        setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    };

    const addRow = () => {
        const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
        setRows([...rows, emptyRow(nextId)]);
        setActiveTab(rows.length);
    };

    const removeRow = (index: number) => {
        if (rows.length <= MIN_EVALS) return;
        setRows(rows.filter((_, i) => i !== index));
        setActiveTab((t) => (typeof t === "number" ? Math.max(0, Math.min(t, rows.length - 2)) : t));
    };

    const addFiles = (id: number, files: FileList) => {
        const names = Array.from(files).map((f) => f.name);
        setRows((rs) => rs.map((r) => (r.id === id ? { ...r, files: [...r.files, ...names] } : r)));
    };

    const removeFile = (id: number, idx: number) => {
        setRows((rs) => rs.map((r) => (r.id === id ? { ...r, files: r.files.filter((_, i) => i !== idx) } : r)));
    };

    // Validaciones para la pestaña "Datos colocados"
    const seleccionOk = !!form.subject && !!form.section;
    const evalsComplete = rows.every((r) => r.content.trim() && r.weight && r.date);
    const weightOk = totalWeight === 100;
    const datesInRange = rows.every((r) => !r.date || (r.date >= LAPSO.start && r.date <= LAPSO.end));
    const sortedDates = rows.map((r) => r.date).filter(Boolean).sort();
    let spacingOk = true;
    for (let i = 1; i < sortedDates.length; i++) {
        const diff = (new Date(sortedDates[i]).getTime() - new Date(sortedDates[i - 1]).getTime()) / 86_400_000;
        if (diff < LAPSO.minDays || diff > LAPSO.maxDays) spacingOk = false;
    }
    const allValid = seleccionOk && evalsComplete && weightOk && datesInRange && spacingOk;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId !== null) {
            setPlans((ps) =>
                ps.map((p) =>
                    p.id === editingId
                        ? {
                              ...p,
                              subject: form.subject || p.subject,
                              section: form.section || p.section,
                              count: rows.length,
                              status: "review",
                              note: "Plan actualizado · enviado al evaluador",
                          }
                        : p,
                ),
            );
            setFeedback("El plan de evaluación fue actualizado y enviado al evaluador.");
        } else {
            const newPlan: Plan = {
                id: Date.now(),
                subject: form.subject,
                section: form.section,
                count: rows.length,
                status: "review",
                note: "Plan enviado al evaluador para su revisión",
            };
            setPlans([newPlan, ...plans]);
            setFeedback("Plan creado y enviado al evaluador para su revisión.");
        }
        setShowModal(false);
    };

    const inputCls =
        "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary";
    const labelCls = "text-edu-ink-700 text-sm font-medium";

    return (
        <div className="flex flex-col gap-5">
            {/* Confirmación */}
            {feedback && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-edu-control text-sm font-medium bg-edu-success-bg text-edu-success">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{feedback}</span>
                    <button
                        onClick={() => setFeedback(null)}
                        aria-label="Cerrar"
                        className="text-edu-success bg-transparent border-none cursor-pointer p-0 flex items-center"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Encabezado */}
            <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Planes de evaluación</h2>
                    <p className="text-edu-ink-500 text-sm mt-1 m-0">
                        Crea y modifica los planes de tus secciones
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
                >
                    <PlusCircle className="w-4 h-4" />
                    Crear plan de evaluación
                </button>
            </div>

            {/* Tabla de planes */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.6fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                    {["Materia", "Sección", "Evaluaciones", "Estado", "Acción"].map((h) => (
                        <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                            {h}
                        </span>
                    ))}
                </div>
                {plans.map((plan, i) => {
                    const st = STATUS_META[plan.status];
                    return (
                        <div
                            key={plan.id}
                            className={`px-5 py-[13px] transition-colors hover:bg-edu-subtle ${i < plans.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                        >
                            <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.6fr] items-center">
                                <span className="text-sm text-edu-ink font-medium">{plan.subject}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{plan.section}</span>
                                <span className="text-sm text-edu-ink-700 font-semibold">{plan.count} evaluaciones</span>
                                <span
                                    className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                                    style={{ backgroundColor: st.bg, color: st.fg }}
                                >
                                    {st.label}
                                </span>
                                <button
                                    onClick={() => openEdit(plan)}
                                    className="inline-flex items-center gap-1 text-[0.8rem] text-edu-primary font-semibold cursor-pointer w-fit bg-transparent border-none p-0"
                                >
                                    <Pencil style={{ width: "13px", height: "13px" }} />
                                    Modificar
                                </button>
                            </div>
                            {plan.note && (
                                <div className={`mt-2 flex items-center gap-1.5 text-xs w-fit rounded-edu-chip px-2.5 py-1.5 ${plan.status === "changes" ? "text-edu-danger bg-edu-danger-bg" : "text-edu-ink-500 bg-edu-primary-50"}`}>
                                    <AlertTriangle className="shrink-0" style={{ width: "12px", height: "12px" }} />
                                    {plan.note}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal crear / modificar */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-edu-surface rounded-edu-card w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Encabezado del modal */}
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center sticky top-0 bg-edu-surface z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-edu-control bg-edu-primary-50 flex items-center justify-center">
                                    <PlusCircle className="w-4 h-4 text-edu-primary" />
                                </div>
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">
                                    {editingId !== null ? "Modificar plan de evaluación" : "Crear plan de evaluación"}
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                aria-label="Cerrar"
                                className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                            {/* Materia + sección (selects) */}
                            <div className="grid grid-cols-2 gap-3">
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

                            {/* Aviso del lapso */}
                            <div className="flex items-start gap-2 px-3.5 py-3 rounded-edu-control bg-edu-primary-50 text-edu-primary text-[0.8125rem] leading-[1.5]">
                                <Info className="w-4 h-4 shrink-0 mt-px" />
                                <span>
                                    El lapso va del <strong>{LAPSO.startLabel}</strong> al <strong>{LAPSO.endLabel}</strong>. Entre una
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
                                            disabled={rows.length <= MIN_EVALS}
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
                                            placeholder="Ej. Prueba escrita · Unidad 1"
                                            className={inputCls}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className={labelCls}>Descripción</label>
                                        <textarea
                                            value={rows[activeTab].description}
                                            onChange={(e) => updateRow(rows[activeTab].id, "description", e.target.value)}
                                            placeholder="Describe en qué consiste la evaluación…"
                                            rows={2}
                                            className={`${inputCls} resize-none`}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1.5">
                                            <label className={labelCls}>Ponderación (%)</label>
                                            <input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={rows[activeTab].weight}
                                                onChange={(e) => updateRow(rows[activeTab].id, "weight", e.target.value)}
                                                placeholder="20"
                                                className={inputCls}
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
                                            Adjuntar archivos de apoyo
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
                                    <div className="rounded-edu-control border border-edu-border-soft p-4 grid grid-cols-2 gap-3">
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
                                                <span className="text-[0.8rem] text-edu-ink-700 font-semibold">{r.weight || "—"} %</span>
                                                <span className="text-[0.78rem] text-edu-ink-500">{r.date || "—"}</span>
                                                <span className="text-[0.78rem] text-edu-ink-500">{r.files.length} archivo(s)</span>
                                            </div>
                                        ))}
                                        <div className="px-3 py-2 bg-edu-subtle border-t border-edu-border-soft flex justify-between text-[0.8125rem]">
                                            <span className="text-edu-ink-500">Ponderación total</span>
                                            <span className={`font-semibold ${weightOk ? "text-edu-success" : "text-edu-warning"}`}>{totalWeight} %</span>
                                        </div>
                                    </div>

                                    {/* Verificación */}
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { ok: seleccionOk, text: "Materia y sección seleccionadas" },
                                            { ok: evalsComplete, text: "Todas las evaluaciones tienen nombre, ponderación y fecha" },
                                            { ok: weightOk, text: `La ponderación total es 100 % (actual: ${totalWeight} %)` },
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
                            )}

                            {/* Acciones */}
                            <div className="flex gap-2 justify-end border-t border-edu-border-soft mt-1 -mx-5 px-5 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
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
                                        {editingId !== null ? "Guardar cambios" : "Guardar plan"}
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
                </div>
            )}
        </div>
    );
}
