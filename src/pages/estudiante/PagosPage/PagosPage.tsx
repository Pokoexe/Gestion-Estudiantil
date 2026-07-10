import { CheckCircle2, X } from "lucide-react";
import { BaucheModal } from "@shared/ui/BaucheModal";
import { usePagos, money } from "./functions/usePagos";
import { SolvencyBanner } from "./ui/SolvencyBanner";
import { PaymentsHistory } from "./ui/PaymentsHistory";
import { PagoModal } from "./modals/PagoModal";

export function PagosPage() {
    const {
        query, setQuery,
        setPage,
        showModal, setShowModal,
        selectedPayment, setSelectedPayment,
        feedback, setFeedback,
        form, setForm,
        modalTab, setModalTab,
        copied,
        photo,
        photoError,
        filteredPayments,
        totalPages, currentPage, pagedPayments,
        account, amountToPay,
        currencies,
        copyValue,
        openModal,
        handleFile,
        handleSubmit,
    } = usePagos();

    return (
        <>
            {/* Confirmación de pago enviado */}
            {feedback && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-edu-control text-sm font-medium bg-edu-success-bg text-edu-success">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{feedback}</span>
                    <button
                        onClick={() => setFeedback(null)}
                        aria-label="Cerrar"
                        className="text-edu-success bg-transparent border-none cursor-pointer p-0 flex items-center"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Bloque de solvencia */}
            <SolvencyBanner onPayClick={openModal} />

            {/* Historial de pagos */}
            <PaymentsHistory
                query={query}
                setQuery={setQuery}
                setPage={setPage}
                filteredPayments={filteredPayments}
                pagedPayments={pagedPayments}
                currentPage={currentPage}
                totalPages={totalPages}
                onRowClick={setSelectedPayment}
            />

            {/* Modal bauche de historial */}
            {selectedPayment && (
                <BaucheModal
                    rep="—"
                    showOptions={false}
                    student="—"
                    amount={`${money(selectedPayment.amount)} ${selectedPayment.currency}`}
                    method={selectedPayment.type === "efectivo" ? "Efectivo" : "Transferencia / Manual"}
                    reference={selectedPayment.voucher && selectedPayment.voucher !== "—" ? selectedPayment.voucher : "—"}
                    date={selectedPayment.date}
                    onClose={() => setSelectedPayment(null)}
                    onAccept={() => setSelectedPayment(null)}
                    onReject={() => setSelectedPayment(null)}
                />
            )}

            {/* Modal de pago por internet */}
            {showModal && (
                <PagoModal
                    form={form}
                    setForm={setForm}
                    modalTab={modalTab}
                    setModalTab={setModalTab}
                    copied={copied}
                    photo={photo}
                    photoError={photoError}
                    account={account}
                    amountToPay={amountToPay}
                    currencies={currencies}
                    copyValue={copyValue}
                    handleFile={handleFile}
                    handleSubmit={handleSubmit}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
