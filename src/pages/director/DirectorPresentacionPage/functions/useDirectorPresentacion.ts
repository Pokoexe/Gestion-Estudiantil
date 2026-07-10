import { useEffect, useRef, useState } from "react";
import {
  Monitor,
  Smartphone,
  Eye,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
  ChevronDown,
  X,
  CheckCircle2,
  AlertCircle,
  Type,
  Palette,
  Images,
  Phone as PhoneIcon,
  ListOrdered,
  Building2,
  Users,
  MapPin,
  Sparkles,
  BookOpen,
  CalendarDays,
  GraduationCap,
  UserPlus,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { THEMES } from "@/pages/Auth/LandingPage/functions/themes";
import {
  loadDraft,
  loadPublished,
  saveDraft,
  savePublished,
  clearDraft,
  hasPublished,
} from "@/pages/Auth/LandingPage/functions/storage";
import {
  makeDefaultConfig,
  DEFAULT_TEMPLATE,
  SECTION_META,
  type LandingConfig,
  type ThemeId,
  type Teacher,
  type GalleryImage,
} from "@/pages/Auth/LandingPage/interfaces/types";
import type { Tab, Device, Flash, Confirm } from "../interfaces";

export const TABS: { key: Tab; label: string; icon: typeof Type }[] = [
  { key: "plantillas", label: "Plantillas", icon: Type },
  { key: "docentes", label: "Docentes", icon: Users },
  { key: "galeria", label: "Galería", icon: Images },
  { key: "contacto", label: "Contacto", icon: PhoneIcon },
  { key: "orden", label: "Orden", icon: ListOrdered },
];

export const INPUT =
  "w-full border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.85rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary";

let uid = 0;
export const newId = (p: string) => `${p}${Date.now().toString(36)}${uid++}`;

export function useDirectorPresentacion() {
  const [config, setConfig] = useState<LandingConfig>(
    () => loadDraft() ?? loadPublished() ?? makeDefaultConfig(DEFAULT_TEMPLATE),
  );
  const [tab, setTab] = useState<Tab>("plantillas");
  const [device, setDevice] = useState<Device>("desktop");
  const [fullscreen, setFullscreen] = useState(false);
  const [flash, setFlash] = useState<Flash>(null);
  const [published, setPublished] = useState(hasPublished());
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [galleryDragIdx, setGalleryDragIdx] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const firstRender = useRef(true);

  /* Autoguardado del borrador en cada cambio (omite el montaje inicial). */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    saveDraft(config);
  }, [config]);

  /* Auto-oculta el mensaje flotante. */
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 2600);
    return () => clearTimeout(t);
  }, [flash]);

  const enabledCount = config.sections.filter((s) => s.enabled).length;

  /* ---- Actualizadores ---- */
  const patch = (p: Partial<LandingConfig>) => setConfig((c) => ({ ...c, ...p }));
  const patchHero = (p: Partial<LandingConfig["hero"]>) => setConfig((c) => ({ ...c, hero: { ...c.hero, ...p } }));
  const patchInscripciones = (p: Partial<LandingConfig["inscripciones"]>) => setConfig((c) => ({ ...c, inscripciones: { ...c.inscripciones, ...p } }));
  const patchAbout = (p: Partial<LandingConfig["about"]>) => setConfig((c) => ({ ...c, about: { ...c.about, ...p } }));
  const patchCourses = (p: Partial<LandingConfig["courses"]>) => setConfig((c) => ({ ...c, courses: { ...c.courses, ...p } }));
  const patchActs = (p: Partial<LandingConfig["activities"]>) => setConfig((c) => ({ ...c, activities: { ...c.activities, ...p } }));
  const patchLoc = (p: Partial<LandingConfig["location"]>) => setConfig((c) => ({ ...c, location: { ...c.location, ...p } }));
  const patchTeachers = (p: Partial<Omit<LandingConfig["teachers"], "list">>) => setConfig((c) => ({ ...c, teachers: { ...c.teachers, ...p } }));
  const patchStudents = (p: Partial<LandingConfig["students"]>) => setConfig((c) => ({ ...c, students: { ...c.students, ...p } }));
  const patchExp = (p: Partial<LandingConfig["experience"]>) => setConfig((c) => ({ ...c, experience: { ...c.experience, ...p } }));
  const patchContact = (p: Partial<LandingConfig["contact"]>) => setConfig((c) => ({ ...c, contact: { ...c.contact, ...p } }));
  const patchGallery = (p: Partial<Omit<LandingConfig["gallery"], "images">>) => setConfig((c) => ({ ...c, gallery: { ...c.gallery, ...p } }));

  const setTemplate = (t: ThemeId) =>
    setConfig((c) => ({ ...c, template: t, background: THEMES[t].backgrounds[0].id }));

  /* Ayudantes de secciones */
  const isSectionEnabled = (id: typeof config.sections[number]["id"]) =>
    config.sections.find((s) => s.id === id)?.enabled ?? true;
  const toggleSectionById = (id: typeof config.sections[number]["id"]) => {
    const i = config.sections.findIndex((s) => s.id === id);
    if (i !== -1) toggleSection(i);
  };
  /* "Cifras" agrupa students + experience — se activan/desactivan juntas */
  const cifrasEnabled = isSectionEnabled("students") || isSectionEnabled("experience");
  const toggleCifras = () => {
    const ids = ["students", "experience"] as const;
    const anyOn = ids.some((id) => isSectionEnabled(id));
    setConfig((c) => ({
      ...c,
      sections: c.sections.map((s) =>
        ids.includes(s.id as typeof ids[number]) ? { ...s, enabled: !anyOn } : s
      ),
    }));
  };

  /* Drag-and-drop para el orden de secciones */
  const moveSectionToIndex = (from: number, to: number) =>
    setConfig((c) => {
      const arr = [...c.sections];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { ...c, sections: arr };
    });

  /* Profesores */
  const addTeacher = () =>
    setConfig((c) =>
      c.teachers.list.length >= 12
        ? c
        : { ...c, teachers: { ...c.teachers, list: [...c.teachers.list, { id: newId("t"), name: "Nuevo docente", role: "Materia", photo: `https://i.pravatar.cc/300?img=${(c.teachers.list.length % 70) + 1}` }] } },
    );
  const updateTeacher = (id: string, p: Partial<Teacher>) =>
    setConfig((c) => ({ ...c, teachers: { ...c.teachers, list: c.teachers.list.map((t) => (t.id === id ? { ...t, ...p } : t)) } }));
  const removeTeacher = (id: string) =>
    setConfig((c) => ({ ...c, teachers: { ...c.teachers, list: c.teachers.list.filter((t) => t.id !== id) } }));
  const moveTeacher = (i: number, dir: -1 | 1) =>
    setConfig((c) => {
      const arr = [...c.teachers.list];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return c;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...c, teachers: { ...c.teachers, list: arr } };
    });

  /* Galería */
  const addImage = () =>
    setConfig((c) =>
      c.gallery.images.length >= 12
        ? c
        : { ...c, gallery: { ...c.gallery, images: [...c.gallery.images, { id: newId("g"), url: `https://picsum.photos/seed/foto${uid}/640/480`, caption: "" }] } },
    );
  const updateImage = (id: string, p: Partial<GalleryImage>) =>
    setConfig((c) => ({ ...c, gallery: { ...c.gallery, images: c.gallery.images.map((g) => (g.id === id ? { ...g, ...p } : g)) } }));
  const removeImage = (id: string) =>
    setConfig((c) => ({ ...c, gallery: { ...c.gallery, images: c.gallery.images.filter((g) => g.id !== id) } }));
  const moveImage = (i: number, dir: -1 | 1) =>
    setConfig((c) => {
      const arr = [...c.gallery.images];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return c;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...c, gallery: { ...c.gallery, images: arr } };
    });
  /* Reordenar imágenes por arrastre (mueve el elemento `from` a la posición `to`). */
  const moveImageToIndex = (from: number, to: number) =>
    setConfig((c) => {
      const arr = [...c.gallery.images];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { ...c, gallery: { ...c.gallery, images: arr } };
    });

  /* Orden de secciones */
  const moveSection = (i: number, dir: -1 | 1) =>
    setConfig((c) => {
      const arr = [...c.sections];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return c;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...c, sections: arr };
    });
  const toggleSection = (i: number) =>
    setConfig((c) => {
      const arr = [...c.sections];
      arr[i] = { ...arr[i], enabled: !arr[i].enabled };
      return { ...c, sections: arr };
    });

  /* Acciones globales */
  const publish = () => {
    savePublished(config);
    clearDraft();
    setPublished(true);
    setFullscreen(false);
    setFlash({ tone: "ok", msg: "¡Página publicada! Ya se muestra en el inicio del sistema." });
  };
  const discard = () => {
    const base = loadPublished() ?? makeDefaultConfig(DEFAULT_TEMPLATE);
    setConfig(base);
    clearDraft();
    setFlash({ tone: "ok", msg: "Cambios descartados. Se restauró la última versión publicada." });
  };
  const previewLogin = () => setFlash({ tone: "ok", msg: "En la página real, este botón lleva al inicio de sesión." });
  const previewEnroll = () => setFlash({ tone: "ok", msg: "En la página real, este botón lleva al formulario de inscripción." });

  return {
    config,
    tab,
    setTab,
    device,
    setDevice,
    fullscreen,
    setFullscreen,
    flash,
    setFlash,
    published,
    dragIdx,
    setDragIdx,
    galleryDragIdx,
    setGalleryDragIdx,
    confirm,
    setConfirm,
    optionsOpen,
    setOptionsOpen,
    enabledCount,
    patch,
    patchHero,
    patchInscripciones,
    patchAbout,
    patchCourses,
    patchActs,
    patchLoc,
    patchTeachers,
    patchStudents,
    patchExp,
    patchContact,
    patchGallery,
    setTemplate,
    isSectionEnabled,
    toggleSectionById,
    cifrasEnabled,
    toggleCifras,
    moveSectionToIndex,
    moveSection,
    toggleSection,
    addTeacher,
    updateTeacher,
    removeTeacher,
    moveTeacher,
    addImage,
    updateImage,
    removeImage,
    moveImage,
    moveImageToIndex,
    publish,
    discard,
    previewLogin,
    previewEnroll,
    TABS,
    INPUT,
  };
}
