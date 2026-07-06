/**
 * Definición visual de las 2 plantillas y sus fondos decorativos.
 *
 * Tecnológico → computadoras, robots, mecánica (tonos cian/azul, circuitos).
 * Espacial    → sistema solar: estrellas, planetas, satélites (púrpura/índigo).
 *
 * Los fondos se dibujan 100% con CSS (gradientes, sombras) + íconos de lucide,
 * así no dependen de imágenes externas y quedan nítidos en cualquier tamaño.
 */

import type { LucideIcon } from "lucide-react";
import {
  Cpu,
  Bot,
  CircuitBoard,
  Cog,
  Car,
  Wrench,
  Rocket,
  Star,
  Satellite,
  Sparkles,
  Orbit,
  Telescope,
} from "lucide-react";
import type { SectionId, ThemeId } from "./types";

export interface BackgroundOption {
  id: string;
  label: string;
}

export interface ThemePalette {
  id: ThemeId;
  name: string;
  tagline: string;
  icon: LucideIcon;
  /** Acentos principales. */
  accent: string;
  accent2: string;
  /** Fondo base y superficie de tarjetas. */
  bg: string;
  surface: string;
  surfaceSolid: string;
  /** Texto. */
  text: string;
  textMuted: string;
  /** Borde translúcido para tarjetas de vidrio. */
  border: string;
  /** Gradiente para títulos y botones. */
  headingGradient: string;
  ctaGradient: string;
  /** Sombra de resplandor del CTA. */
  ctaGlow: string;
  backgrounds: BackgroundOption[];
  /** Íconos decorativos flotantes. */
  deco: LucideIcon[];
}

export const THEMES: Record<ThemeId, ThemePalette> = {
  tecnologico: {
    id: "tecnologico",
    name: "Tecnológico",
    tagline: "Computadoras, robots y mecánica",
    icon: Cpu,
    accent: "#22d3ee",
    accent2: "#3b82f6",
    bg: "#060b18",
    surface: "rgba(255,255,255,0.04)",
    surfaceSolid: "#0d1526",
    text: "#e8eef7",
    textMuted: "#9fb0cc",
    border: "rgba(56,189,248,0.18)",
    headingGradient: "linear-gradient(100deg,#67e8f9 0%,#38bdf8 45%,#3b82f6 100%)",
    ctaGradient: "linear-gradient(100deg,#22d3ee 0%,#3b82f6 100%)",
    ctaGlow: "0 12px 34px rgba(34,211,238,0.35)",
    backgrounds: [
      { id: "circuitos", label: "Circuitos" },
      { id: "rejilla", label: "Rejilla" },
      { id: "ondas", label: "Ondas" },
    ],
    deco: [Cpu, Bot, CircuitBoard, Cog, Car, Wrench],
  },
  espacial: {
    id: "espacial",
    name: "Espacial",
    tagline: "Estrellas, planetas y satélites",
    icon: Rocket,
    accent: "#a855f7",
    accent2: "#6366f1",
    bg: "#070312",
    surface: "rgba(255,255,255,0.05)",
    surfaceSolid: "#150a29",
    text: "#ece7f7",
    textMuted: "#b0a4cd",
    border: "rgba(168,85,247,0.22)",
    headingGradient: "linear-gradient(100deg,#c4b5fd 0%,#a855f7 45%,#ec4899 100%)",
    ctaGradient: "linear-gradient(100deg,#a855f7 0%,#6366f1 100%)",
    ctaGlow: "0 12px 34px rgba(168,85,247,0.4)",
    backgrounds: [
      { id: "estrellado", label: "Estrellado" },
      { id: "nebulosa", label: "Nebulosa" },
      { id: "orbitas", label: "Órbitas" },
    ],
    deco: [Rocket, Star, Satellite, Sparkles, Orbit, Telescope],
  },
  cosmico: {
    id: "cosmico",
    name: "Cósmico",
    tagline: "Astronautas, planetas y estrellas fugaces",
    icon: Star,
    accent: "#f472b6",
    accent2: "#22d3ee",
    bg: "#0a0616",
    surface: "rgba(255,255,255,0.05)",
    surfaceSolid: "#160f2e",
    text: "#f6f1ff",
    textMuted: "#c9bce6",
    border: "rgba(244,114,182,0.24)",
    headingGradient: "linear-gradient(100deg,#fde047 0%,#f472b6 48%,#a855f7 100%)",
    ctaGradient: "linear-gradient(100deg,#ec4899 0%,#8b5cf6 100%)",
    ctaGlow: "0 12px 34px rgba(236,72,153,0.4)",
    backgrounds: [
      { id: "galaxia", label: "Galaxia" },
      { id: "cometas", label: "Cometas" },
      { id: "planetas", label: "Planetas" },
    ],
    deco: [Rocket, Star, Sparkles, Orbit, Satellite, Telescope],
  },
};

/** Posiciones fijas de los íconos flotantes (deterministas, sin random). */
const DECO_SPOTS = [
  { top: "14%", left: "8%", size: 34, anim: "lp-anim-float", delay: "0s", opacity: 0.16 },
  { top: "24%", left: "86%", size: 44, anim: "lp-anim-float-slow", delay: "0.8s", opacity: 0.14 },
  { top: "62%", left: "5%", size: 40, anim: "lp-anim-float-x", delay: "1.4s", opacity: 0.12 },
  { top: "72%", left: "90%", size: 30, anim: "lp-anim-float", delay: "0.4s", opacity: 0.16 },
  { top: "44%", left: "48%", size: 26, anim: "lp-anim-float-slow", delay: "2s", opacity: 0.08 },
  { top: "84%", left: "40%", size: 36, anim: "lp-anim-float-x", delay: "1s", opacity: 0.1 },
];

/** Campo de estrellas dibujado con múltiples radial-gradients. */
const STARFIELD =
  "radial-gradient(1.5px 1.5px at 12% 18%, #fff, transparent)," +
  "radial-gradient(1.5px 1.5px at 27% 62%, #fff, transparent)," +
  "radial-gradient(1px 1px at 42% 28%, #e9d5ff, transparent)," +
  "radial-gradient(2px 2px at 58% 78%, #fff, transparent)," +
  "radial-gradient(1px 1px at 68% 12%, #c7d2fe, transparent)," +
  "radial-gradient(1.5px 1.5px at 78% 52%, #fff, transparent)," +
  "radial-gradient(1px 1px at 88% 84%, #fbcfe8, transparent)," +
  "radial-gradient(1.5px 1.5px at 8% 82%, #fff, transparent)," +
  "radial-gradient(1px 1px at 35% 92%, #fff, transparent)," +
  "radial-gradient(1.5px 1.5px at 92% 32%, #ddd6fe, transparent)";

/* ================================================================ */
/* Decoraciones caricaturescas — plantilla "Cósmico"                */
/* Dibujadas 100% con SVG/CSS. Se ubican en los márgenes/esquinas   */
/* del hero para acompañar el texto SIN solaparlo (ver ThemeBackground).*/
/* ================================================================ */

/** Estrella de 5 puntas con parpadeo. */
function CartoonStar({
  size,
  color,
  top,
  left,
  right,
  bottom,
  delay = "0s",
  className = "",
}: {
  size: number;
  color: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`lp-anim-twinkle ${className}`}
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        animationDelay: delay,
        filter: `drop-shadow(0 0 5px ${color})`,
        pointerEvents: "none",
      }}
    >
      <path
        d="M12 1.6l3 6.35 6.9.9-5 4.9 1.25 6.95L12 18.2l-6.15 3.4L7.1 14.65l-5-4.9 6.9-.9z"
        fill={color}
      />
    </svg>
  );
}

/** Planeta caricaturesco con anillo opcional, brillo y crateres. */
function CartoonPlanet({
  size,
  top,
  left,
  right,
  bottom,
  c1,
  c2,
  ring,
  anim = "lp-anim-float-slow",
  delay = "0s",
  className = "",
}: {
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  c1: string;
  c2: string;
  ring?: string;
  anim?: string;
  delay?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`${anim} ${className}`}
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        animationDelay: delay,
        pointerEvents: "none",
      }}
    >
      {ring && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: size * 1.75,
            height: size * 0.52,
            transform: "translate(-50%,-50%) rotate(-22deg)",
            borderRadius: "50%",
            border: `${Math.max(3, size * 0.08)}px solid ${ring}`,
            opacity: 0.85,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 26%, ${c1}, ${c2} 72%)`,
          boxShadow: `0 0 ${size * 0.45}px ${c2}55, inset -${size * 0.14}px -${size * 0.14}px ${size * 0.3}px rgba(0,0,0,0.35)`,
        }}
      />
      <span style={{ position: "absolute", top: "24%", left: "28%", width: size * 0.15, height: size * 0.15, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
      <span style={{ position: "absolute", top: "56%", left: "58%", width: size * 0.1, height: size * 0.1, borderRadius: "50%", background: "rgba(0,0,0,0.18)" }} />
    </div>
  );
}

/** Astronauta caricaturesco flotando con casco, visera y mochila. */
function CartoonAstronaut({
  size,
  top,
  left,
  right,
  bottom,
  suit,
  visor,
  anim = "lp-anim-float",
  delay = "0s",
  flip = false,
  className = "",
}: {
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  suit: string;
  visor: string;
  anim?: string;
  delay?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`${anim} ${className}`}
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        width: size,
        animationDelay: delay,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 120 140"
        className="lp-anim-wobble"
        style={{
          width: "100%",
          height: "auto",
          transform: flip ? "scaleX(-1)" : undefined,
          filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.35))",
        }}
      >
        {/* brazos y guantes */}
        <rect x="14" y="60" width="26" height="17" rx="8.5" fill={suit} />
        <rect x="80" y="60" width="26" height="17" rx="8.5" fill={suit} />
        <circle cx="16" cy="68" r="10" fill="#fdfdff" />
        <circle cx="104" cy="68" r="10" fill="#fdfdff" />
        {/* piernas y botas */}
        <rect x="40" y="94" width="17" height="34" rx="8.5" fill={suit} />
        <rect x="63" y="94" width="17" height="34" rx="8.5" fill={suit} />
        <circle cx="45" cy="128" r="10" fill="#fdfdff" />
        <circle cx="75" cy="128" r="10" fill="#fdfdff" />
        {/* torso / mochila */}
        <rect x="33" y="52" width="54" height="54" rx="21" fill={suit} />
        {/* panel de control en el pecho */}
        <rect x="49" y="72" width="22" height="15" rx="4" fill="#fdfdff" opacity="0.9" />
        <circle cx="55" cy="79.5" r="2.4" fill={visor} />
        <circle cx="65" cy="79.5" r="2.4" fill="#94a3b8" />
        {/* casco */}
        <circle cx="60" cy="40" r="31" fill="#eef2ff" />
        <circle cx="60" cy="40" r="30" fill="none" stroke="#cbd5e1" strokeWidth="2" opacity="0.6" />
        {/* visera */}
        <circle cx="60" cy="40" r="22" fill="#141034" />
        <ellipse cx="51" cy="32" rx="7.5" ry="10" fill={visor} opacity="0.75" />
        <circle cx="69" cy="47" r="3.4" fill="#ffffff" opacity="0.5" />
      </svg>
    </div>
  );
}

/** Estrella fugaz con estela que cruza en diagonal. */
function ShootingStar({
  top,
  left,
  length = 120,
  delay = "0s",
  duration = "5s",
  className = "",
}: {
  top: string;
  left: string;
  length?: number;
  delay?: string;
  duration?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`lp-anim-shoot ${className}`}
      style={{
        position: "absolute",
        top,
        left,
        animationDelay: delay,
        animationDuration: duration,
        pointerEvents: "none",
      }}
    >
      <div style={{ position: "relative", width: length, height: 2, transform: "rotate(20deg)" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85))" }} />
        <div style={{ position: "absolute", right: -2, top: -2, width: 6, height: 6, borderRadius: "50%", background: "#fff", boxShadow: "0 0 10px 2px rgba(255,255,255,0.9)" }} />
      </div>
    </div>
  );
}

/**
 * Fondo decorativo del tema. Se coloca absoluto detrás del contenido.
 * `variant` es el id del fondo seleccionado.
 */
export function ThemeBackground({
  theme,
  variant,
}: {
  theme: ThemePalette;
  variant: string;
}) {
  const glow = (color: string, top: string, left: string, size = 460, o = 0.5) => (
    <div
      className="lp-anim-glow"
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: o,
        filter: "blur(20px)",
        pointerEvents: "none",
      }}
    />
  );

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      style={{ background: theme.bg, pointerEvents: "none" }}
    >
      {/* Resplandores base comunes a todos los fondos. */}
      {glow(theme.accent, "-8%", "-6%", 520, 0.4)}
      {glow(theme.accent2, "60%", "78%", 560, 0.35)}

      {/* ── Variantes Tecnológico ── */}
      {theme.id === "tecnologico" && variant === "circuitos" && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(56,189,248,0.09) 1px, transparent 1px)," +
                "linear-gradient(90deg, rgba(56,189,248,0.09) 1px, transparent 1px)",
              backgroundSize: "54px 54px",
              maskImage: "radial-gradient(circle at 50% 40%, #000 30%, transparent 85%)",
              WebkitMaskImage: "radial-gradient(circle at 50% 40%, #000 30%, transparent 85%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(34,211,238,0.5) 2px, transparent 2px)",
              backgroundSize: "54px 54px",
              backgroundPosition: "27px 27px",
              opacity: 0.4,
              maskImage: "radial-gradient(circle at 50% 40%, #000 20%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(circle at 50% 40%, #000 20%, transparent 75%)",
            }}
          />
        </>
      )}
      {theme.id === "tecnologico" && variant === "rejilla" && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(59,130,246,0.35) 1.5px, transparent 1.5px)",
            backgroundSize: "34px 34px",
            maskImage: "radial-gradient(ellipse at 50% 30%, #000 40%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, #000 40%, transparent 85%)",
          }}
        />
      )}
      {theme.id === "tecnologico" && variant === "ondas" && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(34,211,238,0.06) 0 2px, transparent 2px 26px)",
          }}
        />
      )}

      {/* ── Variantes Espacial ── */}
      {theme.id === "espacial" && (variant === "estrellado" || variant === "orbitas") && (
        <div
          className="absolute inset-0 lp-anim-twinkle"
          style={{ backgroundImage: STARFIELD }}
        />
      )}
      {theme.id === "espacial" && variant === "nebulosa" && (
        <>
          {glow("#ec4899", "10%", "20%", 520, 0.28)}
          {glow("#6366f1", "40%", "10%", 480, 0.3)}
          <div
            className="absolute inset-0 lp-anim-twinkle"
            style={{ backgroundImage: STARFIELD, opacity: 0.5 }}
          />
        </>
      )}
      {theme.id === "espacial" && variant === "orbitas" && (
        <div className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2">
          {[220, 360, 520].map((d, i) => (
            <div
              key={d}
              className={i % 2 === 0 ? "lp-anim-spin-slow" : "lp-anim-spin-slower"}
              style={{
                position: "absolute",
                width: d,
                height: d,
                marginLeft: -d / 2,
                marginTop: -d / 2,
                borderRadius: "50%",
                border: `1px solid ${theme.border}`,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: -5,
                  left: "50%",
                  width: 10,
                  height: 10,
                  marginLeft: -5,
                  borderRadius: "50%",
                  background: i === 0 ? theme.accent : theme.accent2,
                  boxShadow: `0 0 12px ${i === 0 ? theme.accent : theme.accent2}`,
                }}
              />
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              width: 60,
              height: 60,
              marginLeft: -30,
              marginTop: -30,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 30%, #fbcfe8, ${theme.accent} 60%, #4c1d95)`,
              boxShadow: `0 0 40px ${theme.accent}`,
            }}
          />
        </div>
      )}

      {/* ── Plantilla Cósmico (caricaturesca) ── */}
      {theme.id === "cosmico" && (
        <>
          {/* Campo de estrellas de fondo. */}
          <div className="absolute inset-0 lp-anim-twinkle" style={{ backgroundImage: STARFIELD, opacity: 0.7 }} />
          {/* Nebulosa extra en la variante galaxia. */}
          {variant === "galaxia" && glow("#8b5cf6", "6%", "56%", 460, 0.24)}

          {/* Estrellas de 5 puntas — repartidas por bordes y esquinas. */}
          <CartoonStar size={26} color="#fde047" top="11%" left="15%" delay="0s" />
          <CartoonStar size={15} color="#f9a8d4" top="21%" left="32%" delay="0.6s" className="hidden @lg:block" />
          <CartoonStar size={20} color="#a5f3fc" top="70%" left="12%" delay="1.1s" />
          <CartoonStar size={22} color="#fde047" top="80%" left="86%" delay="0.3s" />
          <CartoonStar size={16} color="#c4b5fd" top="30%" left="72%" delay="1.6s" className="hidden @lg:block" />
          <CartoonStar size={18} color="#f9a8d4" top="58%" left="92%" delay="0.9s" className="hidden @md:block" />
          <CartoonStar size={14} color="#fef08a" top="88%" left="46%" delay="1.3s" className="hidden @lg:block" />

          {/* Planetas — pegados a los bordes para no invadir el texto centrado. */}
          <CartoonPlanet size={96} top="8%" left="2%" c1="#f9a8d4" c2="#a855f7" ring="#f472b6" delay="0s" className="hidden @xl:block" />
          <CartoonPlanet size={52} top="14%" left="89%" c1="#7dd3fc" c2="#2563eb" delay="0.8s" className="hidden @lg:block" />
          {variant !== "cometas" && (
            <CartoonPlanet size={64} top="70%" left="4%" c1="#fdba74" c2="#ea580c" ring="#fcd34d" anim="lp-anim-float-x" delay="1.2s" className="hidden @2xl:block" />
          )}
          {variant === "planetas" && (
            <>
              <CartoonPlanet size={74} top="50%" left="87%" c1="#c4b5fd" c2="#7c3aed" ring="#a78bfa" delay="0.5s" className="hidden @xl:block" />
              <CartoonPlanet size={40} top="84%" left="30%" c1="#6ee7b7" c2="#059669" delay="1.5s" className="hidden @2xl:block" />
            </>
          )}

          {/* Astronautas — flotan en los laterales, junto al texto sin taparlo. */}
          <CartoonAstronaut size={108} top="5%" left="79%" suit="#f472b6" visor="#f9a8d4" delay="0s" flip className="hidden @2xl:block" />
          <CartoonAstronaut size={88} top="64%" left="80%" suit="#38bdf8" visor="#a5f3fc" anim="lp-anim-float-slow" delay="1s" className="hidden @3xl:block" />
          <CartoonAstronaut size={72} top="58%" left="1%" suit="#a78bfa" visor="#c4b5fd" anim="lp-anim-float-x" delay="0.6s" className="hidden @4xl:block" />

          {/* Estrellas fugaces (más numerosas en la variante cometas). */}
          <ShootingStar top="16%" left="42%" length={130} delay="0s" duration="6s" className="hidden @lg:block" />
          <ShootingStar top="36%" left="10%" length={90} delay="2.4s" duration="5.5s" className="hidden @xl:block" />
          {variant === "cometas" && (
            <>
              <ShootingStar top="48%" left="54%" length={150} delay="1.2s" duration="5s" className="hidden @md:block" />
              <ShootingStar top="8%" left="24%" length={110} delay="3.2s" duration="6.5s" className="hidden @lg:block" />
              <ShootingStar top="66%" left="30%" length={120} delay="4s" duration="5.8s" className="hidden @xl:block" />
            </>
          )}

          {/* Velo oscuro central: realza la legibilidad del texto sobre la escena. */}
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 60% 56% at 50% 46%, rgba(10,6,22,0.6), transparent 76%)" }}
          />
        </>
      )}

      {/* Íconos decorativos flotantes (comunes, salvo Cósmico que trae su escena). */}
      {theme.id !== "cosmico" &&
        DECO_SPOTS.map((spot, i) => {
          const Icon = theme.deco[i % theme.deco.length];
          return (
            <Icon
              key={i}
              className={spot.anim}
              style={{
                position: "absolute",
                top: spot.top,
                left: spot.left,
                width: spot.size,
                height: spot.size,
                color: i % 2 === 0 ? theme.accent : theme.accent2,
                opacity: spot.opacity,
                animationDelay: spot.delay,
              }}
            />
          );
        })}
    </div>
  );
}

/* ================================================================ */
/* Decoración cósmica de los bloques de información (no solo el hero)*/
/* ================================================================ */

/**
 * Receta de decoración por sección: en qué lado se apoya, el planeta y un
 * astronauta opcional. Los colores/lados alternan para que la página no se
 * sienta repetitiva. En las secciones de dos columnas con texto sobre el
 * fondo (Sobre la institución, Ubicación) la decoración va del lado de la
 * TARJETA para no quedar bajo el texto.
 */
const COSMIC_SECTION_DECOR: Record<
  SectionId,
  {
    side: "left" | "right";
    planet: { size: number; c1: string; c2: string; ring?: string };
    astronaut?: { size: number; suit: string; visor: string };
  }
> = {
  inscripciones: { side: "right", planet: { size: 78, c1: "#f9a8d4", c2: "#8b5cf6", ring: "#f472b6" }, astronaut: { size: 82, suit: "#38bdf8", visor: "#a5f3fc" } },
  about:      { side: "right", planet: { size: 82, c1: "#f9a8d4", c2: "#a855f7", ring: "#f472b6" }, astronaut: { size: 78, suit: "#38bdf8", visor: "#a5f3fc" } },
  courses:    { side: "left",  planet: { size: 74, c1: "#7dd3fc", c2: "#2563eb" } },
  activities: { side: "right", planet: { size: 66, c1: "#fdba74", c2: "#ea580c", ring: "#fcd34d" }, astronaut: { size: 76, suit: "#f472b6", visor: "#f9a8d4" } },
  location:   { side: "right", planet: { size: 78, c1: "#c4b5fd", c2: "#7c3aed", ring: "#a78bfa" } },
  gallery:    { side: "left",  planet: { size: 62, c1: "#6ee7b7", c2: "#059669" } },
  teachers:   { side: "right", planet: { size: 74, c1: "#f9a8d4", c2: "#db2777", ring: "#fbcfe8" }, astronaut: { size: 78, suit: "#a78bfa", visor: "#c4b5fd" } },
  students:   { side: "left",  planet: { size: 66, c1: "#fde047", c2: "#f59e0b" } },
  experience: { side: "right", planet: { size: 66, c1: "#7dd3fc", c2: "#0ea5e9", ring: "#bae6fd" } },
  contact:    { side: "left",  planet: { size: 72, c1: "#c4b5fd", c2: "#7c3aed" }, astronaut: { size: 80, suit: "#38bdf8", visor: "#a5f3fc" } },
};

/**
 * Escena cósmica para un bloque de información. Se dibuja DETRÁS del contenido
 * (que va en una capa z-10 superior) y se apoya en los bordes/esquinas para
 * acompañar sin dificultar la lectura. Solo se usa con la plantilla Cósmico.
 */
export function CosmicSectionDecor({ id }: { id: SectionId }) {
  const d = COSMIC_SECTION_DECOR[id];
  const planetEdge = d.side === "left" ? { left: "-1.75rem" } : { right: "-1.75rem" };
  const astroEdge = d.side === "left" ? { left: "1.5%" } : { right: "1.5%" };

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden" style={{ pointerEvents: "none" }}>
      {/* Estrellas tenues de fondo: unen visualmente toda la página. */}
      <div className="absolute inset-0 lp-anim-twinkle" style={{ backgroundImage: STARFIELD, opacity: 0.22 }} />

      {/* Estrellitas en las esquinas (junto, no encima, del texto). */}
      <CartoonStar size={16} color="#fde047" top="12%" left="4%" delay="0s" className="hidden @lg:block" />
      <CartoonStar size={14} color="#a5f3fc" top="16%" right="6%" delay="0.7s" className="hidden @lg:block" />
      <CartoonStar size={15} color="#f9a8d4" bottom="12%" left="8%" delay="1.2s" className="hidden @xl:block" />
      <CartoonStar size={13} color="#c4b5fd" bottom="15%" right="10%" delay="0.4s" className="hidden @xl:block" />

      {/* Planeta apoyado en un borde lateral (parcialmente recortado). */}
      <CartoonPlanet
        size={d.planet.size}
        top="24%"
        {...planetEdge}
        c1={d.planet.c1}
        c2={d.planet.c2}
        ring={d.planet.ring}
        delay="0.3s"
        className="hidden @2xl:block"
      />

      {/* Astronauta flotando en el mismo lateral (solo pantallas amplias). */}
      {d.astronaut && (
        <CartoonAstronaut
          size={d.astronaut.size}
          top="54%"
          {...astroEdge}
          suit={d.astronaut.suit}
          visor={d.astronaut.visor}
          anim="lp-anim-float-slow"
          delay="0.6s"
          flip={d.side === "right"}
          className="hidden @3xl:block"
        />
      )}
    </div>
  );
}
