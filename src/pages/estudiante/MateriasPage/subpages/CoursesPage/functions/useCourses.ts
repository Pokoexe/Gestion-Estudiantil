import { useState } from "react";
import { useSearchParams } from "react-router";
import { useFetch } from "@shared/services";
import {
  getMateriaActual,
  getMateriaActualDocente,
  getMateriaActualEvaluaciones,
} from "@shared/services/actions/estudiante";

/**
 * Estado y lógica de la subpágina de la materia actual: lectura del query param
 * `pendiente`, fetch de la materia/docente/evaluaciones, filtro por estado y
 * contadores derivados.
 */
export function useCourses() {
  const [searchParams] = useSearchParams();
  const isPendiente = searchParams.get("pendiente") === "true";

  const [filter, setFilter] = useState<"Todas" | "Pendientes" | "Calificadas">("Todas");
  const { data: course, loading: loadingCourse } = useFetch(getMateriaActual, null);
  const { data: teacher, loading: loadingTeacher } = useFetch(getMateriaActualDocente, null);
  const { data: assignments, loading: loadingAssignments } = useFetch(getMateriaActualEvaluaciones, []);

  const pendingCount = assignments.filter((a) => a.status === "pending").length;
  const gradedCount = assignments.filter((a) => a.status === "graded").length;
  const filteredAssignments = assignments.filter((a) =>
    filter === "Todas" ? true : filter === "Calificadas" ? a.status === "graded" : a.status !== "graded",
  );

  const loading = loadingCourse || loadingTeacher || loadingAssignments;

  return {
    isPendiente,
    filter, setFilter,
    course, teacher, assignments,
    pendingCount, gradedCount, filteredAssignments,
    loading,
  };
}
