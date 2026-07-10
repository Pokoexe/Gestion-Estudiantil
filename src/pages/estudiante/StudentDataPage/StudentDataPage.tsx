import { useNavigate } from "react-router";
import { useStudentData } from "./functions/useStudentData";
import { StudentProfileHeader } from "./ui/StudentProfileHeader";
import { StatsGrid } from "./ui/StatsGrid";
import { EvaluacionesYRiesgo } from "./ui/EvaluacionesYRiesgo";
import { Extracurriculares } from "./ui/Extracurriculares";

export function StudentDataPage() {
    const navigate = useNavigate();
    const {
        student,
        loading,
        incidencias,
        actividades,
        proximas,
        reprobadas,
    } = useStudentData();

    if (loading) {
        return (
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
                Cargando…
            </div>
        );
    }

    return (
        <>
            <StudentProfileHeader student={student} />
            <StatsGrid onSubjectClick={(subjectId) => navigate(`/estudiante/materias/${subjectId}`)} />
            <EvaluacionesYRiesgo
                proximas={proximas}
                reprobadas={reprobadas}
                incidencias={incidencias}
                onSubjectClick={(subjectId) => navigate(`/estudiante/materias/${subjectId}`)}
            />
            <Extracurriculares actividades={actividades} />
        </>
    );
}
