/**
 * Actions del dominio Chats — SDK cliente de los "endpoints" maquetados.
 *
 * Solo lectura (`api.get`): la lista de conversaciones. Devuelve directamente el
 * `data` de la respuesta para que las páginas la consuman con `useFetch`.
 *
 * La helper pura `nowTime` NO se envuelve en endpoint: las páginas la siguen
 * importando directamente desde `../data/chats`.
 */

import { api } from "@shared/services/client";
import type { Conversation } from "@shared/services/data/chats";

export type { Conversation, ChatMessage } from "@shared/services/data/chats";

/** GET /chats — conversaciones (mensajería) del usuario. */
export async function getChats(): Promise<Conversation[]> {
  const { data } = await api.get<Conversation[]>("/chats");
  return data;
}
