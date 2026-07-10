import { ClipboardCheck, AlertCircle } from "lucide-react";
import type { FotoFile } from "../interfaces";
import type { StepKey } from "../interfaces";
import { StepTitle, ReviewSection, ReviewItem } from "./fields";

interface RevisionStepProps {
    est: {
        nombre: string;
        apellido: string;
        cedula: string;
        fechaNac: string;
        residencia: string;
    };
    estFoto: FotoFile | null;
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
    repFoto: FotoFile | null;
    primeraVez: boolean;
    actaNac: string | null;
    boletin: string | null;
    fotosEst: FotoFile[];
    estOk: boolean;
    repOk: boolean;
    docsOk: boolean;
    listoParaPagar: boolean;
    goToStep: (key: StepKey) => void;
}

export function RevisionStep({
    est,
    estFoto,
    rep,
    repFoto,
    primeraVez,
    actaNac,
    boletin,
    fotosEst,
    estOk,
    repOk,
    docsOk,
    listoParaPagar,
    goToStep,
}: RevisionStepProps) {
    return (
        <div className="p-5 flex flex-col gap-5">
            <StepTitle
                icon={ClipboardCheck}
                title="Datos suministrados"
                subtitle="Verifica que la información sea correcta antes de continuar al pago"
            />

            <ReviewSection title="Datos del estudiante" ok={estOk} onEdit={() => goToStep("estudiante")}>
                <ReviewItem label="Nombres y apellidos" value={`${est.nombre} ${est.apellido}`.trim()} />
                <ReviewItem label="Cédula" value={est.cedula} />
                <ReviewItem label="Fecha de nacimiento" value={est.fechaNac} />
                <ReviewItem label="Lugar de residencia" value={est.residencia} full />
                <ReviewItem label="Foto del estudiante" value={estFoto?.name} />
            </ReviewSection>

            <ReviewSection title="Datos del representante" ok={repOk} onEdit={() => goToStep("representante")}>
                <ReviewItem label="Nombres y apellidos" value={`${rep.nombre} ${rep.apellido}`.trim()} />
                <ReviewItem label="Cédula" value={rep.cedula} />
                <ReviewItem label="Teléfono" value={rep.telefono} />
                <ReviewItem label="Correo electrónico" value={rep.email} />
                <ReviewItem label="Teléfono de casa" value={rep.telCasa} />
                <ReviewItem label="Teléfono de respaldo" value={rep.telRespaldo} />
                <ReviewItem label="Representante sustituto" value={rep.sustituto} />
                <ReviewItem label="¿Dónde vive?" value={rep.residencia} full />
                <ReviewItem label="Foto del representante" value={repFoto?.name} />
            </ReviewSection>

            <ReviewSection title="Documentos" ok={docsOk} onEdit={() => goToStep("documentos")}>
                <ReviewItem
                    label="Tipo de ingreso"
                    value={primeraVez ? "Nuevo ingreso (primera vez)" : "Ya estudiaba en la institución"}
                />
                <ReviewItem label="Acta de nacimiento" value={actaNac} />
                {primeraVez && <ReviewItem label="Boletín del grado anterior" value={boletin} />}
                <ReviewItem
                    label="Fotos del estudiante"
                    value={fotosEst.length ? `${fotosEst.length} foto(s)` : ""}
                />
            </ReviewSection>

            {!listoParaPagar && (
                <div className="flex items-start gap-2 px-3.5 py-3 rounded-edu-control bg-edu-warning-bg text-edu-warning text-[0.8125rem] leading-[1.5]">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
                    <span>
                        Faltan datos obligatorios por completar. Puedes continuar y completarlos, pero se
                        recomienda revisarlos antes de enviar la inscripción.
                    </span>
                </div>
            )}
        </div>
    );
}
