import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useFetch } from "@shared/services";
import { getCursosDocentesOpciones } from "@shared/services/actions/coordinador";
import type { EvalRow } from "../interfaces";

const MIN_EVALS = 1;

const emptyEval = (id: number): EvalRow => ({
  id, nombre: "", descripcion: "", ponderacion: "", fecha: "", archivos: [],
});

const inputCls = "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary";
const labelCls = "text-edu-ink-700 text-sm font-medium";

export function useCoordCursosForm() {
  const navigate = useNavigate();
  const { data: DOCENTES_OPCIONES } = useFetch(getCursosDocentesOpciones, []);
  const imgRef = useRef<HTMLInputElement>(null);

  const [mainTab, setMainTab] = useState<"info" | "evaluaciones">("info");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cupos, setCupos] = useState("");
  const [docente, setDocente] = useState("");
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [evalRows, setEvalRows] = useState<EvalRow[]>([emptyEval(1), emptyEval(2)]);
  const [evalTab, setEvalTab] = useState<number | "review">(0);

  const totalPond = evalRows.reduce((s, r) => s + (parseFloat(r.ponderacion) || 0), 0);
  const weightOk = totalPond === 100;
  const evalsOk = evalRows.every((r) => r.nombre.trim() && r.ponderacion);
  const infoOk = titulo.trim() && cupos && docente;

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgPreview(URL.createObjectURL(file));
  };

  const updateEval = (rid: number, field: keyof EvalRow, value: string) =>
    setEvalRows((rs) => rs.map((r) => r.id === rid ? { ...r, [field]: value } : r));

  const addEval = () => {
    const nextId = Math.max(0, ...evalRows.map((r) => r.id)) + 1;
    setEvalRows((prev) => [...prev, emptyEval(nextId)]);
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

  return {
    navigate,
    DOCENTES_OPCIONES,
    imgRef,
    mainTab,
    setMainTab,
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    cupos,
    setCupos,
    docente,
    setDocente,
    imgPreview,
    handleImg,
    evalRows,
    evalTab,
    setEvalTab,
    totalPond,
    weightOk,
    evalsOk,
    infoOk,
    updateEval,
    addEval,
    removeEval,
    addArchivos,
    removeArchivo,
    handleSubmit,
    MIN_EVALS,
    inputCls,
    labelCls,
  };
}
