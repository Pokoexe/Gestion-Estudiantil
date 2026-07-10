import { useDocenteCalificaciones, selectCls } from "./functions/useDocenteCalificaciones";
import { AnioMateriaSelects } from "./ui/AnioMateriaSelects";
import { KpiDonuts } from "./ui/KpiDonuts";
import { CalificacionesPanel } from "./ui/CalificacionesPanel";
import { GradeUploadModal } from "./modals/GradeUploadModal";

export function DocenteCalificacionesPage() {
    const {
        loading,
        ANIOS,
        MATERIAS,
        PLAN,
        ESTUDIANTES,
        attendancePct,
        anio,
        setAnio,
        materia,
        setMateria,
        query,
        setQuery,
        filtro,
        setFiltro,
        selectedStudent,
        setSelectedStudent,
        setPage,
        filteredStudents,
        totalPages,
        currentPage,
        pagedStudents,
        classAverage,
        approvedCount,
        avgKpiColor,
        attKpiColor,
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
    } = useDocenteCalificaciones();

    if (loading) return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Calificaciones</h2>
                    <p className="text-edu-ink-500 text-sm mt-1 m-0">
                        Sube y actualiza las notas de tus estudiantes por evaluación
                    </p>
                </div> */}
            </div>

            <AnioMateriaSelects
                anio={anio}
                setAnio={setAnio}
                materia={materia}
                setMateria={setMateria}
                ANIOS={ANIOS}
                MATERIAS={MATERIAS}
                selectCls={selectCls}
            />

            <KpiDonuts
                classAverage={classAverage}
                approvedCount={approvedCount}
                ESTUDIANTES={ESTUDIANTES}
                avgKpiColor={avgKpiColor}
                attendancePct={attendancePct}
                attKpiColor={attKpiColor}
            />

            <CalificacionesPanel
                query={query}
                setQuery={setQuery}
                filtro={filtro}
                setFiltro={setFiltro}
                setPage={setPage}
                filteredStudents={filteredStudents}
                pagedStudents={pagedStudents}
                currentPage={currentPage}
                totalPages={totalPages}
                PLAN={PLAN}
                selectedStudent={selectedStudent}
                setSelectedStudent={setSelectedStudent}
                openGrade={openGrade}
                notas={notas}
            />

            {gradeCtx && (
                <GradeUploadModal
                    gradeCtx={gradeCtx}
                    gradeValue={gradeValue}
                    setGradeValue={setGradeValue}
                    gradeFile={gradeFile}
                    onGradeFile={onGradeFile}
                    gradePrev={gradePrev}
                    gradeIsChange={gradeIsChange}
                    materia={materia}
                    anio={anio}
                    saveGrade={saveGrade}
                    onClose={() => setGradeCtx(null)}
                />
            )}
        </div>
    );
}
