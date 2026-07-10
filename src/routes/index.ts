import { createBrowserRouter } from "react-router";
import { LandingPage } from "@/pages/Auth/LandingPage/LandingPage";
import { LoginPage } from "@/pages/Auth/LoginPage/LoginPage";
import { AppLayout } from "@shared/ui/AppLayout";
import { DashboardPage } from "@/pages/estudiante/DashboardPage/DashboardPage";
import { CoursesPage } from "@/pages/estudiante/MateriasPage/subpages/CoursesPage/CoursesPage";
import { DocenteDashboard } from "@/pages/docente/DocenteDashboard/DocenteDashboard";
import { CoordinadorDashboard } from "@/pages/coordinador/CoordinadorDashboard/CoordinadorDashboard";
import { EvaluadorDashboard } from "@/pages/evaluador/EvaluadorDashboard/EvaluadorDashboard";
import { TesoreriaDashboard } from "@/pages/tesoreria/TesoreriaDashboard/TesoreriaDashboard";
import { DirectorDashboard } from "@/pages/director/DirectorDashboard/DirectorDashboard";
import { ProgramadorDashboard } from "@/pages/programador/ProgramadorDashboard/ProgramadorDashboard";
import { ProgramadorUsuariosPage } from "@/pages/programador/ProgramadorUsuariosPage/ProgramadorUsuariosPage";
import { ProgramadorEstadoPage } from "@/pages/programador/ProgramadorEstadoPage/ProgramadorEstadoPage";
import { ProgramadorRegistrosPage } from "@/pages/programador/ProgramadorRegistrosPage/ProgramadorRegistrosPage";
import { ProgramadorIntegracionesPage } from "@/pages/programador/ProgramadorIntegracionesPage/ProgramadorIntegracionesPage";
import { MateriasPage } from "@/pages/estudiante/MateriasPage/MateriasPage";
import { RepairPage } from "@/pages/estudiante/RepairPage/RepairPage";
import { RepairCoursePage } from "@/pages/estudiante/RepairPage/subpages/RepairCoursePage/RepairCoursePage";
import { CoursesActivitiesPage } from "@/pages/estudiante/CoursesActivitiesPage/CoursesActivitiesPage";
import { CourseDetailPage } from "@/pages/general/CourseDetailPage/CourseDetailPage";
import { PagosPage } from "@/pages/estudiante/PagosPage/PagosPage";
import { StudentDataPage } from "@/pages/estudiante/StudentDataPage/StudentDataPage";
import { CalificacionPage } from "@/pages/estudiante/CalificacionPage/CalificacionPage";
import { MisEvaluacionesPage } from "@/pages/estudiante/MisEvaluacionesPage/MisEvaluacionesPage";
import { MensajesPage } from "@/pages/general/MensajesPage/MensajesPage";
import { MateriasPendientesPage } from "@/pages/estudiante/MateriasPendientesPage/MateriasPendientesPage";
// Docente
import { DocenteSeccionesPage } from "@/pages/docente/DocenteSeccionesPage/DocenteSeccionesPage";
import { DocenteHorarioPage } from "@/pages/docente/DocenteHorarioPage/DocenteHorarioPage";
import { DocentePlanesPage } from "@/pages/docente/DocentePlanesPage/DocentePlanesPage";
import { DocentePlanFormPage } from "@/pages/docente/DocentePlanesPage/subpages/DocentePlanFormPage/DocentePlanFormPage";
import { DocentePlanificacionPage } from "@/pages/docente/DocentePlanificacionPage/DocentePlanificacionPage";
import { DocentePlanificacionFormPage } from "@/pages/docente/DocentePlanificacionPage/subpages/DocentePlanificacionFormPage/DocentePlanificacionFormPage";
import { DocenteRevisionesPage } from "@/pages/docente/DocenteRevisionesPage/DocenteRevisionesPage";
import { DocenteReparacionesPage } from "@/pages/docente/DocenteReparacionesPage/DocenteReparacionesPage";
import { DocenteReparacionFormPage } from "@/pages/docente/DocenteReparacionesPage/subpages/DocenteReparacionFormPage/DocenteReparacionFormPage";
import { DocenteConcejoPage } from "@/pages/docente/DocenteConcejoPage/DocenteConcejoPage";
import { DocenteConcejoDiscusionPage } from "@/pages/docente/DocenteConcejoPage/subpages/DocenteConcejoDiscusionPage/DocenteConcejoDiscusionPage";
import { DocentePostulacionesPage } from "@/pages/docente/DocentePostulacionesPage/DocentePostulacionesPage";
import { DocenteCalificacionesPage } from "@/pages/docente/DocenteCalificacionesPage/DocenteCalificacionesPage";
import { DocenteCursosPage } from "@/pages/docente/DocenteCursosPage/DocenteCursosPage";
import { DocenteCursosFormPage } from "@/pages/docente/DocenteCursosPage/subpages/DocenteCursosFormPage/DocenteCursosFormPage";
// Coordinador
import { CoordCursosPage } from "@/pages/coordinador/CoordCursosPage/CoordCursosPage";
import { CoordCursosFormPage } from "@/pages/coordinador/CoordCursosPage/subpages/CoordCursosFormPage/CoordCursosFormPage";
import { InscripcionesPage } from "@/pages/Auth/InscripcionesPage/InscripcionesPage";
import { CoordReunionesPage } from "@/pages/general/CoordReunionesPage/CoordReunionesPage";
import { CoordActividadesPage } from "@/pages/general/CoordActividadesPage/CoordActividadesPage";
import { CoordPlanificacionesPage } from "@/pages/general/CoordPlanificacionesPage/CoordPlanificacionesPage";
import { CoordIncidenciasPage } from "@/pages/general/CoordIncidenciasPage/CoordIncidenciasPage";
import { CoordSeccionesPage } from "@/pages/general/CoordSeccionesPage/CoordSeccionesPage";
import { CoordPersonasPage } from "@/pages/general/CoordPersonasPage/CoordPersonasPage";
import { CoordAsistenciaPage } from "@/pages/general/CoordAsistenciaPage/CoordAsistenciaPage";
// Evaluador
import { EvalRevisionesPage } from "@/pages/evaluador/EvalRevisionesPage/EvalRevisionesPage";
import { EvalCronogramaPage } from "@/pages/evaluador/EvalCronogramaPage/EvalCronogramaPage";
import { EvalPlanDetallePage } from "@/pages/evaluador/EvalCronogramaPage/subpages/EvalPlanDetallePage/EvalPlanDetallePage";
import { EvalBoletinesPage } from "@/pages/evaluador/EvalBoletinesPage/EvalBoletinesPage";
import { EvalSabanaEstudiantePage } from "@/pages/evaluador/EvalBoletinesPage/subpages/EvalSabanaEstudiantePage/EvalSabanaEstudiantePage";
import { EvalDiscusionPage } from "@/pages/evaluador/EvalDiscusionPage/EvalDiscusionPage";
import { EvalConcejoDiscusionPage } from "@/pages/evaluador/EvalDiscusionPage/subpages/EvalConcejoDiscusionPage/EvalConcejoDiscusionPage";
import { EvalPostularEstudiantePage } from "@/pages/evaluador/EvalDiscusionPage/subpages/EvalPostularEstudiantePage/EvalPostularEstudiantePage";
import { EvalDiscusionEstudiantePage } from "@/pages/evaluador/EvalDiscusionPage/subpages/EvalDiscusionEstudiantePage/EvalDiscusionEstudiantePage";
import { EvalPlantillasPage } from "@/pages/evaluador/EvalPlantillasPage/EvalPlantillasPage";
import { EvalPlantillaPreviewPage } from "@/pages/evaluador/EvalPlantillasPage/subpages/EvalPlantillaPreviewPage/EvalPlantillaPreviewPage";
import { EvalReparacionesPage } from "@/pages/evaluador/EvalReparacionesPage/EvalReparacionesPage";
import { LapsosPage } from "@/pages/general/LapsosPage/LapsosPage";
// Administración (Tesorería)
import { TesoreriaPagosPage } from "@/pages/tesoreria/TesoreriaPagosPage/TesoreriaPagosPage";
import { TesoreriaSolvenciaPage } from "@/pages/tesoreria/TesoreriaSolvenciaPage/TesoreriaSolvenciaPage";
import { TesoreriaConfirmarPage } from "@/pages/tesoreria/TesoreriaConfirmarPage/TesoreriaConfirmarPage";
import { TesoreriaInventarioPage } from "@/pages/tesoreria/TesoreriaInventarioPage/TesoreriaInventarioPage";
import { TesoreriaReportesPage } from "@/pages/tesoreria/TesoreriaReportesPage/TesoreriaReportesPage";
// Director
import { DirAcademicoPage } from "@/pages/director/DirAcademicoPage/DirAcademicoPage";
import { DirFinanzasPage } from "@/pages/director/DirFinanzasPage/DirFinanzasPage";
import { DirActividadesPage } from "@/pages/director/DirActividadesPage/DirActividadesPage";
import { DirInscripcionesPage } from "@/pages/director/DirInscripcionesPage/DirInscripcionesPage";
import { DirInscripcionDetallePage } from "@/pages/director/DirInscripcionesPage/subpages/DirInscripcionDetallePage/DirInscripcionDetallePage";
import { DirPreciosPage } from "@/pages/director/DirPreciosPage/DirPreciosPage";
import { DirectorPresentacionPage } from "@/pages/director/DirectorPresentacionPage/DirectorPresentacionPage";
import { ConfiguracionPage } from "@/pages/general/ConfiguracionPage/ConfiguracionPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/login", Component: LoginPage },
  { path: "/inscripcion", Component: InscripcionesPage },


  {
    path: "/estudiante",
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "datos", Component: StudentDataPage },
      { path: "materias", Component: MateriasPage },
      { path: "materias/:id", Component: CoursesPage },
      { path: "pendientes", Component: MateriasPendientesPage },
      { path: "calificaciones", Component: CalificacionPage },
      { path: "evaluaciones", Component: MisEvaluacionesPage },
      { path: "reparacion", Component: RepairPage },
      { path: "reparacion/:id", Component: RepairCoursePage },
      { path: "cursos", Component: CoursesActivitiesPage },
      { path: "cursos/:id", Component: CourseDetailPage },
      { path: "pagos", Component: PagosPage },
      { path: "mensajes", Component: MensajesPage },
      { path: "configuracion", Component: ConfiguracionPage },
    ],
  },
  {
    path: "/docente",
    Component: AppLayout,
    children: [
      { index: true, Component: DocenteDashboard },
      { path: "secciones", Component: DocenteSeccionesPage },
      { path: "horario", Component: DocenteHorarioPage },
      { path: "planes", Component: DocentePlanesPage },
      { path: "planes/nuevo", Component: DocentePlanFormPage },
      { path: "planes/:id/editar", Component: DocentePlanFormPage },
      { path: "planificacion", Component: DocentePlanificacionPage },
      { path: "planificacion/nuevo", Component: DocentePlanificacionFormPage },
      { path: "planificacion/:id/editar", Component: DocentePlanificacionFormPage },
      { path: "revisiones", Component: DocenteRevisionesPage },
      { path: "reparaciones", Component: DocenteReparacionesPage },
      { path: "reparaciones/:id", Component: DocenteReparacionFormPage },
      { path: "concejo", Component: DocenteConcejoPage },
      { path: "concejo/:id", Component: DocenteConcejoDiscusionPage },
      { path: "actividades", Component: DocentePostulacionesPage },
      { path: "calificaciones", Component: DocenteCalificacionesPage },
      { path: "cursos", Component: DocenteCursosPage },
      { path: "cursos/nuevo", Component: DocenteCursosFormPage },
      { path: "cursos/:id", Component: CourseDetailPage },
      { path: "mensajes", Component: MensajesPage },
      { path: "configuracion", Component: ConfiguracionPage },
    ],
  },
  {
    path: "/coordinador",
    Component: AppLayout,
    children: [
      { index: true, Component: CoordinadorDashboard },
      { path: "reuniones", Component: CoordReunionesPage },
      { path: "actividades", Component: CoordActividadesPage },
      { path: "planificaciones", Component: CoordPlanificacionesPage },
      { path: "incidencias", Component: CoordIncidenciasPage },
      { path: "secciones", Component: CoordSeccionesPage },
      { path: "asistencia", Component: CoordAsistenciaPage },
      { path: "personas", Component: CoordPersonasPage },
      { path: "cursos", Component: CoordCursosPage },
      { path: "cursos/nuevo", Component: CoordCursosFormPage },
      { path: "lapsos", Component: LapsosPage },
      { path: "configuracion", Component: ConfiguracionPage },
    ],
  },
  {
    path: "/evaluador",
    Component: AppLayout,
    children: [
      { index: true, Component: EvaluadorDashboard },
      { path: "revisiones", Component: EvalRevisionesPage },
      { path: "cronograma", Component: EvalCronogramaPage },
      { path: "cronograma/:id", Component: EvalPlanDetallePage },
      { path: "boletines", Component: EvalBoletinesPage },
      { path: "boletines/:id/sabana", Component: EvalSabanaEstudiantePage },
      { path: "discusion", Component: EvalDiscusionPage },
      { path: "discusion/concejo", Component: EvalConcejoDiscusionPage },
      { path: "discusion/postular/:id", Component: EvalPostularEstudiantePage },
      { path: "discusion/concejo/:id", Component: EvalDiscusionEstudiantePage },
      { path: "plantillas", Component: EvalPlantillasPage },
      { path: "plantillas/preview", Component: EvalPlantillaPreviewPage },
      { path: "reparaciones", Component: EvalReparacionesPage },
      { path: "lapsos", Component: LapsosPage },
      { path: "configuracion", Component: ConfiguracionPage },
    ],
  },
  {
    path: "/tesoreria",
    Component: AppLayout,
    children: [
      { index: true, Component: TesoreriaDashboard },
      { path: "pagos", Component: TesoreriaPagosPage },
      { path: "solvencia", Component: TesoreriaSolvenciaPage },
      { path: "confirmar", Component: TesoreriaConfirmarPage },
      { path: "inventario", Component: TesoreriaInventarioPage },
      { path: "reportes", Component: TesoreriaReportesPage },
      { path: "configuracion", Component: ConfiguracionPage },
    ],
  },
  {
    path: "/director",
    Component: AppLayout,
    children: [
      { index: true, Component: DirectorDashboard },
      { path: "academico", Component: DirAcademicoPage },
      { path: "inscripciones", Component: DirInscripcionesPage },
      { path: "inscripciones/:id", Component: DirInscripcionDetallePage },
      { path: "finanzas", Component: DirFinanzasPage },
      { path: "precios", Component: DirPreciosPage },
      { path: "cursos", Component: DirActividadesPage },
      { path: "actividades", Component: CoordActividadesPage },
      { path: "presentacion", Component: DirectorPresentacionPage },
      { path: "reuniones", Component: CoordReunionesPage },
      { path: "planificaciones", Component: CoordPlanificacionesPage },
      { path: "incidencias", Component: CoordIncidenciasPage },
      { path: "secciones", Component: CoordSeccionesPage },
      { path: "asistencia", Component: CoordAsistenciaPage },
      { path: "personas", Component: CoordPersonasPage },
      { path: "docentes", Component: CoordPersonasPage },
      { path: "lapsos", Component: LapsosPage },
      { path: "configuracion", Component: ConfiguracionPage },
    ],
  },
  {
    path: "/programador",
    Component: AppLayout,
    children: [
      { index: true, Component: ProgramadorDashboard },
      { path: "usuarios", Component: ProgramadorUsuariosPage },
      { path: "estado", Component: ProgramadorEstadoPage },
      { path: "registros", Component: ProgramadorRegistrosPage },
      { path: "integraciones", Component: ProgramadorIntegracionesPage },
      { path: "configuracion", Component: ConfiguracionPage },
    ],
  },
], { basename: '/Gestion-Estudiantil' });
