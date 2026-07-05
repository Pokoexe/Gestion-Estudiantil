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
import type { ThemeId } from "./types";

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

      {/* Íconos decorativos flotantes (comunes). */}
      {DECO_SPOTS.map((spot, i) => {
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
