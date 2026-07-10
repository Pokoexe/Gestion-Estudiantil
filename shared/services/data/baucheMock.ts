/**
 * Imagen de prueba (mock) del bauche / comprobante de transferencia.
 * Es un SVG embebido como data-URI para que se muestre como <img> sin
 * depender de archivos externos ni de conexión. Simula la captura de una
 * transferencia hecha desde la banca en línea.
 */

const SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='440' height='640' viewBox='0 0 440 640' font-family='Segoe UI, Roboto, Arial, sans-serif'>
  <rect width='440' height='640' fill='#eef2f7'/>
  <rect x='40' y='36' width='360' height='568' rx='26' fill='#ffffff' stroke='#e2e8f0' stroke-width='1.5'/>
  <path d='M40 62 a26 26 0 0 1 26 -26 h308 a26 26 0 0 1 26 26 v138 h-360 z' fill='#16a34a'/>
  <circle cx='220' cy='104' r='36' fill='#ffffff' fill-opacity='0.22'/>
  <path d='M204 105 l11 11 l22 -24' fill='none' stroke='#ffffff' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'/>
  <text x='220' y='162' text-anchor='middle' fill='#ffffff' font-size='15' opacity='0.92'>Transferencia exitosa</text>
  <text x='220' y='196' text-anchor='middle' fill='#ffffff' font-size='30' font-weight='700'>Bs. 2.400,00</text>

  <text x='72' y='258' fill='#94a3b8' font-size='13'>Banco</text>
  <text x='368' y='258' text-anchor='end' fill='#1e293b' font-size='13' font-weight='600'>Banco de Venezuela</text>
  <line x1='72' y1='278' x2='368' y2='278' stroke='#eef2f7' stroke-width='1.5'/>

  <text x='72' y='308' fill='#94a3b8' font-size='13'>N.º de referencia</text>
  <text x='368' y='308' text-anchor='end' fill='#1e293b' font-size='13' font-weight='600'>0102-77341</text>
  <line x1='72' y1='328' x2='368' y2='328' stroke='#eef2f7' stroke-width='1.5'/>

  <text x='72' y='358' fill='#94a3b8' font-size='13'>Fecha y hora</text>
  <text x='368' y='358' text-anchor='end' fill='#1e293b' font-size='13' font-weight='600'>02/07/2026  10:24 a.m.</text>
  <line x1='72' y1='378' x2='368' y2='378' stroke='#eef2f7' stroke-width='1.5'/>

  <text x='72' y='408' fill='#94a3b8' font-size='13'>Origen</text>
  <text x='368' y='408' text-anchor='end' fill='#1e293b' font-size='13' font-weight='600'>Pago Móvil ****341</text>
  <line x1='72' y1='428' x2='368' y2='428' stroke='#eef2f7' stroke-width='1.5'/>

  <text x='72' y='458' fill='#94a3b8' font-size='13'>Beneficiario</text>
  <text x='368' y='458' text-anchor='end' fill='#1e293b' font-size='13' font-weight='600'>Colegio EduGestión</text>

  <g transform='translate(220 530) rotate(-8)'>
    <rect x='-94' y='-27' width='188' height='54' rx='11' fill='none' stroke='#16a34a' stroke-width='2.5' stroke-opacity='0.5'/>
    <text x='0' y='8' text-anchor='middle' fill='#16a34a' fill-opacity='0.55' font-size='22' font-weight='700' letter-spacing='3'>PAGADO</text>
  </g>
  <text x='220' y='586' text-anchor='middle' fill='#94a3b8' font-size='11'>Comprobante generado por la banca en línea</text>
</svg>`;

export const BAUCHE_MOCK = `data:image/svg+xml,${encodeURIComponent(SVG)}`;
