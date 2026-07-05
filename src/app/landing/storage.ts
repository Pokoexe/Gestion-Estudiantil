/**
 * Persistencia de la landing page en COOKIES.
 *
 *   - PUBLISHED_KEY → configuración publicada; es la única que lee la raíz "/".
 *   - DRAFT_KEY     → autoguardado del editor; NO se usa en "/", solo evita
 *                     perder cambios mientras el docente personaliza.
 *
 * Se normaliza siempre contra un default para tolerar cookies viejas o
 * incompletas (mezcla superficial + saneo de la lista de secciones).
 */

import {
  makeDefaultConfig,
  DEFAULT_TEMPLATE,
  SECTION_ORDER,
  MAX_ENABLED_SECTIONS,
  type LandingConfig,
  type SectionEntry,
  type SectionId,
  type ThemeId,
} from "./types";

const PUBLISHED_KEY = "edu_landing_v1";
const DRAFT_KEY = "edu_landing_draft_v1";
const ONE_YEAR = 60 * 60 * 24 * 365;

/* ---------------------------------------------------------------- */
/* Cookies de bajo nivel                                            */
/* ---------------------------------------------------------------- */

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const found = document.cookie
    .split("; ")
    .find((row) => row.startsWith(prefix));
  return found ? decodeURIComponent(found.slice(prefix.length)) : null;
}

function writeCookie(name: string, value: string, maxAgeSec = ONE_YEAR) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSec}; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

/* ---------------------------------------------------------------- */
/* Normalización                                                    */
/* ---------------------------------------------------------------- */

/** Garantiza que estén las 9 secciones, sin duplicados y respetando el tope. */
function normalizeSections(raw: unknown): SectionEntry[] {
  const arr = Array.isArray(raw) ? (raw as Partial<SectionEntry>[]) : [];
  const seen = new Set<SectionId>();
  const result: SectionEntry[] = [];

  for (const item of arr) {
    const id = item?.id as SectionId | undefined;
    if (id && SECTION_ORDER.includes(id) && !seen.has(id)) {
      seen.add(id);
      result.push({ id, enabled: !!item.enabled });
    }
  }
  // Agrega las que falten (deshabilitadas) para no perder ninguna sección.
  for (const id of SECTION_ORDER) {
    if (!seen.has(id)) result.push({ id, enabled: false });
  }

  // Respeta el máximo de secciones activas.
  let active = 0;
  return result.map((s) => {
    if (s.enabled && active >= MAX_ENABLED_SECTIONS) return { ...s, enabled: false };
    if (s.enabled) active += 1;
    return s;
  });
}

/** Mezcla una config parcial (de cookie) sobre el default de su plantilla. */
export function normalizeConfig(partial: Partial<LandingConfig> | null): LandingConfig {
  const template: ThemeId =
    partial?.template === "espacial" || partial?.template === "tecnologico"
      ? partial.template
      : DEFAULT_TEMPLATE;

  const base = makeDefaultConfig(template);
  if (!partial) return base;

  return {
    ...base,
    ...partial,
    template,
    hero: { ...base.hero, ...partial.hero },
    about: { ...base.about, ...partial.about },
    courses: { ...base.courses, ...partial.courses },
    activities: { ...base.activities, ...partial.activities },
    location: { ...base.location, ...partial.location },
    gallery: {
      ...base.gallery,
      ...partial.gallery,
      images: partial.gallery?.images ?? base.gallery.images,
    },
    teachers: {
      ...base.teachers,
      ...partial.teachers,
      list: partial.teachers?.list ?? base.teachers.list,
    },
    students: { ...base.students, ...partial.students },
    experience: { ...base.experience, ...partial.experience },
    contact: { ...base.contact, ...partial.contact },
    sections: normalizeSections(partial.sections),
  };
}

function parse(value: string | null): LandingConfig | null {
  if (!value) return null;
  try {
    return normalizeConfig(JSON.parse(value) as Partial<LandingConfig>);
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------- */
/* API pública                                                      */
/* ---------------------------------------------------------------- */

/** Config publicada (la que muestra la raíz). null si no existe. */
export function loadPublished(): LandingConfig | null {
  return parse(readCookie(PUBLISHED_KEY));
}

/** Publica la configuración: crea/actualiza la cookie que lee la raíz "/". */
export function savePublished(config: LandingConfig): void {
  writeCookie(PUBLISHED_KEY, JSON.stringify(config));
}

/** Borrador de edición (autoguardado). null si no existe. */
export function loadDraft(): LandingConfig | null {
  return parse(readCookie(DRAFT_KEY));
}

/** Guarda el borrador mientras se edita (no afecta la raíz). */
export function saveDraft(config: LandingConfig): void {
  writeCookie(DRAFT_KEY, JSON.stringify(config));
}

/** Elimina el borrador (al descartar cambios o tras publicar). */
export function clearDraft(): void {
  removeCookie(DRAFT_KEY);
}

export function hasPublished(): boolean {
  return readCookie(PUBLISHED_KEY) !== null;
}

export function hasDraft(): boolean {
  return readCookie(DRAFT_KEY) !== null;
}
