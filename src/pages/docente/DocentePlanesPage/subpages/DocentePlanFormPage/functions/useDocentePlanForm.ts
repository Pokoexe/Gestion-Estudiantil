import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { LAPSO, MIN_EVALS } from "@shared/services/data/plans";
import { useFetch } from "@shared/services";
import {
    getPlanById,
    getMateriaOptions,
    getSeccionOptions,
    crearPlan,
    actualizarPlan,
    type PlanEvaluacion,
    type Plan,
} from "@shared/services/actions/plans";

const emptyRow = (id: number): PlanEvaluacion => ({
    id,
    content: "",
    description: "",
    weight: "",
    date: "",
    files: [],
});

export const inputCls =
    "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary";
export const labelCls = "text-edu-ink-700 text-sm font-medium";

export function useDocentePlanForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const editing = id != null;

    const { data: MATERIA_OPTIONS } = useFetch(getMateriaOptions, []);
    const { data: SECCION_OPTIONS } = useFetch(getSeccionOptions, []);

    // Carga async del plan a editar (undefined mientras carga o si no existe).
    const [plan, setPlan] = useState<Plan | undefined>(undefined);
    const [planLoaded, setPlanLoaded] = useState(!editing);
    useEffect(() => {
        if (!editing) return;
        let alive = true;
        getPlanById(id!).then((p) => {
            if (!alive) return;
            setPlan(p);
            setPlanLoaded(true);
        });
        return () => { alive = false; };
    }, [editing, id]);

    const [form, setForm] = useState({ subject: "", section: "" });
    const [rows, setRows] = useState<PlanEvaluacion[]>([
        emptyRow(1), emptyRow(2), emptyRow(3), emptyRow(4),
    ]);
    const [activeTab, setActiveTab] = useState<number | "review">(0);

    // Al llegar el plan (modo edición), rellena el formulario con sus datos.
    useEffect(() => {
        if (!plan) return;
        setForm({ subject: plan.subject ?? "", section: plan.section ?? "" });
        if (plan.evaluations && plan.evaluations.length) {
            setRows(plan.evaluations.map((e) => ({ ...e, files: [...e.files] })));
        } else {
            setRows(Array.from({ length: plan.count }, (_, i) => ({
                ...emptyRow(i + 1),
                content: `Evaluación ${i + 1}`,
            })));
        }
    }, [plan]);

    const totalWeight = rows.reduce((a, r) => a + (parseFloat(r.weight) || 0), 0);

    const updateRow = (rid: number, field: keyof PlanEvaluacion, value: string) => {
        setRows((rs) => rs.map((r) => (r.id === rid ? { ...r, [field]: value } : r)));
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

    const addFiles = (rid: number, files: FileList) => {
        const names = Array.from(files).map((f) => f.name);
        setRows((rs) => rs.map((r) => (r.id === rid ? { ...r, files: [...r.files, ...names] } : r)));
    };

    const removeFile = (rid: number, idx: number) => {
        setRows((rs) => rs.map((r) => (r.id === rid ? { ...r, files: r.files.filter((_, i) => i !== idx) } : r)));
    };

    // Validaciones para "Datos colocados"
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = { subject: form.subject, section: form.section, evaluations: rows };
        if (editing && plan) {
            await actualizarPlan(plan.id, data);
            navigate("/docente/planes", { state: { feedback: "El plan de evaluación fue actualizado y enviado al evaluador." } });
        } else {
            await crearPlan(data);
            navigate("/docente/planes", { state: { feedback: "Plan creado y enviado al evaluador para su revisión." } });
        }
    };

    return {
        editing,
        planLoaded,
        plan,
        form,
        setForm,
        rows,
        activeTab,
        setActiveTab,
        MATERIA_OPTIONS,
        SECCION_OPTIONS,
        totalWeight,
        seleccionOk,
        evalsComplete,
        weightOk,
        datesInRange,
        spacingOk,
        allValid,
        updateRow,
        addRow,
        removeRow,
        addFiles,
        removeFile,
        handleSubmit,
        navigate,
        inputCls,
        labelCls,
    };
}
