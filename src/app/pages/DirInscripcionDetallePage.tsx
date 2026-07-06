import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    ArrowLeft,
    User,
    Users,
    FileText,
    CreditCard,
    Receipt,
    Phone,
    Mail,
    MapPin,
    CalendarDays,
    IdCard,
    GraduationCap,
    ImageIcon,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { accent } from "../theme/tokens";
import { BaucheModal } from "../components/BaucheModal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useFetch } from "../datos_maquetados";
import { getInscripciones, type InscripcionEstado } from "../datos_maquetados/actions/inscripciones";
import {
    TIPO_META,
    ESTADO_META,
} from "../datos_maquetados/data/inscripciones";

type PendingAction = "aceptar" | "rechazar" | null;

export function DirInscripcionDetallePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: inscripciones, loading } = useFetch(getInscripciones, []);
    const record = inscripciones.find((r) => r.id === Number(id));

    const [estado, setEstado] = useState<InscripcionEstado | undefined>(undefined);
    useEffect(() => setEstado(record?.estado), [record]);
    const [showBauche, setShowBauche] = useState(false);
    const [pending, setPending] = useState<PendingAction>(null);

    if (loading)
        return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

    /* Registro inexistente */
    if (!record) {
        return (
            <div className="flex flex-col gap-5">
                <button
                    type="button"
                    onClick={() => navigate("/director/inscripciones")}
                    className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a inscripciones
                </button>
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 flex flex-col items-center gap-3 text-center">
                    <FileText className="w-8 h-8 text-edu-ink-400" />
                    <p className="text-edu-ink-500 text-sm m-0">No se encontró la inscripción solicitada.</p>
                </div>
            </div>
        );
    }

    const tipo = TIPO_META[record.tipo];
    const estadoMeta = ESTADO_META[estado ?? record.estado];
    const iniciales = `${record.estNombre[0] ?? ""}${record.estApellido[0] ?? ""}`.toUpperCase();

    const applyAction = (action: "aceptar" | "rechazar") => {
        const nuevo: InscripcionEstado = action === "aceptar" ? "aceptado" : "rechazado";
        record.estado = nuevo; // muta el registro compartido (la lista lo reflejará)
        setEstado(nuevo);
        setPending(null);
        setShowBauche(false);
    };

    const enRevision = (estado ?? record.estado) === "revision";

    return (
        <div className="flex flex-col gap-5">
            {/* Volver */}
            <button
                type="button"
                onClick={() => navigate("/director/inscripciones")}
                className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver a inscripciones
            </button>

            {/* Encabezado */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold shrink-0" style={{ backgroundColor: accent.amber.bg, color: accent.amber.fg }}>
                        {iniciales}
                    </div>
                    <div>
                        <h2 className="m-0 text-edu-ink font-bold text-[1.25rem]">{record.estNombre} {record.estApellido}</h2>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold ${tipo.cls}`}>{tipo.label}</span>
                            <span className="text-[0.8125rem] text-edu-ink-500">{record.gradoSolicitado}</span>
                            <span className="text-edu-ink-300">·</span>
                            <span className="text-[0.8125rem] text-edu-ink-400">Solicitud #{record.id} · {record.fechaInscripcion}</span>
                        </div>
                    </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-edu-pill text-[0.78rem] font-semibold ${estadoMeta.cls}`}>
                    {estadoMeta.label}
                </span>
            </div>

            {/* Secciones de datos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                {/* Datos del estudiante */}
                <SectionCard icon={User} title="Datos del estudiante">
                    <Info icon={User} label="Nombres y apellidos" value={`${record.estNombre} ${record.estApellido}`} />
                    <Info icon={IdCard} label="Cédula" value={record.estCedula || "Sin cédula"} />
                    <Info icon={CalendarDays} label="Fecha de nacimiento" value={record.estFechaNac} />
                    <Info icon={GraduationCap} label="Grado a inscribir" value={record.gradoSolicitado} />
                    <Info icon={MapPin} label="Lugar de residencia" value={record.estResidencia} full />
                </SectionCard>

                {/* Datos del representante */}
                <SectionCard icon={Users} title="Datos del representante">
                    <Info icon={User} label="Nombres y apellidos" value={`${record.repNombre} ${record.repApellido}`} />
                    <Info icon={IdCard} label="Cédula" value={record.repCedula} />
                    <Info icon={Phone} label="Teléfono" value={record.repTelefono} />
                    <Info icon={Mail} label="Correo electrónico" value={record.repEmail} />
                    <Info icon={Phone} label="Teléfono de casa" value={record.repTelCasa || "—"} />
                    <Info icon={Phone} label="Teléfono de respaldo" value={record.repTelRespaldo || "—"} />
                    <Info icon={User} label="Representante sustituto" value={record.repSustituto || "—"} />
                    <Info icon={MapPin} label="¿Dónde vive?" value={record.repResidencia} full />
                </SectionCard>

                {/* Documentos */}
                <SectionCard icon={FileText} title="Documentos suministrados">
                    <div className="sm:col-span-2 flex flex-col gap-2.5">
                        <Info
                            icon={GraduationCap}
                            label="Tipo de ingreso"
                            value={record.primeraVez ? "Nuevo ingreso (primera vez)" : "Ya estudiaba en la institución"}
                        />
                        <DocItem name={record.actaNacimiento} label="Acta de nacimiento" />
                        {record.primeraVez && <DocItem name={record.boletin} label="Boletín del grado anterior" />}
                        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft">
                            <ImageIcon className="w-4 h-4 text-edu-primary shrink-0" />
                            <span className="text-[0.8125rem] text-edu-ink flex-1">Fotos del estudiante</span>
                            <span className="text-[0.78rem] text-edu-ink-500 font-medium">{record.fotosCount} foto(s)</span>
                        </div>
                    </div>
                </SectionCard>

                {/* Pago */}
                <SectionCard icon={CreditCard} title="Pago de inscripción">
                    <Info icon={CreditCard} label="Monto" value={record.monto} />
                    <Info icon={CalendarDays} label="Fecha del pago" value={record.fechaPago} />
                    <Info icon={Receipt} label="N.º de comprobante" value={record.bauche} />
                    <Info icon={FileText} label="Método" value={record.metodo} full />

                    <div className="sm:col-span-2 flex flex-col gap-2.5 pt-1">
                        <button
                            type="button"
                            onClick={() => setShowBauche(true)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle transition-colors"
                        >
                            <Receipt className="w-4 h-4" />
                            Ver comprobante (bauche)
                        </button>

                        {enRevision ? (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPending("rechazar")}
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-edu-control text-sm font-semibold border-[1.5px] border-edu-danger-bg bg-edu-danger-bg text-edu-danger cursor-pointer hover:brightness-95 transition-all"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Rechazar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPending("aceptar")}
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-edu-control text-sm font-semibold border-none bg-edu-success text-white cursor-pointer hover:brightness-95 transition-all"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Aceptar inscripción
                                </button>
                            </div>
                        ) : (
                            <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-edu-control text-[0.8125rem] font-medium ${estadoMeta.cls}`}>
                                {(estado ?? record.estado) === "aceptado" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                Esta inscripción ya fue {(estado ?? record.estado) === "aceptado" ? "aceptada" : "rechazada"}.
                            </div>
                        )}
                    </div>
                </SectionCard>
            </div>

            {/* Modal bauche */}
            {showBauche && (
                <BaucheModal
                    rep={`${record.repNombre} ${record.repApellido}`}
                    student={`${record.estNombre} ${record.estApellido}`}
                    amount={record.monto}
                    method={record.metodo}
                    reference={record.bauche}
                    date={record.fechaPago}
                    showOptions={enRevision}
                    onClose={() => setShowBauche(false)}
                    onAccept={() => setPending("aceptar")}
                    onReject={() => setPending("rechazar")}
                />
            )}

            {/* Confirmación */}
            {pending && (
                <ConfirmDialog
                    title={pending === "aceptar" ? "¿Confirmar el pago de esta inscripción?" : "¿Rechazar esta inscripción?"}
                    message={
                        pending === "aceptar"
                            ? "La inscripción quedará aceptada y el representante será notificado."
                            : "La inscripción será rechazada. Esta acción puede revertirse."
                    }
                    confirmLabel={pending === "aceptar" ? "Sí, aceptar" : "Sí, rechazar"}
                    tone={pending === "aceptar" ? "success" : "danger"}
                    icon={pending === "aceptar" ? CheckCircle2 : XCircle}
                    onConfirm={() => applyAction(pending)}
                    onCancel={() => setPending(null)}
                />
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Subcomponentes                                                      */
/* ------------------------------------------------------------------ */

function SectionCard({
    icon: Icon,
    title,
    children,
}: {
    icon: React.FC<{ className?: string }>;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-4 py-3 border-b border-edu-border-soft flex items-center gap-2">
                <div className="w-7 h-7 rounded-edu-control bg-edu-primary-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-edu-primary" />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9rem]">{title}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5 p-4">{children}</div>
        </div>
    );
}

function Info({
    icon: Icon,
    label,
    value,
    full,
}: {
    icon: React.FC<{ className?: string }>;
    label: string;
    value: string;
    full?: boolean;
}) {
    return (
        <div className={`flex items-start gap-2.5 ${full ? "sm:col-span-2" : ""}`}>
            <div className="w-8 h-8 rounded-edu-control bg-edu-subtle flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-edu-ink-500" />
            </div>
            <div className="min-w-0">
                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.04em] font-medium">{label}</div>
                <div className="text-[0.875rem] text-edu-ink font-medium break-words">{value || "—"}</div>
            </div>
        </div>
    );
}

function DocItem({ name, label }: { name: string; label: string }) {
    return (
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft">
            <FileText className="w-4 h-4 text-edu-primary shrink-0" />
            <div className="min-w-0 flex-1">
                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.04em] font-medium">{label}</div>
                <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{name || "No adjuntado"}</div>
            </div>
        </div>
    );
}
