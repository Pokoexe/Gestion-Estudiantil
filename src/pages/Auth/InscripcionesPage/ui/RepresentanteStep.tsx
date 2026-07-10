import { Users } from "lucide-react";
import type { FotoFile } from "../interfaces";
import { StepTitle, Field, PhotoField } from "./fields";

interface RepresentanteStepProps {
    rep: {
        nombre: string;
        apellido: string;
        cedula: string;
        residencia: string;
        telefono: string;
        email: string;
        sustituto: string;
        telCasa: string;
        telRespaldo: string;
    };
    setRep: React.Dispatch<React.SetStateAction<{
        nombre: string;
        apellido: string;
        cedula: string;
        residencia: string;
        telefono: string;
        email: string;
        sustituto: string;
        telCasa: string;
        telRespaldo: string;
    }>>;
    repFoto: FotoFile | null;
    setRepFoto: React.Dispatch<React.SetStateAction<FotoFile | null>>;
    pickFoto: (setter: (f: FotoFile | null) => void, prev: FotoFile | null) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputCls: string;
}

export function RepresentanteStep({ rep, setRep, repFoto, setRepFoto, pickFoto, inputCls }: RepresentanteStepProps) {
    return (
        <div className="p-5 flex flex-col gap-5">
            <StepTitle icon={Users} title="Datos del representante" subtitle="Responsable legal del estudiante" />

            <PhotoField
                label="Foto del representante"
                hint="Foto reciente, tipo carnet"
                foto={repFoto}
                onPick={pickFoto(setRepFoto, repFoto)}
                onRemove={() => {
                    if (repFoto?.url) URL.revokeObjectURL(repFoto.url);
                    setRepFoto(null);
                }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nombres" required>
                    <input
                        className={inputCls}
                        value={rep.nombre}
                        onChange={(e) => setRep({ ...rep, nombre: e.target.value })}
                        placeholder="Ej. Ramón José"
                    />
                </Field>
                <Field label="Apellidos" required>
                    <input
                        className={inputCls}
                        value={rep.apellido}
                        onChange={(e) => setRep({ ...rep, apellido: e.target.value })}
                        placeholder="Ej. Peña Silva"
                    />
                </Field>
                <Field label="Cédula" required>
                    <input
                        className={inputCls}
                        value={rep.cedula}
                        onChange={(e) => setRep({ ...rep, cedula: e.target.value })}
                        placeholder="Ej. V-11.987.654"
                    />
                </Field>
                <Field label="Teléfono" required>
                    <input
                        className={inputCls}
                        value={rep.telefono}
                        onChange={(e) => setRep({ ...rep, telefono: e.target.value })}
                        placeholder="Ej. 0424-6667890"
                    />
                </Field>
                <Field label="Correo electrónico" required>
                    <input
                        type="email"
                        className={inputCls}
                        value={rep.email}
                        onChange={(e) => setRep({ ...rep, email: e.target.value })}
                        placeholder="Ej. ramon.pena@gmail.com"
                    />
                </Field>
                <Field label="Teléfono de casa" hint="opcional">
                    <input
                        className={inputCls}
                        value={rep.telCasa}
                        onChange={(e) => setRep({ ...rep, telCasa: e.target.value })}
                        placeholder="Ej. 0212-5551234"
                    />
                </Field>
                <Field label="Representante sustituto" hint="opcional">
                    <input
                        className={inputCls}
                        value={rep.sustituto}
                        onChange={(e) => setRep({ ...rep, sustituto: e.target.value })}
                        placeholder="Nombre y apellido"
                    />
                </Field>
                <Field label="Teléfono de respaldo" hint="opcional">
                    <input
                        className={inputCls}
                        value={rep.telRespaldo}
                        onChange={(e) => setRep({ ...rep, telRespaldo: e.target.value })}
                        placeholder="Ej. 0416-7778901"
                    />
                </Field>
            </div>

            <Field label="¿Dónde vive?" required>
                <textarea
                    className={`${inputCls} resize-none`}
                    rows={2}
                    value={rep.residencia}
                    onChange={(e) => setRep({ ...rep, residencia: e.target.value })}
                    placeholder="Dirección de residencia del representante…"
                />
            </Field>
        </div>
    );
}
