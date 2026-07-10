import { useState, useEffect } from "react";
import { useFetch } from "@shared/services";
import {
    getAsistenciaEstudiantes,
    getAsistenciaDocentes,
    type AsistenciaPersona as Persona,
} from "@shared/services/actions/coordinador";
import type { Tab } from "../interfaces";

export function useCoordAsistencia() {
    const { data: estudiantesFetched } = useFetch(getAsistenciaEstudiantes, []);
    const { data: docentesFetched } = useFetch(getAsistenciaDocentes, []);
    const [tab, setTab] = useState<Tab>("estudiantes");
    const [estudiantes, setEstudiantes] = useState<Persona[]>([]);
    useEffect(() => setEstudiantes(estudiantesFetched), [estudiantesFetched]);
    const [docentes, setDocentes] = useState<Persona[]>([]);
    useEffect(() => setDocentes(docentesFetched), [docentesFetched]);

    return { tab, setTab, estudiantes, setEstudiantes, docentes, setDocentes };
}
