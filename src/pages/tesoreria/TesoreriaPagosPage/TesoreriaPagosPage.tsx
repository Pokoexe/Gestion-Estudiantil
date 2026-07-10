import { useTesoreriaPagos, money } from "./functions/useTesoreriaPagos";
import { WeeklyChartCard } from "./ui/WeeklyChartCard";
import { AvailableBalances } from "./ui/AvailableBalances";
import { AddCashAction } from "./ui/AddCashAction";
import { PaymentsHistory } from "./ui/PaymentsHistory";
import { AddCashPaymentModal } from "./modals/AddCashPaymentModal";

export { money };

export function TesoreriaPagosPage() {
  const {
    MONTHLY,
    showModal, setShowModal,
    form, setForm,
    query, setQuery,
    methodFilter, setMethodFilter,
    statusFilter, setStatusFilter,
    setPage,
    safePage, totalPages,
    filtered, pageItems,
    openModal, handleSubmit,
    AVAILABLE, STATUS_META, CURRENCIES,
    COLS, HEADERS,
  } = useTesoreriaPagos();

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <WeeklyChartCard data={MONTHLY} />
        <AvailableBalances available={AVAILABLE} money={money} />
      </div>

      <AddCashAction onClick={openModal} />

      <PaymentsHistory
        query={query}
        setQuery={setQuery}
        methodFilter={methodFilter}
        setMethodFilter={setMethodFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setPage={setPage}
        filtered={filtered}
        pageItems={pageItems}
        safePage={safePage}
        totalPages={totalPages}
        statusMeta={STATUS_META}
        cols={COLS}
        headers={HEADERS}
        money={money}
      />

      {showModal && (
        <AddCashPaymentModal
          form={form}
          setForm={setForm}
          currencies={CURRENCIES}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
