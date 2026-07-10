export type FiltroNota = "todos" | "aprobados" | "por_entregar" | "reprobados";
export type TabKey = "estudiantes" | "plan" | "subir" | "faltan" | "raspados";

export type {
    Seccion,
    Estudiante,
    EvaluacionPlan,
    Pendiente,
    EvalEstado,
    EvalTipo,
} from "@shared/services/actions/docente";
