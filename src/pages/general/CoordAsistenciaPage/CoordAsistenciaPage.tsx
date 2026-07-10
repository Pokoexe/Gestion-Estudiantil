import { GraduationCap, Briefcase, Users, UserCheck } from "lucide-react";
import { useCoordAsistencia } from "./functions/useCoordAsistencia";
import { AsistenciaTabs } from "./ui/AsistenciaTabs";
import { AttendancePanel } from "./ui/AttendancePanel";
import type { Tab } from "./interfaces";

const TABS: { key: Tab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: "estudiantes", label: "Estudiantes", icon: GraduationCap },
    { key: "docentes", label: "Docentes", icon: Briefcase },
];

export function CoordAsistenciaPage() {
    const { tab, setTab, estudiantes, setEstudiantes, docentes, setDocentes } = useCoordAsistencia();

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            {/* <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.purple.bg }}>
                    <ClipboardCheck style={{ width: 22, height: 22, color: accent.purple.fg }} />
                </div>
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.15rem]">Control de asistencia</h2>
                    <p className="m-0 text-edu-ink-500 text-[0.8125rem]">Seguimiento mensual de estudiantes y docentes del plantel</p>
                </div>
            </div> */}

            {/* Pestañas */}
            <AsistenciaTabs tab={tab} setTab={setTab} tabs={TABS} />

            {/* Contenido por pestaña */}
            {tab === "estudiantes" ? (
                <AttendancePanel
                    data={estudiantes}
                    setData={setEstudiantes}
                    entidad="Estudiante"
                    metaLabel="Sección"
                    tablaTitulo="Control de asistencia de estudiantes"
                    tablaHint="Resumen del mes · 22 días hábiles"
                    icon={Users}
                />
            ) : (
                <AttendancePanel
                    data={docentes}
                    setData={setDocentes}
                    entidad="Docente"
                    metaLabel="Materia"
                    tablaTitulo="Control de asistencia de docentes"
                    tablaHint="Resumen del mes · 22 días hábiles"
                    icon={UserCheck}
                />
            )}
        </div>
    );
}
