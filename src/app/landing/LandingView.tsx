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
      {enabled.map((id) => (
        <Section
          key={id}
          id={id}
          config={config}
          theme={theme}
          glass={glass}
          gradText={gradText}
          onEnroll={onEnroll}
        />
      ))}

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
}: {
  id: SectionId;
  config: LandingConfig;
  theme: (typeof THEMES)[keyof typeof THEMES];
  glass: React.CSSProperties;
  gradText: React.CSSProperties;
  onEnroll?: () => void;
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
        {id === "location" && <LocationSection config={config} theme={theme} glass={glass} gradText={gradText} />}
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

function CoursesSection({ config, theme, glass, gradText }: SecProps) {
  const courses = EXTRA_COURSES.slice(0, 6);
  return (
    <>
      <SectionHeading eyebrow={SECTION_META.courses.label} title={config.courses.heading} subtitle={config.courses.subtitle} theme={theme} gradText={gradText} />
      <div className="mt-10 grid grid-cols-1 gap-5 @2xl:grid-cols-2 @4xl:grid-cols-3">
        {courses.map((c) => (
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
    </>
  );
}

function ActivitiesSection({ config, theme, glass, gradText }: SecProps) {
  return (
    <>
      <SectionHeading eyebrow={SECTION_META.activities.label} title={config.activities.heading} subtitle={config.activities.subtitle} theme={theme} gradText={gradText} />
      <div className="mt-10 grid grid-cols-1 gap-4 @3xl:grid-cols-2">
        {FEATURED_ACTIVITIES.map((a) => (
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
    </>
  );
}

function LocationSection({ config, theme, glass, gradText }: SecProps) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-8 @3xl:grid-cols-2">
      <div className="flex flex-col justify-center">
        <span className="text-[0.74rem] font-bold uppercase tracking-[0.14em]" style={{ color: theme.accent }}>
          {SECTION_META.location.label}
        </span>
        <h2 className="mt-2 text-[1.7rem] font-extrabold leading-tight @2xl:text-[2.1rem]">
          <span style={gradText}>{config.location.heading}</span>
        </h2>
        <ul className="mt-5 flex flex-col gap-3 text-[0.92rem]" style={{ color: theme.textMuted }}>
          <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: theme.accent }} /><span>{config.location.address}<br />{config.location.city}</span></li>
          <li className="flex items-start gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0" style={{ color: theme.accent }} /><span>{config.location.hours}</span></li>
        </ul>
      </div>
      <div className="relative min-h-[240px] overflow-hidden rounded-3xl" style={glass}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="relative flex h-14 w-14 items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-40 lp-anim-glow" style={{ background: theme.accent }} />
            <MapPin className="relative h-9 w-9" style={{ color: theme.accent }} />
          </span>
          <div className="mt-2 text-[0.82rem] font-semibold" style={{ color: theme.text }}>{config.location.city}</div>
        </div>
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
  const pageCount = Math.max(1, Math.ceil(images.length / GALLERY_PER_PAGE));
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  // Si se eliminan imágenes en el editor y la página actual queda fuera de
  // rango, la reajustamos a la última disponible.
  useEffect(() => {
    if (page > pageCount - 1) setPage(pageCount - 1);
  }, [page, pageCount]);

  // Avance automático cada 5 s. Se reinicia el temporizador en cada cambio de
  // página (también al navegar manualmente) y se pausa al pasar el cursor.
  // Respeta la preferencia de "reducir movimiento" del sistema.
  useEffect(() => {
    if (pageCount <= 1 || paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setPage((p) => (p + 1) % pageCount), GALLERY_AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [page, pageCount, paused]);

  const go = (dir: -1 | 1) => setPage((p) => (p + dir + pageCount) % pageCount);
  const pageImages = images.slice(page * GALLERY_PER_PAGE, page * GALLERY_PER_PAGE + GALLERY_PER_PAGE);

  const arrowStyle: React.CSSProperties = {
    background: theme.surfaceSolid,
    border: `1px solid ${theme.border}`,
    color: theme.text,
    boxShadow: "0 6px 16px rgba(0,0,0,0.28)",
  };

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
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${i === 0 ? "h-full min-h-[160px] @2xl:min-h-[336px]" : "h-40"}`}
                />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 p-3" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
                    <span className="text-[0.78rem] font-medium text-white">{img.caption}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {pageCount > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                aria-label="Página anterior"
                className="absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-110 @2xl:-left-3"
                style={arrowStyle}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Página siguiente"
                className="absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-110 @2xl:-right-3"
                style={arrowStyle}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {pageCount > 1 && (
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
        )}
      </div>
    </>
  );
}

function TeachersSection({ config, theme, glass, gradText }: SecProps) {
  return (
    <>
      <SectionHeading eyebrow={SECTION_META.teachers.label} title={config.teachers.heading} subtitle={config.teachers.subtitle} theme={theme} gradText={gradText} />
      <div className="mt-10 grid grid-cols-1 gap-5 @xs:grid-cols-2 @3xl:grid-cols-4">
        {config.teachers.list.map((t) => (
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
