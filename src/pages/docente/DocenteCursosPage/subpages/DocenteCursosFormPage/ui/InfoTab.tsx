import { ImageIcon, User } from "lucide-react";

interface InfoTabProps {
    titulo: string;
    setTitulo: (v: string) => void;
    descripcion: string;
    setDescripcion: (v: string) => void;
    cupos: string;
    setCupos: (v: string) => void;
    imgPreview: string | null;
    imgRef: React.RefObject<HTMLInputElement>;
    handleImg: (e: React.ChangeEvent<HTMLInputElement>) => void;
    docente: { initials?: string; name?: string; role?: string } | null;
    inputCls: string;
    labelCls: string;
}

export function InfoTab({
    titulo, setTitulo,
    descripcion, setDescripcion,
    cupos, setCupos,
    imgPreview, imgRef, handleImg,
    docente,
    inputCls, labelCls,
}: InfoTabProps) {
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
                    <label className={labelCls}>Docente a cargo</label>
                    <div className="flex items-center gap-3 px-3.5 py-2.5 bg-edu-subtle rounded-edu-control border-[1.5px] border-edu-border">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[0.75rem] font-bold text-edu-primary shrink-0"
                            style={{ backgroundColor: "#eff6ff", border: "2px solid #bfdbfe" }}
                        >
                            {docente?.initials ?? "—"}
                        </div>
                        <div>
                            <div className="text-[0.875rem] font-semibold text-edu-ink">{docente?.name ?? "…"}</div>
                            <div className="text-[0.72rem] text-edu-ink-400 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {docente?.role ?? ""}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
