import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import {
    FileText,
    FlaskConical,
    Presentation,
    PenLine,
    Users,
    ClipboardList,
    FileSpreadsheet,
    AlertTriangle,
    XCircle,
} from "lucide-react";
import { color } from "@themes/tokens";
import { useFetch } from "@shared/services";
import {
    getSecciones,
    getEstudiantes,
    getPlanSeccion,
    getPendientes,
    type Seccion,
    type Estudiante,
    type EvalEstado,
    type EvalTipo,
    type EvaluacionPlan,
    type Pendiente,
} from "@shared/services/actions/docente";
import type { FiltroNota, TabKey } from "../interfaces";

/* ------------------------------------------------------------------ */
/* Mapas presentacionales                                             */
/* ------------------------------------------------------------------ */

export const EVAL_STATUS: Record<EvalEstado, { bg: string; fg: string }> = {
    Calificada: { bg: color.successBg, fg: color.success },
    "En curso": { bg: color.primary100, fg: color.primary },
    Pendiente: { bg: color.subtle, fg: color.ink500 },
};

export const TYPE_META: Record<EvalTipo, { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; color: string; label: string }> = {
    exam: { icon: FileText, bg: color.warningBg, color: color.warning, label: "Examen" },
    lab: { icon: FlaskConical, bg: color.successBg, color: color.success, label: "Laboratorio" },
    presentation: { icon: Presentation, bg: color.primary50, color: color.primary, label: "Exposición" },
    essay: { icon: PenLine, bg: color.purpleBg, color: color.purple, label: "Ensayo" },
};

export const TABS = [
    { key: "estudiantes", label: "Estudiantes", icon: Users },
    { key: "plan", label: "Plan de evaluación", icon: ClipboardList },
    { key: "subir", label: "Subir notas", icon: FileSpreadsheet },
    { key: "faltan", label: "Faltan por entregar", icon: AlertTriangle },
    { key: "raspados", label: "Reprobados", icon: XCircle },
] as const;

export function notaColor(n: number): string {
    if (n < 10) return "text-edu-danger";
    if (n < 14) return "text-edu-warning";
    return "text-edu-success";
}

/* ------------------------------------------------------------------ */
/* Hook                                                               */
/* ------------------------------------------------------------------ */

export function useDocenteSecciones() {
    const [selected, setSelected] = useState<Seccion | null>(null);
    const [tab, setTab] = useState<TabKey>("estudiantes");

    // Modal de detalle de una evaluación del plan
    const [evalDetail, setEvalDetail] = useState<EvaluacionPlan | null>(null);

    // Modal de evidencia entregada (pestaña "Faltan por entregar")
    const [evidence, setEvidence] = useState<Pendiente | null>(null);

    // Modal con el detalle de notas y resultados de un estudiante
    const [studentDetail, setStudentDetail] = useState<Estudiante | null>(null);

    // Pestaña "Subir notas"
    const [query, setQuery] = useState("");
    const [filtro, setFiltro] = useState<FiltroNota>("todos");
    const [selectedEvalId, setSelectedEvalId] = useState<number>(0);
    const [notas, setNotas] = useState<Record<number, string>>({});

    // Modal para subir la nota de un estudiante
    const [gradeStudent, setGradeStudent] = useState<Estudiante | null>(null);
    const [gradeValue, setGradeValue] = useState("");
    const [gradeFile, setGradeFile] = useState<{ url: string; name: string; isImage: boolean } | null>(null);

    // Datos maquetados de la sección
    const { data: SECCIONES } = useFetch(getSecciones, []);
    const { data: ESTUDIANTES } = useFetch(getEstudiantes, []);
    const { data: PLAN } = useFetch(getPlanSeccion, []);
    const { data: PENDIENTES } = useFetch(getPendientes, []);

    // Al cargar el plan, selecciona por defecto la evaluación "En curso" (o la primera).
    useEffect(() => {
        if (PLAN.length && !selectedEvalId) {
            setSelectedEvalId(PLAN.find((p) => p.status === "En curso")?.id ?? PLAN[0].id);
        }
    }, [PLAN, selectedEvalId]);

    // Permite abrir una sección concreta al llegar desde el horario
    const location = useLocation();
    useEffect(() => {
        const sid = (location.state as { seccionId?: number } | null)?.seccionId;
        if (sid) {
            const sec = SECCIONES.find((s) => s.id === sid);
            if (sec) {
                setSelected(sec);
                setTab("estudiantes");
            }
        }
    }, [location.state, SECCIONES]);

    const openSeccion = (sec: Seccion) => {
        setSelected(sec);
        setTab("estudiantes");
        setQuery("");
        setFiltro("todos");
        setNotas({});
        setEvalDetail(null);
        setEvidence(null);
        setStudentDetail(null);
    };

    const openGrade = (e: Estudiante) => {
        setGradeStudent(e);
        setGradeValue("");
        setGradeFile(null);
    };

    const onGradeFile = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const file = ev.target.files?.[0];
        if (!file) return;
        setGradeFile({ url: URL.createObjectURL(file), name: file.name, isImage: file.type.startsWith("image/") });
    };

    const saveGrade = () => {
        if (gradeStudent) setNotas((prev) => ({ ...prev, [gradeStudent.id]: gradeValue }));
        setGradeStudent(null);
    };

    const raspados = ESTUDIANTES.filter((e) => e.average < 10);
    const promedioSeccion = ESTUDIANTES.length ? ESTUDIANTES.reduce((acc, e) => acc + e.average, 0) / ESTUDIANTES.length : 0;
    const asistenciaSeccion = ESTUDIANTES.length ? ESTUDIANTES.reduce((acc, e) => acc + e.attendance, 0) / ESTUDIANTES.length : 0;
    const aprobados = ESTUDIANTES.filter((e) => e.average >= 10).length;
    const ultimaEval = PLAN.find((p) => p.status === "En curso") ?? (PLAN.length ? PLAN[PLAN.length - 1] : undefined);
    const faltanUltima = PENDIENTES.filter((p) => p.evaluation === ultimaEval?.name).length;

    const selectedEval = PLAN.find((p) => p.id === selectedEvalId) ?? (PLAN.length ? PLAN[0] : undefined);
    const porEntregarNames = new Set(
        PENDIENTES.filter((p) => p.evaluation === selectedEval?.name).map((p) => p.student),
    );
    const filteredStudents = ESTUDIANTES.filter((e) => {
        if (query.trim() && !e.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
        if (filtro === "aprobados") return e.average >= 10;
        if (filtro === "reprobados") return e.average < 10;
        if (filtro === "por_entregar") return porEntregarNames.has(e.name);
        return true;
    });

    // Contexto para el modal de subir/cambiar nota
    const gradeIdx = PLAN.findIndex((p) => p.id === selectedEvalId);
    const gradePrev = gradeStudent
        ? notas[gradeStudent.id] ?? (gradeStudent.grades[gradeIdx] != null ? gradeStudent.grades[gradeIdx]!.toFixed(1) : null)
        : null;
    const gradeIsChange = gradePrev != null;

    return {
        selected,
        setSelected,
        tab,
        setTab,
        evalDetail,
        setEvalDetail,
        evidence,
        setEvidence,
        studentDetail,
        setStudentDetail,
        query,
        setQuery,
        filtro,
        setFiltro,
        selectedEvalId,
        setSelectedEvalId,
        notas,
        gradeStudent,
        gradeValue,
        setGradeValue,
        gradeFile,
        SECCIONES,
        ESTUDIANTES,
        PLAN,
        PENDIENTES,
        raspados,
        promedioSeccion,
        asistenciaSeccion,
        aprobados,
        faltanUltima,
        selectedEval,
        porEntregarNames,
        filteredStudents,
        gradePrev,
        gradeIsChange,
        openSeccion,
        openGrade,
        onGradeFile,
        saveGrade,
        setGradeStudent,
        notaColor,
        TYPE_META,
        EVAL_STATUS,
        TABS,
    };
}
