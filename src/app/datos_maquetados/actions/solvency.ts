/**
 * Actions del dominio Solvency (solvencia / morosidad del estudiante).
 *
 * Este dominio NO tiene endpoints: sus exports son FLAGS y ESTILOS síncronos
 * derivados de una constante (`MONTHS_OWED`) — no una colección de registros ni
 * funciones mutadoras. Por eso, siguiendo la regla del proyecto, no se envuelven
 * en `api.get`/`api.post`: se re-exportan tal cual desde la data para ofrecer a
 * las páginas una superficie de import consistente con el resto de dominios.
 *
 * (Si en el futuro se agrega una colección de pagos/movimientos, ésa sí debería
 * exponerse como un endpoint GET.)
 */

export {
  MONTHS_OWED,
  MONTHLY_FEE,
  FEE_CURRENCY,
  BILLING_DAY,
  SOLVENT,
  DEBT_LEVEL,
  OWED,
  MONTHS_LABEL,
  DEBT_MESSAGE,
  DEBT_STYLES,
} from "../data/solvency";

export type { DebtLevel } from "../data/solvency";
