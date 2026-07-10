import { useState, useEffect } from "react";
import { useFetch } from "@shared/services";
import {
    getSecciones,
    getMateriasCoord,
    getBloques,
    getDocentesSecciones,
    type Seccion,
    type Materia,
    type Bloque,
    type Nivel,
} from "@shared/services/actions/coordinador";
import type { Tab } from "../interfaces";

const PER_PAGE = 5;

const NIVELES: Nivel[] = ["Primaria", "Liceo"];

const NIVEL_META: Record<Nivel, { cls: string }> = {
    Primaria: { cls: "bg-edu-primary-100 text-edu-primary" },
    Liceo: { cls: "bg-edu-warning-bg text-edu-warning" },
};

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const ANIOS = ["1.º Año", "2.º Año", "3.º Año", "4.º Año", "5.º Año"];

const SEC_COLS = "grid-cols-[1fr_0.7fr_0.7fr_1.4fr_0.7fr]";
const SEC_HEADERS = ["Año", "Sección", "Cupo", "Tutor", "Acciones"];

const MAT_COLS = "grid-cols-[0.5fr_2fr_1fr_0.7fr]";
const MAT_HEADERS = ["N.º", "Materia", "Nivel", "Acciones"];

const TABS: { key: Tab; label: string }[] = [
    { key: "secciones", label: "Secciones / Años" },
    { key: "materias", label: "Materias" },
    { key: "horarios", label: "Formato de horarios" },
];

export function useCoordSecciones() {
    const { data: seccionesFetched } = useFetch(getSecciones, []);
    const { data: materiasFetched } = useFetch(getMateriasCoord, []);
    const { data: bloquesFetched } = useFetch(getBloques, []);
    const { data: DOCENTES } = useFetch(getDocentesSecciones, []);

    const [tab, setTab] = useState<Tab>("secciones");

    // Secciones
    const [secciones, setSecciones] = useState<Seccion[]>([]);
    useEffect(() => setSecciones(seccionesFetched), [seccionesFetched]);
    const [secModal, setSecModal] = useState<{ mode: "add" | "edit"; id: number | null; anio: string; seccion: string; cupo: string; tutor: string } | null>(null);
    const [confirmDelSec, setConfirmDelSec] = useState<Seccion | null>(null);
    const [secQuery, setSecQuery] = useState("");
    const [secPage, setSecPage] = useState(1);

    // Materias
    const [materias, setMaterias] = useState<Materia[]>([]);
    useEffect(() => setMaterias(materiasFetched), [materiasFetched]);
    const [matModal, setMatModal] = useState<{ mode: "add" | "edit"; id: number | null; nombre: string; nivel: Nivel } | null>(null);
    const [confirmDelMat, setConfirmDelMat] = useState<Materia | null>(null);
    const [matQuery, setMatQuery] = useState("");
    const [matPage, setMatPage] = useState(1);

    // Horarios
    const [bloques, setBloques] = useState<Bloque[]>([]);
    useEffect(() => setBloques(bloquesFetched), [bloquesFetched]);
    const [nuevoBloque, setNuevoBloque] = useState({ inicio: "", fin: "" });
    // Asignación docente por celda: clave `${bloqueId}-${dia}`
    const [asignaciones, setAsignaciones] = useState<Record<string, string>>({});

    // Filtro y paginación de secciones
    const filteredSec = secciones.filter(
        (s) => !secQuery.trim() || `${s.anio} ${s.seccion} ${s.tutor}`.toLowerCase().includes(secQuery.trim().toLowerCase())
    );
    const secTotalPages = Math.max(1, Math.ceil(filteredSec.length / PER_PAGE));
    const secCurrentPage = Math.min(secPage, secTotalPages);
    const secPaged = filteredSec.slice((secCurrentPage - 1) * PER_PAGE, secCurrentPage * PER_PAGE);

    // Filtro y paginación de materias
    const filteredMat = materias.filter(
        (m) => !matQuery.trim() || `${m.nombre} ${m.nivel}`.toLowerCase().includes(matQuery.trim().toLowerCase())
    );
    const matTotalPages = Math.max(1, Math.ceil(filteredMat.length / PER_PAGE));
    const matCurrentPage = Math.min(matPage, matTotalPages);
    const matPaged = filteredMat.slice((matCurrentPage - 1) * PER_PAGE, matCurrentPage * PER_PAGE);

    const openAddSec = () => setSecModal({ mode: "add", id: null, anio: "1.º Año", seccion: "A", cupo: "30", tutor: "Sin asignar" });
    const openEditSec = (s: Seccion) => setSecModal({ mode: "edit", id: s.id, anio: s.anio, seccion: s.seccion, cupo: String(s.cupo), tutor: s.tutor });

    const guardarSeccion = (e: React.FormEvent) => {
        e.preventDefault();
        if (!secModal) return;
        const datos = {
            anio: secModal.anio,
            seccion: secModal.seccion.trim().toUpperCase() || "A",
            cupo: Number(secModal.cupo) || 30,
            tutor: secModal.tutor,
        };
        if (secModal.mode === "add") {
            setSecciones([...secciones, { id: Date.now(), ...datos }]);
        } else {
            setSecciones((ss) => ss.map((x) => (x.id === secModal.id ? { ...x, ...datos } : x)));
        }
        setSecModal(null);
    };

    const eliminarSeccion = () => {
        if (!confirmDelSec) return;
        setSecciones((ss) => ss.filter((x) => x.id !== confirmDelSec.id));
        setConfirmDelSec(null);
    };

    const openAddMat = () => setMatModal({ mode: "add", id: null, nombre: "", nivel: "Primaria" });
    const openEditMat = (m: Materia) => setMatModal({ mode: "edit", id: m.id, nombre: m.nombre, nivel: m.nivel });

    const guardarMateria = (e: React.FormEvent) => {
        e.preventDefault();
        if (!matModal) return;
        const nombre = matModal.nombre.trim();
        if (!nombre) return;
        if (matModal.mode === "add") {
            setMaterias([...materias, { id: Date.now(), nombre, nivel: matModal.nivel }]);
            setMatQuery("");
            setMatPage(matTotalPages);
        } else {
            setMaterias((ms) => ms.map((x) => (x.id === matModal.id ? { ...x, nombre, nivel: matModal.nivel } : x)));
        }
        setMatModal(null);
    };

    const eliminarMateria = () => {
        if (!confirmDelMat) return;
        setMaterias((ms) => ms.filter((x) => x.id !== confirmDelMat.id));
        setConfirmDelMat(null);
    };

    const agregarBloque = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoBloque.inicio || !nuevoBloque.fin) return;
        setBloques([...bloques, { id: Date.now(), inicio: nuevoBloque.inicio, fin: nuevoBloque.fin }]);
        setNuevoBloque({ inicio: "", fin: "" });
    };

    const eliminarBloque = (id: number) => setBloques((bs) => bs.filter((b) => b.id !== id));

    const setAsignacion = (bloqueId: number, dia: string, docente: string) =>
        setAsignaciones((a) => ({ ...a, [`${bloqueId}-${dia}`]: docente }));

    return {
        tab, setTab,
        secciones, secModal, setSecModal, confirmDelSec, setConfirmDelSec,
        secQuery, setSecQuery, secPage, setSecPage,
        materias, matModal, setMatModal, confirmDelMat, setConfirmDelMat,
        matQuery, setMatQuery, matPage, setMatPage,
        bloques, nuevoBloque, setNuevoBloque, asignaciones,
        filteredSec, secTotalPages, secCurrentPage, secPaged,
        filteredMat, matTotalPages, matCurrentPage, matPaged,
        openAddSec, openEditSec, guardarSeccion, eliminarSeccion,
        openAddMat, openEditMat, guardarMateria, eliminarMateria,
        agregarBloque, eliminarBloque, setAsignacion,
        DOCENTES,
        NIVELES, NIVEL_META, DIAS, ANIOS,
        SEC_COLS, SEC_HEADERS, MAT_COLS, MAT_HEADERS, TABS,
    };
}
