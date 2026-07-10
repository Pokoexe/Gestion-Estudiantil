import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useFetch } from "@shared/services";
import { getInscripciones, type InscripcionEstado } from "@shared/services/actions/inscripciones";
import {
    TIPO_META,
    ESTADO_META,
} from "@shared/services/data/inscripciones";
import type { PendingAction } from "../interfaces";

export function useDirInscripcionDetalle() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: inscripciones, loading } = useFetch(getInscripciones, []);
    const record = inscripciones.find((x) => x.id === Number(id));

    const [estado, setEstado] = useState<InscripcionEstado | undefined>(undefined);
    useEffect(() => setEstado(record?.estado), [record]);
    const [showBauche, setShowBauche] = useState(false);
    const [pending, setPending] = useState<PendingAction>(null);

    const tipo = record ? TIPO_META[record.tipo] : undefined;
    const estadoMeta = record ? ESTADO_META[estado ?? record.estado] : undefined;
    const iniciales = record
        ? `${record.estNombre[0] ?? ""}${record.estApellido[0] ?? ""}`.toUpperCase()
        : "";

    const applyAction = (action: "aceptar" | "rechazar") => {
        const nuevo: InscripcionEstado = action === "aceptar" ? "aceptado" : "rechazado";
        record!.estado = nuevo; // muta el registro compartido (la lista lo reflejará)
        setEstado(nuevo);
        setPending(null);
        setShowBauche(false);
    };

    const enRevision = (estado ?? record?.estado) === "revision";

    return {
        navigate,
        loading,
        record,
        estado,
        showBauche,
        setShowBauche,
        pending,
        setPending,
        tipo,
        estadoMeta,
        iniciales,
        enRevision,
        applyAction,
        TIPO_META,
        ESTADO_META,
    };
}
