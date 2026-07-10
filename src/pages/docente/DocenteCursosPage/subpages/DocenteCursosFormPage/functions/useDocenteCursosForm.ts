import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useFetch } from "@shared/services";
import { getDocenteActual } from "@shared/services/actions/docente-eval";
import type { EvalRow } from "../interfaces";

const MIN_EVALS = 1;

const emptyEval = (id: number): EvalRow => ({
    id, nombre: "", descripcion: "", ponderacion: "", fecha: "", archivos: [],
});

export function useDocenteCursosForm() {
    const navigate = useNavigate();

    const { data: docente } = useFetch(getDocenteActual, null);

    const [mainTab, setMainTab] = useState<"info" | "evaluaciones">("info");

    /* Información */
    const [titulo,      setTitulo]      = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [cupos,       setCupos]       = useState("");
    const [imgPreview,  setImgPreview]  = useState<string | null>(null);
    const imgRef = useRef<HTMLInputElement>(null);

    /* Evaluaciones */
    const [evalRows, setEvalRows] = useState<EvalRow[]>([emptyEval(1), emptyEval(2)]);
    const [evalTab,  setEvalTab]  = useState<number | "review">(0);

    const totalPond = evalRows.reduce((s, r) => s + (parseFloat(r.ponderacion) || 0), 0);
    const weightOk  = totalPond === 100;
    const evalsOk   = evalRows.every((r) => r.nombre.trim() && r.ponderacion);
    const infoOk    = titulo.trim() && cupos;

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
        navigate("/docente/cursos");
    };

    const inputCls = "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary";
    const labelCls = "text-edu-ink-700 text-sm font-medium";

    return {
        navigate,
        docente,
        mainTab, setMainTab,
        titulo, setTitulo,
        descripcion, setDescripcion,
        cupos, setCupos,
        imgPreview,
        imgRef,
        evalRows,
        evalTab, setEvalTab,
        totalPond, weightOk, evalsOk, infoOk,
        handleImg,
        updateEval,
        addEval,
        removeEval,
        addArchivos,
        removeArchivo,
        handleSubmit,
        inputCls,
        labelCls,
        MIN_EVALS,
    };
}
