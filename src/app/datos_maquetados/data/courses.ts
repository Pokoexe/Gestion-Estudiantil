/**
 * Catálogo de cursos extracurriculares — fuente única compartida por el
 * listado (CoursesActivitiesPage) y el detalle (CourseDetailPage) para que
 * los ids coincidan en ambas vistas.
 */

export type EvaluationType = "presentation" | "exam" | "lab" | "essay";
export type EvaluationStatus = "pending" | "submitted" | "graded";
/** Inscripción del estudiante: activo (en curso) o participado (finalizado). */
export type EnrollmentStatus = "active" | "participated";

export interface CourseEvaluation {
    id: number;
    title: string;
    type: EvaluationType;
    dueDate: string;
    weight: string;
    status: EvaluationStatus;
    grade?: string;
    description?: string;
}

export interface ExtraCourse {
    id: number;
    title: string;
    teacher: string;
    date: string; // fecha de inicio
    description: string;
    image: string;
    code: string;
    schedule: string;
    room: string;
    term: string;
    topic: string;
    price: number; // USD
    totalSpots: number;
    enrolledCount: number;
    /** Definido solo si el estudiante está inscrito o ya participó. */
    enrollment?: EnrollmentStatus;
    evaluations: CourseEvaluation[];
}

export const EXTRA_COURSES: ExtraCourse[] = [
    {
        id: 1,
        title: "Robótica y automatización",
        teacher: "Prof. Daniel Ríos",
        date: "8 jul 2026",
        topic: "robotica",
        price: 25,
        totalSpots: 20,
        enrolledCount: 18,
        description:
            "Diseña y programa robots con sensores y motores. Aprende los fundamentos de la automatización mediante proyectos prácticos por equipos.",
        image: "https://picsum.photos/seed/robotica/640/360",
        code: "EXT-ROB",
        schedule: "Lun / Mié · 14:00 – 15:30",
        room: "Lab de Tecnología",
        term: "2026-I",
        enrollment: "active",
        evaluations: [
            { id: 1, title: "Montaje del primer robot", type: "lab", dueDate: "15 jul 2026", weight: "30%", status: "graded", grade: "18", description: "Ensamblaje y prueba del kit básico de robótica." },
            { id: 2, title: "Programación de rutinas", type: "exam", dueDate: "29 jul 2026", weight: "35%", status: "pending" },
            { id: 3, title: "Proyecto final por equipos", type: "presentation", dueDate: "12 ago 2026", weight: "35%", status: "pending", description: "Presentación de un robot que resuelva un problema real." },
        ],
    },
    {
        id: 2,
        title: "Oratoria y debate",
        teacher: "Prof. Lucía Fernández",
        date: "9 jul 2026",
        topic: "comunicacion",
        price: 15,
        totalSpots: 25,
        enrolledCount: 10,
        description:
            "Desarrolla habilidades de comunicación, argumentación y expresión en público a través de debates y ejercicios de improvisación.",
        image: "https://picsum.photos/seed/oratoria/640/360",
        code: "EXT-ORA",
        schedule: "Mar / Jue · 15:00 – 16:00",
        room: "Auditorio",
        term: "2026-I",
        evaluations: [
            { id: 1, title: "Discurso individual", type: "presentation", dueDate: "23 jul 2026", weight: "40%", status: "graded", grade: "17" },
            { id: 2, title: "Debate por equipos", type: "presentation", dueDate: "6 ago 2026", weight: "40%", status: "pending" },
            { id: 3, title: "Ensayo argumentativo", type: "essay", dueDate: "13 ago 2026", weight: "20%", status: "pending" },
        ],
    },
    {
        id: 3,
        title: "Ajedrez estratégico",
        teacher: "Prof. Marco Salcedo",
        date: "7 jul 2026",
        topic: "juegos",
        price: 10,
        totalSpots: 15,
        enrolledCount: 12,
        description:
            "Aprende aperturas, tácticas y finales. Mejora tu pensamiento estratégico participando en torneos internos.",
        image: "https://picsum.photos/seed/ajedrez/640/360",
        code: "EXT-AJE",
        schedule: "Vie · 14:00 – 16:00",
        room: "Sala de usos múltiples",
        term: "2026-I",
        enrollment: "participated",
        evaluations: [
            { id: 1, title: "Examen de aperturas", type: "exam", dueDate: "18 jul 2026", weight: "30%", status: "graded", grade: "15" },
            { id: 2, title: "Torneo interno", type: "presentation", dueDate: "1 ago 2026", weight: "70%", status: "pending" },
        ],
    },
    {
        id: 4,
        title: "Fotografía digital",
        teacher: "Prof. Andrea Gómez",
        date: "10 jul 2026",
        topic: "arte",
        price: 20,
        totalSpots: 20,
        enrolledCount: 8,
        description:
            "Domina la composición, la luz y la edición. Construye un portafolio fotográfico con salidas de campo guiadas.",
        image: "https://picsum.photos/seed/fotografia/640/360",
        code: "EXT-FOT",
        schedule: "Sáb · 09:00 – 11:00",
        room: "Aula 305",
        term: "2026-I",
        evaluations: [
            { id: 1, title: "Ejercicio de composición", type: "lab", dueDate: "24 jul 2026", weight: "30%", status: "graded", grade: "16" },
            { id: 2, title: "Portafolio temático", type: "essay", dueDate: "14 ago 2026", weight: "40%", status: "pending" },
            { id: 3, title: "Exposición final", type: "presentation", dueDate: "21 ago 2026", weight: "30%", status: "pending" },
        ],
    },
    {
        id: 5,
        title: "Guitarra y ensamble musical",
        teacher: "Prof. Sofía Herrera",
        date: "8 jul 2026",
        topic: "musica",
        price: 20,
        totalSpots: 20,
        enrolledCount: 15,
        description:
            "Desde los primeros acordes hasta tocar en conjunto. Un curso práctico para iniciarte en la guitarra y la música de ensamble.",
        image: "https://picsum.photos/seed/guitarra/640/360",
        code: "EXT-MUS",
        schedule: "Lun / Mié · 16:00 – 17:00",
        room: "Sala de música",
        term: "2026-I",
        evaluations: [
            { id: 1, title: "Evaluación de acordes básicos", type: "exam", dueDate: "22 jul 2026", weight: "40%", status: "pending" },
            { id: 2, title: "Presentación de ensamble", type: "presentation", dueDate: "19 ago 2026", weight: "60%", status: "pending" },
        ],
    },
    {
        id: 6,
        title: "Programación web",
        teacher: "Prof. Javier Núñez",
        date: "9 jul 2026",
        topic: "programacion",
        price: 25,
        totalSpots: 25,
        enrolledCount: 22,
        description:
            "Crea tus primeras páginas web con HTML, CSS y JavaScript. Publica un proyecto propio al finalizar el curso.",
        image: "https://picsum.photos/seed/programacion/640/360",
        code: "EXT-WEB",
        schedule: "Mar / Jue · 14:00 – 15:30",
        room: "Lab de Informática",
        term: "2026-I",
        enrollment: "active",
        evaluations: [
            { id: 1, title: "Maquetación con HTML y CSS", type: "lab", dueDate: "23 jul 2026", weight: "30%", status: "graded", grade: "19" },
            { id: 2, title: "Examen de JavaScript", type: "exam", dueDate: "6 ago 2026", weight: "30%", status: "pending" },
            { id: 3, title: "Proyecto web personal", type: "presentation", dueDate: "20 ago 2026", weight: "40%", status: "pending", description: "Publica un sitio web funcional sobre un tema de tu interés." },
        ],
    },
    {
        id: 7,
        title: "Teatro y expresión escénica",
        teacher: "Prof. Camila Ortiz",
        date: "11 jul 2026",
        topic: "arte",
        price: 15,
        totalSpots: 30,
        enrolledCount: 12,
        description:
            "Explora la actuación, la voz y el movimiento. Cierra el curso con una obra montada por todo el grupo.",
        image: "https://picsum.photos/seed/teatro/640/360",
        code: "EXT-TEA",
        schedule: "Vie · 15:00 – 17:00",
        room: "Auditorio",
        term: "2026-I",
        evaluations: [
            { id: 1, title: "Ejercicios de improvisación", type: "presentation", dueDate: "25 jul 2026", weight: "30%", status: "pending" },
            { id: 2, title: "Obra final", type: "presentation", dueDate: "22 ago 2026", weight: "70%", status: "pending" },
        ],
    },
    {
        id: 8,
        title: "Ecología y huerto escolar",
        teacher: "Prof. Roberto Díaz",
        date: "7 jul 2026",
        topic: "ecologia",
        price: 12,
        totalSpots: 20,
        enrolledCount: 16,
        description:
            "Aprende sobre sostenibilidad cultivando un huerto. Un curso vivencial sobre el cuidado del ambiente.",
        image: "https://picsum.photos/seed/ecologia/640/360",
        code: "EXT-ECO",
        schedule: "Mié · 14:00 – 15:30",
        room: "Huerto escolar",
        term: "2026-I",
        enrollment: "participated",
        evaluations: [
            { id: 1, title: "Bitácora del huerto", type: "essay", dueDate: "30 jul 2026", weight: "40%", status: "graded", grade: "18" },
            { id: 2, title: "Proyecto de compostaje", type: "lab", dueDate: "13 ago 2026", weight: "60%", status: "pending" },
        ],
    },
    {
        id: 9,
        title: "Baloncesto",
        teacher: "Prof. Nieves Cabrera",
        date: "8 jul 2026",
        topic: "deportes",
        price: 10,
        totalSpots: 25,
        enrolledCount: 10,
        description:
            "Fundamentos técnicos, táctica de equipo y acondicionamiento físico, con partidos amistosos cada semana.",
        image: "https://picsum.photos/seed/baloncesto/640/360",
        code: "EXT-BAL",
        schedule: "Lun / Vie · 16:00 – 17:30",
        room: "Cancha techada",
        term: "2026-I",
        evaluations: [
            { id: 1, title: "Prueba de fundamentos", type: "exam", dueDate: "24 jul 2026", weight: "50%", status: "pending" },
            { id: 2, title: "Torneo interno", type: "presentation", dueDate: "18 ago 2026", weight: "50%", status: "pending" },
        ],
    },
    {
        id: 10,
        title: "Cocina y nutrición",
        teacher: "Prof. Carmen Vargas",
        date: "10 jul 2026",
        topic: "cocina",
        price: 18,
        totalSpots: 20,
        enrolledCount: 7,
        description:
            "Aprende a preparar recetas saludables y equilibradas. Descubre técnicas culinarias básicas con ingredientes naturales y de temporada.",
        image: "https://picsum.photos/seed/cocina/640/360",
        code: "EXT-COC",
        schedule: "Sáb · 09:00 – 11:00",
        room: "Aula de cocina",
        term: "2026-I",
        enrollment: "active",
        evaluations: [
            { id: 1, title: "Receta práctica individual", type: "lab", dueDate: "24 jul 2026", weight: "50%", status: "pending" },
            { id: 2, title: "Menú temático grupal", type: "presentation", dueDate: "14 ago 2026", weight: "50%", status: "pending" },
        ],
    },
];

export const getCourseById = (id: string | number | undefined): ExtraCourse | undefined =>
    EXTRA_COURSES.find((c) => String(c.id) === String(id));
