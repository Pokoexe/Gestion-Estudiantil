import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { LAPSO, MIN_REP } from "@shared/services/data/reparaciones";
import { useFetch } from "@shared/services";
import { getReparacionById, guardarReparacion, type ReparacionEval } from "@shared/services/actions/reparaciones";

const emptyRow = (id: number): ReparacionEval => ({
    id,
    content: "",
    description: "",
    date: "",
    horario: "",
    files: [],
});

export const inputCls =
    "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary";
export const labelCls = "text-edu-ink-700 text-sm font-medium";

export function useDocenteReparacionForm() {
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

    const yaCreada = reparacion?.status === "creada";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await guardarReparacion(reparacion!.id, rows);
        navigate("/docente/reparaciones", {
            state: { feedback: yaCreada ? "La reparación fue actualizada." : "Reparación creada correctamente." },
        });
    };

    return {
        navigate,
        reparacion,
        loading,
        rows,
        activeTab,
        setActiveTab,
        updateRow,
        addRow,
        removeRow,
        addFiles,
        removeFile,
        evalsComplete,
        datesInRange,
        spacingOk,
        allValid,
        yaCreada,
        handleSubmit,
    };
}
