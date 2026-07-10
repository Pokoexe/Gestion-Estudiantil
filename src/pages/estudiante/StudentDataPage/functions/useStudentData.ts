import { useFetch } from "@shared/services";
import {
    getPerfilEstudiante,
    getProximasEvaluaciones,
    getMateriasReprobadas,
    getIncidencias,
    getActividadesPerfil,
} from "@shared/services/actions/estudiante";

const MAX_ITEMS = 5;

/**
 * Estado y lógica de la página de datos del estudiante: fetch de perfil,
 * próximas evaluaciones, materias reprobadas, incidencias y actividades,
 * con recorte a un máximo de ítems y estado de carga agregado.
 */
export function useStudentData() {
    const { data: student, loading: loadingStudent } = useFetch(getPerfilEstudiante, null);
    const { data: proximasEval, loading: loadingProximas } = useFetch(getProximasEvaluaciones, []);
    const { data: materiasReprobadas, loading: loadingReprobadas } = useFetch(getMateriasReprobadas, []);
    const { data: incidenciasData, loading: loadingIncidencias } = useFetch(getIncidencias, []);
    const { data: actividadesData, loading: loadingActividades } = useFetch(getActividadesPerfil, []);

    const incidencias = incidenciasData.slice(0, MAX_ITEMS);
    const actividades = actividadesData.slice(0, MAX_ITEMS);
    const proximas = proximasEval.slice(0, MAX_ITEMS);
    const reprobadas = materiasReprobadas.slice(0, MAX_ITEMS);

    const loading = loadingStudent || loadingProximas || loadingReprobadas || loadingIncidencias || loadingActividades;

    return {
        student,
        loading,
        incidencias,
        actividades,
        proximas,
        reprobadas,
    };
}
