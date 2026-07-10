/**
 * Persistencia de la landing page en localStorage.
 *
 *   - PUBLISHED_KEY → configuración publicada; es la única que lee la raíz "/".
 *   - DRAFT_KEY     → autoguardado del editor; NO se usa en "/", solo evita
 *                     perder cambios mientras el docente personaliza.
 *
 * Antes se usaban cookies, pero la config completa (12 imágenes, docentes,
 * textos) supera el límite de ~4 KB por cookie y el navegador la rechazaba en
 * silencio (la publicación no se reflejaba en "/"). localStorage admite ~5 MB.
 * Se conserva una lectura de compatibilidad desde la cookie anterior.
 *
 * Se normaliza siempre contra un default para tolerar datos viejos o
 * incompletos (mezcla superficial + saneo de la lista de secciones).
 */

import {
  makeDefaultConfig,
  DEFAULT_TEMPLATE,
  SECTION_ORDER,
  type LandingConfig,
  type SectionEntry,
  type SectionId,
  type ThemeId,
} from "../interfaces/types";

const PUBLISHED_KEY = "edu_landing_v1";
const DRAFT_KEY = "edu_landing_draft_v1";

/* ---------------------------------------------------------------- */
/* Almacenamiento de bajo nivel (localStorage + migración de cookie) */
/* ---------------------------------------------------------------- */

/** Lee una cookie por nombre (solo para migrar datos publicados antiguos). */
function readLegacyCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const found = document.cookie
    .split("; ")
    .find((row) => row.startsWith(prefix));
  return found ? decodeURIComponent(found.slice(prefix.length)) : null;
}

/** Borra la cookie anterior una vez migrada a localStorage. */
function removeLegacyCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

function readStore(name: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(name);
    if (v !== null) return v;
  } catch {
    /* localStorage no disponible (modo privado, etc.) */
  }
  // Compatibilidad: usa la cookie anterior si aún existe.
  return readLegacyCookie(name);
}

function writeStore(name: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(name, value);
  } catch {
    /* cuota excedida u otro error */
  }
  // La cookie vieja quedó obsoleta (límite de 4 KB); se elimina.
  removeLegacyCookie(name);
}

function removeStore(name: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(name);
  } catch {
    /* localStorage no disponible */
  }
  removeLegacyCookie(name);
}

/* ---------------------------------------------------------------- */
/* Normalización                                                    */
/* ---------------------------------------------------------------- */

/** Garantiza que estén todas las secciones, sin duplicados ni pérdidas. */
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

  return result;
}

/** Mezcla una config parcial (de cookie) sobre el default de su plantilla. */
export function normalizeConfig(partial: Partial<LandingConfig> | null): LandingConfig {
  const template: ThemeId =
    partial?.template === "espacial" ||
    partial?.template === "tecnologico" ||
    partial?.template === "cosmico"
      ? partial.template
      : DEFAULT_TEMPLATE;

  const base = makeDefaultConfig(template);
  if (!partial) return base;

  return {
    ...base,
    ...partial,
    template,
    hero: { ...base.hero, ...partial.hero },
    inscripciones: { ...base.inscripciones, ...partial.inscripciones },
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
  return parse(readStore(PUBLISHED_KEY));
}

/** Publica la configuración: crea/actualiza el registro que lee la raíz "/". */
export function savePublished(config: LandingConfig): void {
  writeStore(PUBLISHED_KEY, JSON.stringify(config));
}

/** Borrador de edición (autoguardado). null si no existe. */
export function loadDraft(): LandingConfig | null {
  return parse(readStore(DRAFT_KEY));
}

/** Guarda el borrador mientras se edita (no afecta la raíz). */
export function saveDraft(config: LandingConfig): void {
  writeStore(DRAFT_KEY, JSON.stringify(config));
}

/** Elimina el borrador (al descartar cambios o tras publicar). */
export function clearDraft(): void {
  removeStore(DRAFT_KEY);
}

export function hasPublished(): boolean {
  return readStore(PUBLISHED_KEY) !== null;
}

export function hasDraft(): boolean {
  return readStore(DRAFT_KEY) !== null;
}
