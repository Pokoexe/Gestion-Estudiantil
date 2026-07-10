import { useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useFetch } from "@shared/services";
import { getCursoExtraById } from "@shared/services/actions/courses";

export function useCourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fetchCourse = useCallback(() => getCursoExtraById(id ?? ""), [id]);
    const { data: course, loading } = useFetch(fetchCourse, undefined, [id]);
    const [filter, setFilter] = useState<"Todas" | "Pendientes" | "Calificadas">("Todas");

    const isEnrolled = !!course?.enrollment;

    const evaluations = course?.evaluations ?? [];
    const pendingCount = evaluations.filter((e) => e.status === "pending").length;
    const gradedEvals = evaluations.filter((e) => e.status === "graded");
    const firstPending = evaluations.find((e) => e.status === "pending");
    const filteredEvaluations = evaluations.filter((e) =>
        filter === "Todas" ? true : filter === "Calificadas" ? e.status === "graded" : e.status !== "graded",
    );

    const avg = gradedEvals.length
        ? gradedEvals.reduce((sum, e) => sum + parseFloat(e.grade ?? "0"), 0) / gradedEvals.length
        : null;
    const evaluatedWeight = gradedEvals.reduce((sum, e) => sum + (parseInt(e.weight, 10) || 0), 0);

    const goBack = () => navigate("/estudiante/cursos");

    return {
        course,
        loading,
        filter,
        setFilter,
        isEnrolled,
        evaluations,
        pendingCount,
        gradedEvals,
        firstPending,
        filteredEvaluations,
        avg,
        evaluatedWeight,
        goBack,
        navigate,
    };
}
