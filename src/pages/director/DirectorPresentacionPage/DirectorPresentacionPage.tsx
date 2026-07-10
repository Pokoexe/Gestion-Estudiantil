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

import { ConfirmDialog } from "@shared/ui/ConfirmDialog";
import { useDirectorPresentacion } from "./functions/useDirectorPresentacion";
import { PreviewPanel } from "./ui/PreviewPanel";
import { OptionsPanel } from "./ui/OptionsPanel";
import { FullscreenPreview } from "./ui/FullscreenPreview";
import { FlashMessage } from "./ui/FlashMessage";

export function DirectorPresentacionPage() {
  const {
    config,
    tab,
    setTab,
    device,
    setDevice,
    fullscreen,
    setFullscreen,
    flash,
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
    previewLogin,
    previewEnroll,
  } = useDirectorPresentacion();

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
        <PreviewPanel
          device={device}
          config={config}
          optionsOpen={optionsOpen}
          setOptionsOpen={setOptionsOpen}
          previewLogin={previewLogin}
          previewEnroll={previewEnroll}
        />

        {/* Panel de opciones — 1.5fr (derecha) */}
        <OptionsPanel
          optionsOpen={optionsOpen}
          device={device}
          setDevice={setDevice}
          tab={tab}
          setTab={setTab}
          config={config}
          enabledCount={enabledCount}
          dragIdx={dragIdx}
          setDragIdx={setDragIdx}
          galleryDragIdx={galleryDragIdx}
          setGalleryDragIdx={setGalleryDragIdx}
          setConfirm={setConfirm}
          setFullscreen={setFullscreen}
          patch={patch}
          patchTeachers={patchTeachers}
          patchGallery={patchGallery}
          patchContact={patchContact}
          setTemplate={setTemplate}
          moveSectionToIndex={moveSectionToIndex}
          moveSection={moveSection}
          toggleSection={toggleSection}
          addTeacher={addTeacher}
          updateTeacher={updateTeacher}
          removeTeacher={removeTeacher}
          moveTeacher={moveTeacher}
          addImage={addImage}
          updateImage={updateImage}
          removeImage={removeImage}
          moveImage={moveImage}
          moveImageToIndex={moveImageToIndex}
          publish={publish}
          discard={discard}
        />
      </div>

      {/* ── Vista previa a pantalla completa ── */}
      {fullscreen && (
        <FullscreenPreview
          device={device}
          setDevice={setDevice}
          config={config}
          setFullscreen={setFullscreen}
          setConfirm={setConfirm}
          publish={publish}
          previewLogin={previewLogin}
          previewEnroll={previewEnroll}
        />
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
      {flash && <FlashMessage flash={flash} />}
    </div>
  );
}
