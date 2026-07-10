import { Search, Receipt } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import type { Payment } from "@shared/services/actions/estudiante";
import { STATUS_META, money } from "../functions/usePagos";

const PAY_COLS = "grid-cols-[1fr_0.8fr_1fr_1fr_1.1fr_1fr]";
const PAY_HEADERS = ["Monto", "Moneda", "Fecha", "Tipo", "Estado", "Bauche"];

interface PaymentsHistoryProps {
    query: string;
    setQuery: (v: string) => void;
    setPage: (v: number) => void;
    filteredPayments: Payment[];
    pagedPayments: Payment[];
    currentPage: number;
    totalPages: number;
    onRowClick: (p: Payment) => void;
}

/** Historial de pagos: buscador, tabla de pagos y paginación. */
export function PaymentsHistory({
    query, setQuery, setPage,
    filteredPayments, pagedPayments,
    currentPage, totalPages, onRowClick,
}: PaymentsHistoryProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Historial de pagos</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">{filteredPayments.length} pagos</span>
            </div>
            <div className="px-5 py-3 border-b border-edu-border-soft">
                <div className="relative">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Buscar por bauche, tipo, moneda o estado…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-[720px]">
                    <div className={`grid ${PAY_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {PAY_HEADERS.map((h) => (
                            <span
                                key={h}
                                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                            >
                                {h}
                            </span>
                        ))}
                    </div>
                    {filteredPayments.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                            No hay pagos que coincidan con la búsqueda.
                        </div>
                    )}
                    {pagedPayments.map((p, i) => {
                        const st = STATUS_META[p.status];
                        return (
                            <div
                                key={p.id}
                                onClick={() => onRowClick(p)}
                                className={`grid ${PAY_COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < pagedPayments.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span className="text-[0.875rem] text-edu-ink font-semibold">{money(p.amount)}</span>
                                <span className="text-[0.875rem] text-edu-ink-700">{p.currency}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{p.date}</span>
                                <span className="text-[0.875rem] text-edu-ink-700 capitalize">{p.type}</span>
                                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}>
                                    {st.label}
                                </span>
                                <span className="text-[0.8125rem] text-edu-ink-500 flex items-center gap-1.5">
                                    {p.voucher && p.voucher !== "—" ? (
                                        p.receiptUrl ? (
                                            <a
                                                href={p.receiptUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-edu-primary font-medium no-underline hover:underline"
                                            >
                                                <Receipt className="w-3.5 h-3.5 shrink-0" />
                                                {p.voucher}
                                            </a>
                                        ) : (
                                            <>
                                                <Receipt className="w-3.5 h-3.5 text-edu-ink-400 shrink-0" />
                                                {p.voucher}
                                            </>
                                        )
                                    ) : (
                                        "—"
                                    )}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
            {totalPages > 1 && (
                <div className="px-5 py-4 border-t border-edu-border-soft">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                </div>
            )}
        </div>
    );
}
