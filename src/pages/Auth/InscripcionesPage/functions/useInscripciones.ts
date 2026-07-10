import { useState } from "react";
import { useNavigate } from "react-router";
import type { LucideIcon } from "lucide-react";
import {
    User,
    Users,
    FileText,
    ClipboardCheck,
    CreditCard,
} from "lucide-react";
import type { StepKey, FotoFile } from "../interfaces";

/* ------------------------------------------------------------------ */
/* Configuración                                                       */
/* ------------------------------------------------------------------ */

const STEPS: { key: StepKey; label: string; short: string; icon: LucideIcon }[] = [
    { key: "estudiante", label: "Datos del estudiante", short: "Estudiante", icon: User },
    { key: "representante", label: "Datos del representante", short: "Representante", icon: Users },
    { key: "documentos", label: "Documentos", short: "Documentos", icon: FileText },
    { key: "revision", label: "Datos suministrados", short: "Revisión", icon: ClipboardCheck },
    { key: "pago", label: "Pago", short: "Pago", icon: CreditCard },
];

/** Cuota de inscripción y cuenta destino — se muestran en la pestaña de pago. */
const INSCRIPCION_FEE = "Bs. 1.500,00";

const BANCO_INSCRIPCION = {
    method: "Transferencia o Pago Móvil",
    fields: [
        { label: "Banco", value: "Banco de Venezuela (0102)" },
        { label: "Tipo de cuenta", value: "Cuenta Corriente" },
        { label: "N.º de cuenta", value: "0102 0345 67 8901234567" },
        { label: "Titular", value: "U.E. Colegio EduGestión" },
        { label: "RIF", value: "J-30123456-7" },
        { label: "Pago Móvil", value: "0414-1234567" },
    ],
};

const inputCls =
    "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary transition-colors";
const labelCls = "text-edu-ink-700 text-sm font-medium";

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function useInscripciones() {
    const navigate = useNavigate();

    const [step, setStep] = useState<StepKey>("estudiante");
    /** Pasos por los que el usuario ya pasó — al abandonar un paso se marca aquí,
     *  y el stepper revela su estado ✓ (completo) o ✗ (faltan datos). */
    const [visited, setVisited] = useState<Set<StepKey>>(() => new Set());
    const [submitted, setSubmitted] = useState(false);

    /* Datos del estudiante */
    const [est, setEst] = useState({
        nombre: "",
        apellido: "",
        cedula: "",
        fechaNac: "",
        residencia: "",
    });
    const [estFoto, setEstFoto] = useState<FotoFile | null>(null);

    /* Datos del representante */
    const [rep, setRep] = useState({
        nombre: "",
        apellido: "",
        cedula: "",
        residencia: "",
        telefono: "",
        email: "",
        sustituto: "",
        telCasa: "",
        telRespaldo: "",
    });
    const [repFoto, setRepFoto] = useState<FotoFile | null>(null);

    /* Documentos */
    const [primeraVez, setPrimeraVez] = useState(true);
    const [actaNac, setActaNac] = useState<string | null>(null);
    const [boletin, setBoletin] = useState<string | null>(null);
    const [fotosEst, setFotosEst] = useState<FotoFile[]>([]);

    /* Pago */
    const [payProof, setPayProof] = useState<FotoFile | null>(null);
    const [payError, setPayError] = useState(false);
    const [bauche, setBauche] = useState("");
    const [copied, setCopied] = useState<string | null>(null);

    /* ---- Validación (suave, para el resumen y los avisos) ---- */
    const estOk = !!(est.nombre.trim() && est.apellido.trim() && est.fechaNac && est.residencia.trim());
    const repOk = !!(
        rep.nombre.trim() &&
        rep.apellido.trim() &&
        rep.cedula.trim() &&
        rep.telefono.trim() &&
        rep.email.trim() &&
        rep.residencia.trim()
    );
    const docsOk = !!actaNac && (!primeraVez || !!boletin);
    const listoParaPagar = estOk && repOk && docsOk;

    /** Validez por paso — decide si el stepper muestra ✓ (completo) o ✗ (faltan datos). */
    const stepValid: Record<StepKey, boolean> = {
        estudiante: estOk,
        representante: repOk,
        documentos: docsOk,
        revision: listoParaPagar,
        pago: !!payProof,
    };

    /* ---- Navegación entre pasos ---- */
    const order = STEPS.map((s) => s.key);
    const currentIndex = order.indexOf(step);
    /** Marca el paso que se abandona como "visitado" (para revelar su ✓/✗) y cambia de paso. */
    const goToStep = (key: StepKey) => {
        if (key === step) return;
        setVisited((prev) => (prev.has(step) ? prev : new Set(prev).add(step)));
        setStep(key);
    };
    const goNext = () => currentIndex < order.length - 1 && goToStep(order[currentIndex + 1]);
    const goPrev = () => currentIndex > 0 && goToStep(order[currentIndex - 1]);

    /* ---- Archivos ---- */
    const pickFoto = (setter: (f: FotoFile | null) => void, prev: FotoFile | null) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (prev?.url) URL.revokeObjectURL(prev.url);
        setter({ name: file.name, url: URL.createObjectURL(file) });
    };

    const addFotosEst = (files: FileList) => {
        const nuevas = Array.from(files).map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
        setFotosEst((prev) => [...prev, ...nuevas]);
    };

    const removeFotoEst = (idx: number) =>
        setFotosEst((prev) => {
            const target = prev[idx];
            if (target?.url) URL.revokeObjectURL(target.url);
            return prev.filter((_, i) => i !== idx);
        });

    const copyValue = (label: string, value: string) => {
        navigator.clipboard?.writeText(value);
        setCopied(label);
        setTimeout(() => setCopied((c) => (c === label ? null : c)), 1500);
    };

    const pickPayProof = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (payProof?.url) URL.revokeObjectURL(payProof.url);
        setPayProof({ name: file.name, url: URL.createObjectURL(file) });
        setPayError(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Revela el estado ✓/✗ de todos los pasos en el stepper.
        setVisited(new Set(order));
        // Busca el primer paso con datos incompletos y, si existe, lleva al usuario allí.
        const firstInvalid = order.find((k) => !stepValid[k]);
        if (firstInvalid) {
            if (firstInvalid === "pago") setPayError(true);
            setStep(firstInvalid);
            return;
        }
        setSubmitted(true);
    };

    const goHome = () => navigate("/");

    return {
        step,
        setStep,
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
        setPayProof,
        payError,
        setPayError,
        bauche,
        setBauche,
        copied,
        setCopied,
        estOk,
        repOk,
        docsOk,
        listoParaPagar,
        stepValid,
        order,
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
        goHome,
        STEPS,
        INSCRIPCION_FEE,
        BANCO_INSCRIPCION,
        inputCls,
        labelCls,
    };
}
