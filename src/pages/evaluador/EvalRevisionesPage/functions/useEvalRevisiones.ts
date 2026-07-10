import { useEffect, useState } from "react";
import {
  ClipboardList,
  ClipboardCheck,
  CheckCircle2,
  MessageSquareWarning,
} from "lucide-react";
import { useLapso } from "@shared/context/LapsoContext";
import { useFetch } from "@shared/services";
import {
  getRevisiones,
  type Revision,
  type RevTipo,
  type RevEstado,
} from "@shared/services/actions/evaluador";
import type { TabOpt } from "../interfaces";

export const TEAL = "#0d9488";
export const TEAL_BG = "#ccfbf1";
export const TEAL_50 = "#f0fdfa";

export const ESTADO_META: Record<RevEstado, string> = {
  Pendiente: "bg-edu-warning-bg text-edu-warning",
  Aprobado: "bg-edu-success-bg text-edu-success",
  "Revisión solicitada": "bg-edu-danger-bg text-edu-danger",
};

export const TIPO_META: Record<RevTipo, string> = {
  Exámenes: "text-edu-warning",
  "Planes de evaluación": "text-edu-primary",
  "Temas de reparación": "text-edu-purple",
};

export const TABS: TabOpt[] = [
  "Todas",
  "Exámenes",
  "Planes de evaluación",
  "Temas de reparación",
];
export const COLS =
  "grid-cols-[1.4fr_1.1fr_0.9fr_1.1fr_0.9fr_1fr_1.2fr]";
export const HEADERS = [
  "Docente",
  "Materia",
  "Sección",
  "Tipo",
  "Fecha",
  "Estado",
  "Acciones",
];
export const PER_PAGE = 6;

export function useEvalRevisiones() {
  const { data: fetched } = useFetch(getRevisiones, []);
  const [revisiones, setRevisiones] = useState<Revision[]>([]);
  useEffect(() => setRevisiones(fetched), [fetched]);

  const [tab, setTab] = useState<TabOpt>("Todas");
  const [query, setQuery] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<"todos" | RevEstado>(
    "todos"
  );
  const [page, setPage] = useState(1);
  const [modalId, setModalId] = useState<number | null>(null);
  const [obs, setObs] = useState("");
  const [detail, setDetail] = useState<Revision | null>(null);
  const [confirmAprobar, setConfirmAprobar] = useState<Revision | null>(null);

  const { selectedId } = useLapso();
  const enLapso = revisiones.filter((r) => r.lapso === selectedId);
  const pendientes = enLapso.filter((r) => r.estado === "Pendiente").length;

  const filtradas = enLapso.filter((r) => {
    if (tab !== "Todas" && r.tipo !== tab) return false;
    if (estadoFilter !== "todos" && r.estado !== estadoFilter) return false;
    if (
      query.trim() &&
      !`${r.docente} ${r.materia} ${r.seccion}`
        .toLowerCase()
        .includes(query.trim().toLowerCase())
    )
      return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtradas.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtradas.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const modalRevision = revisiones.find((x) => x.id === modalId);

  const aprobar = (id: number) =>
    setRevisiones((rs) =>
      rs.map((r) =>
        r.id === id ? { ...r, estado: "Aprobado", observacion: undefined } : r
      )
    );

  const solicitarRevision = () => {
    if (modalId === null) return;
    setRevisiones((rs) =>
      rs.map((r) =>
        r.id === modalId
          ? {
              ...r,
              estado: "Revisión solicitada",
              observacion: obs.trim() || "Se solicitaron ajustes.",
            }
          : r
      )
    );
    setModalId(null);
    setObs("");
  };

  const KPIS = [
    {
      label: "Por revisar",
      value: String(pendientes),
      icon: ClipboardList,
      bg: TEAL_BG,
      fg: TEAL,
    },
    {
      label: "Aprobados",
      value: String(enLapso.filter((r) => r.estado === "Aprobado").length),
      icon: CheckCircle2,
      bg: "#dcfce7",
      fg: "#16a34a",
    },
    {
      label: "En revisión",
      value: String(
        enLapso.filter((r) => r.estado === "Revisión solicitada").length
      ),
      icon: MessageSquareWarning,
      bg: "#fee2e2",
      fg: "#dc2626",
    },
    {
      label: "Total de entregas",
      value: String(enLapso.length),
      icon: ClipboardCheck,
      bg: "#ede9fe",
      fg: "#7c3aed",
    },
  ];

  return {
    // state
    tab,
    setTab,
    query,
    setQuery,
    estadoFilter,
    setEstadoFilter,
    page,
    setPage,
    modalId,
    setModalId,
    obs,
    setObs,
    detail,
    setDetail,
    confirmAprobar,
    setConfirmAprobar,
    // derived
    filtradas,
    totalPages,
    currentPage,
    paged,
    modalRevision,
    KPIS,
    // handlers
    aprobar,
    solicitarRevision,
    // constants
    TEAL,
    TEAL_BG,
    TEAL_50,
    ESTADO_META,
    TIPO_META,
    TABS,
    COLS,
    HEADERS,
  };
}
