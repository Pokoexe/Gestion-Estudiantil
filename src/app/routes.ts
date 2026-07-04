import { createBrowserRouter } from "react-router";
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
import { DocenteAsistenciaPage } from "./pages/DocenteAsistenciaPage";
import { DocenteCalificacionesPage } from "./pages/DocenteCalificacionesPage";
// Coordinador
import { CoordReunionesPage } from "./pages/CoordReunionesPage";
import { CoordActividadesPage } from "./pages/CoordActividadesPage";
import { CoordPlanificacionesPage } from "./pages/CoordPlanificacionesPage";
import { CoordIncidenciasPage } from "./pages/CoordIncidenciasPage";
import { CoordSeccionesPage } from "./pages/CoordSeccionesPage";
import { CoordPersonasPage } from "./pages/CoordPersonasPage";
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
// Administración (Tesorería)
import { TesoreriaPagosPage } from "./pages/TesoreriaPagosPage";
import { TesoreriaSolvenciaPage } from "./pages/TesoreriaSolvenciaPage";
import { TesoreriaConfirmarPage } from "./pages/TesoreriaConfirmarPage";
import { TesoreriaInventarioPage } from "./pages/TesoreriaInventarioPage";
import { TesoreriaReportesPage } from "./pages/TesoreriaReportesPage";
// Director
import { DirAcademicoPage } from "./pages/DirAcademicoPage";
import { DirFinanzasPage } from "./pages/DirFinanzasPage";
import { DirPersonalPage } from "./pages/DirPersonalPage";
import { DirActividadesPage } from "./pages/DirActividadesPage";
import { DirReportesPage } from "./pages/DirReportesPage";

export const router = createBrowserRouter([
  { path: "/", Component: LoginPage },


  {
    path: "/estudiante",
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "datos", Component: StudentDataPage },
      { path: "materias", Component: MateriasPage },
      { path: "materias/:id", Component: CoursesPage },
      { path: "calificaciones", Component: CalificacionPage },
      { path: "evaluaciones", Component: MisEvaluacionesPage },
      { path: "reparacion", Component: RepairPage },
      { path: "reparacion/:id", Component: RepairCoursePage },
      { path: "cursos", Component: CoursesActivitiesPage },
      { path: "cursos/:id", Component: CourseDetailPage },
      { path: "pagos", Component: PagosPage },
      { path: "mensajes", Component: MensajesPage },
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
      { path: "calificaciones", Component: DocenteCalificacionesPage },
      { path: "mensajes", Component: MensajesPage },
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
      { path: "asistencia", Component: DocenteAsistenciaPage },
      { path: "personas", Component: CoordPersonasPage },
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
    ],
  },
  {
    path: "/director",
    Component: AppLayout,
    children: [
      { index: true, Component: DirectorDashboard },
      { path: "academico", Component: DirAcademicoPage },
      { path: "finanzas", Component: DirFinanzasPage },
      { path: "personal", Component: DirPersonalPage },
      { path: "actividades", Component: DirActividadesPage },
      { path: "reportes", Component: DirReportesPage },
    ],
  },
  {
    path: "/programador",
    Component: AppLayout,
    children: [{ index: true, Component: ProgramadorDashboard }],
  },
], { basename: '/Gestion-Estudiantil' });
