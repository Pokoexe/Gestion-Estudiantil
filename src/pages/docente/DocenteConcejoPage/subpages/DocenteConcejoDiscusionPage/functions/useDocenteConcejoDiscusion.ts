import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { desglose } from "@shared/services/data/boletines";
import { useFetch } from "@shared/services";
import { getPostulaciones, decidirPostulacion, type PostEstado } from "@shared/services/actions/discusiones";
import { getBoletines, getMaterias } from "@shared/services/actions/boletines";

export const ESTADO_META: Record<PostEstado, string> = {
    Pendiente: "bg-edu-warning-bg text-edu-warning",
    Aceptada: "bg-edu-success-bg text-edu-success",
    Rechazada: "bg-edu-danger-bg text-edu-danger",
};

export const EVAL_COLS = "grid-cols-[2fr_1fr_0.7fr_0.7fr]";

export function useDocenteConcejoDiscusion() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: POSTULACIONES, loading: loadingPost } = useFetch(getPostulaciones, []);
    const { data: BOLETINES, loading: loadingBol } = useFetch(getBoletines, []);
    const { data: MATERIAS, loading: loadingMat } = useFetch(getMaterias, []);
    const loading = loadingPost || loadingBol || loadingMat;

    const post = POSTULACIONES.find((p) => String(p.id) === id);

    const [obs, setObs] = useState("");
    // Materia cuyas notas se están VISUALIZANDO (no necesariamente la que se discute).
    const [viewMateria, setViewMateria] = useState("");
    const [confirm, setConfirm] = useState<"Aceptada" | "Rechazada" | null>(null);

    // Sincroniza los valores iniciales editables una vez cargados los datos.
    useEffect(() => {
        if (post) setObs(post.observacion ?? "");
    }, [post]);
    useEffect(() => {
        if (post) setViewMateria(post.materia);
        else if (MATERIAS.length) setViewMateria(MATERIAS[0]);
    }, [post, MATERIAS]);

    const volver = () => navigate("/docente/concejo");

    const boletin = post ? BOLETINES.find((b) => b.student === post.estudiante) : undefined;
    const pendiente = post ? post.estado === "Pendiente" : false;

    // Materias disponibles en el selector (garantiza incluir la materia en discusión).
    const materias = post
        ? MATERIAS.includes(post.materia) ? MATERIAS : [post.materia, ...MATERIAS]
        : MATERIAS;

    // Nota final de una materia: del boletín si existe; si no, la de la postulación.
    const notaFinalDe = (m: string): number => {
        const idx = MATERIAS.indexOf(m);
        if (boletin && idx >= 0) return boletin.notas[idx];
        return post ? post.nota : 0;
    };

    const viewNota = notaFinalDe(viewMateria);
    const viewEvals = desglose(viewNota);
    const viendoDiscusion = post ? viewMateria === post.materia : false;

    const confirmarDecision = async () => {
        if (!confirm || !post) return;
        await decidirPostulacion(post.id, confirm, obs);
        setConfirm(null);
        volver();
    };

    return {
        loading,
        post,
        obs,
        setObs,
        viewMateria,
        setViewMateria,
        confirm,
        setConfirm,
        volver,
        boletin,
        pendiente,
        materias,
        notaFinalDe,
        viewNota,
        viewEvals,
        viendoDiscusion,
        confirmarDecision,
    };
}
