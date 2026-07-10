import { Eye, Save, RotateCcw } from "lucide-react";
import type { LandingConfig, ThemeId, Teacher, GalleryImage } from "@/pages/Auth/LandingPage/interfaces/types";
import type { Tab, Device, Confirm } from "../interfaces";
import { TABS } from "../functions/useDirectorPresentacion";
import { DeviceToggle } from "./DeviceToggle";
import { TabPlantillas } from "./TabPlantillas";
import { TabDocentes } from "./TabDocentes";
import { TabGaleria } from "./TabGaleria";
import { TabContacto } from "./TabContacto";
import { TabOrden } from "./TabOrden";

export function OptionsPanel({
  optionsOpen,
  device,
  setDevice,
  tab,
  setTab,
  config,
  enabledCount,
  dragIdx,
  setDragIdx,
  galleryDragIdx,
  setGalleryDragIdx,
  setConfirm,
  setFullscreen,
  patch,
  patchTeachers,
  patchGallery,
  patchContact,
  setTemplate,
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
}: {
  optionsOpen: boolean;
  device: Device;
  setDevice: (d: Device) => void;
  tab: Tab;
  setTab: (t: Tab) => void;
  config: LandingConfig;
  enabledCount: number;
  dragIdx: number | null;
  setDragIdx: (i: number | null) => void;
  galleryDragIdx: number | null;
  setGalleryDragIdx: (i: number | null) => void;
  setConfirm: (c: Confirm) => void;
  setFullscreen: (v: boolean) => void;
  patch: (p: Partial<LandingConfig>) => void;
  patchTeachers: (p: Partial<Omit<LandingConfig["teachers"], "list">>) => void;
  patchGallery: (p: Partial<Omit<LandingConfig["gallery"], "images">>) => void;
  patchContact: (p: Partial<LandingConfig["contact"]>) => void;
  setTemplate: (t: ThemeId) => void;
  moveSectionToIndex: (from: number, to: number) => void;
  moveSection: (i: number, dir: -1 | 1) => void;
  toggleSection: (i: number) => void;
  addTeacher: () => void;
  updateTeacher: (id: string, p: Partial<Teacher>) => void;
  removeTeacher: (id: string) => void;
  moveTeacher: (i: number, dir: -1 | 1) => void;
  addImage: () => void;
  updateImage: (id: string, p: Partial<GalleryImage>) => void;
  removeImage: (id: string) => void;
  moveImage: (i: number, dir: -1 | 1) => void;
  moveImageToIndex: (from: number, to: number) => void;
  publish: () => void;
  discard: () => void;
}) {
  return (
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

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === "plantillas" && (
          <TabPlantillas config={config} setTemplate={setTemplate} patch={patch} />
        )}
        {tab === "docentes" && (
          <TabDocentes
            config={config}
            patchTeachers={patchTeachers}
            addTeacher={addTeacher}
            updateTeacher={updateTeacher}
            removeTeacher={removeTeacher}
            moveTeacher={moveTeacher}
          />
        )}
        {tab === "galeria" && (
          <TabGaleria
            config={config}
            patchGallery={patchGallery}
            galleryDragIdx={galleryDragIdx}
            setGalleryDragIdx={setGalleryDragIdx}
            addImage={addImage}
            updateImage={updateImage}
            removeImage={removeImage}
            moveImage={moveImage}
            moveImageToIndex={moveImageToIndex}
          />
        )}
        {tab === "contacto" && (
          <TabContacto config={config} patchContact={patchContact} />
        )}
        {tab === "orden" && (
          <TabOrden
            config={config}
            enabledCount={enabledCount}
            dragIdx={dragIdx}
            setDragIdx={setDragIdx}
            moveSectionToIndex={moveSectionToIndex}
            moveSection={moveSection}
            toggleSection={toggleSection}
          />
        )}
      </div>
    </div>
  );
}
