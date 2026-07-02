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

export const router = createBrowserRouter([
  { path: "/", Component: LoginPage },

  {
    path: "/estudiante",
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "materias", Component: MateriasPage },
      { path: "cursos", Component: CoursesPage },
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
]);
