import { Fragment, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { LucideIcon } from "lucide-react";
import {
    ArrowLeft,
    UserPlus,
    User,
    Users,
    FileText,
    ClipboardCheck,
    CreditCard,
    Upload,
    Camera,
    X,
    Landmark,
    Copy,
    Check,
    CheckCircle2,
    Info,
    ChevronRight,
    ChevronLeft,
    Phone,
    PartyPopper,
    AlertCircle,
    Trash2,
    Home,
    GraduationCap,
    LogIn,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Configuración                                                       */
/* ------------------------------------------------------------------ */

type StepKey = "estudiante" | "representante" | "documentos" | "revision" | "pago";

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

interface FotoFile {
    name: string;
    url: string;
}

/* ------------------------------------------------------------------ */
/* Página pública                                                      */
/* ------------------------------------------------------------------ */

export function InscripcionesPage() {
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

    const inputCls =
        "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-primary transition-colors";
    const labelCls = "text-edu-ink-700 text-sm font-medium";

    /* ------------------------------------------------------------------ */
    /* Pantalla de éxito                                                   */
    /* ------------------------------------------------------------------ */
    if (submitted) {
        const nombreCompleto = `${est.nombre} ${est.apellido}`.trim() || "el estudiante";
        return (
            <PublicShell>
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
                            Te contactaremos al número <strong>{rep.telefono || "registrado"}</strong> en un lapso
                            de 24 a 48 horas hábiles.
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover"
                        >
                            <Home className="w-4 h-4" />
                            Volver al inicio
                        </button>
                    </div>
                </div>
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
                <div className="flex items-center px-4 sm:px-5 py-4 border-b border-edu-border-soft overflow-x-auto">
                    {STEPS.map((s, i) => {
                        const active = step === s.key;
                        // Solo se evalúa (✓/✗) un paso una vez que el usuario ya pasó por él.
                        const wasVisited = visited.has(s.key);
                        const showOk = wasVisited && stepValid[s.key];
                        const showError = wasVisited && !stepValid[s.key];
                        return (
                            <Fragment key={s.key}>
                                <button
                                    type="button"
                                    onClick={() => goToStep(s.key)}
                                    title={showError ? "Faltan datos por completar" : s.label}
                                    className="flex items-center gap-2 shrink-0 bg-transparent border-none cursor-pointer p-0"
                                >
                                    <span
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.8125rem] font-bold shrink-0 transition-colors ${active
                                                ? "bg-edu-primary text-white"
                                                : showOk
                                                    ? "bg-edu-success-bg text-edu-success"
                                                    : showError
                                                        ? "bg-edu-danger-bg text-edu-danger"
                                                        : "bg-edu-subtle text-edu-ink-400 border border-edu-border"
                                            }`}
                                    >
                                        {showOk ? (
                                            <Check className="w-4 h-4" />
                                        ) : showError ? (
                                            <X className="w-4 h-4" />
                                        ) : (
                                            i + 1
                                        )}
                                    </span>
                                    <span
                                        className={`text-[0.8125rem] font-medium whitespace-nowrap hidden md:inline ${active
                                                ? "text-edu-primary"
                                                : showError
                                                    ? "text-edu-danger"
                                                    : showOk
                                                        ? "text-edu-ink-700"
                                                        : "text-edu-ink-400"
                                            }`}
                                    >
                                        {s.label}
                                    </span>
                                </button>
                                {i < STEPS.length - 1 && (
                                    <div className="h-px w-5 md:w-8 bg-edu-border shrink-0 mx-1.5 md:mx-2.5" />
                                )}
                            </Fragment>
                        );
                    })}
                </div>

                {/* ── Paso 1 · Datos del estudiante ── */}
                {step === "estudiante" && (
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
                )}

                {/* ── Paso 2 · Datos del representante ── */}
                {step === "representante" && (
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
                )}

                {/* ── Paso 3 · Documentos ── */}
                {step === "documentos" && (
                    <div className="p-5 flex flex-col gap-5">
                        <StepTitle icon={FileText} title="Documentos" subtitle="Recaudos requeridos para la inscripción" />

                        {/* ¿Primera vez? */}
                        <div className="rounded-edu-control border border-edu-border-soft bg-edu-subtle p-4 flex flex-col gap-3">
                            <span className="text-sm font-semibold text-edu-ink">
                                ¿Es la primera vez que se inscribe en la institución?
                            </span>
                            <div className="flex gap-2">
                                {[
                                    { v: true, label: "Sí, es nuevo ingreso" },
                                    { v: false, label: "No, ya estudiaba aquí" },
                                ].map((opt) => {
                                    const active = primeraVez === opt.v;
                                    return (
                                        <button
                                            key={String(opt.v)}
                                            type="button"
                                            onClick={() => setPrimeraVez(opt.v)}
                                            className={`flex-1 px-3.5 py-2.5 rounded-edu-control text-[0.8125rem] font-semibold border-[1.5px] cursor-pointer transition-colors ${active
                                                    ? "border-edu-primary bg-edu-primary-50 text-edu-primary"
                                                    : "border-edu-border bg-edu-surface text-edu-ink-500 hover:border-edu-primary-200"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                            {primeraVez && (
                                <div className="flex items-start gap-2 text-[0.78rem] text-edu-ink-500 leading-relaxed">
                                    <Info className="w-3.5 h-3.5 shrink-0 mt-px text-edu-primary" />
                                    Al ser nuevo ingreso, se solicita el boletín del grado anterior para verificar la
                                    prosecución del estudiante (por ejemplo, que pasa a 2.º porque aprobó 1.º).
                                </div>
                            )}
                        </div>

                        {/* Acta de nacimiento */}
                        <DocField
                            label="Acta de nacimiento"
                            required
                            fileName={actaNac}
                            onPick={(name) => setActaNac(name)}
                            onRemove={() => setActaNac(null)}
                        />

                        {/* Boletín — solo si es primera vez */}
                        {primeraVez && (
                            <DocField
                                label="Boletín del grado anterior"
                                required
                                fileName={boletin}
                                onPick={(name) => setBoletin(name)}
                                onRemove={() => setBoletin(null)}
                            />
                        )}

                        {/* Fotos del estudiante (varias) */}
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>
                                Fotos del estudiante{" "}
                                <span className="text-edu-ink-400 font-normal">(tipo carnet · una o varias)</span>
                            </label>
                            <label className="border-[1.5px] border-dashed border-edu-border rounded-edu-control px-3.5 py-3 bg-edu-subtle cursor-pointer flex items-center justify-center gap-2 transition-colors hover:border-edu-primary text-edu-ink-500 text-[0.8125rem]">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => e.target.files && addFotosEst(e.target.files)}
                                    className="sr-only"
                                />
                                <Upload className="w-4 h-4" />
                                Subir fotos del estudiante
                            </label>
                            {fotosEst.length > 0 && (
                                <div className="flex flex-wrap gap-2.5 mt-1">
                                    {fotosEst.map((f, i) => (
                                        <div
                                            key={i}
                                            className="relative w-20 h-20 rounded-edu-chip overflow-hidden border border-edu-border-soft group"
                                        >
                                            <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeFotoEst(i)}
                                                aria-label="Quitar foto"
                                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/55 text-white flex items-center justify-center border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Paso 4 · Datos suministrados (revisión) ── */}
                {step === "revision" && (
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
                )}

                {/* ── Paso 5 · Pago (estilo modal de PagosPage) ── */}
                {step === "pago" && (
                    <div className="p-5 flex flex-col gap-4">
                        <StepTitle icon={CreditCard} title="Pago de inscripción" subtitle="Realiza el pago y sube el comprobante" />

                        {/* Cuenta a pagar */}
                        <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                            <div className="px-3.5 py-2.5 bg-edu-subtle border-b border-edu-border-soft flex items-center gap-2">
                                <Landmark className="w-4 h-4 text-edu-primary shrink-0" />
                                <span className="text-[0.8125rem] font-semibold text-edu-ink">
                                    Cuenta a pagar · {BANCO_INSCRIPCION.method}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                {BANCO_INSCRIPCION.fields.map((f, i) => (
                                    <div
                                        key={f.label}
                                        className={`flex items-center justify-between gap-3 px-3.5 py-2.5 ${i < BANCO_INSCRIPCION.fields.length - 1 ? "border-b border-edu-border-soft" : ""
                                            }`}
                                    >
                                        <div className="min-w-0">
                                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                                                {f.label}
                                            </div>
                                            <div className="text-[0.875rem] text-edu-ink font-medium break-all">{f.value}</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => copyValue(f.label, f.value)}
                                            aria-label={`Copiar ${f.label}`}
                                            className="shrink-0 w-8 h-8 rounded-edu-chip border border-edu-border bg-edu-surface flex items-center justify-center text-edu-ink-500 cursor-pointer transition-colors hover:border-edu-primary-200 hover:text-edu-primary"
                                        >
                                            {copied === f.label ? (
                                                <Check className="w-3.5 h-3.5 text-edu-success" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Monto a pagar */}
                        <div className="flex items-center justify-between px-3.5 py-3 rounded-edu-control bg-edu-primary-50">
                            <span className="text-[0.8125rem] font-medium text-edu-primary">Cuota de inscripción</span>
                            <span className="text-[1.1rem] font-bold text-edu-primary">{INSCRIPCION_FEE}</span>
                        </div>

                        {/* Comprobante (foto) */}
                        <div className="flex flex-col gap-1.5">
                            <span className={labelCls}>
                                Comprobante de pago (foto) <span className="text-edu-danger text-xs">requerido</span>
                            </span>
                            <label
                                className={`border-[1.5px] border-dashed rounded-edu-control px-3.5 py-4 bg-edu-subtle cursor-pointer flex items-center gap-3 transition-colors hover:border-edu-primary-200 ${payError ? "border-edu-danger" : "border-edu-border"
                                    }`}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        if (payProof?.url) URL.revokeObjectURL(payProof.url);
                                        setPayProof({ name: file.name, url: URL.createObjectURL(file) });
                                        setPayError(false);
                                    }}
                                />
                                {payProof ? (
                                    <>
                                        <img
                                            src={payProof.url}
                                            alt="Comprobante"
                                            className="w-12 h-12 rounded-edu-chip object-cover border border-edu-border-soft shrink-0"
                                        />
                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="text-[0.8125rem] text-edu-ink font-medium truncate">
                                                {payProof.name}
                                            </div>
                                            <div className="text-[0.72rem] text-edu-primary">Toca para cambiar la imagen</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-1 w-full text-center">
                                        <Upload className="w-5 h-5 text-edu-ink-400" />
                                        <span className="text-[0.8125rem] font-medium text-edu-ink-500">
                                            Toca para subir una foto del comprobante
                                        </span>
                                        <span className="text-[0.72rem] text-edu-ink-400">Formatos JPG o PNG</span>
                                    </div>
                                )}
                            </label>
                            {payError && (
                                <span className="text-[0.75rem] text-edu-danger font-medium">
                                    Debes subir la foto del comprobante para enviar la inscripción.
                                </span>
                            )}
                        </div>

                        {/* N.º de comprobante */}
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>N.º de comprobante (bauche)</label>
                            <input
                                type="text"
                                value={bauche}
                                onChange={(e) => setBauche(e.target.value)}
                                placeholder="Ej. A-1042"
                                className={inputCls}
                            />
                        </div>

                        {/* Aviso */}
                        <div className="flex items-start gap-2 px-3.5 py-3 rounded-edu-control bg-edu-primary-50 text-edu-primary text-[0.8125rem] leading-[1.5]">
                            <Info className="w-4 h-4 shrink-0 mt-px" />
                            <span>
                                Al enviar, tu inscripción quedará <strong>en revisión</strong>. Verificaremos los datos y
                                el comprobante, y te llamaremos para confirmar la inscripción.
                            </span>
                        </div>
                    </div>
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

/* ------------------------------------------------------------------ */
/* Shell público — barra superior con marca y acceso                   */
/* ------------------------------------------------------------------ */

function PublicShell({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen w-full bg-edu-bg flex flex-col">
            <header className="h-14 bg-edu-surface border-b border-edu-border sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-0"
                >
                    <div className="w-9 h-9 rounded-edu-control bg-edu-primary flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div className="leading-tight text-left">
                        <div className="text-edu-ink font-semibold text-[0.95rem]">EduGestión</div>
                        <div className="text-edu-ink-400 text-[0.68rem]">Inscripciones en línea</div>
                    </div>
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-[0.8125rem] font-semibold cursor-pointer hover:border-edu-primary-200 hover:text-edu-primary transition-colors"
                >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Iniciar sesión</span>
                </button>
            </header>
            <main className="flex-1 w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-5">
                {children}
            </main>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Subcomponentes                                                      */
/* ------------------------------------------------------------------ */

function StepTitle({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
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

function Field({
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

function PhotoField({
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

function DocField({
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

function ReviewSection({
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

function ReviewItem({ label, value, full }: { label: string; value?: string | null; full?: boolean }) {
    return (
        <div className={full ? "sm:col-span-2" : ""}>
            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">{label}</div>
            <div className={`text-[0.875rem] font-medium ${value ? "text-edu-ink" : "text-edu-danger"}`}>
                {value || "Sin completar"}
            </div>
        </div>
    );
}
