import { LapsoFilter } from "@shared/ui/LapsoFilter";
import { useDirAcademico } from "./functions/useDirAcademico";
import { KpiRow } from "./ui/KpiRow";
import { PerformanceByYearCard } from "./ui/PerformanceByYearCard";
import { AttendanceSummaryCard } from "./ui/AttendanceSummaryCard";
import { MonthlyAttendanceCard } from "./ui/MonthlyAttendanceCard";
import { PerformanceByLapsoCard } from "./ui/PerformanceByLapsoCard";
import { SectionsTable } from "./ui/SectionsTable";

export function DirAcademicoPage() {
  const {
    navigate,
    selectedId,
    loading,
    kpis,
    sections,
    performance,
    RENDIMIENTO_LAPSO,
    ASISTENCIA_MES,
    ATT_STATS,
  } = useDirAcademico();

  if (loading)
    return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado de sección */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="m-0 text-edu-ink font-bold text-xl">Panorama académico global</h2>
          <p className="m-0 mt-1 text-edu-ink-400 text-[0.85rem]">
            Rendimiento, asistencia e incidencias de toda la institución · Período 2026-I
          </p>
        </div>
        <LapsoFilter />
      </div>

      {/* Fila de KPIs */}
      <KpiRow kpis={kpis} />

      {/* Rendimiento por año + resumen de asistencia */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-4 items-stretch">
        <PerformanceByYearCard performance={performance} />
        <AttendanceSummaryCard attStats={ATT_STATS} />
      </div>

      {/* Asistencia mensual + Rendimiento por lapso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <MonthlyAttendanceCard asistenciaMes={ASISTENCIA_MES} />
        <PerformanceByLapsoCard rendimientoLapso={RENDIMIENTO_LAPSO} selectedId={selectedId} />
      </div>

      {/* Tabla de secciones por año */}
      <SectionsTable
        sections={sections}
        onRowClick={() => navigate("/director/secciones")}
      />
    </div>
  );
}
