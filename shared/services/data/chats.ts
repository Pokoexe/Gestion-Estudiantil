/**
 * Conversaciones (mock) — fuente compartida por la página de Mensajes y por el
 * chat flotante global (estilo Messenger).
 */

export interface ChatMessage {
    id: number;
    fromMe: boolean;
    text: string;
    time: string;
}

export interface Conversation {
    id: number;
    name: string;
    subtitle: string;
    initials: string;
    color: string; // color del avatar
    online?: boolean;
    unread: number;
    lastTime: string;
    messages: ChatMessage[];
}

export const CONVERSATIONS: Conversation[] = [
    {
        id: 1,
        name: "Prof. Ana Ramírez",
        subtitle: "Docente · Matemática",
        initials: "AR",
        color: "#1a56db",
        online: true,
        unread: 2,
        lastTime: "10:24",
        messages: [
            { id: 1, fromMe: false, text: "Buenos días Carlos, ¿ya revisaste la guía de derivadas?", time: "10:20" },
            { id: 2, fromMe: true, text: "Sí profe, la estoy resolviendo. Tengo una duda con el ejercicio 5.", time: "10:22" },
            { id: 3, fromMe: false, text: "Perfecto. Recuerda que el examen es el viernes.", time: "10:23" },
            { id: 4, fromMe: false, text: "Repasa bien la recta tangente 📘", time: "10:24" },
        ],
    },
    {
        id: 2,
        name: "Coordinación Académica",
        subtitle: "Lic. Marta Sánchez",
        initials: "MS",
        color: "#7c3aed",
        online: false,
        unread: 1,
        lastTime: "Ayer",
        messages: [
            { id: 1, fromMe: false, text: "Hola, te recordamos la reunión de representantes del jueves.", time: "16:40" },
            { id: 2, fromMe: true, text: "Gracias, se lo comento a mi mamá.", time: "17:02" },
            { id: 3, fromMe: false, text: "Perfecto. Cualquier duda nos escribes.", time: "17:05" },
        ],
    },
    {
        id: 3,
        name: "Administración",
        subtitle: "Tesorería · Pagos",
        initials: "AD",
        color: "#16a34a",
        online: true,
        unread: 0,
        lastTime: "Lun",
        messages: [
            { id: 1, fromMe: false, text: "Recibimos tu comprobante, está en revisión.", time: "09:10" },
            { id: 2, fromMe: true, text: "Perfecto, muchas gracias.", time: "09:15" },
        ],
    },
    {
        id: 4,
        name: "Prof. Alejandro Torres",
        subtitle: "Docente · Física",
        initials: "AT",
        color: "#b45309",
        online: false,
        unread: 0,
        lastTime: "Lun",
        messages: [
            { id: 1, fromMe: false, text: "El informe del péndulo quedó muy bien, ¡felicitaciones!", time: "12:30" },
            { id: 2, fromMe: true, text: "¡Gracias profe! 🙌", time: "12:45" },
        ],
    },
    {
        id: 5,
        name: "Grupo 4.º Año B",
        subtitle: "28 participantes",
        initials: "4B",
        color: "#0ea5e9",
        online: false,
        unread: 5,
        lastTime: "08:02",
        messages: [
            { id: 1, fromMe: false, text: "María: ¿alguien tiene los apuntes de historia?", time: "07:55" },
            { id: 2, fromMe: false, text: "José: yo los subo al drive en un rato", time: "07:58" },
            { id: 3, fromMe: true, text: "Gracias José 🙏", time: "08:02" },
        ],
    },
];

export const nowTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
