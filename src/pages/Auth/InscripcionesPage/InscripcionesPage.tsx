import { useNavigate } from "react-router";
import { ArrowLeft, UserPlus, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { useInscripciones } from "./functions/useInscripciones";
import { PublicShell } from "./ui/PublicShell";
import { InscripcionStepper } from "./ui/InscripcionStepper";
import { SuccessScreen } from "./ui/SuccessScreen";
import { EstudianteStep } from "./ui/EstudianteStep";
import { RepresentanteStep } from "./ui/RepresentanteStep";
import { DocumentosStep } from "./ui/DocumentosStep";
import { RevisionStep } from "./ui/RevisionStep";
import { PagoStep } from "./ui/PagoStep";

export function InscripcionesPage() {
    const navigate = useNavigate();
    const {
        step,
        visited,
        submitted,
        est,
        setEst,
        estFoto,
        setEstFoto,
        rep,
        setRep,
        repFoto,
        setRepFoto,
        primeraVez,
        setPrimeraVez,
        actaNac,
        setActaNac,
        boletin,
        setBoletin,
        fotosEst,
        payProof,
        payError,
        bauche,
        setBauche,
        copied,
        estOk,
        repOk,
        docsOk,
        listoParaPagar,
        stepValid,
        currentIndex,
        goToStep,
        goNext,
        goPrev,
        pickFoto,
        addFotosEst,
        removeFotoEst,
        copyValue,
        pickPayProof,
        handleSubmit,
        STEPS,
        INSCRIPCION_FEE,
        BANCO_INSCRIPCION,
        inputCls,
        labelCls,
    } = useInscripciones();

    /* ------------------------------------------------------------------ */
    /* Pantalla de éxito                                                   */
    /* ------------------------------------------------------------------ */
    if (submitted) {
        const nombreCompleto = `${est.nombre} ${est.apellido}`.trim() || "el estudiante";
        return (
            <PublicShell>
                <SuccessScreen
                    nombreCompleto={nombreCompleto}
                    telefono={rep.telefono}
                    onGoHome={() => navigate("/")}
                />
            </PublicShell>
        );
    }

    /* ------------------------------------------------------------------ */
    /* Formulario                                                          */
    /* ------------------------------------------------------------------ */
    return (
        <PublicShell>
            {/* Volver */}
            <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio
            </button>

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-edu-control bg-edu-primary-50 flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5 text-edu-primary" />
                </div>
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.25rem]">Inscripción en línea</h2>
                    <p className="text-edu-ink-500 text-sm mt-0.5 m-0">
                        Completa los datos del estudiante, del representante y realiza el pago de inscripción
                    </p>
                </div>
            </div>

            {/* Tarjeta principal */}
            <form
                onSubmit={handleSubmit}
                className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col"
            >
                {/* Stepper */}
                <InscripcionStepper
                    STEPS={STEPS}
                    step={step}
                    visited={visited}
                    stepValid={stepValid}
                    goToStep={goToStep}
                />

                {/* ── Paso 1 · Datos del estudiante ── */}
                {step === "estudiante" && (
                    <EstudianteStep
                        est={est}
                        setEst={setEst}
                        estFoto={estFoto}
                        setEstFoto={setEstFoto}
                        pickFoto={pickFoto}
                        inputCls={inputCls}
                    />
                )}

                {/* ── Paso 2 · Datos del representante ── */}
                {step === "representante" && (
                    <RepresentanteStep
                        rep={rep}
                        setRep={setRep}
                        repFoto={repFoto}
                        setRepFoto={setRepFoto}
                        pickFoto={pickFoto}
                        inputCls={inputCls}
                    />
                )}

                {/* ── Paso 3 · Documentos ── */}
                {step === "documentos" && (
                    <DocumentosStep
                        primeraVez={primeraVez}
                        setPrimeraVez={setPrimeraVez}
                        actaNac={actaNac}
                        setActaNac={setActaNac}
                        boletin={boletin}
                        setBoletin={setBoletin}
                        fotosEst={fotosEst}
                        addFotosEst={addFotosEst}
                        removeFotoEst={removeFotoEst}
                        labelCls={labelCls}
                    />
                )}

                {/* ── Paso 4 · Datos suministrados (revisión) ── */}
                {step === "revision" && (
                    <RevisionStep
                        est={est}
                        estFoto={estFoto}
                        rep={rep}
                        repFoto={repFoto}
                        primeraVez={primeraVez}
                        actaNac={actaNac}
                        boletin={boletin}
                        fotosEst={fotosEst}
                        estOk={estOk}
                        repOk={repOk}
                        docsOk={docsOk}
                        listoParaPagar={listoParaPagar}
                        goToStep={goToStep}
                    />
                )}

                {/* ── Paso 5 · Pago ── */}
                {step === "pago" && (
                    <PagoStep
                        INSCRIPCION_FEE={INSCRIPCION_FEE}
                        BANCO_INSCRIPCION={BANCO_INSCRIPCION}
                        payProof={payProof}
                        payError={payError}
                        bauche={bauche}
                        setBauche={setBauche}
                        copied={copied}
                        copyValue={copyValue}
                        pickPayProof={pickPayProof}
                        labelCls={labelCls}
                    />
                )}

                {/* Acciones */}
                <div className="flex gap-2 justify-between border-t border-edu-border-soft px-5 py-4">
                    {currentIndex === 0 ? (
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle transition-colors"
                        >
                            Cancelar
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={goPrev}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Atrás
                        </button>
                    )}

                    {step === "pago" ? (
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer hover:bg-edu-primary-hover transition-colors"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Enviar inscripción
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={goNext}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer hover:bg-edu-primary-hover transition-colors"
                        >
                            Continuar
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </form>

            <p className="text-edu-ink-300 text-xs text-center pt-2 pb-4">
                © 2026 EduGestión. Todos los derechos reservados.
            </p>
        </PublicShell>
    );
}
