/**
 * Datos maquetados del rol Coordinador.
 *
 * Reúne los datos estáticos que antes vivían incrustados en las páginas del
 * coordinador (agenda del dashboard, reuniones, actividades, planificaciones,
 * incidencias, secciones/materias/bloques, asistencia, personas y cursos
 * extracurriculares). Los expone el "servidor" maquetado a través de las rutas
 * de `../server/routes/coordinador.routes.ts`.
 *
 * Solo se mueven las SERIES DE DATOS (registros que representan contenido). Los
 * mapas presentacionales (metadatos de estado, plantillas de columnas, listas
 * de opciones) permanecen en cada página.
 */

/* ================================================================== */
/* Dashboard                                                           */
/* ================================================================== */

export type DashMeetingStatus = "programada" | "realizada" | "cancelada";

export interface DashMeeting {
  topic: string;
  audience: string;
  datetime: string;
  status: DashMeetingStatus;
}

export const DASHBOARD_MEETINGS: DashMeeting[] = [
  { topic: "Ajuste de plan de evaluación", audience: "Docentes", datetime: "3 jul 2026, 10:00", status: "programada" },
  { topic: "Seguimiento de convivencia escolar", audience: "Representantes", datetime: "5 jul 2026, 08:30", status: "programada" },
  { topic: "Organización de la Feria de ciencias", audience: "Docentes", datetime: "7 jul 2026, 14:00", status: "programada" },
  { topic: "Revisión de indicadores del segundo lapso", audience: "Docentes", datetime: "28 jun 2026, 09:00", status: "realizada" },
  { topic: "Coordinación de acto cultural de fin de mes", audience: "Representantes", datetime: "26 jun 2026, 11:00", status: "cancelada" },
];

export type DashPlanStatus = "pendiente" | "aprobada" | "rechazada";

export interface DashPlan {
  teacher: string;
  subject: string;
  sent: string;
  status: DashPlanStatus;
  note?: string;
}

export const DASHBOARD_PLANS: DashPlan[] = [
  { teacher: "Prof. Alejandro Morales", subject: "Ciencias Naturales", sent: "1 jul 2026", status: "pendiente" },
  { teacher: "Prof. Daniela Fuentes", subject: "Matemática", sent: "30 jun 2026", status: "pendiente" },
  { teacher: "Prof. Ricardo Villalba", subject: "Historia Universal", sent: "29 jun 2026", status: "aprobada" },
  {
    teacher: "Prof. Marisol Cabrera",
    subject: "Lengua y Literatura",
    sent: "27 jun 2026",
    status: "rechazada",
    note: "Observación: los porcentajes de evaluación no suman 100%. Ajustar ponderación del proyecto final.",
  },
  { teacher: "Prof. Óscar Delgado", subject: "Educación Física", sent: "26 jun 2026", status: "pendiente" },
];

export type DashActivityType = "Deportiva" | "Cultural" | "Académica";

export interface DashActivity {
  name: string;
  type: DashActivityType;
  teacher: string;
  taken: number;
  cap: number;
  status: string;
  statusOk: boolean;
}

export const DASHBOARD_ACTIVITIES: DashActivity[] = [
  { name: "Torneo de fútbol", type: "Deportiva", teacher: "Prof. Óscar Delgado", taken: 18, cap: 25, status: "En curso", statusOk: true },
  { name: "Festival de danzas", type: "Cultural", teacher: "Prof. Marisol Cabrera", taken: 22, cap: 30, status: "Inscripciones abiertas", statusOk: true },
];

export type DashPersonRole = "Estudiante" | "Docente";
export type DashSeverity = "Leve" | "Moderada" | "Grave";

export interface DashIncident {
  person: string;
  role: DashPersonRole;
  type: string;
  date: string;
  severity: DashSeverity;
}

export const DASHBOARD_INCIDENTS: DashIncident[] = [
  { person: "Carlos Jiménez", role: "Estudiante", type: "Ausencia injustificada", date: "30 jun 2026", severity: "Leve" },
  { person: "Valentina Rojas", role: "Estudiante", type: "Conducta disruptiva en aula", date: "28 jun 2026", severity: "Moderada" },
  { person: "Prof. Ricardo Villalba", role: "Docente", type: "Retraso en entrega de notas", date: "26 jun 2026", severity: "Leve" },
  { person: "Andrés Peralta", role: "Estudiante", type: "Agresión física en recreo", date: "24 jun 2026", severity: "Grave" },
  { person: "Lucía Mendoza", role: "Estudiante", type: "Uso indebido de dispositivos", date: "22 jun 2026", severity: "Moderada" },
];

export interface DashIncidentsByMonth {
  mes: string;
  incidencias: number;
}

export const DASHBOARD_INCIDENTS_BY_MONTH: DashIncidentsByMonth[] = [
  { mes: "Feb", incidencias: 5 },
  { mes: "Mar", incidencias: 8 },
  { mes: "Abr", incidencias: 6 },
  { mes: "May", incidencias: 11 },
  { mes: "Jun", incidencias: 7 },
  { mes: "Jul", incidencias: 9 },
];

/* ================================================================== */
/* Reuniones                                                           */
/* ================================================================== */

export type ReunionEstado = "Programada" | "Realizada" | "Cancelada";
export type ReunionConvocados = "Docentes" | "Representantes" | "Ambos";

export interface Reunion {
  id: number;
  tema: string;
  fecha: string;
  hora: string;
  convocados: ReunionConvocados;
  estado: ReunionEstado;
  observaciones?: string;
}

export const REUNIONES: Reunion[] = [
  { id: 1, tema: "Cierre del segundo lapso", fecha: "10 jul 2026", hora: "08:00", convocados: "Docentes", estado: "Programada", observaciones: "Traer consolidado de notas por sección." },
  { id: 2, tema: "Entrega de boletines 4.º Año", fecha: "12 jul 2026", hora: "14:00", convocados: "Representantes", estado: "Programada" },
  { id: 3, tema: "Planificación del acto de graduación", fecha: "28 jun 2026", hora: "10:30", convocados: "Ambos", estado: "Realizada", observaciones: "Se conformó la comisión de logística." },
  { id: 4, tema: "Revisión de convivencia escolar", fecha: "20 jun 2026", hora: "09:00", convocados: "Docentes", estado: "Realizada" },
  { id: 5, tema: "Feria científica anual", fecha: "5 jun 2026", hora: "11:00", convocados: "Ambos", estado: "Cancelada", observaciones: "Reprogramada por lluvias." },
];

/* ================================================================== */
/* Actividades                                                         */
/* ================================================================== */

export type TipoActividad = "Cultural" | "Deportiva" | "Científica" | "Artística";
export type EstadoPostulado = "Pendiente" | "Aprobado" | "Rechazado";

export interface ActividadTabla {
  docente: string;
  tema: string;
  id: number;
  fecha: string;
  cupos: string;
  lugar: string;
  estado: EstadoPostulado;
  postulados: Postulado[];
}

export interface Postulado {
  id: number;
  nombre: string;
  seccion: string;
  estado: EstadoPostulado;
}

export interface Actividad {
  id: number;
  nombre: string;
  tipo: TipoActividad;
  docente: string;
  cupo: number;
  postulados: Postulado[];
}

/** Lista de docentes seleccionables (compartida por actividades y secciones). */
export const DOCENTES: string[] = [
  "Sin asignar",
  "Prof. María Herrera",
  "Prof. Luis Rondón",
  "Prof. Carla Yépez",
  "Prof. José Bracho",
  "Prof. Ana Salazar",
  "Prof. Pedro Uzcátegui",
];

export const ACTIVIDADES: Actividad[] = [
  {
    id: 1, nombre: "Danzas Tradicionales", tipo: "Cultural", docente: "Prof. María Herrera", cupo: 25,
    postulados: [
      { id: 11, nombre: "Valeria Contreras", seccion: "3.º Año A", estado: "Aprobado" },
      { id: 12, nombre: "Daniel Peña", seccion: "2.º Año B", estado: "Pendiente" },
      { id: 13, nombre: "Isabella Moreno", seccion: "4.º Año C", estado: "Pendiente" },
    ],
  },
];

export const ACTIVIDADES_AGENDA: ActividadTabla[] = [
  {
    id: 1, tema: "Danzas Tradicionales", lugar: "Auditorio", cupos: "4/25", fecha: "12 jul 2026", docente: "Prof. María Herrera", estado: "Aprobado",
    postulados: [
      { id: 11, nombre: "Valeria Contreras", seccion: "3.º Año A", estado: "Aprobado" },
      { id: 12, nombre: "Daniel Peña", seccion: "2.º Año B", estado: "Pendiente" },
      { id: 13, nombre: "Isabella Moreno", seccion: "4.º Año C", estado: "Pendiente" },
      { id: 14, nombre: "Sofía Marcano", seccion: "1.º Año B", estado: "Pendiente" },
    ],
  },
  {
    id: 2, tema: "Torneo de ajedrez", lugar: "Tariba", cupos: "1/25", fecha: "10 jul 2026", docente: "Prof. José Bracho", estado: "Pendiente",
    postulados: [
      { id: 21, nombre: "Carlos Guédez", seccion: "5.º Año A", estado: "Pendiente" },
      { id: 22, nombre: "Gustavo Pedraza", seccion: "2.º Año A", estado: "Pendiente" },
    ],
  },
  {
    id: 3, tema: "Feria científica", lugar: "Laboratorio", cupos: "6/30", fecha: "18 jul 2026", docente: "Prof. Pedro Uzcátegui", estado: "Aprobado",
    postulados: [
      { id: 31, nombre: "Andrea Villalba", seccion: "5.º Año B", estado: "Aprobado" },
      { id: 32, nombre: "Jesús Colmenares", seccion: "4.º Año A", estado: "Aprobado" },
      { id: 33, nombre: "Daniel Peña", seccion: "2.º Año B", estado: "Pendiente" },
    ],
  },
  {
    id: 4, tema: "Festival de canto", lugar: "Auditorio", cupos: "2/20", fecha: "20 jul 2026", docente: "Prof. Carla Yépez", estado: "Pendiente",
    postulados: [
      { id: 41, nombre: "Sofía Marcano", seccion: "1.º Año B", estado: "Pendiente" },
      { id: 42, nombre: "Valeria Contreras", seccion: "3.º Año A", estado: "Rechazado" },
    ],
  },
  {
    id: 5, tema: "Carrera atlética", lugar: "Cancha deportiva", cupos: "8/40", fecha: "25 jul 2026", docente: "Prof. Luis Rondón", estado: "Aprobado",
    postulados: [
      { id: 51, nombre: "Gustavo Pedraza", seccion: "2.º Año A", estado: "Aprobado" },
      { id: 52, nombre: "Carlos Guédez", seccion: "5.º Año A", estado: "Aprobado" },
      { id: 53, nombre: "Andrea Villalba", seccion: "5.º Año B", estado: "Pendiente" },
    ],
  },
  {
    id: 6, tema: "Club de teatro", lugar: "Sala de usos múltiples", cupos: "3/15", fecha: "28 jul 2026", docente: "Prof. Ana Salazar", estado: "Pendiente",
    postulados: [
      { id: 61, nombre: "Isabella Moreno", seccion: "4.º Año C", estado: "Pendiente" },
      { id: 62, nombre: "Jesús Colmenares", seccion: "4.º Año A", estado: "Pendiente" },
    ],
  },
];

/* ================================================================== */
/* Planificaciones                                                     */
/* ================================================================== */

export type EstadoPlan = "Pendiente" | "Aprobada" | "Rechazada";

export interface Planificacion {
  id: number;
  docente: string;
  materia: string;
  seccion: string;
  entrega: string;
  estado: EstadoPlan;
  observacion?: string;
}

export const PLANIFICACIONES: Planificacion[] = [
  { id: 1, docente: "Prof. María Herrera", materia: "Ciencias Naturales", seccion: "4.º Año B", entrega: "1 jul 2026", estado: "Pendiente" },
  { id: 2, docente: "Prof. Luis Rondón", materia: "Educación Física", seccion: "3.º Año A", entrega: "30 jun 2026", estado: "Pendiente" },
  { id: 3, docente: "Prof. Carla Yépez", materia: "Castellano", seccion: "5.º Año A", entrega: "28 jun 2026", estado: "Aprobada" },
  { id: 4, docente: "Prof. José Bracho", materia: "Matemática", seccion: "4.º Año C", entrega: "27 jun 2026", estado: "Rechazada", observacion: "Falta el cronograma de evaluaciones del lapso." },
  { id: 5, docente: "Prof. Ana Salazar", materia: "Historia de Venezuela", seccion: "2.º Año B", entrega: "26 jun 2026", estado: "Aprobada" },
  { id: 6, docente: "Prof. Pedro Uzcátegui", materia: "Química", seccion: "5.º Año B", entrega: "25 jun 2026", estado: "Pendiente" },
];

/* ================================================================== */
/* Incidencias                                                         */
/* ================================================================== */

export type TipoPersona = "Docente" | "Estudiante" | "Formato";
export type Gravedad = "Leve" | "Moderada" | "Grave";

export interface Incidencia {
  id: number;
  persona: string;
  tipo: TipoPersona;
  gravedad: Gravedad;
  fecha: string;
  descripcion: string;
}

export const INCIDENCIAS: Incidencia[] = [
  { id: 1, persona: "Andrés Villalobos", tipo: "Estudiante", gravedad: "Moderada", fecha: "2 jul 2026", descripcion: "Se retiró del aula sin autorización durante la clase de Matemática." },
  { id: 2, persona: "Prof. Luis Rondón", tipo: "Docente", gravedad: "Leve", fecha: "1 jul 2026", descripcion: "Entrega tardía del consolidado de notas del segundo lapso." },
  { id: 3, persona: "Mariangel Ochoa", tipo: "Estudiante", gravedad: "Grave", fecha: "29 jun 2026", descripcion: "Riña con otra estudiante en el receso; se citó a los representantes." },
  { id: 4, persona: "Prof. Pedro Uzcátegui", tipo: "Docente", gravedad: "Moderada", fecha: "27 jun 2026", descripcion: "Inasistencia sin justificativo a la reunión de departamento." },
  { id: 5, persona: "Kevin Graterol", tipo: "Estudiante", gravedad: "Leve", fecha: "25 jun 2026", descripcion: "Uso del teléfono celular durante la evaluación de Biología." },
  { id: 6, persona: "Daniela Sánchez", tipo: "Estudiante", gravedad: "Moderada", fecha: "24 jun 2026", descripcion: "Llegada tarde reiterada a la primera hora de clase." },
  { id: 7, persona: "Prof. Carla Yépez", tipo: "Docente", gravedad: "Leve", fecha: "22 jun 2026", descripcion: "No registró la asistencia en el sistema durante la semana." },
  { id: 8, persona: "Josué Ramírez", tipo: "Estudiante", gravedad: "Grave", fecha: "20 jun 2026", descripcion: "Daño intencional al mobiliario del laboratorio de Física." },
];

/** Campos del formato de registro de incidencias. */
export const CAMPOS_FORMATO_INCIDENCIAS: string[] = [
  "Nombre y apellido de la persona",
  "Cédula / código de estudiante",
  "Tipo (docente / estudiante)",
  "Año y sección (si aplica)",
  "Fecha y hora del hecho",
  "Gravedad de la incidencia",
  "Descripción detallada del hecho",
  "Medida o acción tomada",
  "Responsable del registro",
];

/* ================================================================== */
/* Secciones / Materias / Horarios                                     */
/* ================================================================== */

export interface Seccion {
  id: number;
  anio: string;
  seccion: string;
  cupo: number;
  tutor: string;
}

export type Nivel = "Primaria" | "Liceo";

export interface Materia {
  id: number;
  nombre: string;
  nivel: Nivel;
}

export interface Bloque {
  id: number;
  inicio: string;
  fin: string;
}

export const SECCIONES: Seccion[] = [
  { id: 1, anio: "1.º Año", seccion: "A", cupo: 32, tutor: "Prof. Ana Salazar" },
  { id: 2, anio: "1.º Año", seccion: "B", cupo: 30, tutor: "Prof. José Bracho" },
  { id: 3, anio: "2.º Año", seccion: "A", cupo: 30, tutor: "Prof. Carla Yépez" },
  { id: 4, anio: "2.º Año", seccion: "B", cupo: 29, tutor: "Prof. Luis Rondón" },
  { id: 5, anio: "3.º Año", seccion: "A", cupo: 28, tutor: "Prof. María Herrera" },
  { id: 6, anio: "3.º Año", seccion: "B", cupo: 27, tutor: "Prof. Pedro Uzcátegui" },
  { id: 7, anio: "4.º Año", seccion: "A", cupo: 31, tutor: "Prof. Ana Salazar" },
  { id: 8, anio: "4.º Año", seccion: "B", cupo: 30, tutor: "Prof. José Bracho" },
  { id: 9, anio: "5.º Año", seccion: "A", cupo: 27, tutor: "Prof. Carla Yépez" },
];

export const MATERIAS: Materia[] = [
  { id: 1, nombre: "Castellano", nivel: "Liceo" },
  { id: 2, nombre: "Matemática", nivel: "Liceo" },
  { id: 3, nombre: "Ciencias Naturales", nivel: "Primaria" },
  { id: 4, nombre: "Biología", nivel: "Liceo" },
  { id: 5, nombre: "Química", nivel: "Liceo" },
  { id: 6, nombre: "Física", nivel: "Liceo" },
  { id: 7, nombre: "Historia de Venezuela", nivel: "Liceo" },
  { id: 8, nombre: "Geografía", nivel: "Liceo" },
  { id: 9, nombre: "Inglés", nivel: "Liceo" },
  { id: 10, nombre: "Educación Física", nivel: "Primaria" },
  { id: 11, nombre: "Educación Artística", nivel: "Primaria" },
  { id: 12, nombre: "Informática", nivel: "Liceo" },
];

export const BLOQUES: Bloque[] = [
  { id: 1, inicio: "07:00", fin: "07:45" },
  { id: 2, inicio: "07:45", fin: "08:30" },
  { id: 3, inicio: "08:30", fin: "09:15" },
  { id: 4, inicio: "09:30", fin: "10:15" },
];

/** Lista de docentes seleccionables en secciones/horarios (incluye a Uzcátegui). */
export const DOCENTES_SECCIONES: string[] = [
  "Sin asignar",
  "Prof. María Herrera",
  "Prof. Luis Rondón",
  "Prof. Carla Yépez",
  "Prof. José Bracho",
  "Prof. Ana Salazar",
  "Prof. Pedro Uzcátegui",
];

/* ================================================================== */
/* Asistencia                                                          */
/* ================================================================== */

export interface AsistenciaPersona {
  id: number;
  name: string;
  /** Sección (estudiantes) o materia (docentes) */
  meta: string;
  /** Días asistidos en el mes */
  present: number;
  /** Días hábiles transcurridos en el mes */
  total: number;
}

export const ASISTENCIA_ESTUDIANTES: AsistenciaPersona[] = [
  { id: 1, name: "María Fernanda Rodríguez", meta: "4.º Año B", present: 21, total: 22 },
  { id: 2, name: "José Gregorio Martínez", meta: "4.º Año B", present: 19, total: 22 },
  { id: 3, name: "Carla Valentina Pérez", meta: "5.º Año A", present: 22, total: 22 },
  { id: 4, name: "Luis Alberto Contreras", meta: "3.º Año C", present: 17, total: 22 },
  { id: 5, name: "Andrea Carolina Suárez", meta: "5.º Año A", present: 20, total: 22 },
  { id: 6, name: "Daniel Eduardo Blanco", meta: "3.º Año C", present: 22, total: 22 },
  { id: 7, name: "Gabriela Alejandra Mora", meta: "4.º Año B", present: 18, total: 22 },
  { id: 8, name: "Ricardo Antonio Salazar", meta: "5.º Año B", present: 21, total: 22 },
];

export const ASISTENCIA_DOCENTES: AsistenciaPersona[] = [
  { id: 1, name: "Marisela Ríos", meta: "Matemática", present: 21, total: 22 },
  { id: 2, name: "Luis Aponte", meta: "Castellano", present: 20, total: 22 },
  { id: 3, name: "Yaneth Bravo", meta: "Biología", present: 22, total: 22 },
  { id: 4, name: "Óscar Medina", meta: "Historia", present: 18, total: 22 },
  { id: 5, name: "Karina Suárez", meta: "Inglés", present: 19, total: 22 },
];

/* ================================================================== */
/* Personas (estudiantes + docentes)                                   */
/* ================================================================== */

export type EstadoDocente = "Activo" | "Suspendido";
export type RepRelacion = "Madre" | "Padre" | "Tutor/a";

export interface Estudiante {
  id: number;
  nombre: string;
  cedula: string;
  grado: string;
  fechaNac: string;
  representante: string;
  repCedula: string;
  repTelefono: string;
  repRelacion: RepRelacion;
  repEmail: string;
}

export interface Docente {
  id: number;
  nombre: string;
  area: string;
  secciones: string;
  estado: EstadoDocente;
}

export const PERSONAS_ESTUDIANTES: Estudiante[] = [
  { id: 1, nombre: "Valeria Contreras", cedula: "V-31.245.678", grado: "3.º Año A", fechaNac: "15 mar 2011", representante: "Josefina Contreras", repCedula: "V-12.345.678", repTelefono: "0414-5551234", repRelacion: "Madre", repEmail: "josefina.contreras@gmail.com" },
  { id: 2, nombre: "Daniel Peña", cedula: "V-32.108.945", grado: "2.º Año B", fechaNac: "3 jun 2012", representante: "Ramón Peña", repCedula: "V-11.987.654", repTelefono: "0424-6667890", repRelacion: "Padre", repEmail: "ramon.pena@gmail.com" },
  { id: 3, nombre: "Isabella Moreno", cedula: "V-30.987.221", grado: "4.º Año C", fechaNac: "22 sep 2010", representante: "Carmen Moreno", repCedula: "V-13.456.789", repTelefono: "0412-3334567", repRelacion: "Madre", repEmail: "carmen.moreno@hotmail.com" },
  { id: 4, nombre: "Carlos Guédez", cedula: "V-29.845.117", grado: "5.º Año A", fechaNac: "8 ene 2009", representante: "Luisa Guédez", repCedula: "V-10.234.567", repTelefono: "0416-7778901", repRelacion: "Madre", repEmail: "luisa.guedez@gmail.com" },
  { id: 5, nombre: "Andrea Villalba", cedula: "V-31.677.402", grado: "5.º Año B", fechaNac: "30 nov 2009", representante: "Óscar Villalba", repCedula: "V-12.876.543", repTelefono: "0426-2223456", repRelacion: "Padre", repEmail: "oscar.villalba@gmail.com" },
  { id: 6, nombre: "Jesús Colmenares", cedula: "V-32.554.890", grado: "4.º Año A", fechaNac: "17 abr 2010", representante: "Yajaira Colmenares", repCedula: "V-14.567.890", repTelefono: "0414-9990123", repRelacion: "Madre", repEmail: "yajaira.colmenares@gmail.com" },
  { id: 7, nombre: "Sofía Marcano", cedula: "V-33.012.456", grado: "1.º Año B", fechaNac: "5 feb 2013", representante: "Elena Marcano", repCedula: "V-15.678.901", repTelefono: "0424-1112345", repRelacion: "Madre", repEmail: "elena.marcano@gmail.com" },
  { id: 8, nombre: "Gustavo Pedraza", cedula: "V-31.890.333", grado: "2.º Año A", fechaNac: "20 ago 2012", representante: "Jorge Pedraza", repCedula: "V-11.223.344", repTelefono: "0412-8889012", repRelacion: "Padre", repEmail: "jorge.pedraza@hotmail.com" },
];

export const PERSONAS_DOCENTES: Docente[] = [
  { id: 1, nombre: "Prof. María Herrera", area: "Ciencias Naturales, Biología", secciones: "4.º B · 5.º A", estado: "Activo" },
  { id: 2, nombre: "Prof. Luis Rondón", area: "Educación Física", secciones: "3.º A · 3.º B · 4.º C", estado: "Activo" },
  { id: 3, nombre: "Prof. Carla Yépez", area: "Castellano, Literatura", secciones: "5.º A · 2.º A", estado: "Activo" },
  { id: 4, nombre: "Prof. José Bracho", area: "Matemática", secciones: "4.º C · 2.º B", estado: "Suspendido" },
  { id: 5, nombre: "Prof. Pedro Uzcátegui", area: "Química, Física", secciones: "5.º B", estado: "Activo" },
];

/** Distribución de estudiantes por sección (serie del donut). El color de cada
 *  segmento lo asigna la página desde sus tokens de tema. */
export interface SeccionDistribucion {
  seccion: string;
  estudiantes: number;
}

export const PERSONAS_POR_SECCION: SeccionDistribucion[] = [
  { seccion: "1.º Año", estudiantes: 132 },
  { seccion: "2.º Año", estudiantes: 128 },
  { seccion: "3.º Año", estudiantes: 124 },
  { seccion: "4.º Año", estudiantes: 118 },
  { seccion: "5.º Año", estudiantes: 110 },
];

/* ================================================================== */
/* Cursos extracurriculares (workflow del coordinador)                 */
/* ================================================================== */

export type CursoStatus =
  | "creado"
  | "solicitado"
  | "en_espera"
  | "en_proceso"
  | "aceptado"
  | "rechazado";

export interface CoordCurso {
  id: number;
  title: string;
  code: string;
  description: string;
  schedule: string;
  fecha: string;
  cupos: number;
  enrolledCount: number;
  profesor: string;
  evaluaciones: string[];
  status: CursoStatus;
  image?: string;
}

export const COORD_CURSOS: CoordCurso[] = [
  {
    id: 1, title: "Robótica y automatización", code: "EXT-ROB",
    description: "Introducción al diseño y construcción de robots simples usando Arduino y Lego Mindstorms.",
    schedule: "Lun / Mié · 14:00–15:30", fecha: "15/01/2026", cupos: 20, enrolledCount: 18,
    profesor: "Prof. Alejandro Morales",
    evaluaciones: ["Proyecto final de robot", "Exposición grupal"],
    status: "aceptado",
    image: "https://picsum.photos/seed/robotics1/400/200",
  },
  {
    id: 2, title: "Oratoria y debate", code: "EXT-ORA",
    description: "Desarrollo de habilidades de comunicación oral, argumentación y técnicas de debate académico.",
    schedule: "Mar / Jue · 15:00–16:00", fecha: "20/01/2026", cupos: 25, enrolledCount: 10,
    profesor: "Lic. Carmen Torres",
    evaluaciones: ["Debate en vivo", "Presentación individual"],
    status: "en_proceso",
    image: "https://picsum.photos/seed/speaking2/400/200",
  },
  {
    id: 3, title: "Ajedrez estratégico", code: "EXT-AJE",
    description: "Fundamentos del ajedrez competitivo: apertura, desarrollo de piezas y finales.",
    schedule: "Vie · 14:00–16:00", fecha: "22/01/2026", cupos: 15, enrolledCount: 12,
    profesor: "Prof. Ramón Díaz",
    evaluaciones: ["Torneo interno", "Análisis de partidas"],
    status: "en_proceso",
    image: "https://picsum.photos/seed/chess3/400/200",
  },
  {
    id: 4, title: "Fotografía digital", code: "EXT-FOT",
    description: "Técnicas de composición fotográfica, manejo de cámara y edición básica en Lightroom.",
    schedule: "Sáb · 09:00–11:00", fecha: "18/01/2026", cupos: 20, enrolledCount: 8,
    profesor: "Ing. Sofía Ruiz",
    evaluaciones: ["Portafolio fotográfico", "Práctica de campo"],
    status: "solicitado",
    image: "https://picsum.photos/seed/camera4/400/200",
  },
  {
    id: 5, title: "Guitarra y ensamble musical", code: "EXT-MUS",
    description: "Técnica guitarrística desde nivel básico hasta ensamble con otros instrumentos.",
    schedule: "Lun / Mié · 16:00–17:00", fecha: "17/01/2026", cupos: 20, enrolledCount: 15,
    profesor: "Prof. Luis Vega",
    evaluaciones: ["Recital final", "Práctica semanal"],
    status: "en_espera",
    image: "https://picsum.photos/seed/guitar5/400/200",
  },
  {
    id: 6, title: "Programación web", code: "EXT-WEB",
    description: "Introducción a HTML, CSS y JavaScript para crear páginas web responsivas.",
    schedule: "Mar / Jue · 14:00–15:30", fecha: "19/01/2026", cupos: 25, enrolledCount: 22,
    profesor: "Prof. Alejandro Morales",
    evaluaciones: ["Proyecto web final", "Evaluación práctica"],
    status: "aceptado",
    image: "https://picsum.photos/seed/coding6/400/200",
  },
  {
    id: 7, title: "Teatro y expresión corporal", code: "EXT-TEA",
    description: "Taller de actuación, improvisación y movimiento escénico para desarrollar la expresividad.",
    schedule: "Mié / Vie · 15:00–16:30", fecha: "21/01/2026", cupos: 18, enrolledCount: 0,
    profesor: "Lic. Patricia Mora",
    evaluaciones: ["Obra de teatro final"],
    status: "creado",
  },
  {
    id: 8, title: "Matemáticas avanzadas", code: "EXT-MAT",
    description: "Cálculo diferencial e integral para estudiantes con vocación científica.",
    schedule: "Lun / Jue · 13:00–14:00", fecha: "23/01/2026", cupos: 20, enrolledCount: 0,
    profesor: "Prof. Miguel Ángel Fuentes",
    evaluaciones: ["Examen teórico", "Resolución de problemas"],
    status: "rechazado",
  },
  {
    id: 9, title: "Idiomas: inglés intermedio", code: "EXT-ING",
    description: "Conversación, gramática B1 y preparación para certificaciones de inglés.",
    schedule: "Lun / Mié / Vie · 07:00–08:00", fecha: "14/01/2026", cupos: 25, enrolledCount: 20,
    profesor: "Lic. Andrea Blanco",
    evaluaciones: ["Speaking test", "Written exam"],
    status: "aceptado",
    image: "https://picsum.photos/seed/english9/400/200",
  },
  {
    id: 10, title: "Pintura y artes plásticas", code: "EXT-PNT",
    description: "Técnicas de pintura al óleo, acuarela y diseño de composición artística.",
    schedule: "Sáb · 08:00–10:00", fecha: "24/01/2026", cupos: 16, enrolledCount: 0,
    profesor: "Prof. Verónica Estrada",
    evaluaciones: ["Exposición de obras"],
    status: "solicitado",
    image: "https://picsum.photos/seed/painting10/400/200",
  },
];

/** Serie del area chart de estudiantes por curso a lo largo del período. */
export interface CursosChartPoint {
  mes: string;
  rob: number;
  web: number;
  ing: number;
  mus: number;
}

export const COORD_CURSOS_CHART: CursosChartPoint[] = [
  { mes: "Feb", rob: 4, web: 7, ing: 10, mus: 5 },
  { mes: "Mar", rob: 8, web: 12, ing: 14, mus: 8 },
  { mes: "Abr", rob: 12, web: 16, ing: 17, mus: 11 },
  { mes: "May", rob: 15, web: 19, ing: 19, mus: 13 },
  { mes: "Jun", rob: 17, web: 21, ing: 20, mus: 14 },
  { mes: "Jul", rob: 18, web: 22, ing: 20, mus: 15 },
];

/** Docentes seleccionables al crear un curso extracurricular. */
export const CURSOS_DOCENTES_OPCIONES: string[] = [
  "Prof. Alejandro Morales",
  "Lic. Carmen Torres",
  "Prof. Ramón Díaz",
  "Ing. Sofía Ruiz",
  "Prof. Luis Vega",
  "Lic. Andrea Blanco",
  "Lic. Patricia Mora",
  "Prof. Miguel Ángel Fuentes",
  "Prof. Verónica Estrada",
];
