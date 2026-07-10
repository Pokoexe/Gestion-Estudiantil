import { ImageIcon } from "lucide-react";

type Props = {
  imgRef: React.RefObject<HTMLInputElement>;
  imgPreview: string | null;
  handleImg: (e: React.ChangeEvent<HTMLInputElement>) => void;
  titulo: string;
  setTitulo: (v: string) => void;
  descripcion: string;
  setDescripcion: (v: string) => void;
  cupos: string;
  setCupos: (v: string) => void;
  docente: string;
  setDocente: (v: string) => void;
  docentesOpciones: string[];
  inputCls: string;
  labelCls: string;
};

export function InfoTab({
  imgRef, imgPreview, handleImg,
  titulo, setTitulo,
  descripcion, setDescripcion,
  cupos, setCupos,
  docente, setDocente,
  docentesOpciones,
  inputCls, labelCls,
}: Props) {
  return (
    <div className="p-5 flex flex-col gap-5">
      {/* Imagen */}
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>
          Imagen del curso <span className="text-edu-ink-400 font-normal">(opcional)</span>
        </label>
        <div
          onClick={() => imgRef.current?.click()}
          className="relative border-[1.5px] border-dashed border-edu-border rounded-edu-control overflow-hidden cursor-pointer flex items-center justify-center transition-colors hover:border-edu-primary"
          style={{ height: imgPreview ? "200px" : "110px" }}
        >
          {imgPreview ? (
            <>
              <img src={imgPreview} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-semibold">Cambiar imagen</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-edu-ink-400">
              <ImageIcon className="w-7 h-7" />
              <span className="text-[0.8rem]">Haz clic para subir una imagen</span>
            </div>
          )}
        </div>
        <input ref={imgRef} type="file" accept="image/*" onChange={handleImg} className="sr-only" />
      </div>

      {/* Título */}
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>
          Título del curso <span className="text-edu-danger text-xs">requerido</span>
        </label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej. Robótica y automatización"
          className={inputCls}
          required
        />
      </div>

      {/* Descripción */}
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Describe brevemente el contenido y objetivos del curso…"
          rows={4}
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Cupos + Docente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>
            Cupos disponibles <span className="text-edu-danger text-xs">requerido</span>
          </label>
          <input
            type="number"
            min={1}
            value={cupos}
            onChange={(e) => setCupos(e.target.value)}
            placeholder="20"
            className={inputCls}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>
            Docente a cargo <span className="text-edu-danger text-xs">requerido</span>
          </label>
          <select
            value={docente}
            onChange={(e) => setDocente(e.target.value)}
            className={`${inputCls} cursor-pointer`}
            required
          >
            <option value="">Seleccionar docente</option>
            {docentesOpciones.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
