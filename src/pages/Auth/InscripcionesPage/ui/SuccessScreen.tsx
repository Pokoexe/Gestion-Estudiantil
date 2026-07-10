import { PartyPopper, Phone, Home } from "lucide-react";

interface SuccessScreenProps {
    nombreCompleto: string;
    telefono: string;
    onGoHome: () => void;
}

export function SuccessScreen({ nombreCompleto, telefono, onGoHome }: SuccessScreenProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-8 sm:p-12 flex flex-col items-center text-center gap-5 max-w-xl mx-auto w-full">
            <div className="w-20 h-20 rounded-full bg-edu-success-bg flex items-center justify-center">
                <PartyPopper className="w-10 h-10 text-edu-success" />
            </div>
            <div>
                <h2 className="m-0 text-edu-ink font-bold text-[1.5rem]">¡Felicidades!</h2>
                <p className="text-edu-ink-700 text-base mt-2 mb-0 leading-relaxed">
                    La solicitud de inscripción de <strong>{nombreCompleto}</strong> fue enviada
                    correctamente. Revisaremos tus datos y te llamaremos para confirmar la inscripción.
                </p>
            </div>

            <div className="w-full rounded-edu-control bg-edu-subtle border border-edu-border-soft px-4 py-3 flex items-center gap-3 text-left">
                <Phone className="w-5 h-5 text-edu-primary shrink-0" />
                <div className="text-[0.8125rem] text-edu-ink-700">
                    Te contactaremos al número <strong>{telefono || "registrado"}</strong> en un lapso
                    de 24 a 48 horas hábiles.
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                    type="button"
                    onClick={onGoHome}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover"
                >
                    <Home className="w-4 h-4" />
                    Volver al inicio
                </button>
            </div>
        </div>
    );
}
