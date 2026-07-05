/**
 * Modelo de datos de la landing page pública personalizable.
 *
 * Un docente arma la página escogiendo una de las 2 plantillas (tema) y
 * ajustando su contenido, galería, contacto y el ORDEN de las secciones.
 * La configuración se serializa a JSON y se guarda en una cookie:
 *   - cookie "publicada"  → la que se muestra en la raíz "/" del sistema.
 *   - cookie "borrador"   → autoguardado mientras se edita (no se usa en "/").
 *
 * Regla de negocio: máximo 8 "temas de información" visibles a la vez para
 * evitar sobrecarga (hay 9 secciones disponibles).
 */

import type { LucideIcon } from "lucide-react";
import {
  Info,
  BookOpen,
  CalendarDays,
  MapPin,
  Images,
  Users,
  GraduationCap,
  Award,
  Phone,
} from "lucide-react";

/** Las 2 plantillas base. */
export type ThemeId = "tecnologico" | "espacial";

/** Identificadores de las 9 secciones ("temas de información"). */
export type SectionId =
  | "about"
  | "courses"
  | "activities"
  | "location"
  | "gallery"
  | "teachers"
  | "students"
  | "experience"
  | "contact";

/** Máximo de secciones visibles simultáneamente. */
export const MAX_ENABLED_SECTIONS = 8;

export interface Teacher {
  id: string;
  name: string;
  role: string;
  photo: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

/** Entrada de la lista ordenable de secciones. */
export interface SectionEntry {
  id: SectionId;
  enabled: boolean;
}

export interface LandingConfig {
  /** Plantilla / tema visual activo. */
  template: ThemeId;
  /** Variante de fondo dentro del tema (ver themes.tsx). */
  background: string;

  /** Marca mostrada en el header y footer. */
  institutionName: string;
  tagline: string;

  hero: { badge: string; title: string; subtitle: string; ctaText: string };
  about: { heading: string; body: string };
  courses: { heading: string; subtitle: string };
  activities: { heading: string; subtitle: string };
  location: { heading: string; address: string; city: string; hours: string };
  gallery: { heading: string; images: GalleryImage[] };
  teachers: { heading: string; subtitle: string; list: Teacher[] };
  students: { number: number; label: string };
  experience: { number: number; label: string };
  contact: {
    heading: string;
    subtitle: string;
    whatsapp: string;
    phone: string;
    email: string;
  };

  /** Orden + visibilidad de las 9 secciones. */
  sections: SectionEntry[];

  /** Visibilidad del hero y la marca en la landing. */
  showHero?: boolean;
  showBrand?: boolean;
}

/** Metadatos de cada sección para la UI del editor y el nav del header. */
export const SECTION_META: Record<
  SectionId,
  { label: string; description: string; icon: LucideIcon; navLabel?: string }
> = {
  about: { label: "Sobre la institución", description: "Texto de presentación del colegio.", icon: Info, navLabel: "Nosotros" },
  courses: { label: "Cursos y talleres", description: "Muestra los cursos activos del sistema.", icon: BookOpen, navLabel: "Cursos" },
  activities: { label: "Actividades y eventos", description: "Actividades destacadas de la institución.", icon: CalendarDays, navLabel: "Actividades" },
  location: { label: "Ubicación", description: "Dirección y horario de atención.", icon: MapPin, navLabel: "Ubicación" },
  gallery: { label: "Galería de imágenes", description: "Fotos de la institución.", icon: Images, navLabel: "Galería" },
  teachers: { label: "Profesores", description: "Docentes trabajando en la institución.", icon: Users, navLabel: "Docentes" },
  students: { label: "Cantidad de alumnos", description: "Cifra de estudiantes en el sistema.", icon: GraduationCap },
  experience: { label: "Años de experiencia", description: "Trayectoria de la institución.", icon: Award },
  contact: { label: "Teléfonos de contacto", description: "WhatsApp y teléfono fijo.", icon: Phone, navLabel: "Contacto" },
};

/** Orden canónico de las secciones (usado como referencia). */
export const SECTION_ORDER: SectionId[] = [
  "about",
  "students",
  "experience",
  "courses",
  "teachers",
  "activities",
  "gallery",
  "location",
  "contact",
];

const DEFAULT_TEACHERS: Teacher[] = [
  { id: "t1", name: "Prof. Alejandro Morales", role: "Ciencias Naturales", photo: "https://i.pravatar.cc/300?img=12" },
  { id: "t2", name: "Lic. Marta Sánchez", role: "Coordinación Académica", photo: "https://i.pravatar.cc/300?img=45" },
  { id: "t3", name: "Prof. Lucía Fernández", role: "Oratoria y Debate", photo: "https://i.pravatar.cc/300?img=32" },
  { id: "t4", name: "Prof. Javier Núñez", role: "Programación Web", photo: "https://i.pravatar.cc/300?img=15" },
];

const DEFAULT_GALLERY: GalleryImage[] = [
  { id: "g1", url: "https://picsum.photos/seed/campus1/640/480", caption: "Nuestro campus" },
  { id: "g2", url: "https://picsum.photos/seed/lab2/640/480", caption: "Laboratorio de tecnología" },
  { id: "g3", url: "https://picsum.photos/seed/biblio3/640/480", caption: "Biblioteca" },
  { id: "g4", url: "https://picsum.photos/seed/deporte4/640/480", caption: "Áreas deportivas" },
  { id: "g5", url: "https://picsum.photos/seed/aula5/640/480", caption: "Aulas equipadas" },
  { id: "g6", url: "https://picsum.photos/seed/evento6/640/480", caption: "Eventos institucionales" },
];

/** Orden y visibilidad por defecto: 8 secciones activas (ubicación oculta). */
const DEFAULT_SECTIONS: SectionEntry[] = [
  { id: "about", enabled: true },
  { id: "students", enabled: true },
  { id: "experience", enabled: true },
  { id: "courses", enabled: true },
  { id: "teachers", enabled: true },
  { id: "activities", enabled: true },
  { id: "gallery", enabled: true },
  { id: "location", enabled: false },
  { id: "contact", enabled: true },
];

/** Textos del hero que cambian según la plantilla. */
const HERO_BY_TEMPLATE: Record<ThemeId, LandingConfig["hero"]> = {
  tecnologico: {
    badge: "Educación con tecnología",
    title: "Formamos a los innovadores del mañana",
    subtitle:
      "Robótica, programación y ciencia aplicada en un entorno diseñado para despertar la curiosidad y el pensamiento crítico.",
    ctaText: "Conoce más",
  },
  espacial: {
    badge: "Un universo por descubrir",
    title: "Un universo de posibilidades para aprender",
    subtitle:
      "Impulsamos a cada estudiante a explorar, cuestionar y alcanzar nuevas galaxias del conocimiento con acompañamiento cercano.",
    ctaText: "Explorar",
  },
};

/** Construye una configuración por defecto para la plantilla indicada. */
export function makeDefaultConfig(template: ThemeId): LandingConfig {
  return {
    template,
    background: template === "tecnologico" ? "circuitos" : "estrellado",
    institutionName: "U.E. Colegio EduGestión",
    tagline: "Excelencia académica desde 2001",
    hero: HERO_BY_TEMPLATE[template],
    about: {
      heading: "Sobre nuestra institución",
      body: "Somos una comunidad educativa comprometida con la formación integral de nuestros estudiantes. Combinamos rigor académico, valores humanos y herramientas modernas para preparar a los jóvenes ante los retos del futuro.",
    },
    courses: {
      heading: "Cursos y talleres",
      subtitle: "Una oferta extracurricular que complementa la formación académica.",
    },
    activities: {
      heading: "Actividades y eventos",
      subtitle: "Vivimos el aprendizaje más allá del aula.",
    },
    location: {
      heading: "¿Dónde estamos?",
      address: "Av. Principal, Sector Central, Edificio Escolar",
      city: "Caracas, Venezuela",
      hours: "Lunes a Viernes · 7:00 AM – 3:00 PM",
    },
    gallery: {
      heading: "Galería",
      images: DEFAULT_GALLERY,
    },
    teachers: {
      heading: "Nuestros docentes",
      subtitle: "Un equipo humano que hace la diferencia.",
      list: DEFAULT_TEACHERS,
    },
    students: { number: 480, label: "Alumnos en el sistema" },
    experience: { number: 25, label: "Años de experiencia" },
    contact: {
      heading: "Contáctanos",
      subtitle: "Estamos para atenderte. Escríbenos o llámanos.",
      whatsapp: "+58 412-000-0000",
      phone: "+58 212-000-0000",
      email: "contacto@edugestion.edu",
    },
    sections: DEFAULT_SECTIONS,
    showHero: true,
    showBrand: true,
  };
}

/** Plantilla por defecto que verá la raíz si no existe cookie publicada. */
export const DEFAULT_TEMPLATE: ThemeId = "tecnologico";
