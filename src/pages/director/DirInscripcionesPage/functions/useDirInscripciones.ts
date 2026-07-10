import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    UserPlus,
    Users,
    TrendingUp,
} from "lucide-react";
import { accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import {
    getInscripciones,
    getInscripcionesChart,
    type Inscripcion,
    type InscripcionEstado,
    type InscripcionTipo,
} from "@shared/services/actions/inscripciones";
import {
    INSCRIPCION_FEE,
    TIPO_META,
    ESTADO_META,
} from "@shared/services/data/inscripciones";
import { color } from "@themes/tokens";
import type { PendingAction } from "../interfaces";

const PER_PAGE = 6;

const COLS = "grid-cols-[1.4fr_1.3fr_0.8fr_1fr_0.9fr]";
const HEADERS = ["Estudiante", "Representante", "Tipo", "Bauche", "Estado"];

const AREAS = [
    { dataKey: "nuevos", name: "Nuevos ingresos", color: color.primary },
    { dataKey: "reinscritos", name: "Reinscritos", color: color.success },
];

export function useDirInscripciones() {
    const navigate = useNavigate();

    const { data: inscripciones } = useFetch(getInscripciones, []);
    const { data: chart } = useFetch(getInscripcionesChart, []);

    const [items, setItems] = useState<Inscripcion[]>([]);
    useEffect(() => setItems(inscripciones.map((x) => ({ ...x }))), [inscripciones]);
    const [query, setQuery] = useState("");
    const [tipoFilter, setTipoFilter] = useState<"todos" | InscripcionTipo>("todos");
    const [estadoFilter, setEstadoFilter] = useState<"todos" | InscripcionEstado>("todos");
    const [page, setPage] = useState(1);
    const [baucheItem, setBaucheItem] = useState<Inscripcion | null>(null);
    const [pending, setPending] = useState<PendingAction>(null);
    const [abiertas, setAbiertas] = useState(true);

    /* ---- Métricas ---- */
    const total = items.length;
    const nuevos = items.filter((x) => x.tipo === "nuevo").length;
    const reinscritos = items.filter((x) => x.tipo === "reinscrito").length;
    const porRevisar = items.filter((x) => x.estado === "revision").length;
    const activas = items.filter((x) => x.estado !== "rechazado").length;

    const KPIS = [
        { label: "Total inscritos", value: String(total), icon: Users, ac: accent.blue },
        { label: "Nuevos ingresos", value: String(nuevos), icon: UserPlus, ac: accent.green },
        { label: "Reinscritos", value: String(reinscritos), icon: TrendingUp, ac: accent.purple },
    ];

    /* ---- Filtrado y paginación ---- */
    const filtered = items
        .filter((x) => tipoFilter === "todos" || x.tipo === tipoFilter)
        .filter((x) => estadoFilter === "todos" || x.estado === estadoFilter)
        .filter((x) => {
            const q = query.trim().toLowerCase();
            if (!q) return true;
            return `${x.estNombre} ${x.estApellido} ${x.repNombre} ${x.repApellido} ${x.bauche} ${x.gradoSolicitado}`
                .toLowerCase()
                .includes(q);
        });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    /* ---- Aceptar / rechazar ---- */
    const applyAction = (id: number, action: "aceptar" | "rechazar") => {
        const estado: InscripcionEstado = action === "aceptar" ? "aceptado" : "rechazado";
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, estado } : x)));
        // Muta el registro compartido (el mismo array que sirve el endpoint) para
        // que la página de detalle refleje el cambio al navegar.
        const rec = inscripciones.find((r) => r.id === id);
        if (rec) rec.estado = estado;
        setPending(null);
        setBaucheItem(null);
    };

    return {
        navigate,
        chart,
        items,
        query,
        setQuery,
        tipoFilter,
        setTipoFilter,
        estadoFilter,
        setEstadoFilter,
        page,
        setPage,
        baucheItem,
        setBaucheItem,
        pending,
        setPending,
        abiertas,
        setAbiertas,
        KPIS,
        filtered,
        totalPages,
        currentPage,
        paged,
        applyAction,
        COLS,
        HEADERS,
        AREAS,
        TIPO_META,
        ESTADO_META,
        INSCRIPCION_FEE,
        porRevisar,
        activas,
        total,
    };
}
