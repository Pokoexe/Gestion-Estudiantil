import { useState } from "react";
import { LAPSOS, CURRENT_LAPSO_ID } from "@shared/services/data/lapsos";
import { type LocalLapso } from "../interfaces";

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

const TODAY = "2026-07-05";

const PER_PAGE = 6;

const COLS = "grid-cols-[1.3fr_1fr_1fr_1fr_1.1fr_auto]";
const HEADERS = ["Lapso", "Período", "Inicio", "Cierre", "Estado", ""];

function diasEntre(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

function fmtFecha(iso: string): string {
  const [y, m, d] = iso.split("-");
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${Number(d)} ${meses[Number(m) - 1]} ${y}`;
}

function fmtFechaLarga(iso: string): string {
  const [y, m, d] = iso.split("-");
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${Number(d)} de ${meses[Number(m) - 1]} de ${y}`;
}

export function useLapsos() {
  const [lapsos, setLapsos] = useState<LocalLapso[]>(LAPSOS.map((l) => ({ ...l })));

  const [editTarget, setEditTarget] = useState<number | null>(null);
  const [editInicio, setEditInicio] = useState("");
  const [editCierre, setEditCierre] = useState("");

  const [showNuevo, setShowNuevo] = useState(false);
  const [nuevoForm, setNuevoForm] = useState({ roman: "", periodo: "2026-I", inicio: "", cierre: "" });

  const [page, setPage] = useState(1);

  const current = lapsos.find((l) => l.id === CURRENT_LAPSO_ID)!;
  const diasTotal = Math.max(1, diasEntre(current.inicio, current.cierre));
  const diasTrans = Math.min(diasTotal, Math.max(0, diasEntre(current.inicio, TODAY)));
  const progreso = Math.round((diasTrans / diasTotal) * 100);

  const totalPages = Math.max(1, Math.ceil(lapsos.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = lapsos.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const openEdit = (id: number) => {
    const l = lapsos.find((lp) => lp.id === id)!;
    setEditInicio(l.inicio);
    setEditCierre(l.cierre);
    setEditTarget(id);
  };

  const guardarCierre = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTarget === null) return;
    setLapsos((prev) =>
      prev.map((l) =>
        l.id === editTarget
          ? {
            ...l,
            inicio: editInicio,
            cierre: editCierre,
            inicioLabel: fmtFechaLarga(editInicio),
            cierreLabel: fmtFechaLarga(editCierre),
          }
          : l
      )
    );
    setEditTarget(null);
  };

  const agregarLapso = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = Math.max(...lapsos.map((l) => l.id)) + 1;
    setLapsos((prev) => [
      ...prev,
      {
        id: nextId,
        roman: nuevoForm.roman,
        label: `Lapso ${nuevoForm.roman}`,
        periodo: nuevoForm.periodo,
        fullLabel: `Lapso ${nuevoForm.roman} · ${nuevoForm.periodo}`,
        inicio: nuevoForm.inicio,
        cierre: nuevoForm.cierre,
        inicioLabel: fmtFechaLarga(nuevoForm.inicio),
        cierreLabel: fmtFechaLarga(nuevoForm.cierre),
        estado: "proximo",
      },
    ]);
    setShowNuevo(false);
    setNuevoForm({ roman: "", periodo: "2026-I", inicio: "", cierre: "" });
  };

  return {
    lapsos,
    editTarget,
    setEditTarget,
    editInicio,
    setEditInicio,
    editCierre,
    setEditCierre,
    showNuevo,
    setShowNuevo,
    nuevoForm,
    setNuevoForm,
    page,
    setPage,
    current,
    diasTotal,
    diasTrans,
    progreso,
    totalPages,
    currentPage,
    paged,
    openEdit,
    guardarCierre,
    agregarLapso,
    TEAL,
    TODAY,
    COLS,
    HEADERS,
    fmtFecha,
    fmtFechaLarga,
    diasEntre,
  };
}
