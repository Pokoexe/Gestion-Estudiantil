/** Cuenta destino de pago: método y lista de campos (etiqueta/valor) a mostrar. */
export interface PaymentAccount {
    method: string;
    fields: { label: string; value: string }[];
}
