import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { AppLayout } from "./components/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { CoursesPage } from "./pages/CoursesPage";
import { DocenteDashboard } from "./pages/DocenteDashboard";
import { CoordinadorDashboard } from "./pages/CoordinadorDashboard";
import { EvaluadorDashboard } from "./pages/EvaluadorDashboard";
import { TesoreriaDashboard } from "./pages/TesoreriaDashboard";
import { DirectorDashboard } from "./pages/DirectorDashboard";
import { ProgramadorDashboard } from "./pages/ProgramadorDashboard";
import { MateriasPage } from "./pages/MateriasPage";
import { RepairPage } from "./pages/RepairPage";
import { RepairCoursePage } from "./pages/RepairCoursePage";
import { CoursesActivitiesPage } from "./pages/CoursesActivitiesPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { PagosPage } from "./pages/PagosPage";
import { StudentDataPage } from "./pages/StudentDataPage";
import { CalificacionPage } from "./pages/CalificacionPage";
import { MisEvaluacionesPage } from "./pages/MisEvaluacionesPage";
import { MensajesPage } from "./pages/MensajesPage";
import { MateriasPendientesPage } from "./pages/MateriasPendientesPage";
// Docente
import { DocenteSeccionesPage } from "./pages/DocenteSeccionesPage";
import { DocenteHorarioPage } from "./pages/DocenteHorarioPage";
import { DocentePlanesPage } from "./pages/DocentePlanesPage";
import { DocentePlanFormPage } from "./pages/DocentePlanFormPage";
import { DocentePlanificacionPage } from "./pages/DocentePlanificacionPage";
import { DocentePlanificacionFormPage } from "./pages/DocentePlanificacionFormPage";
import { DocenteRevisionesPage } from "./pages/DocenteRevisionesPage";
import { DocenteReparacionesPage } from "./pages/DocenteReparacionesPage";
import { DocenteReparacionFormPage } from "./pages/DocenteReparacionFormPage";
import { DocenteConcejoPage } from "./pages/DocenteConcejoPage";
import { DocenteConcejoDiscusionPage } from "./pages/DocenteConcejoDiscusionPage";
import { DocentePostulacionesPage } from "./pages/DocentePostulacionesPage";
import { DocenteCalificacionesPage } from "./pages/DocenteCalificacionesPage";
import { DocenteCursosPage } from "./pages/DocenteCursosPage";
import { DocenteCursosFormPage } from "./pages/DocenteCursosFormPage";
// Coordinador
import { CoordCursosPage } from "./pages/CoordCursosPage";
import { CoordCursosFormPage } from "./pages/CoordCursosFormPage";
import { InscripcionesPage } from "./pages/InscripcionesPage";
import { CoordReunionesPage } from "./pages/CoordReunionesPage";
import { CoordActividadesPage } from "./pages/CoordActividadesPage";
import { CoordPlanificacionesPage } from "./pages/CoordPlanificacionesPage";
import { CoordIncidenciasPage } from "./pages/CoordIncidenciasPage";
import { CoordSeccionesPage } from "./pages/CoordSeccionesPage";
import { CoordPersonasPage } from "./pages/CoordPersonasPage";
import { CoordAsistenciaPage } from "./pages/CoordAsistenciaPage";
// Evaluador
import { EvalRevisionesPage } from "./pages/EvalRevisionesPage";
import { EvalCronogramaPage } from "./pages/EvalCronogramaPage";
import { EvalPlanDetallePage } from "./pages/EvalPlanDetallePage";
import { EvalBoletinesPage } from "./pages/EvalBoletinesPage";
import { EvalSabanaEstudiantePage } from "./pages/EvalSabanaEstudiantePage";
import { EvalDiscusionPage } from "./pages/EvalDiscusionPage";
import { EvalConcejoDiscusionPage } from "./pages/EvalConcejoDiscusionPage";
import { EvalPostularEstudiantePage } from "./pages/EvalPostularEstudiantePage";
import { EvalDiscusionEstudiantePage } from "./pages/EvalDiscusionEstudiantePage";
import { EvalPlantillasPage } from "./pages/EvalPlantillasPage";
import { EvalPlantillaPreviewPage } from "./pages/EvalPlantillaPreviewPage";
import { EvalReparacionesPage } from "./pages/EvalReparacionesPage";
import { LapsosPage } from "./pages/LapsosPage";
// Administración (Tesorería)
import { TesoreriaPagosPage } from "./pages/TesoreriaPagosPage";
import { TesoreriaSolvenciaPage } from "./pages/TesoreriaSolvenciaPage";
import { TesoreriaConfirmarPage } from "./pages/TesoreriaConfirmarPage";
import { TesoreriaInventarioPage } from "./pages/TesoreriaInventarioPage";
import { TesoreriaReportesPage } from "./pages/TesoreriaReportesPage";
// Director
import { DirAcademicoPage } from "./pages/DirAcademicoPage";
import { DirFinanzasPage } from "./pages/DirFinanzasPage";
import { DirActividadesPage } from "./pages/DirActividadesPage";
import { DirInscripcionesPage } from "./pages/DirInscripcionesPage";
import { DirInscripcionDetallePage } from "./pages/DirInscripcionDetallePage";
import { DirectorPresentacionPage } from "./pages/DirectorPresentacionPage";
import { ConfiguracionPage } from "./pages/ConfiguracionPage";

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
      { path: "configuracion", Component: ConfiguracionPage },
    ],
  },
], { basename: '/Gestion-Estudiantil' });
