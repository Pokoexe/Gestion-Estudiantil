/**
 * Editor de la landing page pública (rol Director).
 *
 * Se abre a pantalla completa (AppLayout oculta la barra lateral, igual que
 * la vista de Mensajes). Estilo "personalizador de WordPress":
 *   - Izquierda: opciones en pestañas (Contenido · Galería · Contacto · Orden).
 *   - Derecha: previsualización en vivo (escritorio / móvil).
 *   - Botón "Vista previa" a pantalla completa antes de publicar.
 *
 * Persistencia:
 *   - Mientras se edita se AUTOGUARDA en la cookie borrador (no afecta la raíz).
 *   - "Guardar y publicar" escribe la cookie publicada que se muestra en "/".
 */

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
import { LandingView } from "../landing/LandingView";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { THEMES } from "../landing/themes";
import {
  loadDraft,
  loadPublished,
  saveDraft,
  savePublished,
  clearDraft,
  hasPublished,
} from "../landing/storage";
import {
  makeDefaultConfig,
  DEFAULT_TEMPLATE,
  SECTION_META,
  type LandingConfig,
  type ThemeId,
  type Teacher,
  type GalleryImage,
} from "../landing/types";

type Tab = "plantillas" | "docentes" | "galeria" | "contacto" | "orden";
type Device = "desktop" | "mobile";
type Flash = { tone: "ok" | "warn"; msg: string } | null;
type Confirm = { title: string; tone?: "success" | "danger" | "warning"; icon?: React.FC<{ className?: string }>; confirmLabel?: string; onConfirm: () => void } | null;

const TABS: { key: Tab; label: string; icon: typeof Type }[] = [
  { key: "plantillas", label: "Plantillas", icon: Type },
  { key: "docentes", label: "Docentes", icon: Users },
  { key: "galeria", label: "Galería", icon: Images },
  { key: "contacto", label: "Contacto", icon: PhoneIcon },
  { key: "orden", label: "Orden", icon: ListOrdered },
];

const INPUT =
  "w-full border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.85rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary";

let uid = 0;
const newId = (p: string) => `${p}${Date.now().toString(36)}${uid++}`;

export function DirectorPresentacionPage() {
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

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      {/* ── Editor: preview (izq 2fr) + opciones (der 1.5fr) ── */}
      <div className="relative flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
        {/* Backdrop móvil para cerrar el panel de opciones */}
        <div
          className={`absolute inset-0 z-20 bg-black/40 transition-opacity duration-300 lg:hidden ${optionsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setOptionsOpen(false)}
        />

        {/* Panel de previsualización — 2fr (izquierda) */}
        <div className="relative flex flex-[2] flex-col overflow-hidden border-r border-edu-border bg-[#0e1424]" style={{ height: "calc(100vh - 60px)" }}>
          {/* Botón flotante de opciones (solo móvil) */}
          <button
            onClick={() => setOptionsOpen(true)}
            aria-label="Abrir opciones de presentación"
            className={`fixed bottom-4 right-4 z-[49] w-9 h-9 rounded-full border-[1.5px] border-edu-border bg-edu-subtle cursor-pointer flex items-center justify-center text-edu-ink-500 shrink-0 shadow-md transition-opacity duration-200 lg:hidden ${optionsOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 overflow-y-auto lp-noscrollbar bg-[#0b1020] p-3 isolate">
            <PreviewSurface device={device}>
              <LandingView config={config} onLogin={previewLogin} onEnroll={previewEnroll} />
            </PreviewSurface>
          </div>
        </div>

        {/* Panel de opciones — 1.5fr (derecha) */}
        <div className={`absolute inset-y-0 right-0 z-30 flex w-[88vw] max-w-[420px] flex-col overflow-hidden bg-edu-surface transition-transform duration-300 ${optionsOpen ? "translate-x-0" : "translate-x-full"} lg:relative lg:inset-auto lg:z-auto lg:max-w-none lg:translate-x-0 lg:flex-[1.5] lg:w-auto`}>
          {/* ── Header ── */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-edu-border bg-edu-surface px-4 py-2">
            <div className="flex items-center gap-2.5">
              <DeviceToggle device={device} onChange={setDevice} />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirm({ title: "Descartar cambios", tone: "danger", icon: RotateCcw, confirmLabel: "Descartar", onConfirm: discard })}
                className="inline-flex items-center gap-1.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface px-3 py-1.5 text-[0.8rem] font-semibold text-edu-ink-700 cursor-pointer transition-colors hover:bg-edu-subtle"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Descartar
              </button>
              <button
                onClick={() => setFullscreen(true)}
                className="inline-flex items-center gap-1.5 rounded-edu-control border-[1.5px] border-edu-primary-200 bg-edu-primary-50 px-3 py-1.5 text-[0.8rem] font-semibold text-edu-primary cursor-pointer transition-colors hover:bg-edu-primary-100"
              >
                <Eye className="h-3.5 w-3.5" />
                Vista previa
              </button>
              <button
                onClick={() => setConfirm({ title: "Guardar y publicar", tone: "success", icon: Save, confirmLabel: "Publicar", onConfirm: publish })}
                className="inline-flex items-center gap-1.5 rounded-edu-control border-none bg-edu-primary px-3.5 py-1.5 text-[0.8rem] font-semibold text-white cursor-pointer transition-colors hover:bg-edu-primary-hover"
              >
                <Save className="h-3.5 w-3.5" />
                Guardar y publicar
              </button>
            </div>
          </div>


          {/* Pestañas */}
          <div className="flex shrink-0 border-b border-edu-border-soft px-2 pt-2">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 -mb-px px-2 py-2.5 text-[0.8rem] font-semibold cursor-pointer transition-colors ${active ? "border-edu-primary text-edu-primary" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden @sm:inline sm:inline">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Plantillas scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            {tab === "plantillas" && (
              <div className="flex flex-col gap-3">
                {/* Plantilla */}
                <Group title="Plantilla y fondo" icon={Palette} defaultOpen>
                  <label className="text-[0.75rem] font-semibold text-edu-ink-500">Plantilla base</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(Object.values(THEMES)).map((th) => {
                      const Icon = th.icon;
                      const active = config.template === th.id;
                      return (
                        <button
                          key={th.id}
                          onClick={() => setTemplate(th.id)}
                          className={`flex flex-col items-start gap-2 rounded-edu-control border-[1.5px] p-3 text-left cursor-pointer transition-all ${active ? "border-edu-primary bg-edu-primary-50" : "border-edu-border bg-edu-surface hover:border-edu-primary-200"
                            }`}
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-edu-chip" style={{ backgroundImage: th.ctaGradient }}>
                            <Icon className="h-4 w-4 text-white" />
                          </span>
                          <span className="text-[0.82rem] font-bold text-edu-ink">{th.name}</span>
                          <span className="text-[0.68rem] leading-tight text-edu-ink-400">{th.tagline}</span>
                        </button>
                      );
                    })}
                  </div>
                  <label className="mt-1 text-[0.75rem] font-semibold text-edu-ink-500">Fondo</label>
                  <div className="flex flex-wrap gap-1.5">
                    {THEMES[config.template].backgrounds.map((bg) => {
                      const active = config.background === bg.id;
                      return (
                        <button
                          key={bg.id}
                          onClick={() => patch({ background: bg.id })}
                          className={`rounded-edu-pill border-[1.5px] px-3 py-1.5 text-[0.76rem] font-medium cursor-pointer transition-colors ${active ? "border-edu-primary bg-edu-primary-50 text-edu-primary" : "border-edu-border bg-edu-surface text-edu-ink-600 hover:bg-edu-subtle"
                            }`}
                        >
                          {bg.label}
                        </button>
                      );
                    })}
                  </div>
                </Group>
              </div>
            )}

            {tab === "docentes" && (
              <div className="flex flex-col gap-3">
                <TextField label="Título de la sección" value={config.teachers.heading} onChange={(v) => patchTeachers({ heading: v })} />
                <TextField label="Subtítulo" value={config.teachers.subtitle} onChange={(v) => patchTeachers({ subtitle: v })} />
                <div className="flex items-center justify-between">
                  <span className="text-[0.75rem] font-semibold text-edu-ink-500">Docentes ({config.teachers.list.length}/12)</span>
                  <span className="text-[0.68rem] text-edu-ink-400">Se ven de 4 en 4</span>
                </div>
                <div className="flex flex-col gap-2">
                  {config.teachers.list.map((t, i) => (
                    <div key={t.id} className="flex gap-2 rounded-edu-control border border-edu-border-soft bg-edu-subtle p-2">
                      <img src={t.photo} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover border border-edu-border" />
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <input className={INPUT} value={t.name} onChange={(e) => updateTeacher(t.id, { name: e.target.value })} placeholder="Nombre del docente" />
                        <input className={INPUT} value={t.role} onChange={(e) => updateTeacher(t.id, { role: e.target.value })} placeholder="Materia o cargo" />
                        <input className={INPUT} value={t.photo} onChange={(e) => updateTeacher(t.id, { photo: e.target.value })} placeholder="URL de la foto" />
                      </div>
                      <div className="flex shrink-0 flex-col gap-1">
                        <IconBtn onClick={() => moveTeacher(i, -1)} disabled={i === 0} label="Subir"><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn onClick={() => moveTeacher(i, 1)} disabled={i === config.teachers.list.length - 1} label="Bajar"><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn onClick={() => removeTeacher(t.id)} label="Eliminar" danger><Trash2 className="h-3.5 w-3.5" /></IconBtn>
                      </div>
                    </div>
                  ))}
                  <AddButton disabled={config.teachers.list.length >= 12} onClick={addTeacher} label={config.teachers.list.length >= 12 ? "Máximo 12 docentes" : "Agregar docente"} />
                </div>
              </div>
            )}

            {tab === "galeria" && (
              <div className="flex flex-col gap-3">
                <TextField label="Título de la galería" value={config.gallery.heading} onChange={(v) => patchGallery({ heading: v })} />
                <div className="flex items-center justify-between">
                  <span className="text-[0.75rem] font-semibold text-edu-ink-500">Imágenes ({config.gallery.images.length}/12)</span>
                  <span className="text-[0.68rem] text-edu-ink-400">Arrastra para reordenar · se ven de 6 en 6</span>
                </div>
                <div className="flex flex-col gap-2">
                  {config.gallery.images.map((img, i) => {
                    const isDragging = galleryDragIdx === i;
                    return (
                    <div
                      key={img.id}
                      onDragEnter={() => {
                        if (galleryDragIdx !== null && galleryDragIdx !== i) {
                          moveImageToIndex(galleryDragIdx, i);
                          setGalleryDragIdx(i);
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnd={() => setGalleryDragIdx(null)}
                      className={`flex gap-2 rounded-edu-control border p-2 transition-colors ${isDragging ? "border-edu-primary-200 bg-edu-primary-50 opacity-50" : "border-edu-border-soft bg-edu-subtle"}`}
                    >
                      <button
                        type="button"
                        draggable
                        onDragStart={(e) => { e.dataTransfer.setDragImage(e.currentTarget, 10, 10); setGalleryDragIdx(i); }}
                        onDragEnd={() => setGalleryDragIdx(null)}
                        aria-label="Arrastrar para reordenar"
                        title="Arrastrar para reordenar"
                        className="flex w-5 shrink-0 cursor-grab items-center justify-center border-none bg-transparent text-edu-ink-300 hover:text-edu-ink-500 active:cursor-grabbing"
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>
                      <img src={img.url} alt="" draggable={false} className="h-16 w-16 shrink-0 rounded-edu-chip object-cover border border-edu-border" />
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <input className={INPUT} value={img.url} onChange={(e) => updateImage(img.id, { url: e.target.value })} placeholder="URL de la imagen" />
                        <input className={INPUT} value={img.caption} onChange={(e) => updateImage(img.id, { caption: e.target.value })} placeholder="Descripción (opcional)" />
                      </div>
                      <div className="flex shrink-0 flex-col gap-1">
                        <IconBtn onClick={() => moveImage(i, -1)} disabled={i === 0} label="Subir"><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn onClick={() => moveImage(i, 1)} disabled={i === config.gallery.images.length - 1} label="Bajar"><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn onClick={() => removeImage(img.id)} label="Eliminar" danger><Trash2 className="h-3.5 w-3.5" /></IconBtn>
                      </div>
                    </div>
                    );
                  })}
                  <AddButton disabled={config.gallery.images.length >= 12} onClick={addImage} label={config.gallery.images.length >= 12 ? "Máximo 12 imágenes" : "Agregar imagen"} />
                </div>
              </div>
            )}

            {tab === "contacto" && (
              <div className="flex flex-col gap-3">
                <Group title="Encabezado" icon={Type} defaultOpen>
                  <TextField label="Título" value={config.contact.heading} onChange={(v) => patchContact({ heading: v })} />
                  <TextField label="Subtítulo" value={config.contact.subtitle} onChange={(v) => patchContact({ subtitle: v })} />
                </Group>
                <Group title="Datos de contacto" icon={PhoneIcon} defaultOpen>
                  <TextField label="WhatsApp" value={config.contact.whatsapp} onChange={(v) => patchContact({ whatsapp: v })} placeholder="+58 412-000-0000" />
                  <TextField label="Teléfono fijo" value={config.contact.phone} onChange={(v) => patchContact({ phone: v })} placeholder="+58 212-000-0000" />
                  <TextField label="Correo electrónico" value={config.contact.email} onChange={(v) => patchContact({ email: v })} placeholder="contacto@colegio.edu" />
                </Group>
              </div>
            )}

            {tab === "orden" && (
              <div className="flex flex-col gap-3">
                <div className="rounded-edu-control border border-edu-border-soft bg-edu-subtle p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.8rem] font-semibold text-edu-ink">Secciones visibles</span>
                    <span className="rounded-edu-pill bg-edu-primary-50 px-2.5 py-0.5 text-[0.72rem] font-bold text-edu-primary">
                      {enabledCount}/{config.sections.length}
                    </span>
                  </div>
                  <p className="m-0 mt-1 text-[0.72rem] text-edu-ink-400">Activa las secciones que desees. Arrastra o usa las flechas para reordenar.</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  {config.sections.map((s, i) => {
                    const meta = SECTION_META[s.id];
                    const Icon = meta.icon;
                    const isDragging = dragIdx === i;
                    return (
                      <div
                        key={s.id}
                        onDragEnter={() => {
                          if (dragIdx !== null && dragIdx !== i) {
                            moveSectionToIndex(dragIdx, i);
                            setDragIdx(i);
                          }
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnd={() => setDragIdx(null)}
                        className={`flex items-center gap-2 rounded-edu-control border p-2 pl-2.5 transition-colors select-none ${isDragging
                          ? "border-edu-primary-200 bg-edu-primary-50 opacity-50"
                          : s.enabled
                            ? "border-edu-border bg-edu-surface hover:border-edu-primary-200"
                            : "border-edu-border-soft bg-edu-subtle opacity-70"
                          }`}
                      >
                        <button
                          type="button"
                          draggable
                          onDragStart={(e) => { e.dataTransfer.setDragImage(e.currentTarget, 10, 10); setDragIdx(i); }}
                          onDragEnd={() => setDragIdx(null)}
                          aria-label="Arrastrar para reordenar"
                          title="Arrastrar para reordenar"
                          className="flex shrink-0 cursor-grab items-center justify-center border-none bg-transparent p-0.5 text-edu-ink-300 hover:text-edu-ink-500 active:cursor-grabbing"
                        >
                          <GripVertical className="h-4 w-4" />
                        </button>
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-edu-chip ${s.enabled ? "bg-edu-primary-50" : "bg-edu-border-soft"}`}>
                          <Icon className={`h-4 w-4 ${s.enabled ? "text-edu-primary" : "text-edu-ink-400"}`} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[0.82rem] font-semibold text-edu-ink">{meta.label}</div>
                          <div className="truncate text-[0.68rem] text-edu-ink-400">{meta.description}</div>
                        </div>
                        <IconBtn onClick={() => moveSection(i, -1)} disabled={i === 0} label="Subir"><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn onClick={() => moveSection(i, 1)} disabled={i === config.sections.length - 1} label="Bajar"><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
                        <Switch on={s.enabled} onClick={() => toggleSection(i)} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Vista previa a pantalla completa ── */}
      {fullscreen && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-slate-950">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-900 px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <Eye className="h-4 w-4" />
              <span className="text-[0.9rem] font-semibold">Vista previa</span>
              <span className="hidden text-[0.78rem] text-slate-400 sm:inline">— así se verá antes de publicar</span>
            </div>
            <div className="flex items-center gap-2">
              <DeviceToggle device={device} onChange={setDevice} />
              <button onClick={() => setFullscreen(false)} className="inline-flex items-center gap-1.5 rounded-edu-control border border-white/15 bg-transparent px-3 py-2 text-[0.82rem] font-semibold text-white cursor-pointer hover:bg-white/10">
                <X className="h-4 w-4" /> Cerrar
              </button>
              <button onClick={() => setConfirm({ title: "Guardar y publicar", tone: "success", icon: Save, confirmLabel: "Publicar", onConfirm: publish })} className="inline-flex items-center gap-1.5 rounded-edu-control border-none bg-edu-primary px-4 py-2 text-[0.82rem] font-semibold text-white cursor-pointer hover:bg-edu-primary-hover">
                <Save className="h-4 w-4" /> Guardar y publicar
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto lp-noscrollbar bg-[#0b1020] p-4">
            <PreviewSurface device={device}>
              <LandingView config={config} onLogin={previewLogin} onEnroll={previewEnroll} />
            </PreviewSurface>
          </div>
        </div>
      )}

      {/* ── Modal de confirmación ── */}
      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          tone={confirm.tone}
          icon={confirm.icon}
          confirmLabel={confirm.confirmLabel}
          onConfirm={() => { confirm.onConfirm(); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* ── Mensaje flotante ── */}
      {flash && (
        <div className={`fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-edu-control px-4 py-3 text-[0.85rem] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.18)] ${flash.tone === "ok" ? "bg-edu-ink text-white" : "bg-edu-warning-bg text-edu-warning border border-edu-warning-strong/30"}`}>
          {flash.tone === "ok" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {flash.msg}
        </div>
      )}
    </div>
  );
}

/* ================================================================ */
/* Superficie de previsualización (escritorio / móvil)              */
/* ================================================================ */

function PreviewSurface({ device, children }: { device: Device; children: React.ReactNode }) {
  if (device === "mobile") {
    return (
      <div className="mx-auto w-[390px] max-w-full overflow-hidden rounded-[2.2rem] border-[9px] border-slate-800 bg-black shadow-2xl" style={{ height: 680 }}>
        <div className="h-full w-full overflow-y-auto lp-noscrollbar">{children}</div>
      </div>
    );
  }
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black" style={{ minHeight: "100%" }}>
      {children}
    </div>
  );
}

function DeviceToggle({ device, onChange }: { device: Device; onChange: (d: Device) => void }) {
  return (
    <div className="flex items-center gap-0.5 rounded-full bg-white/10 p-0.5">
      {([["desktop", Monitor], ["mobile", Smartphone]] as const).map(([d, Icon]) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          aria-label={d === "desktop" ? "Escritorio" : "Móvil"}
          className={`flex h-7 w-7 items-center justify-center rounded-full cursor-pointer transition-colors ${device === d ? "bg-white text-slate-900" : "text-slate-300 hover:text-slate-500"}`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

/* ================================================================ */
/* Controles reutilizables                                          */
/* ================================================================ */

function Group({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  sectionEnabled,
  onToggle,
}: {
  title: string;
  icon: typeof Type;
  children: React.ReactNode;
  defaultOpen?: boolean;
  sectionEnabled?: boolean;
  onToggle?: () => void;
}) {
  return (
    <details open={defaultOpen} className="group overflow-hidden rounded-edu-control border border-edu-border-soft bg-edu-surface">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-2.5 text-[0.82rem] font-semibold text-edu-ink select-none [&::-webkit-details-marker]:hidden">
        <Icon className="h-4 w-4 text-edu-primary" />
        {title}
        <span className="ml-auto flex items-center gap-2">
          {onToggle !== undefined && sectionEnabled !== undefined && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
              role="switch"
              aria-checked={sectionEnabled}
              title={sectionEnabled ? "Ocultar sección" : "Mostrar sección"}
              className={`relative h-5 w-9 shrink-0 rounded-full transition-colors cursor-pointer border-none ${sectionEnabled ? "bg-edu-primary" : "bg-edu-border"}`}
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${sectionEnabled ? "left-[18px]" : "left-0.5"}`} />
            </button>
          )}
          <ChevronDown className="h-4 w-4 text-edu-ink-400 transition-transform group-open:rotate-180" />
        </span>
      </summary>
      <div className="flex flex-col gap-2.5 px-3.5 pb-3.5 pt-1">{children}</div>
    </details>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.74rem] font-medium text-edu-ink-600">{label}</span>
      <input className={INPUT} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.74rem] font-medium text-edu-ink-600">{label}</span>
      <textarea className={`${INPUT} resize-none leading-relaxed`} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.74rem] font-medium text-edu-ink-600">{label}</span>
      <input
        type="number"
        min={0}
        className={INPUT}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
      />
    </label>
  );
}

function IconBtn({
  onClick,
  disabled,
  label,
  danger,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-edu-chip border border-edu-border bg-edu-surface transition-colors ${disabled ? "cursor-not-allowed text-edu-ink-300 opacity-50" : danger ? "cursor-pointer text-edu-ink-400 hover:border-edu-danger hover:text-edu-danger" : "cursor-pointer text-edu-ink-500 hover:border-edu-primary-200 hover:text-edu-primary"
        }`}
    >
      {children}
    </button>
  );
}

function AddButton({ onClick, label, disabled }: { onClick: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-1.5 rounded-edu-control border-[1.5px] border-dashed py-2.5 text-[0.8rem] font-semibold transition-colors ${disabled ? "cursor-not-allowed border-edu-border text-edu-ink-300" : "cursor-pointer border-edu-primary-200 text-edu-primary hover:bg-edu-primary-50"
        }`}
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );
}

function Switch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors cursor-pointer ${on ? "bg-edu-primary" : "bg-edu-border"}`}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
    </button>
  );
}

