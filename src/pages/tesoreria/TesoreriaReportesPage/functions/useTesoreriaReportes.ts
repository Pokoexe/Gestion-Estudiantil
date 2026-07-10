import { useState, useEffect } from "react";
import { color } from "@themes/tokens";
import { useFetch } from "@shared/services";
import {
  getReportes,
  type ReportType,
  type ReportStatus,
  type Report,
} from "@shared/services/actions/tesoreria";

const REPORT_TYPES: ReportType[] = ["Ausencia de clases", "Falla de servicios", "Suspensión", "Incidente", "Mantenimiento"];

const REPORT_STATUS: Record<ReportStatus, { label: string; bg: string; fg: string }> = {
  abierto: { label: "Abierto", bg: color.dangerBg, fg: color.danger },
  en_proceso: { label: "En proceso", bg: color.warningBg, fg: color.warning },
  cerrado: { label: "Cerrado", bg: color.successBg, fg: color.success },
};

const RESPONSABLES = ["Coord. Luis Aponte", "Prof. Marisela Ríos", "Aux. Génesis Prieto", "Dir. Ana Belén Ferrer"];
const REP_COLS = "grid-cols-[2fr_1.1fr_0.9fr_1.2fr_0.9fr]";
const REP_HEADERS = ["Título", "Tipo", "Fecha", "Autor", "Estado"];
const PER_PAGE = 6;

export function useTesoreriaReportes() {
  const { data: fetchedReports } = useFetch(getReportes, []);

  const [reports, setReports] = useState<Report[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: REPORT_TYPES[0], date: "3 jul 2026", desc: "" });
  const [responsable, setResponsable] = useState(RESPONSABLES[0]);
  const [editReport, setEditReport] = useState<Report | null>(null);
  const [editForm, setEditForm] = useState({ title: "", type: REPORT_TYPES[0], date: "", author: RESPONSABLES[0], status: "abierto" as ReportStatus });
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"todos" | ReportType>("todos");
  const [statusFilter, setStatusFilter] = useState<"todos" | ReportStatus>("todos");
  const [page, setPage] = useState(1);

  useEffect(() => setReports(fetchedReports), [fetchedReports]);

  const total = reports.length;
  const last = reports[0];
  const thisMonth = reports.filter((r) => r.date.includes("jul")).length;

  const filtered = reports.filter((r) => {
    if (typeFilter !== "todos" && r.type !== typeFilter) return false;
    if (statusFilter !== "todos" && r.status !== statusFilter) return false;
    if (query.trim() && !`${r.title} ${r.type} ${r.author}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const openModal = () => {
    setForm({ type: REPORT_TYPES[0], date: "3 jul 2026", desc: "" });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: Report = {
      id: Date.now(),
      title: form.desc.trim() ? form.desc.trim().slice(0, 60) : form.type,
      type: form.type,
      date: form.date,
      author: responsable,
      status: "abierto",
    };
    setReports([nuevo, ...reports]);
    setShowModal(false);
  };

  const openEdit = (r: Report) => {
    setEditForm({ title: r.title, type: r.type, date: r.date, author: r.author, status: r.status });
    setEditReport(r);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editReport) return;
    setReports((prev) => prev.map((x) => (x.id === editReport.id
      ? { ...x, title: editForm.title.trim() || x.title, type: editForm.type, date: editForm.date, author: editForm.author, status: editForm.status }
      : x)));
    setEditReport(null);
  };

  return {
    reports, showModal, setShowModal,
    form, setForm, responsable, setResponsable,
    editReport, setEditReport, editForm, setEditForm,
    query, setQuery, typeFilter, setTypeFilter, statusFilter, setStatusFilter, page, setPage,
    total, last, thisMonth,
    filtered, totalPages, currentPage, paged,
    openModal, handleSubmit, openEdit, handleEditSubmit,
    REPORT_TYPES, REPORT_STATUS, RESPONSABLES, REP_COLS, REP_HEADERS,
  };
}
