import { useEffect, useState } from "react";
import {
    OWED as owed,
    FEE_CURRENCY,
} from "@shared/services/data/solvency";
import { useFetch } from "@shared/services";
import { getPagos, type Payment, type PayStatus } from "@shared/services/actions/estudiante";
import type { PaymentAccount } from "../interfaces";

export const STATUS_META: Record<PayStatus, { label: string; cls: string }> = {
    confirmed: { label: "Confirmado", cls: "bg-edu-success-bg text-edu-success" },
    review: { label: "En revisión", cls: "bg-edu-warning-bg text-edu-warning" },
    rejected: { label: "Rechazado", cls: "bg-edu-danger-bg text-edu-danger" },
};

const CURRENCIES = ["USD", "COP", "Bs."];

/** Tasa de cambio desde USD (moneda de la mensualidad) hacia cada moneda de pago. */
const RATES: Record<string, number> = { USD: 1, COP: 4000, "Bs.": 36.5 };

/** Cuenta destino según la moneda de pago — datos completos, sin censura. */
const ACCOUNTS_BY_CURRENCY: Record<string, PaymentAccount> = {
    "Bs.": {
        method: "Transferencia o Pago Móvil",
        fields: [
            { label: "Banco", value: "Banco de Venezuela (0102)" },
            { label: "Tipo de cuenta", value: "Cuenta Corriente" },
            { label: "N.º de cuenta", value: "0102 0345 67 8901234567" },
            { label: "Titular", value: "U.E. Colegio EduGestión" },
            { label: "RIF", value: "J-30123456-7" },
            { label: "Pago Móvil", value: "0414-1234567" },
        ],
    },
    USD: {
        method: "Zelle",
        fields: [
            { label: "Titular", value: "EduGestion School LLC" },
            { label: "Correo Zelle", value: "pagos.usd@edugestion.edu" },
            { label: "Banco", value: "Bank of America" },
            { label: "N.º de cuenta", value: "4851 2200 7788" },
            { label: "Routing (ABA)", value: "026009593" },
        ],
    },
    COP: {
        method: "Transferencia o Nequi",
        fields: [
            { label: "Banco", value: "Bancolombia" },
            { label: "Tipo de cuenta", value: "Cuenta de Ahorros" },
            { label: "N.º de cuenta", value: "123-456789-01" },
            { label: "Titular", value: "EduGestión Colombia S.A.S." },
            { label: "NIT", value: "901.234.567-8" },
            { label: "Nequi", value: "300 123 4567" },
        ],
    },
};

const MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export const money = (n: number) => n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatDate = (d: Date) => `${d.getDate()} ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;

const PER_PAGE = 5;

/**
 * Estado y lógica de la página de pagos: fetch, búsqueda, paginación,
 * modal de bauche del historial y modal de pago por internet.
 */
export function usePagos() {
    const { data: fetchedPayments } = useFetch(getPagos, []);
    const [payments, setPayments] = useState<Payment[]>([]);
    useEffect(() => setPayments(fetchedPayments), [fetchedPayments]);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [form, setForm] = useState({ currency: "USD", voucher: "" });
    const [modalTab, setModalTab] = useState<"cuenta" | "prueba">("cuenta");
    const [copied, setCopied] = useState<string | null>(null);
    const [photo, setPhoto] = useState<{ name: string; url: string } | null>(null);
    const [photoError, setPhotoError] = useState(false);

    const filteredPayments = payments.filter((p) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return (
            p.voucher.toLowerCase().includes(q) ||
            p.type.toLowerCase().includes(q) ||
            p.currency.toLowerCase().includes(q) ||
            p.date.toLowerCase().includes(q) ||
            STATUS_META[p.status].label.toLowerCase().includes(q)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredPayments.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const pagedPayments = filteredPayments.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const account = ACCOUNTS_BY_CURRENCY[form.currency];
    const amountToPay = owed * (RATES[form.currency] ?? 1);

    const copyValue = (label: string, value: string) => {
        navigator.clipboard?.writeText(value);
        setCopied(label);
        setTimeout(() => setCopied((c) => (c === label ? null : c)), 1500);
    };

    const openModal = () => {
        setForm({ currency: FEE_CURRENCY, voucher: "" });
        setModalTab("cuenta");
        if (photo?.url) URL.revokeObjectURL(photo.url);
        setPhoto(null);
        setPhotoError(false);
        setShowModal(true);
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (photo?.url) URL.revokeObjectURL(photo.url);
        setPhoto({ name: file.name, url: URL.createObjectURL(file) });
        setPhotoError(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!photo) {
            setPhotoError(true);
            return;
        }
        const newPayment: Payment = {
            id: Date.now(),
            amount: amountToPay,
            currency: form.currency,
            date: formatDate(new Date()),
            type: "manual",
            status: "review",
            voucher: form.voucher.trim() || "—",
            receiptUrl: photo.url,
        };
        setPayments([newPayment, ...payments]);
        setShowModal(false);
        setFeedback("Tu pago fue enviado y quedó en estado «En revisión». Administración lo confirmará pronto.");
        setPhoto(null);
        setPhotoError(false);
    };

    return {
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
        currencies: CURRENCIES,
        copyValue,
        openModal,
        handleFile,
        handleSubmit,
    };
}
