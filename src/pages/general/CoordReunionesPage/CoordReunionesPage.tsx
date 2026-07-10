import { PlusCircle, CheckCircle2, XCircle } from "lucide-react";
import { accent } from "@themes/tokens";
import { ConfirmDialog } from "@shared/ui/ConfirmDialog";
import { useCoordReuniones } from "./functions/useCoordReuniones";
import { ReunionesKpis } from "./ui/ReunionesKpis";
import { ReunionesTable } from "./ui/ReunionesTable";
import { CrearReunionModal } from "./modals/CrearReunionModal";

export function CoordReunionesPage() {
    const {
        reuniones,
        showModal,
        setShowModal,
        confirm,
        setConfirm,
        form,
        setForm,
        kpis,
        openModal,
        handleSubmit,
        cambiarEstado,
        ESTADO_META,
        COLS,
        HEADERS,
    } = useCoordReuniones();

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            {/* <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.purple.bg }}>
                        <CalendarClock style={{ width: 22, height: 22, color: accent.purple.fg }} />
                    </div>
                    <div>
                        <h2 className="m-0 text-edu-ink font-bold text-[1.15rem]">Reuniones</h2>
                        <p className="m-0 text-edu-ink-500 text-[0.8125rem]">Convoca y gestiona reuniones con docentes y representantes</p>
                    </div>
                </div>
                <button
                    onClick={openModal}
                    className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer transition-colors border-none text-white"
                    style={{ backgroundColor: accent.purple.fg }}
                >
                    <PlusCircle style={{ width: 16, height: 16 }} />
                    Crear reunión
                </button>
            </div> */}

            {/* KPIs */}
            <ReunionesKpis kpis={kpis} />

            <button
                onClick={openModal}
                className="w-full justify-center inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer transition-colors border-none text-white"
                style={{ backgroundColor: accent.purple.fg }}
            >
                <PlusCircle style={{ width: 16, height: 16 }} />
                Crear reunión
            </button>

            {/* Tabla de reuniones */}
            <ReunionesTable
                reuniones={reuniones}
                COLS={COLS}
                HEADERS={HEADERS}
                ESTADO_META={ESTADO_META}
                onConfirm={setConfirm}
            />

            {/* Diálogo de confirmación */}
            {confirm && (
                confirm.action === "Realizada" ? (
                    <ConfirmDialog
                        tone="success"
                        icon={CheckCircle2}
                        title="Marcar como realizada"
                        message={<>¿Confirmas que la reunión <strong>"{confirm.tema}"</strong> se llevó a cabo?</>}
                        confirmLabel="Sí, realizada"
                        onConfirm={() => { cambiarEstado(confirm.id, "Realizada"); setConfirm(null); }}
                        onCancel={() => setConfirm(null)}
                    />
                ) : (
                    <ConfirmDialog
                        tone="danger"
                        icon={XCircle}
                        title="Cancelar reunión"
                        message={<>¿Seguro que deseas cancelar la reunión <strong>"{confirm.tema}"</strong>? Esta acción no se puede deshacer.</>}
                        confirmLabel="Sí, cancelar"
                        onConfirm={() => { cambiarEstado(confirm.id, "Cancelada"); setConfirm(null); }}
                        onCancel={() => setConfirm(null)}
                    />
                )
            )}

            {/* Modal crear reunión */}
            {showModal && (
                <CrearReunionModal
                    form={form}
                    setForm={setForm}
                    onSubmit={handleSubmit}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
