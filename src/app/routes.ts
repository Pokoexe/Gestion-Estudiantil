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
    children: [{ index: true, Component: DocenteDashboard }],
  },
  {
    path: "/coordinador",
    Component: AppLayout,
    children: [{ index: true, Component: CoordinadorDashboard }],
  },
  {
    path: "/evaluador",
    Component: AppLayout,
    children: [{ index: true, Component: EvaluadorDashboard }],
  },
  {
    path: "/tesoreria",
    Component: AppLayout,
    children: [{ index: true, Component: TesoreriaDashboard }],
  },
  {
    path: "/director",
    Component: AppLayout,
    children: [{ index: true, Component: DirectorDashboard }],
  },
  {
    path: "/programador",
    Component: AppLayout,
    children: [{ index: true, Component: ProgramadorDashboard }],
  },
], { basename: '/Gestion-Estudiantil' });
