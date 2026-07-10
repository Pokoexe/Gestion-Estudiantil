import { useState } from "react";
import { color } from "@themes/tokens";
import type { AsistenciaPersona as Persona } from "@shared/services/actions/coordinador";
import type { Estado } from "../interfaces";

const PER_PAGE = 5;

export function useAttendancePanel(data: Persona[], setData: React.Dispatch<React.SetStateAction<Persona[]>>) {
    const [registerOpen, setRegisterOpen] = useState(false);
    const [todayMarks, setTodayMarks] = useState<Record<number, Estado>>({});
    const [saved, setSaved] = useState(false);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    /* Agregados del mes (sobre el total, no sobre el filtro) */
    const presentes = data.reduce((s, p) => s + p.present, 0);
    const ausentes = data.reduce((s, p) => s + (p.total - p.present), 0);
    const totalReg = presentes + ausentes;
    const pct = totalReg ? Math.round((presentes / totalReg) * 100) : 0;

    /* Búsqueda + paginación de la tabla */
    const q = query.trim().toLowerCase();
    const filtered = q
        ? data.filter((p) => p.name.toLowerCase().includes(q) || p.meta.toLowerCase().includes(q))
        : data;
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const donutData = [
        { name: "Presente", value: presentes, fill: color.success },
        { name: "Ausente", value: ausentes, fill: color.danger },
    ];

    const openRegister = () => {
        setTodayMarks(Object.fromEntries(data.map((p) => [p.id, "presente"])) as Record<number, Estado>);
        setSaved(false);
        setRegisterOpen(true);
    };

    const guardarHoy = () => {
        setData((prev) =>
            prev.map((p) => ({
                ...p,
                present: p.present + (todayMarks[p.id] === "presente" ? 1 : 0),
                total: p.total + 1,
            })),
        );
        setRegisterOpen(false);
        setSaved(true);
    };

    const hoyPresentes = Object.values(todayMarks).filter((e) => e === "presente").length;
    const hoyAusentes = Object.values(todayMarks).filter((e) => e === "ausente").length;

    return {
        registerOpen,
        setRegisterOpen,
        todayMarks,
        setTodayMarks,
        saved,
        query,
        setQuery,
        page,
        setPage,
        presentes,
        ausentes,
        totalReg,
        pct,
        filtered,
        totalPages,
        currentPage,
        paged,
        donutData,
        hoyPresentes,
        hoyAusentes,
        openRegister,
        guardarHoy,
    };
}
