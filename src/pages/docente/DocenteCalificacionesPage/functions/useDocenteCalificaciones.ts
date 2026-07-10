import { useState, useEffect } from "react";
import {
    FileText,
    FlaskConical,
    Presentation,
    PenLine,
} from "lucide-react";
import { color } from "@themes/tokens";
import { useLapso } from "@shared/context/LapsoContext";
import { useFetch } from "@shared/services";
import {
    getCalificaciones,
    type EvalTipo,
    type Estudiante,
    type EvaluacionPlan,
} from "@shared/services/actions/docente-eval";
import type { FiltroNota } from "../interfaces";

export const PER_PAGE = 5;

export const TYPE_META: Record<EvalTipo, { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; color: string; label: string }> = {
    exam: { icon: FileText, bg: color.warningBg, color: color.warning, label: "Examen" },
    lab: { icon: FlaskConical, bg: color.successBg, color: color.success, label: "Laboratorio" },
    presentation: { icon: Presentation, bg: color.primary50, color: color.primary, label: "Exposición" },
    essay: { icon: PenLine, bg: color.purpleBg, color: color.purple, label: "Ensayo" },
};

export function notaColor(n: number): string {
    if (n < 10) return "text-edu-danger";
    if (n < 14) return "text-edu-warning";
    return "text-edu-success";
}

export const selectCls =
    "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary";

export function useDocenteCalificaciones() {
    const { selectedId } = useLapso();
    const { data: CALIFICACIONES, loading } = useFetch(getCalificaciones, null);

    const ANIOS = CALIFICACIONES?.anios ?? [];
    const MATERIAS = CALIFICACIONES?.materias ?? [];
    const lapsoData = CALIFICACIONES?.porLapso[selectedId];
    const PLAN = lapsoData?.plan ?? [];
    const ESTUDIANTES = lapsoData?.estudiantes ?? [];
    const attendancePct = CALIFICACIONES?.asistenciaPorLapso[selectedId] ?? 0;

    const [anio, setAnio] = useState("");
    const [materia, setMateria] = useState("");
    const [query, setQuery] = useState("");
    const [filtro, setFiltro] = useState<FiltroNota>("todos");
    const [selectedStudent, setSelectedStudent] = useState<Estudiante | null>(null);
    const [page, setPage] = useState(1);

    // Sincroniza los valores iniciales de los selectores al cargar los datos.
    useEffect(() => {
        if (ANIOS.length && !anio) setAnio(ANIOS[1] ?? ANIOS[0]);
        if (MATERIAS.length && !materia) setMateria(MATERIAS[0]);
    }, [ANIOS, MATERIAS, anio, materia]);

    // Modal state
    const [gradeCtx, setGradeCtx] = useState<{ student: Estudiante; ev: EvaluacionPlan } | null>(null);
    const [gradeValue, setGradeValue] = useState("");
    const [gradeFile, setGradeFile] = useState<{ url: string; name: string; isImage: boolean } | null>(null);
    const [notas, setNotas] = useState<Record<string, string>>({});

    // KPI values
    const classAverage = ESTUDIANTES.length > 0
        ? ESTUDIANTES.reduce((s, e) => s + e.average, 0) / ESTUDIANTES.length
        : 0;
    const approvedCount = ESTUDIANTES.filter(e => e.average >= 10).length;
    const avgKpiColor = classAverage >= 14 ? color.success : classAverage >= 10 ? color.warning : color.danger;
    const attKpiColor = attendancePct >= 80 ? color.success : attendancePct >= 70 ? color.warning : color.danger;

    // Filtered student list
    const filteredStudents = ESTUDIANTES.filter((e) => {
        if (query.trim() && !e.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
        if (filtro === "aprobados") return e.average >= 10;
        if (filtro === "reprobados") return e.average < 10;
        if (filtro === "por_entregar") return e.grades.some(g => g === null);
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const pagedStudents = filteredStudents.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    // Modal helpers
    const gradeKey = gradeCtx ? `${gradeCtx.student.id}_${gradeCtx.ev.id}` : "";
    const gradeEvalIdx = gradeCtx ? PLAN.findIndex(p => p.id === gradeCtx.ev.id) : -1;
    const gradePrev = gradeCtx
        ? (notas[gradeKey] ?? (gradeEvalIdx >= 0 && gradeCtx.student.grades[gradeEvalIdx] != null
            ? gradeCtx.student.grades[gradeEvalIdx]!.toFixed(1)
            : null))
        : null;
    const gradeIsChange = gradePrev != null;

    const openGrade = (student: Estudiante, ev: EvaluacionPlan) => {
        setGradeCtx({ student, ev });
        setGradeValue("");
        setGradeFile(null);
    };

    const onGradeFile = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const file = ev.target.files?.[0];
        if (!file) return;
        setGradeFile({ url: URL.createObjectURL(file), name: file.name, isImage: file.type.startsWith("image/") });
    };

    const saveGrade = () => {
        if (gradeCtx) setNotas(prev => ({ ...prev, [gradeKey]: gradeValue }));
        setGradeCtx(null);
    };

    return {
        // data
        loading,
        ANIOS,
        MATERIAS,
        PLAN,
        ESTUDIANTES,
        attendancePct,
        // selects
        anio,
        setAnio,
        materia,
        setMateria,
        // search/filter
        query,
        setQuery,
        filtro,
        setFiltro,
        selectedStudent,
        setSelectedStudent,
        page,
        setPage,
        // pagination
        filteredStudents,
        totalPages,
        currentPage,
        pagedStudents,
        // KPIs
        classAverage,
        approvedCount,
        avgKpiColor,
        attKpiColor,
        // modal
        gradeCtx,
        setGradeCtx,
        gradeValue,
        setGradeValue,
        gradeFile,
        gradePrev,
        gradeIsChange,
        notas,
        openGrade,
        onGradeFile,
        saveGrade,
    };
}
