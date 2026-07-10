import { ArrowUp, ArrowDown, Trash2, GripVertical } from "lucide-react";
import type { LandingConfig, GalleryImage } from "@/pages/Auth/LandingPage/interfaces/types";
import { INPUT } from "../functions/useDirectorPresentacion";
import { TextField } from "./TextField";
import { IconBtn } from "./IconBtn";
import { AddButton } from "./AddButton";

export function TabGaleria({
  config,
  patchGallery,
  galleryDragIdx,
  setGalleryDragIdx,
  addImage,
  updateImage,
  removeImage,
  moveImage,
  moveImageToIndex,
}: {
  config: LandingConfig;
  patchGallery: (p: Partial<Omit<LandingConfig["gallery"], "images">>) => void;
  galleryDragIdx: number | null;
  setGalleryDragIdx: (i: number | null) => void;
  addImage: () => void;
  updateImage: (id: string, p: Partial<GalleryImage>) => void;
  removeImage: (id: string) => void;
  moveImage: (i: number, dir: -1 | 1) => void;
  moveImageToIndex: (from: number, to: number) => void;
}) {
  return (
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
  );
}
