import { useDocenteSecciones } from "./functions/useDocenteSecciones";
import { SeccionesList } from "./ui/SeccionesList";
import { SeccionBanner } from "./ui/SeccionBanner";
import { SeccionResumen } from "./ui/SeccionResumen";
import { SeccionTabs } from "./ui/SeccionTabs";
import { EstudiantesTab } from "./ui/EstudiantesTab";
import { PlanTab } from "./ui/PlanTab";
import { SubirNotasTab } from "./ui/SubirNotasTab";
import { FaltanTab } from "./ui/FaltanTab";
import { RaspadosTab } from "./ui/RaspadosTab";
import { EvalDetailModal } from "./modals/EvalDetailModal";
import { GradeUploadModal } from "./modals/GradeUploadModal";
import { EvidenceModal } from "./modals/EvidenceModal";
import { StudentDetailModal } from "./modals/StudentDetailModal";

export function DocenteSeccionesPage() {
    const {
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
    } = useDocenteSecciones();

    /* --------------------------- Lista de secciones --------------------------- */
    if (!selected) {
        return (
            <SeccionesList
                SECCIONES={SECCIONES}
                onOpen={openSeccion}
                notaColor={notaColor}
            />
        );
    }

    /* --------------------------- Detalle de sección --------------------------- */
    return (
        <div className="flex flex-col gap-5">
            <SeccionBanner selected={selected} onBack={() => setSelected(null)} />

            <SeccionResumen
                promedioSeccion={promedioSeccion}
                asistenciaSeccion={asistenciaSeccion}
                aprobados={aprobados}
                raspados={raspados}
                faltanUltima={faltanUltima}
                totalEstudiantes={ESTUDIANTES.length}
                notaColor={notaColor}
            />

            {/* Pestañas */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <SeccionTabs tab={tab} setTab={setTab} TABS={TABS} />

                {tab === "estudiantes" && (
                    <EstudiantesTab
                        ESTUDIANTES={ESTUDIANTES}
                        onSelect={setStudentDetail}
                        notaColor={notaColor}
                    />
                )}

                {tab === "plan" && (
                    <PlanTab
                        PLAN={PLAN}
                        onSelect={setEvalDetail}
                        TYPE_META={TYPE_META}
                        EVAL_STATUS={EVAL_STATUS}
                    />
                )}

                {tab === "subir" && (
                    <SubirNotasTab
                        query={query}
                        setQuery={setQuery}
                        filtro={filtro}
                        setFiltro={setFiltro}
                        filteredStudents={filteredStudents}
                        porEntregarNames={porEntregarNames}
                        notas={notas}
                        onOpenGrade={openGrade}
                        PLAN={PLAN}
                        selectedEvalId={selectedEvalId}
                        setSelectedEvalId={setSelectedEvalId}
                        TYPE_META={TYPE_META}
                        notaColor={notaColor}
                    />
                )}

                {tab === "faltan" && (
                    <FaltanTab
                        PENDIENTES={PENDIENTES}
                        onEvidence={setEvidence}
                    />
                )}

                {tab === "raspados" && (
                    <RaspadosTab raspados={raspados} />
                )}
            </div>

            {/* Modal: detalle de una evaluación del plan */}
            {evalDetail && (
                <EvalDetailModal
                    evalDetail={evalDetail}
                    selected={selected}
                    TYPE_META={TYPE_META}
                    EVAL_STATUS={EVAL_STATUS}
                    onClose={() => setEvalDetail(null)}
                />
            )}

            {/* Modal: subir nota de un estudiante */}
            {gradeStudent && (
                <GradeUploadModal
                    gradeStudent={gradeStudent}
                    gradeIsChange={gradeIsChange}
                    gradePrev={gradePrev}
                    gradeValue={gradeValue}
                    setGradeValue={setGradeValue}
                    gradeFile={gradeFile}
                    onGradeFile={onGradeFile}
                    selectedEval={selectedEval}
                    onSave={saveGrade}
                    onClose={() => setGradeStudent(null)}
                    notaColor={notaColor}
                />
            )}

            {/* Modal: evidencia entregada */}
            {evidence && (
                <EvidenceModal
                    evidence={evidence}
                    onClose={() => setEvidence(null)}
                />
            )}

            {/* Modal: detalle de notas y resultados del estudiante */}
            {studentDetail && (
                <StudentDetailModal
                    studentDetail={studentDetail}
                    PLAN={PLAN}
                    TYPE_META={TYPE_META}
                    notaColor={notaColor}
                    onClose={() => setStudentDetail(null)}
                />
            )}
        </div>
    );
}
