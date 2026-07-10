import { User } from "lucide-react";
import type { FotoFile } from "../interfaces";
import { StepTitle, Field, PhotoField } from "./fields";

interface EstudianteStepProps {
    est: {
        nombre: string;
        apellido: string;
        cedula: string;
        fechaNac: string;
        residencia: string;
    };
    setEst: React.Dispatch<React.SetStateAction<{
        nombre: string;
        apellido: string;
        cedula: string;
        fechaNac: string;
        residencia: string;
    }>>;
    estFoto: FotoFile | null;
    setEstFoto: React.Dispatch<React.SetStateAction<FotoFile | null>>;
    pickFoto: (setter: (f: FotoFile | null) => void, prev: FotoFile | null) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputCls: string;
}

export function EstudianteStep({ est, setEst, estFoto, setEstFoto, pickFoto, inputCls }: EstudianteStepProps) {
    return (
        <div className="p-5 flex flex-col gap-5">
            <StepTitle icon={User} title="Datos del estudiante" subtitle="Información personal del alumno a inscribir" />

            <PhotoField
                label="Foto del estudiante"
                hint="Foto reciente, tipo carnet"
                foto={estFoto}
                onPick={pickFoto(setEstFoto, estFoto)}
                onRemove={() => {
                    if (estFoto?.url) URL.revokeObjectURL(estFoto.url);
                    setEstFoto(null);
                }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nombres" required>
                    <input
                        className={inputCls}
                        value={est.nombre}
                        onChange={(e) => setEst({ ...est, nombre: e.target.value })}
                        placeholder="Ej. Daniel Andrés"
                    />
                </Field>
                <Field label="Apellidos" required>
                    <input
                        className={inputCls}
                        value={est.apellido}
                        onChange={(e) => setEst({ ...est, apellido: e.target.value })}
                        placeholder="Ej. Peña Rojas"
                    />
                </Field>
                <Field label="Cédula" hint="si tiene">
                    <input
                        className={inputCls}
                        value={est.cedula}
                        onChange={(e) => setEst({ ...est, cedula: e.target.value })}
                        placeholder="Ej. V-32.108.945"
                    />
                </Field>
                <Field label="Fecha de nacimiento" required>
                    <input
                        type="date"
                        className={inputCls}
                        value={est.fechaNac}
                        onChange={(e) => setEst({ ...est, fechaNac: e.target.value })}
                    />
                </Field>
            </div>

            <Field label="Lugar de residencia" required>
                <textarea
                    className={`${inputCls} resize-none`}
                    rows={2}
                    value={est.residencia}
                    onChange={(e) => setEst({ ...est, residencia: e.target.value })}
                    placeholder="Urbanización, calle, casa/apto, ciudad…"
                />
            </Field>
        </div>
    );
}
