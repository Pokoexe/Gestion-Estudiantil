/**
 * Datos ficticios de inscripciones para el panel del Director.
 *
 * El arreglo es mutable a propósito: al aceptar/rechazar desde la lista o el
 * detalle se muta el registro en sitio, de modo que ambas vistas reflejen el
 * mismo estado al navegar entre ellas (patrón de maqueta usado en el proyecto).
 */

export type InscripcionEstado = "revision" | "aceptado" | "rechazado";
export type InscripcionTipo = "nuevo" | "reinscrito";

export interface Inscripcion {
    id: number;
    /* Estudiante */
    estNombre: string;
    estApellido: string;
    estCedula: string; // puede ir vacío ("sin cédula")
    estFechaNac: string;
    estResidencia: string;
    gradoSolicitado: string; // grado al que se inscribe
    /* Representante */
    repNombre: string;
    repApellido: string;
    repCedula: string;
    repTelefono: string;
    repEmail: string;
    repTelCasa: string;
    repSustituto: string;
    repTelRespaldo: string;
    repResidencia: string;
    /* Documentos */
    primeraVez: boolean; // nuevo ingreso a la institución
    actaNacimiento: string; // nombre del archivo
    boletin: string; // nombre del archivo (solo nuevo ingreso)
    fotosCount: number;
    /* Pago */
    bauche: string;
    monto: string;
    metodo: string;
    fechaPago: string;
    /* Meta */
    tipo: InscripcionTipo;
    estado: InscripcionEstado;
    fechaInscripcion: string;
}

/** Valor de la cuota de inscripción (mostrado en el panel y en el formulario público). */
export const INSCRIPCION_FEE = "Bs. 1.500,00";

/** Serie mensual: estudiantes nuevos vs. reinscritos (los que ya estaban el año pasado). */
export const INSCRIPCION_CHART = [
    { mes: "Mar", nuevos: 5, reinscritos: 12 },
    { mes: "Abr", nuevos: 9, reinscritos: 28 },
    { mes: "May", nuevos: 14, reinscritos: 46 },
    { mes: "Jun", nuevos: 21, reinscritos: 63 },
    { mes: "Jul", nuevos: 27, reinscritos: 78 },
    { mes: "Ago", nuevos: 34, reinscritos: 92 },
];

export const INSCRIPCIONES: Inscripcion[] = [
    {
        id: 1,
        estNombre: "Daniel Andrés", estApellido: "Peña Rojas", estCedula: "", estFechaNac: "3 jun 2018",
        estResidencia: "Urb. Los Samanes, calle 4, casa 12, Maracay",
        gradoSolicitado: "1.er grado",
        repNombre: "Ramón José", repApellido: "Peña Silva", repCedula: "V-11.987.654",
        repTelefono: "0424-6667890", repEmail: "ramon.pena@gmail.com", repTelCasa: "0243-5551234",
        repSustituto: "María Silva", repTelRespaldo: "0416-7778901",
        repResidencia: "Urb. Los Samanes, calle 4, casa 12, Maracay",
        primeraVez: true, actaNacimiento: "acta_daniel_pena.pdf", boletin: "boletin_preescolar.pdf", fotosCount: 3,
        bauche: "A-10245", monto: INSCRIPCION_FEE, metodo: "Pago Móvil · Banco de Venezuela", fechaPago: "2 ago 2026",
        tipo: "nuevo", estado: "revision", fechaInscripcion: "2 ago 2026",
    },
    {
        id: 2,
        estNombre: "Valeria", estApellido: "Contreras Díaz", estCedula: "V-31.245.678", estFechaNac: "15 mar 2011",
        estResidencia: "Av. Bolívar, res. El Sol, apto 3-B, Maracay",
        gradoSolicitado: "3.er año",
        repNombre: "Josefina", repApellido: "Contreras", repCedula: "V-12.345.678",
        repTelefono: "0414-5551234", repEmail: "josefina.contreras@gmail.com", repTelCasa: "0243-2223344",
        repSustituto: "Pedro Contreras", repTelRespaldo: "0412-9990011",
        repResidencia: "Av. Bolívar, res. El Sol, apto 3-B, Maracay",
        primeraVez: false, actaNacimiento: "acta_valeria.pdf", boletin: "", fotosCount: 2,
        bauche: "A-10251", monto: INSCRIPCION_FEE, metodo: "Transferencia · Banco de Venezuela", fechaPago: "3 ago 2026",
        tipo: "reinscrito", estado: "revision", fechaInscripcion: "3 ago 2026",
    },
    {
        id: 3,
        estNombre: "Sofía", estApellido: "Marcano León", estCedula: "", estFechaNac: "5 feb 2019",
        estResidencia: "Sector La Coromoto, calle 2, casa 8, Turmero",
        gradoSolicitado: "1.er grado",
        repNombre: "Elena", repApellido: "Marcano", repCedula: "V-15.678.901",
        repTelefono: "0424-1112345", repEmail: "elena.marcano@gmail.com", repTelCasa: "",
        repSustituto: "", repTelRespaldo: "",
        repResidencia: "Sector La Coromoto, calle 2, casa 8, Turmero",
        primeraVez: true, actaNacimiento: "acta_sofia_marcano.pdf", boletin: "boletin_sofia.pdf", fotosCount: 3,
        bauche: "A-10260", monto: INSCRIPCION_FEE, metodo: "Pago Móvil · Banco de Venezuela", fechaPago: "4 ago 2026",
        tipo: "nuevo", estado: "aceptado", fechaInscripcion: "4 ago 2026",
    },
    {
        id: 4,
        estNombre: "Jesús Alberto", estApellido: "Colmenares", estCedula: "V-32.554.890", estFechaNac: "17 abr 2010",
        estResidencia: "Urb. Las Acacias, calle 7, casa 21, Maracay",
        gradoSolicitado: "4.º año",
        repNombre: "Yajaira", repApellido: "Colmenares", repCedula: "V-14.567.890",
        repTelefono: "0414-9990123", repEmail: "yajaira.colmenares@gmail.com", repTelCasa: "0243-4445566",
        repSustituto: "Luis Colmenares", repTelRespaldo: "0426-1231231",
        repResidencia: "Urb. Las Acacias, calle 7, casa 21, Maracay",
        primeraVez: false, actaNacimiento: "acta_jesus.pdf", boletin: "", fotosCount: 2,
        bauche: "A-10262", monto: INSCRIPCION_FEE, metodo: "Transferencia · Banco de Venezuela", fechaPago: "4 ago 2026",
        tipo: "reinscrito", estado: "aceptado", fechaInscripcion: "4 ago 2026",
    },
    {
        id: 5,
        estNombre: "Gabriela", estApellido: "Rondón Pérez", estCedula: "", estFechaNac: "9 sep 2017",
        estResidencia: "Urb. El Castaño, vereda 3, casa 5, Maracay",
        gradoSolicitado: "2.º grado",
        repNombre: "Marielys", repApellido: "Pérez", repCedula: "V-18.234.567",
        repTelefono: "0412-3459876", repEmail: "marielys.perez@hotmail.com", repTelCasa: "",
        repSustituto: "Andrés Rondón", repTelRespaldo: "0414-6549870",
        repResidencia: "Urb. El Castaño, vereda 3, casa 5, Maracay",
        primeraVez: true, actaNacimiento: "acta_gabriela.pdf", boletin: "boletin_1er_grado.pdf", fotosCount: 3,
        bauche: "A-10271", monto: INSCRIPCION_FEE, metodo: "Pago Móvil · Banco de Venezuela", fechaPago: "5 ago 2026",
        tipo: "nuevo", estado: "revision", fechaInscripcion: "5 ago 2026",
    },
    {
        id: 6,
        estNombre: "Andrea", estApellido: "Villalba Ruiz", estCedula: "V-31.677.402", estFechaNac: "30 nov 2009",
        estResidencia: "Res. Guaicaipuro, torre B, apto 12, Maracay",
        gradoSolicitado: "5.º año",
        repNombre: "Óscar", repApellido: "Villalba", repCedula: "V-12.876.543",
        repTelefono: "0426-2223456", repEmail: "oscar.villalba@gmail.com", repTelCasa: "0243-7778899",
        repSustituto: "", repTelRespaldo: "",
        repResidencia: "Res. Guaicaipuro, torre B, apto 12, Maracay",
        primeraVez: false, actaNacimiento: "acta_andrea.pdf", boletin: "", fotosCount: 2,
        bauche: "A-10280", monto: INSCRIPCION_FEE, metodo: "Transferencia · Banco de Venezuela", fechaPago: "5 ago 2026",
        tipo: "reinscrito", estado: "rechazado", fechaInscripcion: "5 ago 2026",
    },
    {
        id: 7,
        estNombre: "Mateo", estApellido: "Guédez Ríos", estCedula: "", estFechaNac: "12 ene 2018",
        estResidencia: "Sector Piñonal, calle 9, casa 40, Maracay",
        gradoSolicitado: "1.er grado",
        repNombre: "Luisa", repApellido: "Ríos", repCedula: "V-16.345.221",
        repTelefono: "0416-3332211", repEmail: "luisa.rios@gmail.com", repTelCasa: "",
        repSustituto: "Carlos Guédez", repTelRespaldo: "0424-8887766",
        repResidencia: "Sector Piñonal, calle 9, casa 40, Maracay",
        primeraVez: true, actaNacimiento: "acta_mateo.pdf", boletin: "boletin_mateo.pdf", fotosCount: 3,
        bauche: "A-10288", monto: INSCRIPCION_FEE, metodo: "Pago Móvil · Banco de Venezuela", fechaPago: "6 ago 2026",
        tipo: "nuevo", estado: "revision", fechaInscripcion: "6 ago 2026",
    },
    {
        id: 8,
        estNombre: "Isabella", estApellido: "Moreno Sánchez", estCedula: "V-30.987.221", estFechaNac: "22 sep 2010",
        estResidencia: "Urb. San Jacinto, calle 1, casa 3, Maracay",
        gradoSolicitado: "4.º año",
        repNombre: "Carmen", repApellido: "Moreno", repCedula: "V-13.456.789",
        repTelefono: "0412-3334567", repEmail: "carmen.moreno@hotmail.com", repTelCasa: "0243-1112233",
        repSustituto: "Jorge Moreno", repTelRespaldo: "0416-4443322",
        repResidencia: "Urb. San Jacinto, calle 1, casa 3, Maracay",
        primeraVez: false, actaNacimiento: "acta_isabella.pdf", boletin: "", fotosCount: 2,
        bauche: "A-10295", monto: INSCRIPCION_FEE, metodo: "Transferencia · Banco de Venezuela", fechaPago: "6 ago 2026",
        tipo: "reinscrito", estado: "aceptado", fechaInscripcion: "6 ago 2026",
    },
    {
        id: 9,
        estNombre: "Santiago", estApellido: "Bracho Mora", estCedula: "", estFechaNac: "27 jul 2017",
        estResidencia: "Urb. Base Aragua, calle 5, casa 18, Maracay",
        gradoSolicitado: "2.º grado",
        repNombre: "Patricia", repApellido: "Mora", repCedula: "V-17.998.112",
        repTelefono: "0414-7776655", repEmail: "patricia.mora@gmail.com", repTelCasa: "",
        repSustituto: "", repTelRespaldo: "0426-5556677",
        repResidencia: "Urb. Base Aragua, calle 5, casa 18, Maracay",
        primeraVez: true, actaNacimiento: "acta_santiago.pdf", boletin: "boletin_santiago.pdf", fotosCount: 3,
        bauche: "A-10301", monto: INSCRIPCION_FEE, metodo: "Pago Móvil · Banco de Venezuela", fechaPago: "7 ago 2026",
        tipo: "nuevo", estado: "revision", fechaInscripcion: "7 ago 2026",
    },
];

export const TIPO_META: Record<InscripcionTipo, { label: string; cls: string }> = {
    nuevo: { label: "Nuevo", cls: "bg-edu-primary-50 text-edu-primary" },
    reinscrito: { label: "Reinscrito", cls: "bg-edu-purple-bg text-edu-purple" },
};

export const ESTADO_META: Record<InscripcionEstado, { label: string; cls: string }> = {
    revision: { label: "En revisión", cls: "bg-edu-warning-bg text-edu-warning" },
    aceptado: { label: "Aceptado", cls: "bg-edu-success-bg text-edu-success" },
    rechazado: { label: "Rechazado", cls: "bg-edu-danger-bg text-edu-danger" },
};
