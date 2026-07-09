/**
 * Renderizador de la landing page a partir de una LandingConfig.
 *
 * Se usa idéntico en dos lugares:
 *   - La raíz "/" (página pública real).
 *   - El lienzo de previsualización del editor del docente.
 *
 * Es responsive vía CONTAINER QUERIES (variantes @sm/@lg/@2xl…), de modo que
 * se adapta tanto al ancho real del teléfono como al ancho del panel de preview
 * sin depender del viewport. El header trae el botón "Iniciar sesión".
 */

import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  LogIn,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  CalendarDays,
  User,
  Users,
  Award,
  BookOpen,
  Send,
  CheckCircle2,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { EXTRA_COURSES } from "../datos_maquetados/data/courses";
import { THEMES, ThemeBackground, CosmicSectionDecor } from "./themes";
import { SECTION_META, type LandingConfig, type SectionId } from "./types";

/* Actividades destacadas mostradas en la landing (muestra del sistema). */
const FEATURED_ACTIVITIES = [
  { id: 1, name: "Feria de ciencias", date: "12 may 2026", tag: "Académico" },
  { id: 2, name: "Festival cultural de fin de lapso", date: "26 jul 2026", tag: "Cultural" },
  { id: 3, name: "Torneo interescolar de ajedrez", date: "9 jul 2026", tag: "Deportivo" },
  { id: 4, name: "Jornada de reforestación", date: "24 may 2026", tag: "Ambiental" },
  { id: 5, name: "Concurso de matemáticas", date: "3 jun 2026", tag: "Académico" },
  { id: 6, name: "Muestra de arte estudiantil", date: "17 jun 2026", tag: "Cultural" },
  { id: 7, name: "Campeonato de fútbol sala", date: "30 jun 2026", tag: "Deportivo" },
  { id: 8, name: "Taller de reciclaje creativo", date: "14 jun 2026", tag: "Ambiental" },
  { id: 9, name: "Noche de talentos", date: "8 ago 2026", tag: "Cultural" },
  { id: 10, name: "Olimpiada de robótica", date: "21 ago 2026", tag: "Académico" },
];

export function LandingView({
  config,
  onLogin,
  onEnroll,
}: {
  config: LandingConfig;
  onLogin?: () => void;
  onEnroll?: () => void;
}) {
  const theme = THEMES[config.template];
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const enabled = config.sections.filter((s) => s.enabled).map((s) => s.id);
  const navItems = enabled.filter((id) => SECTION_META[id].navLabel);

  // Si la sección de inscripciones está activa, la sección de Ubicación muestra
  // un CTA "¡Inscríbete!" en lugar del formulario de contacto (ver LocationSection).
  const inscripcionesActive = enabled.includes("inscripciones");

  const scrollTo = (id: SectionId | "top") => {
    setMenuOpen(false);
    const root = rootRef.current;
    if (!root) return;
    if (id === "top") {
      root.querySelector("[data-sec='__hero']")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    root.querySelector(`[data-sec='${id}']`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Estilos derivados del tema (colores runtime → inline).
  const glass: React.CSSProperties = {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    backdropFilter: "blur(6px)",
  };
  const gradText: React.CSSProperties = {
    backgroundImage: theme.headingGradient,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  };
  const cta: React.CSSProperties = {
    backgroundImage: theme.ctaGradient,
    boxShadow: theme.ctaGlow,
    color: "#fff",
  };

  const firstContent = enabled.find((id) => id !== "contact") ?? "about";

  const hasStudents = enabled.includes("students");
  const hasExperience = enabled.includes("experience");
  const bothStats = hasStudents && hasExperience;

  return (
    <div
      ref={rootRef}
      className="lp-scope @container relative w-full overflow-x-hidden"
      style={{ background: theme.bg, color: theme.text }}
    >
      {/* ───────────────── Header ───────────────── */}
      <header
        className="sticky top-0 z-30 w-full"
        style={{
          background: `${theme.bg}e6`,
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div className="mx-auto flex items-center justify-between gap-4 px-4 py-3 @2xl:px-6">
          {/* Marca */}
          <button
            onClick={() => scrollTo("top")}
            className="flex items-center gap-2.5 border-none bg-transparent cursor-pointer text-left"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
              style={{ backgroundImage: theme.ctaGradient, boxShadow: theme.ctaGlow }}
            >
              <GraduationCap className="h-5 w-5 text-white" />
            </span>
            {(config.showBrand ?? true) && (
              <span className="min-w-0">
                <span className="block truncate text-[0.95rem] font-bold leading-tight" style={{ color: theme.text }}>
                  {config.institutionName}
                </span>
                <span className="hidden @sm:block truncate text-[0.68rem]" style={{ color: theme.textMuted }}>
                  {config.tagline}
                </span>
              </span>
            )}
          </button>

          {/* Nav de escritorio */}
          <nav className="hidden items-center gap-1 @3xl:flex">
            {navItems.map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="rounded-full border-none bg-transparent px-3 py-1.5 text-[0.82rem] font-medium cursor-pointer transition-colors hover:bg-white/5"
                style={{ color: theme.textMuted }}
              >
                {SECTION_META[id].navLabel}
              </button>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLogin?.()}
              className="hidden @xs:inline-flex items-center gap-1.5 rounded-full border-none px-4 py-2 text-[0.82rem] font-semibold cursor-pointer transition-transform hover:-translate-y-0.5"
              style={cta}
            >
              <LogIn className="h-4 w-4" />
              Iniciar sesión
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menú"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-transparent cursor-pointer @3xl:hidden"
              style={{ borderColor: theme.border, color: theme.text }}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {menuOpen && (
          <div
            className="@3xl:hidden px-4 pb-4 flex flex-col gap-1"
            style={{ borderTop: `1px solid ${theme.border}` }}
          >
            {navItems.map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="rounded-lg border-none bg-transparent px-3 py-2.5 text-left text-sm font-medium cursor-pointer hover:bg-white/5"
                style={{ color: theme.textMuted }}
              >
                {SECTION_META[id].navLabel}
              </button>
            ))}
            <button
              onClick={() => onLogin?.()}
              className="mt-1 inline-flex @xs:hidden items-center justify-center gap-1.5 rounded-full border-none px-4 py-2.5 text-sm font-semibold cursor-pointer"
              style={cta}
            >
              <LogIn className="h-4 w-4" />
              Iniciar sesión
            </button>
          </div>
        )}
      </header>

      {/* ───────────────── Hero ───────────────── */}
      {(config.showHero ?? true) && <section data-sec="__hero" className="relative overflow-hidden">
        <ThemeBackground theme={theme} variant={config.background} />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center @2xl:py-28 @4xl:py-32">
          <span
            className="lp-fade-up inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.75rem] font-semibold"
            style={{ ...glass, color: theme.text }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.accent, boxShadow: `0 0 8px ${theme.accent}` }} />
            {config.hero.badge}
          </span>
          <h1
            className="lp-fade-up mx-auto mt-6 max-w-3xl text-[2.1rem] font-extrabold leading-[1.1] tracking-tight @2xl:text-[3rem] @4xl:text-[3.6rem]"
            style={{ animationDelay: "0.08s" }}
          >
            <span style={gradText}>{config.hero.title}</span>
          </h1>
          <p
            className="lp-fade-up mx-auto mt-5 max-w-2xl text-[1rem] leading-relaxed @2xl:text-[1.12rem]"
            style={{ color: theme.textMuted, animationDelay: "0.16s" }}
          >
            {config.hero.subtitle}
          </p>
          <div className="lp-fade-up mt-8 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "0.24s" }}>
            <button
              onClick={() => scrollTo(firstContent)}
              className="inline-flex items-center gap-2 rounded-full border-none px-6 py-3 text-[0.92rem] font-semibold cursor-pointer transition-transform hover:-translate-y-0.5"
              style={cta}
            >
              {config.hero.ctaText}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onLogin?.()}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.92rem] font-semibold cursor-pointer transition-colors hover:bg-white/5"
              style={{ ...glass, color: theme.text }}
            >
              <LogIn className="h-4 w-4" />
              Acceder al sistema
            </button>
          </div>
        </div>
      </section>}

      {/* ───────────────── Secciones dinámicas ───────────────── */}
      {enabled
        .filter((id) => !(bothStats && id === "experience"))
        .map((id) => {
          if (bothStats && id === "students") {
            return (
              <div
                key="stats-grid"
                className="relative mx-auto w-full px-4 py-4 @2xl:px-6"
                style={{ scrollMarginTop: 76 }}
              >
                {theme.id === "cosmico" && <CosmicSectionDecor id="students" />}
                <div className="relative z-10 grid grid-cols-2 gap-4">
                  <StatBand icon={GraduationCap} value={config.students.number} label={config.students.label} theme={theme} glass={glass} suffix="+" />
                  <StatBand icon={Award} value={config.experience.number} label={config.experience.label} theme={theme} glass={glass} suffix="" />
                </div>
              </div>
            );
          }
          return (
            <Section
              key={id}
              id={id}
              config={config}
              theme={theme}
              glass={glass}
              gradText={gradText}
              onEnroll={onEnroll}
              inscripcionesActive={inscripcionesActive}
            />
          );
        })}

      {/* ───────────────── Footer ───────────────── */}
      <footer
        className="relative"
        style={{ background: theme.surfaceSolid, borderTop: `1px solid ${theme.border}` }}
      >
        <div className="mx-auto px-4 py-10 @2xl:px-6">
          <div className="grid grid-cols-1 gap-8 @2xl:grid-cols-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundImage: theme.ctaGradient }}>
                  <GraduationCap className="h-5 w-5 text-white" />
                </span>
                <span className="text-[0.95rem] font-bold">{config.institutionName}</span>
              </div>
              <p className="mt-3 max-w-xs text-[0.85rem] leading-relaxed" style={{ color: theme.textMuted }}>
                {config.tagline}
              </p>
            </div>
            <div>
              <h4 className="text-[0.8rem] font-semibold uppercase tracking-wider" style={{ color: theme.text }}>
                Contacto
              </h4>
              <ul className="mt-3 flex flex-col gap-2 text-[0.85rem]" style={{ color: theme.textMuted }}>
                <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 shrink-0" style={{ color: theme.accent }} />{config.contact.whatsapp}</li>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" style={{ color: theme.accent }} />{config.contact.phone}</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" style={{ color: theme.accent }} />{config.contact.email}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[0.8rem] font-semibold uppercase tracking-wider" style={{ color: theme.text }}>
                Ubicación
              </h4>
              <p className="mt-3 flex items-start gap-2 text-[0.85rem]" style={{ color: theme.textMuted }}>
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: theme.accent }} />
                <span>{config.location.address}<br />{config.location.city}</span>
              </p>
            </div>
          </div>
          <div
            className="mt-8 flex flex-col items-center justify-between gap-2 pt-6 text-[0.78rem] @xl:flex-row"
            style={{ borderTop: `1px solid ${theme.border}`, color: theme.textMuted }}
          >
            <span>© 2026 {config.institutionName}. Todos los derechos reservados.</span>
            <button
              onClick={() => onLogin?.()}
              className="border-none bg-transparent cursor-pointer font-semibold hover:underline"
              style={{ color: theme.accent }}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ================================================================ */
/* Encabezado de sección reutilizable                               */
/* ================================================================ */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  theme,
  gradText,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  theme: (typeof THEMES)[keyof typeof THEMES];
  gradText: React.CSSProperties;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-[0.74rem] font-bold uppercase tracking-[0.14em]" style={{ color: theme.accent }}>
        {eyebrow}
      </span>
      <h2 className="mt-2 text-[1.7rem] font-extrabold leading-tight @2xl:text-[2.1rem]">
        <span style={gradText}>{title}</span>
      </h2>
      {subtitle && (
        <p className="mt-3 text-[0.95rem] leading-relaxed" style={{ color: theme.textMuted }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ================================================================ */
/* Router de secciones                                              */
/* ================================================================ */

function Section({
  id,
  config,
  theme,
  glass,
  gradText,
  onEnroll,
  inscripcionesActive,
}: {
  id: SectionId;
  config: LandingConfig;
  theme: (typeof THEMES)[keyof typeof THEMES];
  glass: React.CSSProperties;
  gradText: React.CSSProperties;
  onEnroll?: () => void;
  inscripcionesActive?: boolean;
}) {
  return (
    <section
      data-sec={id}
      className="relative mx-auto w-full px-4 py-4 @2xl:px-6"
      style={{ scrollMarginTop: 76 }}
    >
      {theme.id === "cosmico" && <CosmicSectionDecor id={id} />}
      <div className="relative z-10">
        {id === "inscripciones" && <InscripcionesSection config={config} theme={theme} glass={glass} gradText={gradText} onEnroll={onEnroll} />}
        {id === "about" && <AboutSection config={config} theme={theme} glass={glass} gradText={gradText} />}
        {id === "courses" && <CoursesSection config={config} theme={theme} glass={glass} gradText={gradText} />}
        {id === "activities" && <ActivitiesSection config={config} theme={theme} glass={glass} gradText={gradText} />}
        {id === "location" && <LocationSection config={config} theme={theme} glass={glass} gradText={gradText} inscripcionesActive={inscripcionesActive} onEnroll={onEnroll} />}
        {id === "gallery" && <GallerySection config={config} theme={theme} gradText={gradText} />}
        {id === "teachers" && <TeachersSection config={config} theme={theme} glass={glass} gradText={gradText} />}


        {id === "students" && (
          <StatBand icon={GraduationCap} value={config.students.number} label={config.students.label} theme={theme} glass={glass} suffix="+" />
        )}
        {id === "experience" && (
          <StatBand icon={Award} value={config.experience.number} label={config.experience.label} theme={theme} glass={glass} suffix="" />
        )}
        {id === "contact" && <ContactSection config={config} theme={theme} glass={glass} gradText={gradText} />}
      </div>
    </section>
  );
}

/* ================================================================ */
/* Secciones                                                        */
/* ================================================================ */

type SecProps = {
  config: LandingConfig;
  theme: (typeof THEMES)[keyof typeof THEMES];
  glass: React.CSSProperties;
  gradText: React.CSSProperties;
};

function InscripcionesSection({
  config,
  theme,
  glass,
  gradText,
  onEnroll,
}: SecProps & { onEnroll?: () => void }) {
  const i = config.inscripciones;
  const cta: React.CSSProperties = {
    backgroundImage: theme.ctaGradient,
    boxShadow: theme.ctaGlow,
    color: "#fff",
  };
  return (
    <div
      className="relative overflow-hidden rounded-3xl px-6 py-11 text-center @2xl:px-12 @2xl:py-14"
      style={glass}
    >
      {/* Resplandor con el gradiente del tema. */}
      <div className="absolute inset-0" style={{ backgroundImage: theme.ctaGradient, opacity: 0.16 }} aria-hidden />
      <div
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full"
        style={{ background: `radial-gradient(circle, ${theme.accent}44, transparent 70%)` }}
        aria-hidden
      />
      <div className="relative flex flex-col items-center">
        {/* Estado: "Inscripciones abiertas" con punto pulsante. */}
        <span
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.12em]"
          style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-70 lp-anim-glow" style={{ background: theme.accent }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: theme.accent }} />
          </span>
          {i.status}
        </span>

        <h2 className="mt-4 max-w-2xl text-[1.8rem] font-extrabold leading-tight @2xl:text-[2.3rem]">
          <span style={gradText}>{i.heading}</span>
        </h2>

        {/* Fecha / período de inscripción. */}
        <div
          className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.9rem] font-semibold"
          style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
        >
          <CalendarDays className="h-4 w-4 shrink-0" style={{ color: theme.accent }} />
          {i.period}
        </div>

        <p className="mx-auto mt-4 max-w-xl text-[0.95rem] leading-relaxed" style={{ color: theme.textMuted }}>
          {i.subtitle}
        </p>

        <button
          onClick={() => onEnroll?.()}
          className="mt-7 inline-flex items-center gap-2 rounded-full border-none px-7 py-3.5 text-[0.95rem] font-semibold cursor-pointer transition-transform hover:-translate-y-0.5"
          style={cta}
        >
          {i.ctaText}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function AboutSection({ config, theme, glass, gradText }: SecProps) {
  return (
    <div className="grid grid-cols-1 items-center gap-8 @3xl:grid-cols-2">
      <div>
        <span className="text-[0.74rem] font-bold uppercase tracking-[0.14em]" style={{ color: theme.accent }}>
          {SECTION_META.about.label}
        </span>
        <h2 className="mt-2 text-[1.7rem] font-extrabold leading-tight @2xl:text-[2.1rem]">
          <span style={gradText}>{config.about.heading}</span>
        </h2>
        <p className="mt-4 text-[0.95rem] leading-relaxed" style={{ color: theme.textMuted }}>
          {config.about.body}
        </p>
      </div>
      <div className="rounded-3xl p-6 @2xl:p-8" style={glass}>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Users, label: "Comunidad", value: "Cercana" },
            { icon: BookOpen, label: "Enfoque", value: "Integral" },
            { icon: Award, label: "Trayectoria", value: `${config.experience.number} años` },
            { icon: GraduationCap, label: "Alumnos", value: `${config.students.number}+` },
          ].map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.label} className="rounded-2xl p-4" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
                <Icon className="h-6 w-6" style={{ color: theme.accent }} />
                <div className="mt-3 text-[1.15rem] font-bold" style={{ color: theme.text }}>{it.value}</div>
                <div className="text-[0.78rem]" style={{ color: theme.textMuted }}>{it.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================================================================ */
/* Carrusel de sección reutilizable                                 */
/* ================================================================ */

/** Ítems visibles por "página" en cada carrusel de sección. */
const COURSES_PER_PAGE = 6;
const ACTIVITIES_PER_PAGE = 4;
// 4 por página (una fila completa en la grilla de 4 columnas) para que el
// listado de docentes se pagine y muestre las flechas ‹ › + puntos a partir de
// 5 docentes, igual que Cursos y Actividades.
const TEACHERS_PER_PAGE = 4;

/** Intervalo del avance automático de los carruseles de sección (ms). */
export const SECTION_AUTOPLAY_MS = 6000;

type ThemeShape = (typeof THEMES)[keyof typeof THEMES];

/**
 * Paginación compartida por los carruseles de secciones (cursos, actividades,
 * docentes y galería). Divide `itemCount` ítems en páginas de `perPage` y
 * expone la navegación. Si `autoplayMs > 0`, avanza solo (respeta
 * "prefers-reduced-motion" y la pausa por hover vía `paused`).
 */
export function useCarousel(itemCount: number, perPage: number, autoplayMs = 0) {
  const pageCount = Math.max(1, Math.ceil(itemCount / perPage));
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  // Reajusta la página si el contenido se reduce y queda fuera de rango.
  useEffect(() => {
    if (page > pageCount - 1) setPage(pageCount - 1);
  }, [page, pageCount]);

  // Avance automático opcional; se reinicia en cada cambio y se pausa al hover.
  useEffect(() => {
    if (!autoplayMs || pageCount <= 1 || paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setPage((p) => (p + 1) % pageCount), autoplayMs);
    return () => clearTimeout(t);
  }, [page, pageCount, paused, autoplayMs]);

  const go = (dir: -1 | 1) => setPage((p) => (p + dir + pageCount) % pageCount);

  return { page, setPage, pageCount, paused, setPaused, go };
}

/** Flechas ‹ › superpuestas al carrusel. Solo se muestran si hay más de 1 página. */
export function CarouselArrows({ pageCount, go, theme }: { pageCount: number; go: (dir: -1 | 1) => void; theme: ThemeShape }) {
  if (pageCount <= 1) return null;
  const arrowStyle: React.CSSProperties = {
    background: theme.surfaceSolid,
    border: `1px solid ${theme.border}`,
    color: theme.text,
    boxShadow: "0 6px 16px rgba(0,0,0,0.28)",
  };
  return (
    <>
      <button
        onClick={() => go(-1)}
        aria-label="Anterior"
        className="absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-110 @2xl:-left-3"
        style={arrowStyle}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Siguiente"
        className="absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-110 @2xl:-right-3"
        style={arrowStyle}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </>
  );
}

/** Puntos indicadores bajo el carrusel. Solo se muestran si hay más de 1 página. */
export function CarouselDots({ pageCount, page, setPage, theme }: { pageCount: number; page: number; setPage: (p: number) => void; theme: ThemeShape }) {
  if (pageCount <= 1) return null;
  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      {Array.from({ length: pageCount }).map((_, p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          aria-label={`Ir a la página ${p + 1}`}
          aria-current={p === page}
          className="h-2 rounded-full transition-all cursor-pointer"
          style={{ width: p === page ? 22 : 8, background: p === page ? theme.accent : theme.border }}
        />
      ))}
    </div>
  );
}

function CoursesSection({ config, theme, glass, gradText }: SecProps) {
  const { page, setPage, pageCount, setPaused, go } = useCarousel(EXTRA_COURSES.length, COURSES_PER_PAGE, SECTION_AUTOPLAY_MS);
  const pageCourses = EXTRA_COURSES.slice(page * COURSES_PER_PAGE, page * COURSES_PER_PAGE + COURSES_PER_PAGE);
  return (
    <>
      <SectionHeading eyebrow={SECTION_META.courses.label} title={config.courses.heading} subtitle={config.courses.subtitle} theme={theme} gradText={gradText} />
      <div className="mt-10" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="relative">
          <div key={page} className="lp-anim-fade grid grid-cols-1 gap-5 @2xl:grid-cols-2 @4xl:grid-cols-3">
            {pageCourses.map((c) => (
              <div key={c.id} className="group overflow-hidden rounded-2xl transition-transform hover:-translate-y-1" style={glass}>
                <div className="relative h-40 overflow-hidden">
                  <ImageWithFallback src={c.image} alt={c.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${theme.surfaceSolid} 100%)` }} />
                </div>
                <div className="p-5">
                  <h3 className="text-[1rem] font-bold leading-snug" style={{ color: theme.text }}>{c.title}</h3>
                  <div className="mt-2 flex items-center gap-1.5 text-[0.8rem]" style={{ color: theme.textMuted }}>
                    <User className="h-3.5 w-3.5" style={{ color: theme.accent }} />
                    {c.teacher}
                  </div>
                  <p className="mt-2 line-clamp-2 text-[0.83rem] leading-relaxed" style={{ color: theme.textMuted }}>
                    {c.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <CarouselArrows pageCount={pageCount} go={go} theme={theme} />
        </div>
        <CarouselDots pageCount={pageCount} page={page} setPage={setPage} theme={theme} />
      </div>
    </>
  );
}

function ActivitiesSection({ config, theme, glass, gradText }: SecProps) {
  const { page, setPage, pageCount, setPaused, go } = useCarousel(FEATURED_ACTIVITIES.length, ACTIVITIES_PER_PAGE, SECTION_AUTOPLAY_MS);
  const pageActivities = FEATURED_ACTIVITIES.slice(page * ACTIVITIES_PER_PAGE, page * ACTIVITIES_PER_PAGE + ACTIVITIES_PER_PAGE);
  return (
    <>
      <SectionHeading eyebrow={SECTION_META.activities.label} title={config.activities.heading} subtitle={config.activities.subtitle} theme={theme} gradText={gradText} />
      <div className="mt-10" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="relative">
          <div key={page} className="lp-anim-fade grid grid-cols-1 gap-4 @3xl:grid-cols-2">
            {pageActivities.map((a) => (
              <div key={a.id} className="flex items-center gap-4 rounded-2xl p-5" style={glass}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
                  <CalendarDays className="h-6 w-6" style={{ color: theme.accent }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-[0.95rem] font-bold" style={{ color: theme.text }}>{a.name}</h3>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[0.8rem]" style={{ color: theme.textMuted }}>
                    <span>{a.date}</span>
                    <span className="rounded-full px-2 py-0.5 text-[0.68rem] font-semibold" style={{ background: theme.surface, color: theme.accent, border: `1px solid ${theme.border}` }}>
                      {a.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <CarouselArrows pageCount={pageCount} go={go} theme={theme} />
        </div>
        <CarouselDots pageCount={pageCount} page={page} setPage={setPage} theme={theme} />
      </div>
    </>
  );
}

function LocationSection({
  config,
  theme,
  glass,
  gradText,
  inscripcionesActive,
  onEnroll,
}: SecProps & { inscripcionesActive?: boolean; onEnroll?: () => void }) {
  // Consulta del mapa: usa la personalizada o, si no, la dirección + ciudad.
  // `output=embed` permite incrustar Google Maps sin clave de API.
  const query = config.location.mapQuery?.trim() || `${config.location.address}, ${config.location.city}`;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&hl=es&output=embed`;

  return (
    <>
      <SectionHeading eyebrow={SECTION_META.location.label} title={config.location.heading} theme={theme} gradText={gradText} />
      <div className="mt-10 grid grid-cols-1 items-stretch gap-6 @3xl:grid-cols-2">
        {/* ── Mapa de Google Maps (izquierda) ── */}
        <div className="flex min-h-[360px] flex-col overflow-hidden rounded-3xl" style={glass}>
          <div className="relative flex-1">
            <iframe
              title="Ubicación en Google Maps"
              src={mapSrc}
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="flex flex-col gap-2 p-4" style={{ borderTop: `1px solid ${theme.border}` }}>
            <div className="flex items-start gap-2.5 text-[0.85rem]" style={{ color: theme.textMuted }}>
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: theme.accent }} />
              <span>{config.location.address} · {config.location.city}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[0.85rem]" style={{ color: theme.textMuted }}>
              <Clock className="h-4 w-4 shrink-0" style={{ color: theme.accent }} />
              <span>{config.location.hours}</span>
            </div>
          </div>
        </div>

        {/* ── Panel derecho: formulario de contacto o CTA de inscripción ── */}
        {inscripcionesActive ? (
          <InscribeteCTA config={config} theme={theme} glass={glass} gradText={gradText} onEnroll={onEnroll} />
        ) : (
          <ContactForm theme={theme} glass={glass} gradText={gradText} />
        )}
      </div>
    </>
  );
}

/**
 * Formulario "Contáctanos" del bloque de Ubicación. Es una maqueta: el envío
 * no llega a ningún backend, solo muestra un acuse de recibo local.
 */
function ContactForm({
  theme,
  glass,
  gradText,
}: {
  theme: ThemeShape;
  glass: React.CSSProperties;
  gradText: React.CSSProperties;
}) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const cta: React.CSSProperties = { backgroundImage: theme.ctaGradient, boxShadow: theme.ctaGlow, color: "#fff" };
  const inputStyle: React.CSSProperties = { background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text };
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const labelCls = "text-[0.76rem] font-semibold";
  const fieldCls = "mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-[0.9rem] outline-none transition-colors";

  return (
    <div className="flex flex-col rounded-3xl p-6 @2xl:p-8" style={glass}>
      <span className="text-[0.74rem] font-bold uppercase tracking-[0.14em]" style={{ color: theme.accent }}>Escríbenos</span>
      <h3 className="mt-1 text-[1.5rem] font-extrabold leading-tight @2xl:text-[1.9rem]">
        <span style={gradText}>Contáctanos</span>
      </h3>

      {sent ? (
        <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
            <CheckCircle2 className="h-8 w-8" style={{ color: theme.accent }} />
          </span>
          <h4 className="text-[1.05rem] font-bold" style={{ color: theme.text }}>¡Mensaje enviado!</h4>
          <p className="max-w-xs text-[0.88rem] leading-relaxed" style={{ color: theme.textMuted }}>
            Gracias por escribirnos. Te responderemos lo antes posible.
          </p>
          <button
            onClick={() => { setForm({ name: "", email: "", phone: "", subject: "", message: "" }); setSent(false); }}
            className="mt-2 rounded-full border-none px-5 py-2.5 text-[0.85rem] font-semibold cursor-pointer transition-transform hover:-translate-y-0.5"
            style={cta}
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-5 flex flex-col gap-3.5">
          <div>
            <label className={labelCls} style={{ color: theme.textMuted }}>Nombre y Apellido</label>
            <input required value={form.name} onChange={set("name")} placeholder="Tu nombre completo" className={fieldCls} style={inputStyle} />
          </div>
          <div className="grid grid-cols-1 gap-3.5 @sm:grid-cols-2">
            <div>
              <label className={labelCls} style={{ color: theme.textMuted }}>Correo</label>
              <input required type="email" value={form.email} onChange={set("email")} placeholder="correo@ejemplo.com" className={fieldCls} style={inputStyle} />
            </div>
            <div>
              <label className={labelCls} style={{ color: theme.textMuted }}>Teléfono</label>
              <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+58 400-000-0000" className={fieldCls} style={inputStyle} />
            </div>
          </div>
          <div>
            <label className={labelCls} style={{ color: theme.textMuted }}>Asunto</label>
            <input value={form.subject} onChange={set("subject")} placeholder="Motivo de tu mensaje" className={fieldCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={{ color: theme.textMuted }}>Mensaje</label>
            <textarea required rows={4} value={form.message} onChange={set("message")} placeholder="Escribe tu mensaje…" className={`${fieldCls} resize-none`} style={inputStyle} />
          </div>
          <button
            type="submit"
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-full border-none px-6 py-3 text-[0.92rem] font-semibold cursor-pointer transition-transform hover:-translate-y-0.5"
            style={cta}
          >
            Enviar
            <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}

/**
 * CTA "¿Qué esperas? ¡Inscríbete!" que sustituye al formulario cuando la
 * sección de inscripciones está activa. Reutiliza los textos de config.inscripciones.
 */
function InscribeteCTA({
  config,
  theme,
  glass,
  gradText,
  onEnroll,
}: SecProps & { onEnroll?: () => void }) {
  const i = config.inscripciones;
  const cta: React.CSSProperties = { backgroundImage: theme.ctaGradient, boxShadow: theme.ctaGlow, color: "#fff" };
  return (
    <div className="relative flex flex-col justify-center overflow-hidden rounded-3xl p-8 text-center @2xl:p-10" style={glass}>
      {/* Resplandor con el gradiente del tema. */}
      <div className="absolute inset-0" style={{ backgroundImage: theme.ctaGradient, opacity: 0.16 }} aria-hidden />
      <div
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full"
        style={{ background: `radial-gradient(circle, ${theme.accent}44, transparent 70%)` }}
        aria-hidden
      />
      <div className="relative flex flex-col items-center">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.12em]"
          style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-70 lp-anim-glow" style={{ background: theme.accent }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: theme.accent }} />
          </span>
          {i.status}
        </span>

        <h3 className="mt-4 max-w-md text-[1.7rem] font-extrabold leading-tight @2xl:text-[2.1rem]">
          <span style={gradText}>¿Qué esperas? ¡Inscríbete!</span>
        </h3>

        <div
          className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.88rem] font-semibold"
          style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
        >
          <CalendarDays className="h-4 w-4 shrink-0" style={{ color: theme.accent }} />
          {i.period}
        </div>

        <p className="mx-auto mt-4 max-w-sm text-[0.92rem] leading-relaxed" style={{ color: theme.textMuted }}>
          {i.subtitle}
        </p>

        <button
          onClick={() => onEnroll?.()}
          className="mt-7 inline-flex items-center gap-2 rounded-full border-none px-7 py-3.5 text-[0.95rem] font-semibold cursor-pointer transition-transform hover:-translate-y-0.5"
          style={cta}
        >
          {i.ctaText}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Máximo de imágenes visibles por "página" del carrusel de la galería. */
const GALLERY_PER_PAGE = 6;
/** Intervalo del avance automático del carrusel (ms). */
const GALLERY_AUTOPLAY_MS = 5000;

function GallerySection({
  config,
  theme,
  gradText,
}: {
  config: LandingConfig;
  theme: (typeof THEMES)[keyof typeof THEMES];
  gradText: React.CSSProperties;
}) {
  const images = config.gallery.images;
  // Autoplay cada 5 s (con pausa por hover) exclusivo de la galería.
  const { page, setPage, pageCount, setPaused, go } = useCarousel(images.length, GALLERY_PER_PAGE, GALLERY_AUTOPLAY_MS);
  const pageImages = images.slice(page * GALLERY_PER_PAGE, page * GALLERY_PER_PAGE + GALLERY_PER_PAGE);

  return (
    <>
      <SectionHeading eyebrow={SECTION_META.gallery.label} title={config.gallery.heading} theme={theme} gradText={gradText} />
      <div
        className="mt-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative">
          <div key={page} className="lp-anim-fade grid grid-cols-2 gap-3 @2xl:grid-cols-3">
            {pageImages.map((img, i) => (
              <div
                key={img.id}
                className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "@2xl:col-span-2 @2xl:row-span-2" : ""}`}
                style={{ border: `1px solid ${theme.border}` }}
              >
                <ImageWithFallback
                  src={img.url}
                  alt={img.caption}
                  className={`w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${i === 0 ? "h-[150px] @2xl:h-[312px]" : "h-[150px]"}`}
                />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 p-3" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
                    <span className="text-[0.78rem] font-medium text-white">{img.caption}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <CarouselArrows pageCount={pageCount} go={go} theme={theme} />
        </div>

        <CarouselDots pageCount={pageCount} page={page} setPage={setPage} theme={theme} />
      </div>
    </>
  );
}

function TeachersSection({ config, theme, glass, gradText }: SecProps) {
  const { page, setPage, pageCount, setPaused, go } = useCarousel(config.teachers.list.length, TEACHERS_PER_PAGE, SECTION_AUTOPLAY_MS);
  const pageTeachers = config.teachers.list.slice(page * TEACHERS_PER_PAGE, page * TEACHERS_PER_PAGE + TEACHERS_PER_PAGE);
  return (
    <>
      <SectionHeading eyebrow={SECTION_META.teachers.label} title={config.teachers.heading} subtitle={config.teachers.subtitle} theme={theme} gradText={gradText} />
      <div className="mt-10" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="relative">
          <div key={page} className="lp-anim-fade grid grid-cols-1 gap-5 @xs:grid-cols-2 @3xl:grid-cols-4">
            {pageTeachers.map((t) => (
              <div key={t.id} className="overflow-hidden rounded-2xl text-center transition-transform hover:-translate-y-1" style={glass}>
                <div className="relative mx-auto mt-6 h-24 w-24 overflow-hidden rounded-full" style={{ border: `2px solid ${theme.border}` }}>
                  <ImageWithFallback src={t.photo} alt={t.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-5 pt-4">
                  <h3 className="text-[0.92rem] font-bold" style={{ color: theme.text }}>{t.name}</h3>
                  <p className="mt-1 text-[0.8rem]" style={{ color: theme.accent }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
          <CarouselArrows pageCount={pageCount} go={go} theme={theme} />
        </div>
        <CarouselDots pageCount={pageCount} page={page} setPage={setPage} theme={theme} />
      </div>
    </>
  );
}

function StatBand({
  icon: Icon,
  value,
  label,
  theme,
  glass,
  suffix,
}: {
  icon: typeof GraduationCap;
  value: number;
  label: string;
  theme: (typeof THEMES)[keyof typeof THEMES];
  glass: React.CSSProperties;
  suffix: string;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 rounded-3xl px-6 py-10 text-center" style={glass}>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundImage: theme.ctaGradient, boxShadow: theme.ctaGlow }}>
        <Icon className="h-7 w-7 text-white" />
      </span>
      <div className="text-[3rem] font-extrabold leading-none @2xl:text-[3.6rem]">
        <span
          style={{
            backgroundImage: theme.headingGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {value.toLocaleString("es")}
          {suffix}
        </span>
      </div>
      <div className="text-[0.95rem] font-medium" style={{ color: theme.textMuted }}>{label}</div>
    </div>
  );
}

function ContactSection({ config, theme, glass, gradText }: SecProps) {
  const items = [
    { icon: MessageCircle, label: "WhatsApp", value: config.contact.whatsapp, href: `https://wa.me/${config.contact.whatsapp.replace(/[^\d]/g, "")}` },
    { icon: Phone, label: "Teléfono fijo", value: config.contact.phone, href: `tel:${config.contact.phone.replace(/[^\d+]/g, "")}` },
    { icon: Mail, label: "Correo", value: config.contact.email, href: `mailto:${config.contact.email}` },
  ];
  return (
    <>
      <SectionHeading eyebrow={SECTION_META.contact.label} title={config.contact.heading} subtitle={config.contact.subtitle} theme={theme} gradText={gradText} />
      <div className="mt-10 grid grid-cols-1 gap-4 @2xl:grid-cols-3">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <a
              key={it.label}
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 rounded-2xl p-6 text-center no-underline transition-transform hover:-translate-y-1"
              style={glass}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
                <Icon className="h-6 w-6" style={{ color: theme.accent }} />
              </span>
              <div className="text-[0.78rem] font-semibold uppercase tracking-wider" style={{ color: theme.textMuted }}>{it.label}</div>
              <div className="text-[0.95rem] font-bold" style={{ color: theme.text }}>{it.value}</div>
            </a>
          );
        })}
      </div>
    </>
  );
}
