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
    examUploaded?: boolean;
}

interface EvalRow {
    id: number;
    content: string;
    description: string;
    weight: string;
    date: string;
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
    { id: 1, subject: "Biología", section: "5.º Año A", count: 5, status: "approved", examUploaded: true },
    {
        id: 2,
        subject: "Ciencias Naturales",
        section: "4.º Año B",
        count: 5,
        status: "review",
        note: "Prueba enviada al evaluador · en espera de aprobación",
        examUploaded: true,
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

const emptyRow = (id: number): EvalRow => ({
    id,
    content: "",
    description: "",
    weight: "",
    date: "",
});

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DocentePlanesPage() {
    const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState({ subject: "", section: "" });
    const [rows, setRows] = useState<EvalRow[]>([
        emptyRow(1),
        emptyRow(2),
        emptyRow(3),
        emptyRow(4),
    ]);
    const [examFile, setExamFile] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);

    const totalWeight = rows.reduce((a, r) => a + (parseFloat(r.weight) || 0), 0);

    const openCreate = () => {
        setEditingId(null);
        setForm({ subject: "", section: "" });
        setRows([emptyRow(1), emptyRow(2), emptyRow(3), emptyRow(4)]);
        setExamFile(null);
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
        setExamFile(plan.examUploaded ? "examen_actual.pdf" : null);
        setShowModal(true);
    };

    const updateRow = (id: number, field: keyof EvalRow, value: string) => {
        setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    };

    const addRow = () => {
        const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
        setRows([...rows, emptyRow(nextId)]);
    };

    const removeRow = (id: number) => {
        if (rows.length <= 4) return; // mínimo 4 evaluaciones
        setRows(rows.filter((r) => r.id !== id));
    };

    const handleExam = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setExamFile(file.name);
    };

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
                              examUploaded: !!examFile,
                              note: "Plan actualizado · enviado al evaluador",
                          }
                        : p,
                ),
            );
            setFeedback("El plan de evaluación fue actualizado y enviado al evaluador.");
        } else {
            const newPlan: Plan = {
                id: Date.now(),
                subject: form.subject || "Nueva materia",
                section: form.section || "Sin sección",
                count: rows.length,
                status: examFile ? "review" : "draft",
                examUploaded: !!examFile,
                note: examFile ? "Prueba en revisión por el evaluador" : undefined,
            };
            setPlans([newPlan, ...plans]);
            setFeedback(
                examFile
                    ? "Plan creado. La prueba quedó «En revisión por el evaluador»."
                    : "Plan guardado como borrador.",
            );
        }
        setShowModal(false);
    };

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
                            {/* Materia + sección */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-edu-ink-700 text-sm font-medium">Materia</label>
                                    <input
                                        type="text"
                                        value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        placeholder="Ej. Ciencias Naturales"
                                        className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-edu-ink-700 text-sm font-medium">Sección</label>
                                    <input
                                        type="text"
                                        value={form.section}
                                        onChange={(e) => setForm({ ...form, section: e.target.value })}
                                        placeholder="Ej. 4.º Año B"
                                        className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary"
                                    />
                                </div>
                            </div>

                            {/* Evaluaciones (mínimo 4) */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-edu-ink-700 text-sm font-medium">
                                        Evaluaciones <span className="text-edu-ink-400">(mínimo 4)</span>
                                    </label>
                                    <span className={`text-[0.8rem] font-semibold ${totalWeight === 100 ? "text-edu-success" : "text-edu-warning"}`}>
                                        Total: {totalWeight} %
                                    </span>
                                </div>

                                <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                                    <div className="grid grid-cols-[1.2fr_1.6fr_0.7fr_1fr_0.3fr] px-3 py-2 bg-edu-subtle border-b border-edu-border-soft">
                                        {["Contenido", "Descripción", "%", "Fecha", ""].map((h, idx) => (
                                            <span key={idx} className="text-[0.65rem] font-semibold text-edu-ink-400 uppercase tracking-[0.04em]">
                                                {h}
                                            </span>
                                        ))}
                                    </div>
                                    {rows.map((r, i) => (
                                        <div
                                            key={r.id}
                                            className={`grid grid-cols-[1.2fr_1.6fr_0.7fr_1fr_0.3fr] gap-1.5 px-3 py-2 items-center ${i < rows.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                        >
                                            <input
                                                type="text"
                                                value={r.content}
                                                onChange={(e) => updateRow(r.id, "content", e.target.value)}
                                                placeholder="Unidad 1"
                                                className="border border-edu-border rounded-edu-chip px-2 py-1.5 text-[0.8rem] text-edu-ink outline-none bg-edu-surface focus:border-edu-primary min-w-0"
                                            />
                                            <input
                                                type="text"
                                                value={r.description}
                                                onChange={(e) => updateRow(r.id, "description", e.target.value)}
                                                placeholder="Prueba escrita"
                                                className="border border-edu-border rounded-edu-chip px-2 py-1.5 text-[0.8rem] text-edu-ink outline-none bg-edu-surface focus:border-edu-primary min-w-0"
                                            />
                                            <input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={r.weight}
                                                onChange={(e) => updateRow(r.id, "weight", e.target.value)}
                                                placeholder="20"
                                                className="border border-edu-border rounded-edu-chip px-2 py-1.5 text-[0.8rem] text-edu-ink outline-none bg-edu-surface focus:border-edu-primary min-w-0"
                                            />
                                            <input
                                                type="date"
                                                value={r.date}
                                                onChange={(e) => updateRow(r.id, "date", e.target.value)}
                                                className="border border-edu-border rounded-edu-chip px-2 py-1.5 text-[0.75rem] text-edu-ink outline-none bg-edu-surface focus:border-edu-primary min-w-0"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeRow(r.id)}
                                                disabled={rows.length <= 4}
                                                aria-label="Eliminar evaluación"
                                                className="flex items-center justify-center text-edu-ink-400 hover:text-edu-danger disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none p-0"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={addRow}
                                    className="inline-flex items-center gap-1.5 text-[0.8rem] text-edu-primary font-semibold cursor-pointer w-fit bg-transparent border-none p-0"
                                >
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    Añadir evaluación
                                </button>
                            </div>

                            {/* Subir prueba del examen */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-edu-ink-700 text-sm font-medium">Subir prueba del examen</label>
                                <label className="border-[1.5px] border-dashed border-edu-border rounded-edu-control px-3.5 py-4 bg-edu-subtle cursor-pointer flex items-center gap-3 transition-colors hover:border-edu-primary-200">
                                    <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={handleExam} className="sr-only" />
                                    {examFile ? (
                                        <>
                                            <div className="w-10 h-10 rounded-edu-chip bg-edu-primary-50 flex items-center justify-center shrink-0">
                                                <FileText className="w-5 h-5 text-edu-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{examFile}</div>
                                                <div className="text-[0.72rem] text-edu-primary">Toca para cambiar el archivo</div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 w-full text-center">
                                            <Upload className="w-5 h-5 text-edu-ink-400" />
                                            <span className="text-[0.8125rem] font-medium text-edu-ink-500">
                                                Toca para subir la prueba (PDF o Word)
                                            </span>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Aviso de revisión */}
                            <div className="flex items-start gap-2 px-3.5 py-3 rounded-edu-control bg-edu-primary-50 text-edu-primary text-[0.8125rem] leading-[1.5]">
                                <Info className="w-4 h-4 shrink-0 mt-px" />
                                <span>
                                    Al enviar la prueba, el plan quedará <strong>«En revisión por el evaluador»</strong>. Recibirás una
                                    notificación cuando sea aprobado o si se solicitan cambios.
                                </span>
                            </div>

                            {/* Acciones */}
                            <div className="flex gap-2 justify-end pt-1">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {editingId !== null ? "Guardar cambios" : "Guardar plan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
