import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { LAPSO, MIN_SESIONES } from "@shared/services/data/planificaciones";
import { useFetch } from "@shared/services";
import { getMateriaOptions, getSeccionOptions } from "@shared/services/actions/plans";
import {
    getPlanificacionById,
    crearPlanificacion,
    actualizarPlanificacion,
    type PlanifSesion,
    type Planificacion,
} from "@shared/services/actions/planificaciones";

const emptyRow = (id: number): PlanifSesion => ({
    id,
    content: "",
    description: "",
    date: "",
    files: [],
});

export const inputCls =
    "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary";
export const labelCls = "text-edu-ink-700 text-sm font-medium";

export function useDocentePlanificacionForm() {
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

    return {
        navigate,
        editing,
        planif,
        planifLoaded,
        form,
        setForm,
        rows,
        activeTab,
        setActiveTab,
        MATERIA_OPTIONS,
        SECCION_OPTIONS,
        updateRow,
        addRow,
        removeRow,
        addFiles,
        removeFile,
        seleccionOk,
        sesionesComplete,
        datesInRange,
        spacingOk,
        allValid,
        handleSubmit,
    };
}
