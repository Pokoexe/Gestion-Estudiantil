import { useNavigate } from "react-router";
import { useFetch } from "@shared/services";
import { getHorario, getMateriaSeccion } from "@shared/services/actions/docente";
import type { Materia } from "../interfaces";

/* ------------------------------------------------------------------ */
/* Mapas presentacionales                                             */
/* ------------------------------------------------------------------ */

export const MATERIAS: Materia[] = [
    { key: "cn", name: "Ciencias Naturales", bg: "#dbeafe", fg: "#1e40af" },
    { key: "bio", name: "Biología", bg: "#dcfce7", fg: "#166534" },
    { key: "tierra", name: "Ciencias de la Tierra", bg: "#ede9fe", fg: "#5b21b6" },
    { key: "quim", name: "Química", bg: "#ffedd5", fg: "#9a3412" },
];

export const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as const;

export const BLOQUES = [
    "07:00 - 07:40",
    "07:40 - 08:20",
    "08:20 - 09:00",
    "09:00 - 09:40",
    "09:40 - 10:20",
] as const;

export function useDocenteHorario() {
    const navigate = useNavigate();
    const { data: HORARIO } = useFetch(getHorario, []);
    const { data: SUBJECT_TO_SECTION } = useFetch(getMateriaSeccion, {});

    const materiaMap: Record<string, Materia> = Object.fromEntries(
        MATERIAS.map((m) => [m.key, m]),
    );

    return { HORARIO, SUBJECT_TO_SECTION, navigate, MATERIAS, DIAS, BLOQUES, materiaMap };
}
