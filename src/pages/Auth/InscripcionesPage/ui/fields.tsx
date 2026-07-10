import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import {
    Camera,
    Upload,
    Trash2,
    X,
    FileText,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import type { FotoFile } from "../interfaces";

/* ------------------------------------------------------------------ */
/* StepTitle                                                           */
/* ------------------------------------------------------------------ */

export function StepTitle({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-edu-control bg-edu-primary-50 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-edu-primary" />
            </div>
            <div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">{title}</h3>
                <p className="text-edu-ink-400 text-[0.8rem] m-0">{subtitle}</p>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Field                                                               */
/* ------------------------------------------------------------------ */

export function Field({
    label,
    required,
    hint,
    children,
}: {
    label: string;
    required?: boolean;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">
                {label}{" "}
                {required && <span className="text-edu-danger text-xs">requerido</span>}
                {hint && <span className="text-edu-ink-400 font-normal text-xs">({hint})</span>}
            </label>
            {children}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* PhotoField                                                          */
/* ------------------------------------------------------------------ */

export function PhotoField({
    label,
    hint,
    foto,
    onPick,
    onRemove,
}: {
    label: string;
    hint: string;
    foto: FotoFile | null;
    onPick: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
}) {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">
                {label} <span className="text-edu-ink-400 font-normal text-xs">({hint})</span>
            </label>
            <div className="flex items-center gap-4">
                <div
                    onClick={() => ref.current?.click()}
                    className="relative w-24 h-24 rounded-edu-control border-[1.5px] border-dashed border-edu-border bg-edu-subtle overflow-hidden cursor-pointer flex items-center justify-center shrink-0 transition-colors hover:border-edu-primary"
                >
                    {foto ? (
                        <img src={foto.url} alt={label} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center gap-1 text-edu-ink-400">
                            <Camera className="w-6 h-6" />
                            <span className="text-[0.68rem]">Subir</span>
                        </div>
                    )}
                    <input ref={ref} type="file" accept="image/*" onChange={onPick} className="sr-only" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <button
                        type="button"
                        onClick={() => ref.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-[0.8125rem] font-semibold cursor-pointer hover:bg-edu-subtle transition-colors w-fit"
                    >
                        <Upload className="w-3.5 h-3.5" />
                        {foto ? "Cambiar foto" : "Subir foto"}
                    </button>
                    {foto && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="inline-flex items-center gap-1 text-[0.78rem] text-edu-danger font-medium cursor-pointer bg-transparent border-none p-0 w-fit"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Quitar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* DocField                                                            */
/* ------------------------------------------------------------------ */

export function DocField({
    label,
    required,
    fileName,
    onPick,
    onRemove,
}: {
    label: string;
    required?: boolean;
    fileName: string | null;
    onPick: (name: string) => void;
    onRemove: () => void;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">
                {label} {required && <span className="text-edu-danger text-xs">requerido</span>}
            </label>
            {fileName ? (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft">
                    <FileText className="w-4 h-4 text-edu-primary shrink-0" />
                    <span className="text-[0.8125rem] text-edu-ink flex-1 truncate">{fileName}</span>
                    <button
                        type="button"
                        onClick={onRemove}
                        aria-label="Quitar documento"
                        className="text-edu-ink-400 hover:text-edu-danger bg-transparent border-none cursor-pointer p-0 flex items-center"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <label className="border-[1.5px] border-dashed border-edu-border rounded-edu-control px-3.5 py-3 bg-edu-subtle cursor-pointer flex items-center justify-center gap-2 transition-colors hover:border-edu-primary text-edu-ink-500 text-[0.8125rem]">
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="sr-only"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onPick(file.name);
                        }}
                    />
                    <Upload className="w-4 h-4" />
                    Subir {label.toLowerCase()}
                </label>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* ReviewSection                                                       */
/* ------------------------------------------------------------------ */

export function ReviewSection({
    title,
    ok,
    onEdit,
    children,
}: {
    title: string;
    ok: boolean;
    onEdit: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
            <div className="px-3.5 py-2.5 bg-edu-subtle border-b border-edu-border-soft flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {ok ? (
                        <CheckCircle2 className="w-4 h-4 text-edu-success" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-edu-warning" />
                    )}
                    <span className="text-[0.8125rem] font-semibold text-edu-ink">{title}</span>
                </div>
                <button
                    type="button"
                    onClick={onEdit}
                    className="text-[0.78rem] text-edu-primary font-medium bg-transparent border-none cursor-pointer p-0 hover:underline"
                >
                    Editar
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 p-3.5">{children}</div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* ReviewItem                                                          */
/* ------------------------------------------------------------------ */

export function ReviewItem({ label, value, full }: { label: string; value?: string | null; full?: boolean }) {
    return (
        <div className={full ? "sm:col-span-2" : ""}>
            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">{label}</div>
            <div className={`text-[0.875rem] font-medium ${value ? "text-edu-ink" : "text-edu-danger"}`}>
                {value || "Sin completar"}
            </div>
        </div>
    );
}
