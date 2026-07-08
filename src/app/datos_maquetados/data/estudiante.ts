/**
 * Datos maquetados del rol Estudiante.
 *
 * Reúne los datos estáticos que antes vivían incrustados en las páginas del
 * estudiante (materias, horario, …). Los expone el "servidor" maquetado a
 * través de las rutas de `../server/routes/estudiante.routes.ts`.
 */

import { color } from "../../theme/tokens";
import type { LapsoId } from "./lapsos";

/* ------------------------------------------------------------------ */
/* Materias                                                            */
/* ------------------------------------------------------------------ */

export type SubjectStatus = "aprobado" | "reprobado" | "por_reprobar";

export interface Subject {
  id: number;
  name: string;
  teacher: string;
  evaluations: number;
  attendance: string;
  average: number;
  /** Posición del estudiante dentro de la materia. */
  rank: number;
  /** Evaluaciones no aprobadas. */
  failedEvals: number;
  status: SubjectStatus;
  dot: string;
}

export const MATERIAS_ESTUDIANTE: Subject[] = [
  { id: 1, name: "Física", teacher: "Prof. Torres", evaluations: 8, attendance: "96 %", average: 19, rank: 1, failedEvals: 0, status: "aprobado", dot: color.warningStrong },
  { id: 2, name: "Biología", teacher: "Prof. Ruiz", evaluations: 6, attendance: "94 %", average: 17, rank: 3, failedEvals: 0, status: "aprobado", dot: color.success },
  { id: 3, name: "Matemática", teacher: "Prof. Ramírez", evaluations: 7, attendance: "92 %", average: 16, rank: 5, failedEvals: 0, status: "aprobado", dot: color.primary },
  { id: 4, name: "Literatura", teacher: "Prof. García", evaluations: 5, attendance: "90 %", average: 15, rank: 6, failedEvals: 0, status: "aprobado", dot: color.success },
  { id: 5, name: "Química", teacher: "Prof. Méndez", evaluations: 6, attendance: "88 %", average: 13, rank: 8, failedEvals: 1, status: "aprobado", dot: color.purple },
  { id: 6, name: "Arte", teacher: "Prof. Vega", evaluations: 4, attendance: "85 %", average: 12, rank: 10, failedEvals: 1, status: "aprobado", dot: color.purple },
  { id: 7, name: "Historia", teacher: "Prof. Flores", evaluations: 6, attendance: "78 %", average: 10, rank: 15, failedEvals: 2, status: "por_reprobar", dot: color.danger },
  { id: 8, name: "Inglés", teacher: "Prof. Collins", evaluations: 5, attendance: "70 %", average: 8, rank: 22, failedEvals: 4, status: "reprobado", dot: color.warning },
];

/* ------------------------------------------------------------------ */
/* Horario semanal                                                     */
/* ------------------------------------------------------------------ */

export interface ScheduleClass {
  time: string;
  subject: string;
  teacher: string;
  color: string;
}

export interface ScheduleDay {
  day: string;
  classes: ScheduleClass[];
}

export const HORARIO_ESTUDIANTE: ScheduleDay[] = [
  {
    day: "Lun",
    classes: [
      { time: "07:00", subject: "Matemática", teacher: "Prof. Ramírez", color: "#dbeafe" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
    ],
  },
  {
    day: "Mar",
    classes: [
      { time: "07:00", subject: "Literatura", teacher: "Prof. García", color: "#dcfce7" },
      { time: "10:00", subject: "Historia", teacher: "Prof. Flores", color: "#fce7f3" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
    ],
  },
  {
    day: "Mié",
    classes: [
      { time: "08:00", subject: "Química", teacher: "Prof. Méndez", color: "#ede9fe" },
      { time: "11:00", subject: "Matemática", teacher: "Prof. Ramírez", color: "#dbeafe" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
    ],
  },
  {
    day: "Jue",
    classes: [
      { time: "07:00", subject: "Inglés", teacher: "Prof. Collins", color: "#ffedd5" },
      { time: "09:00", subject: "Biología", teacher: "Prof. Ruiz", color: "#dcfce7" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
    ],
  },
  {
    day: "Vie",
    classes: [
      { time: "08:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
      { time: "10:00", subject: "Arte", teacher: "Prof. Vega", color: "#fce7f3" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
      { time: "09:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Horario del Dashboard (con id de materia por clase)                 */
/* ------------------------------------------------------------------ */

export interface DashboardClass {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  color: string;
  fg: string;
  hasEval: boolean;
}

export interface DashboardScheduleDay {
  day: string;
  classes: DashboardClass[];
}

export const HORARIO_DASHBOARD: DashboardScheduleDay[] = [
  {
    day: "Lun",
    classes: [
      { id: "matematica", time: "07:00", subject: "Matemática", teacher: "Prof. Ramírez", color: "#dbeafe", fg: "#1e40af", hasEval: true },
      { id: "fisica", time: "07:40", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3", fg: "#854d0e", hasEval: false },
      { id: "literatura", time: "08:20", subject: "Literatura", teacher: "Prof. García", color: "#dcfce7", fg: "#166534", hasEval: false },
      { id: "historia", time: "09:00", subject: "Historia", teacher: "Prof. Flores", color: "#fce7f3", fg: "#9d174d", hasEval: true },
      { id: "quimica", time: "09:40", subject: "Química", teacher: "Prof. Méndez", color: "#ede9fe", fg: "#5b21b6", hasEval: false },
    ],
  },
  {
    day: "Mar",
    classes: [
      { id: "literatura", time: "07:00", subject: "Literatura", teacher: "Prof. García", color: "#dcfce7", fg: "#166534", hasEval: false },
      { id: "historia", time: "07:40", subject: "Historia", teacher: "Prof. Flores", color: "#fce7f3", fg: "#9d174d", hasEval: false },
      { id: "ingles", time: "08:20", subject: "Inglés", teacher: "Prof. Collins", color: "#ffedd5", fg: "#9a3412", hasEval: true },
      { id: "biologia", time: "09:00", subject: "Biología", teacher: "Prof. Ruiz", color: "#dcfce7", fg: "#166534", hasEval: false },
      { id: "fisica", time: "09:40", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3", fg: "#854d0e", hasEval: false },
    ],
  },
  {
    day: "Mié",
    classes: [
      { id: "quimica", time: "07:00", subject: "Química", teacher: "Prof. Méndez", color: "#ede9fe", fg: "#5b21b6", hasEval: false },
      { id: "matematica", time: "07:40", subject: "Matemática", teacher: "Prof. Ramírez", color: "#dbeafe", fg: "#1e40af", hasEval: false },
      { id: "fisica", time: "08:20", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3", fg: "#854d0e", hasEval: true },
      { id: "arte", time: "09:00", subject: "Arte", teacher: "Prof. Vega", color: "#fce7f3", fg: "#9d174d", hasEval: false },
      { id: "biologia", time: "09:40", subject: "Biología", teacher: "Prof. Ruiz", color: "#dcfce7", fg: "#166534", hasEval: false },
    ],
  },
  {
    day: "Jue",
    classes: [
      { id: "ingles", time: "07:00", subject: "Inglés", teacher: "Prof. Collins", color: "#ffedd5", fg: "#9a3412", hasEval: false },
      { id: "biologia", time: "07:40", subject: "Biología", teacher: "Prof. Ruiz", color: "#dcfce7", fg: "#166534", hasEval: false },
      { id: "matematica", time: "08:20", subject: "Matemática", teacher: "Prof. Ramírez", color: "#dbeafe", fg: "#1e40af", hasEval: false },
      { id: "quimica", time: "09:00", subject: "Química", teacher: "Prof. Méndez", color: "#ede9fe", fg: "#5b21b6", hasEval: true },
      { id: "historia", time: "09:40", subject: "Historia", teacher: "Prof. Flores", color: "#fce7f3", fg: "#9d174d", hasEval: false },
    ],
  },
  {
    day: "Vie",
    classes: [
      { id: "fisica", time: "07:00", subject: "Física", teacher: "Prof. Torres", color: "#fef9c3", fg: "#854d0e", hasEval: false },
      { id: "arte", time: "07:40", subject: "Arte", teacher: "Prof. Vega", color: "#fce7f3", fg: "#9d174d", hasEval: true },
      { id: "literatura", time: "08:20", subject: "Literatura", teacher: "Prof. García", color: "#dcfce7", fg: "#166534", hasEval: false },
      { id: "ingles", time: "09:00", subject: "Inglés", teacher: "Prof. Collins", color: "#ffedd5", fg: "#9a3412", hasEval: false },
      { id: "matematica", time: "09:40", subject: "Matemática", teacher: "Prof. Ramírez", color: "#dbeafe", fg: "#1e40af", hasEval: false },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Dashboard — evaluaciones pendientes de la semana                    */
/* ------------------------------------------------------------------ */

export interface PendingEval {
  id: number;
  subject: string;
  type: string;
  dueDate: string;
  weight: string;
  status: "upcoming" | "late";
  dot: string;
}

export const PENDING_EVALS_DASHBOARD: PendingEval[] = [
  { id: 1, subject: "Matemática", type: "Examen parcial", dueDate: "5 jul 2026", weight: "30%", status: "upcoming", dot: color.primary },
  { id: 2, subject: "Química", type: "Informe de laboratorio", dueDate: "7 jul 2026", weight: "15%", status: "upcoming", dot: color.purple },
  { id: 3, subject: "Literatura", type: "Entrega de ensayo", dueDate: "10 jul 2026", weight: "20%", status: "upcoming", dot: color.success },
  { id: 4, subject: "Historia", type: "Exposición oral", dueDate: "12 jul 2026", weight: "25%", status: "late", dot: color.danger },
];

/* ------------------------------------------------------------------ */
/* Perfil del estudiante (StudentDataPage)                             */
/* ------------------------------------------------------------------ */

export interface StudentProfile {
  name: string;
  initials: string;
  section: string;
  id: string;
  email: string;
  term: string;
}

export const STUDENT_PROFILE: StudentProfile = {
  name: "Carlos Mendoza",
  initials: "CM",
  section: "4.º Año · Sección B",
  id: "V-30.123.456",
  email: "carlos.mendoza@edugestion.edu",
  term: "2026-I",
};

export interface ProximaEval {
  id: number;
  subjectId: number;
  subject: string;
  type: string;
  date: string;
  dot: string;
}

export const PROXIMAS_EVAL_ESTUDIANTE: ProximaEval[] = [
  { id: 1, subjectId: 3, subject: "Matemática", type: "Examen parcial", date: "5 jul 2026", dot: color.primary },
  { id: 2, subjectId: 5, subject: "Química", type: "Informe de laboratorio", date: "7 jul 2026", dot: color.purple },
  { id: 3, subjectId: 4, subject: "Literatura", type: "Entrega de ensayo", date: "10 jul 2026", dot: color.success },
  { id: 4, subjectId: 7, subject: "Historia", type: "Exposición oral", date: "12 jul 2026", dot: color.danger },
];

export type ReproStatus = "reprobado" | "por_reprobar";

export interface MateriaRepro {
  id: number;
  subject: string;
  teacher: string;
  average: number;
  status: ReproStatus;
}

export const MATERIAS_REPROBADAS_ESTUDIANTE: MateriaRepro[] = [
  { id: 8, subject: "Inglés", teacher: "Prof. Collins", average: 8, status: "reprobado" },
  { id: 7, subject: "Historia", teacher: "Prof. Flores", average: 10, status: "por_reprobar" },
];

export type Severity = "leve" | "grave" | "positiva";

export interface Incidencia {
  id: number;
  type: string;
  detail: string;
  date: string;
  severity: Severity;
}

export const INCIDENCIAS_ESTUDIANTE: Incidencia[] = [
  { id: 1, type: "Reconocimiento por conducta", detail: "Mejor promedio de la sección", date: "20 jun 2026", severity: "positiva" },
  { id: 2, type: "Uso de celular en clase", detail: "Matemática · Prof. Ramírez", date: "3 jun 2026", severity: "leve" },
  { id: 3, type: "Inasistencia sin justificar", detail: "Falta del 18 de junio", date: "18 jun 2026", severity: "grave" },
  { id: 4, type: "Llegada tarde", detail: "Retraso de 15 min a primera hora", date: "12 may 2026", severity: "leve" },
];

export interface Actividad {
  id: number;
  name: string;
  detail: string;
  date: string;
}

export const ACTIVIDADES_ESTUDIANTE: Actividad[] = [
  { id: 1, name: "Ajedrez estratégico", detail: "Curso · Torneo interno", date: "ago 2026" },
  { id: 2, name: "Ecología y huerto escolar", detail: "Curso extracurricular", date: "jul 2026" },
  { id: 3, name: "Olimpiada de matemática", detail: "Representó a la sección", date: "jun 2026" },
  { id: 4, name: "Feria de ciencias", detail: "Actividad institucional", date: "may 2026" },
  { id: 5, name: "Jornada de reforestación", detail: "Voluntariado", date: "may 2026" },
];

/* ------------------------------------------------------------------ */
/* Materia (CoursesPage) — banner, docente y plan de evaluación        */
/* ------------------------------------------------------------------ */

export interface CourseInfo {
  name: string;
  code: string;
  section: string;
  room: string;
  schedule: string;
  term: string;
}

export const COURSE_ESTUDIANTE: CourseInfo = {
  name: "Ciencias Naturales",
  code: "CNA-401",
  section: "Sección B",
  room: "Lab 102",
  schedule: "Lun / Mié · 07:00 – 08:30",
  term: "2026-I",
};

export interface CourseTeacher {
  name: string;
  title: string;
  phone: string;
  email: string;
  initials: string;
}

export const TEACHER_ESTUDIANTE: CourseTeacher = {
  name: "Prof. Alejandro Morales",
  title: "Docente titular de Ciencias",
  phone: "+58 412-555-0193",
  email: "a.morales@edugestion.edu",
  initials: "AM",
};

export interface AssignmentTopic {
  id: number;
  text: string;
}

export interface Assignment {
  id: number;
  title: string;
  type: "presentation" | "exam" | "lab" | "essay";
  dueDate: string;
  weight: string;
  status: "pending" | "submitted" | "graded";
  grade?: string;
  description?: string;
  duration?: string;
  topics?: AssignmentTopic[];
  hasAttachment?: boolean;
  attachmentName?: string;
}

export const ASSIGNMENTS_ESTUDIANTE: Assignment[] = [
  {
    id: 1,
    title: "Exposición sobre el Petróleo",
    type: "presentation",
    dueDate: "10 jul 2026",
    weight: "20%",
    status: "pending",
    description:
      "Prepara y presenta una exposición oral sobre el petróleo como recurso natural. La exposición debe ser clara, bien estructurada y con apoyo visual.",
    duration: "5 minutos",
    topics: [
      { id: 1, text: "¿Qué es el petróleo? (origen, composición y tipos)" },
      { id: 2, text: "¿Dónde se encuentra? (principales reservas y regiones de extracción)" },
      { id: 3, text: "¿Por qué es importante? (relevancia económica, energética y social)" },
    ],
    hasAttachment: true,
    attachmentName: "Guia_Exposicion_Petroleo.pdf",
  },
  {
    id: 2,
    title: "Examen escrito · Unidad 3",
    type: "exam",
    dueDate: "17 jul 2026",
    weight: "30%",
    status: "pending",
    description: "Examen escrito a libro cerrado sobre todos los temas de la Unidad 3: Recursos de la Tierra.",
    duration: "90 minutos",
    hasAttachment: false,
  },
  {
    id: 3,
    title: "Informe de laboratorio · Ciclo del agua",
    type: "lab",
    dueDate: "28 jun 2026",
    weight: "15%",
    status: "graded",
    grade: "88",
    description: "Informe de laboratorio que documenta el experimento del ciclo del agua realizado en la Semana 6.",
    hasAttachment: false,
  },
  {
    id: 4,
    title: "Ensayo sobre energías renovables",
    type: "essay",
    dueDate: "24 jul 2026",
    weight: "20%",
    status: "pending",
    description: "Redacta un ensayo de 600 a 800 palabras comparando dos fuentes de energía renovable.",
    hasAttachment: true,
    attachmentName: "Rubrica_Ensayo.pdf",
  },
  {
    id: 5,
    title: "Prueba corta de biodiversidad",
    type: "exam",
    dueDate: "20 jun 2026",
    weight: "15%",
    status: "graded",
    grade: "95",
    hasAttachment: false,
  },
];

/* ------------------------------------------------------------------ */
/* Materias pendientes (MateriasPendientesPage)                        */
/* ------------------------------------------------------------------ */

export type PendingStatus = "reparacion" | "espera";

export interface PendingSubject {
  id: number;
  name: string;
  year: string;
  average: number;
  status: PendingStatus;
  repairDate?: string;
}

export const PENDING_SUBJECTS_ESTUDIANTE: PendingSubject[] = [
  { id: 1, name: "Inglés", year: "2022–2023", average: 8, status: "reparacion", repairDate: "15 Jul 2026" },
  { id: 2, name: "Historia", year: "2022–2023", average: 10, status: "reparacion", repairDate: "18 Jul 2026" },
  { id: 3, name: "Geografía", year: "2021–2022", average: 9, status: "espera" },
  { id: 4, name: "Química", year: "2021–2022", average: 7, status: "espera" },
  { id: 5, name: "Arte", year: "2020–2021", average: 6, status: "espera" },
  { id: 6, name: "Educación Física", year: "2020–2021", average: 11, status: "espera" },
  { id: 7, name: "Matemática", year: "2023–2024", average: 9, status: "reparacion", repairDate: "20 Jul 2026" },
];

/* ------------------------------------------------------------------ */
/* Calificaciones (CalificacionPage)                                   */
/* ------------------------------------------------------------------ */

export type EvalType = "presentation" | "exam" | "lab" | "essay";

export interface GradeAttachment {
  name: string;
  kind: "image" | "file";
  url: string;
}

export interface Grade {
  id: number;
  lapso: LapsoId;
  subject: string;
  teacher: string;
  title: string;
  type: EvalType;
  date: string;
  weight: string;
  grade: number; // sobre 20
  description: string;
  attachment: GradeAttachment;
}

export const GRADES_ESTUDIANTE: Grade[] = [
  // Lapso II (en curso) — junio 2026
  { id: 1, lapso: 2, subject: "Física", teacher: "Prof. Torres", title: "Examen · Cinemática", type: "exam", date: "12 jun 2026", weight: "30%", grade: 19, description: "Examen escrito sobre movimiento rectilíneo, velocidad y aceleración.", attachment: { name: "Examen_Cinematica.jpg", kind: "image", url: "https://picsum.photos/seed/examfisica/900/1200" } },
  { id: 2, lapso: 2, subject: "Química", teacher: "Prof. Méndez", title: "Informe de laboratorio · Reacciones", type: "lab", date: "10 jun 2026", weight: "25%", grade: 14, description: "Informe del experimento de reacciones ácido-base realizado en el laboratorio.", attachment: { name: "Informe_Reacciones.pdf", kind: "file", url: "#" } },
  { id: 3, lapso: 2, subject: "Literatura", teacher: "Prof. García", title: "Ensayo sobre el Realismo", type: "essay", date: "6 jun 2026", weight: "20%", grade: 17, description: "Ensayo de 600 palabras analizando las características del movimiento realista.", attachment: { name: "Ensayo_Realismo.pdf", kind: "file", url: "#" } },
  { id: 4, lapso: 2, subject: "Historia", teacher: "Prof. Flores", title: "Exposición · Independencia", type: "presentation", date: "4 jun 2026", weight: "25%", grade: 9, description: "Exposición oral sobre el proceso de independencia y sus protagonistas.", attachment: { name: "Diapositivas_Independencia.jpg", kind: "image", url: "https://picsum.photos/seed/histexpo/1200/800" } },
  { id: 5, lapso: 2, subject: "Matemática", teacher: "Prof. Ramírez", title: "Prueba corta · Funciones", type: "exam", date: "2 jun 2026", weight: "15%", grade: 16, description: "Prueba corta sobre dominio, rango y gráficas de funciones.", attachment: { name: "Prueba_Funciones.jpg", kind: "image", url: "https://picsum.photos/seed/matefunc/900/1200" } },
  // Lapso I (finalizado) — mayo 2026
  { id: 6, lapso: 1, subject: "Biología", teacher: "Prof. Ruiz", title: "Laboratorio · Célula", type: "lab", date: "28 may 2026", weight: "20%", grade: 18, description: "Práctica de observación de células vegetales en el microscopio.", attachment: { name: "Practica_Celula.pdf", kind: "file", url: "#" } },
  { id: 7, lapso: 1, subject: "Inglés", teacher: "Prof. Collins", title: "Examen · Present Perfect", type: "exam", date: "26 may 2026", weight: "30%", grade: 8, description: "Examen escrito sobre el uso del present perfect y vocabulario de la unidad.", attachment: { name: "Examen_Ingles.jpg", kind: "image", url: "https://picsum.photos/seed/exingles/900/1200" } },
  { id: 8, lapso: 1, subject: "Arte", teacher: "Prof. Vega", title: "Proyecto · Autorretrato", type: "presentation", date: "22 may 2026", weight: "35%", grade: 20, description: "Presentación del autorretrato realizado con técnica libre.", attachment: { name: "Autorretrato.jpg", kind: "image", url: "https://picsum.photos/seed/autorretrato/1000/1000" } },
  { id: 9, lapso: 1, subject: "Física", teacher: "Prof. Torres", title: "Laboratorio · Péndulo", type: "lab", date: "18 may 2026", weight: "20%", grade: 15, description: "Informe del experimento del péndulo simple y cálculo del período.", attachment: { name: "Lab_Pendulo.pdf", kind: "file", url: "#" } },
  { id: 10, lapso: 1, subject: "Química", teacher: "Prof. Méndez", title: "Examen · Tabla periódica", type: "exam", date: "14 may 2026", weight: "30%", grade: 13, description: "Examen sobre organización de la tabla periódica y propiedades de los elementos.", attachment: { name: "Examen_Tabla.jpg", kind: "image", url: "https://picsum.photos/seed/tablaperiodica/900/1200" } },
  { id: 11, lapso: 1, subject: "Literatura", teacher: "Prof. García", title: "Exposición · Poesía", type: "presentation", date: "10 may 2026", weight: "20%", grade: 12, description: "Exposición grupal sobre recursos literarios en la poesía contemporánea.", attachment: { name: "Poesia.pdf", kind: "file", url: "#" } },
];

/* ------------------------------------------------------------------ */
/* Evaluaciones por hacer (MisEvaluacionesPage)                        */
/* ------------------------------------------------------------------ */

export interface EvaluationTopic {
  id: number;
  text: string;
}

export interface Evaluation {
  id: number;
  lapso: LapsoId;
  subjectId: number;
  subject: string;
  teacher: string;
  title: string;
  type: EvalType;
  date: string;
  daysUntil: number;
  weight: string;
  currentAverage: number; // promedio actual de la materia (sobre 20)
  description: string;
  topics?: EvaluationTopic[];
  guide?: string; // material adjunto
}

export const EVALUATIONS_ESTUDIANTE: Evaluation[] = [
  // Lapso II (en curso) — evaluaciones próximas de julio 2026
  { id: 1, lapso: 2, subjectId: 3, subject: "Matemática", teacher: "Prof. Ramírez", title: "Examen parcial · Derivadas", type: "exam", date: "5 jul 2026", daysUntil: 3, weight: "30%", currentAverage: 11, description: "Examen escrito sobre reglas de derivación y aplicaciones.", topics: [{ id: 1, text: "Reglas de derivación" }, { id: 2, text: "Recta tangente" }, { id: 3, text: "Optimización" }], guide: "Guia_Derivadas.pdf" },
  { id: 2, lapso: 2, subjectId: 8, subject: "Inglés", teacher: "Prof. Collins", title: "Examen · Present Perfect", type: "exam", date: "6 jul 2026", daysUntil: 4, weight: "30%", currentAverage: 8, description: "Examen sobre el uso del present perfect y vocabulario de la unidad.", topics: [{ id: 1, text: "Present perfect vs past simple" }, { id: 2, text: "Vocabulario de viajes" }], guide: "Study_Guide_Unit4.pdf" },
  { id: 3, lapso: 2, subjectId: 5, subject: "Química", teacher: "Prof. Méndez", title: "Informe de laboratorio · Gases", type: "lab", date: "7 jul 2026", daysUntil: 5, weight: "15%", currentAverage: 13, description: "Informe del experimento sobre las leyes de los gases." },
  { id: 4, lapso: 2, subjectId: 1, subject: "Física", teacher: "Prof. Torres", title: "Prueba corta · Dinámica", type: "exam", date: "9 jul 2026", daysUntil: 7, weight: "15%", currentAverage: 19, description: "Prueba corta sobre las leyes de Newton." },
  { id: 5, lapso: 2, subjectId: 4, subject: "Literatura", teacher: "Prof. García", title: "Entrega de ensayo", type: "essay", date: "10 jul 2026", daysUntil: 8, weight: "20%", currentAverage: 15, description: "Ensayo de 600 palabras sobre una obra del realismo.", guide: "Rubrica_Ensayo.pdf" },
  { id: 6, lapso: 2, subjectId: 7, subject: "Historia", teacher: "Prof. Flores", title: "Exposición oral · Independencia", type: "presentation", date: "12 jul 2026", daysUntil: 10, weight: "25%", currentAverage: 10, description: "Exposición grupal sobre el proceso de independencia.", topics: [{ id: 1, text: "Antecedentes" }, { id: 2, text: "Protagonistas" }] },
  { id: 7, lapso: 2, subjectId: 2, subject: "Biología", teacher: "Prof. Ruiz", title: "Laboratorio · Genética", type: "lab", date: "14 jul 2026", daysUntil: 12, weight: "20%", currentAverage: 17, description: "Práctica sobre cruces genéticos y leyes de Mendel." },
  { id: 8, lapso: 2, subjectId: 6, subject: "Arte", teacher: "Prof. Vega", title: "Proyecto · Mural colectivo", type: "presentation", date: "16 jul 2026", daysUntil: 14, weight: "35%", currentAverage: 13, description: "Presentación del mural colectivo con técnica libre." },
  // Lapso III (próximo) — evaluaciones planificadas de agosto 2026
  { id: 9, lapso: 3, subjectId: 3, subject: "Matemática", teacher: "Prof. Ramírez", title: "Examen diagnóstico · Integrales", type: "exam", date: "5 ago 2026", daysUntil: 31, weight: "20%", currentAverage: 12, description: "Examen inicial sobre integrales indefinidas y definidas." },
  { id: 10, lapso: 3, subjectId: 5, subject: "Química", teacher: "Prof. Méndez", title: "Proyecto · Química orgánica", type: "presentation", date: "18 ago 2026", daysUntil: 44, weight: "30%", currentAverage: 13, description: "Presentación del proyecto de introducción a la química orgánica." },
  { id: 11, lapso: 3, subjectId: 2, subject: "Biología", teacher: "Prof. Ruiz", title: "Informe · Ecosistemas", type: "essay", date: "25 ago 2026", daysUntil: 51, weight: "25%", currentAverage: 17, description: "Informe de investigación sobre ecosistemas y biodiversidad." },
];

/* ------------------------------------------------------------------ */
/* Pagos (PagosPage) — historial de pagos                              */
/* ------------------------------------------------------------------ */

export type PayType = "efectivo" | "manual";
export type PayStatus = "confirmed" | "review" | "rejected";

export interface Payment {
  id: number;
  amount: number;
  currency: string;
  date: string;
  type: PayType;
  status: PayStatus;
  voucher: string;
  receiptUrl?: string; // foto del comprobante subida por el estudiante
}

export const PAYMENTS_ESTUDIANTE: Payment[] = [
  { id: 1, amount: 200, currency: "USD", date: "5 jun 2026", type: "efectivo", status: "confirmed", voucher: "" },
  { id: 2, amount: 3000, currency: "Bs.", date: "5 may 2026", type: "manual", status: "confirmed", voucher: "A-1024" },
  { id: 3, amount: 200, currency: "USD", date: "5 abr 2026", type: "manual", status: "confirmed", voucher: "A-0987" },
  { id: 4, amount: 200, currency: "USD", date: "6 mar 2026", type: "manual", status: "rejected", voucher: "A-0955" },
  { id: 5, amount: 780000, currency: "COP", date: "5 feb 2026", type: "efectivo", status: "confirmed", voucher: "" },
  { id: 6, amount: 200, currency: "USD", date: "5 ene 2026", type: "manual", status: "confirmed", voucher: "A-0912" },
  { id: 7, amount: 3000, currency: "Bs.", date: "6 dic 2025", type: "manual", status: "confirmed", voucher: "A-0888" },
  { id: 8, amount: 200, currency: "USD", date: "5 nov 2025", type: "efectivo", status: "confirmed", voucher: "" },
];

/* ------------------------------------------------------------------ */
/* Actividades extracurriculares (CoursesActivitiesPage)               */
/* ------------------------------------------------------------------ */

export type ActivityStatus = "completed" | "upcoming";

export interface Activity {
  id: number;
  name: string;
  date: string;
  teacher: string;
  lugar: string;
  status: ActivityStatus;
}

export const ACTIVITIES_ESTUDIANTE: Activity[] = [
  { id: 1, name: "Feria de ciencias", date: "12 may 2026", teacher: "Prof. Alejandro Morales", lugar: "Laboratorio de Ciencias", status: "completed" },
  { id: 2, name: "Jornada de reforestación", date: "24 may 2026", teacher: "Prof. Roberto Díaz", lugar: "Parque Municipal", status: "completed" },
  { id: 3, name: "Olimpiada de matemática", date: "3 jun 2026", teacher: "Prof. Ana Ramírez", lugar: "Aula Magna", status: "completed" },
  { id: 4, name: "Visita al museo de historia", date: "18 jun 2026", teacher: "Prof. Flores", lugar: "Museo de Historia Nacional", status: "completed" },
  { id: 5, name: "Torneo interescolar de ajedrez", date: "9 jul 2026", teacher: "Prof. Marco Salcedo", lugar: "Sala Multiusos", status: "upcoming" },
  { id: 6, name: "Festival cultural de fin de lapso", date: "26 jul 2026", teacher: "Prof. Camila Ortiz", lugar: "Auditorio Principal", status: "upcoming" },
  { id: 7, name: "Campaña de donación de libros", date: "2 ago 2026", teacher: "Prof. Lucía Fernández", lugar: "Biblioteca Central", status: "upcoming" },
];

/* ------------------------------------------------------------------ */
/* Reparación — listado de materias (RepairPage)                       */
/* ------------------------------------------------------------------ */

export type RepairStatus = "reprobado" | "reparando" | "pendiente";

export interface RepairSubjectRow {
  id: number;
  name: string;
  teacher: string;
  failedEvals: number;
  average: number;
  status: RepairStatus;
  stage?: number;
  totalStages?: number;
}

export const REPAIR_SUBJECTS_ESTUDIANTE: RepairSubjectRow[] = [
  { id: 8, name: "Inglés", teacher: "Prof. Collins", failedEvals: 4, average: 8, status: "reprobado" },
  { id: 9, name: "Geografía", teacher: "Prof. Salas", failedEvals: 3, average: 9, status: "reprobado" },
  { id: 11, name: "Química", teacher: "Prof. Méndez", failedEvals: 2, average: 9, status: "reparando", stage: 2, totalStages: 3 },
  { id: 12, name: "Matemática", teacher: "Prof. Ramírez", failedEvals: 3, average: 8, status: "reparando", stage: 2, totalStages: 2 },
  { id: 7, name: "Historia", teacher: "Prof. Flores", failedEvals: 1, average: 10, status: "pendiente" },
  { id: 10, name: "Educación Física", teacher: "Prof. Nieves", failedEvals: 0, average: 13, status: "pendiente" },
  { id: 13, name: "Arte", teacher: "Prof. Vega", failedEvals: 0, average: 12, status: "pendiente" },
];

/* ------------------------------------------------------------------ */
/* Reparación — detalle por materia y etapas (RepairCoursePage)        */
/* ------------------------------------------------------------------ */

export type EtapaStatus = "passed" | "failed" | "in_progress" | "pending";

export interface Etapa {
  order: number;
  status: EtapaStatus;
  room: string;
  schedule: string;
  term: string;
  finalAverage?: string;
  assignments: Assignment[];
}

export interface RepairSubjectDetail {
  name: string;
  code: string;
  section: string;
  teacher: { name: string; title: string; phone: string; email: string; initials: string };
  etapas: Etapa[];
}

export const REPAIR_SUBJECT_DETAILS: Record<string, RepairSubjectDetail> = {
  "11": {
    name: "Química",
    code: "QUI-401",
    section: "Sección B",
    teacher: {
      name: "Prof. Ricardo Méndez",
      title: "Docente titular de Química",
      phone: "+58 412-555-0177",
      email: "r.mendez@edugestion.edu",
      initials: "RM",
    },
    etapas: [
      {
        order: 1,
        status: "failed",
        room: "Lab 102",
        schedule: "Lun / Mié · 07:00 – 08:30",
        term: "2026-I",
        finalAverage: "8",
        assignments: [
          { id: 1, title: "Exposición sobre enlaces químicos", type: "presentation", dueDate: "5 may 2026", weight: "20%", status: "graded", grade: "9" },
          { id: 2, title: "Examen escrito · Unidad 2", type: "exam", dueDate: "12 may 2026", weight: "30%", status: "graded", grade: "8", description: "Examen a libro cerrado sobre estequiometría y enlaces." },
          { id: 3, title: "Informe de laboratorio · Reacciones", type: "lab", dueDate: "19 may 2026", weight: "25%", status: "graded", grade: "10" },
          { id: 4, title: "Ensayo sobre química ambiental", type: "essay", dueDate: "26 may 2026", weight: "25%", status: "graded", grade: "7" },
        ],
      },
      {
        order: 2,
        status: "in_progress",
        room: "Lab 104",
        schedule: "Mar / Jue · 09:00 – 10:30",
        term: "2026-I",
        assignments: [
          { id: 1, title: "Taller práctico de laboratorio", type: "lab", dueDate: "1 jul 2026", weight: "25%", status: "graded", grade: "14", description: "Práctica supervisada para reforzar los procedimientos evaluados." },
          { id: 2, title: "Prueba corta de repaso", type: "exam", dueDate: "3 jul 2026", weight: "15%", status: "graded", grade: "13" },
          {
            id: 3,
            title: "Examen parcial de recuperación",
            type: "exam",
            dueDate: "8 jul 2026",
            weight: "30%",
            status: "pending",
            description: "Examen escrito que evalúa los contenidos no aprobados de la etapa anterior.",
            duration: "90 minutos",
            topics: [
              { id: 1, text: "Estequiometría y balanceo de ecuaciones" },
              { id: 2, text: "Tipos de enlaces y propiedades" },
            ],
            hasAttachment: true,
            attachmentName: "Guia_Recuperacion.pdf",
          },
          { id: 4, title: "Exposición final del taller", type: "presentation", dueDate: "10 jul 2026", weight: "30%", status: "pending" },
        ],
      },
      {
        order: 3,
        status: "pending",
        room: "Lab 102",
        schedule: "Vie · 07:00 – 10:00",
        term: "2026-II",
        assignments: [
          { id: 1, title: "Diagnóstico inicial", type: "exam", dueDate: "Por definir", weight: "10%", status: "pending" },
          { id: 2, title: "Taller de refuerzo", type: "lab", dueDate: "Por definir", weight: "25%", status: "pending" },
          { id: 3, title: "Proyecto integrador", type: "essay", dueDate: "Por definir", weight: "25%", status: "pending" },
          { id: 4, title: "Examen final", type: "exam", dueDate: "Por definir", weight: "40%", status: "pending" },
        ],
      },
    ],
  },
  "12": {
    name: "Matemática",
    code: "MAT-401",
    section: "Sección B",
    teacher: {
      name: "Prof. Ana Ramírez",
      title: "Docente titular de Matemática",
      phone: "+58 412-555-0104",
      email: "a.ramirez@edugestion.edu",
      initials: "AR",
    },
    etapas: [
      {
        order: 1,
        status: "failed",
        room: "Aula 210",
        schedule: "Lun / Mié · 10:00 – 11:30",
        term: "2026-I",
        finalAverage: "8",
        assignments: [
          { id: 1, title: "Examen de álgebra", type: "exam", dueDate: "6 may 2026", weight: "30%", status: "graded", grade: "8" },
          { id: 2, title: "Taller de factorización", type: "lab", dueDate: "13 may 2026", weight: "25%", status: "graded", grade: "9" },
          { id: 3, title: "Prueba corta de ecuaciones", type: "exam", dueDate: "20 may 2026", weight: "20%", status: "graded", grade: "10" },
          { id: 4, title: "Proyecto de aplicación", type: "essay", dueDate: "27 may 2026", weight: "25%", status: "graded", grade: "7" },
        ],
      },
      {
        order: 2,
        status: "in_progress",
        room: "Aula 208",
        schedule: "Mar / Jue · 07:00 – 08:30",
        term: "2026-I",
        assignments: [
          { id: 1, title: "Examen de funciones", type: "exam", dueDate: "2 jul 2026", weight: "25%", status: "graded", grade: "12" },
          {
            id: 2,
            title: "Taller de límites y derivadas",
            type: "lab",
            dueDate: "9 jul 2026",
            weight: "25%",
            status: "pending",
            description: "Serie de ejercicios guiados sobre los temas con menor rendimiento.",
            hasAttachment: true,
            attachmentName: "Guia_Limites_Derivadas.pdf",
          },
          { id: 3, title: "Prueba corta de repaso", type: "exam", dueDate: "14 jul 2026", weight: "10%", status: "pending" },
          { id: 4, title: "Examen de recuperación final", type: "exam", dueDate: "17 jul 2026", weight: "40%", status: "pending", description: "Evaluación final que integra todo el plan de reparación.", duration: "120 minutos" },
        ],
      },
    ],
  },
};

export const getRepairSubjectDetail = (
  id: string | undefined,
): RepairSubjectDetail | undefined =>
  id != null ? REPAIR_SUBJECT_DETAILS[id] : undefined;
