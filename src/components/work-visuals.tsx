import type { CSSProperties } from 'react';

// Large per-stage visuals for the "How I work" cards: small, believable
// interfaces rather than abstract shapes. Animation state lives in CSS: a card
// without data-active resets every .wv-in / .wv-draw element and the transition
// back to its natural state plays the entrance.
const d = (index: number) => ({ '--i': index } as CSSProperties);
interface Props { es: boolean }

// 1 · Understand: a sentence from the client becomes a prioritised board.
export function UnderstandVisual({ es }: Props) {
  const columns = es
    ? [{ title: 'Primero', items: ['Pedidos por WhatsApp', 'Control de stock'] }, { title: 'Después', items: ['Facturación', 'Reportes'] }, { title: 'Luego', items: ['App móvil'] }]
    : [{ title: 'First', items: ['Orders via WhatsApp', 'Stock control'] }, { title: 'Next', items: ['Invoicing', 'Reports'] }, { title: 'Later', items: ['Mobile app'] }];
  return <div className="wv wv-board">
    <p className="wv-quote wv-in" style={d(0)}>{es ? '“Hoy lo manejamos todo en planillas…”' : '“Today we run everything in spreadsheets…”'}</p>
    <div className="wv-columns">
      {columns.map((column, c) => <div key={column.title} className="wv-column">
        <span className="wv-column-title wv-in" style={d(2 + c)}>{column.title}</span>
        {column.items.map((item, r) => <div key={item} className={`wv-note wv-in ${c === 0 ? 'wv-note-hot' : ''}`} style={d(4 + c * 2 + r)}>{item}</div>)}
      </div>)}
    </div>
  </div>;
}

// 2 · Design: modules, data and integrations, named.
export function DesignVisual({ es }: Props) {
  const nodes = [
    { x: 30, y: 16, w: 160, label: 'Web', order: 0 },
    { x: 330, y: 16, w: 160, label: es ? 'App móvil' : 'Mobile app', order: 1 },
    { x: 170, y: 138, w: 180, label: 'API', order: 3, main: true },
    { x: 14, y: 268, w: 150, label: 'PostgreSQL', order: 6 },
    { x: 185, y: 268, w: 150, label: es ? 'Pagos' : 'Payments', order: 7 },
    { x: 356, y: 268, w: 150, label: 'WhatsApp', order: 8 },
  ];
  return <div className="wv wv-diagram">
    <svg viewBox="0 0 520 330" focusable="false">
      <path d="M110 60 L220 138" pathLength={1} className="wv-draw wv-link" style={d(2)} />
      <path d="M410 60 L300 138" pathLength={1} className="wv-draw wv-link" style={d(2)} />
      <path d="M215 192 L89 268" pathLength={1} className="wv-draw wv-link" style={d(5)} />
      <path d="M260 192 L260 268" pathLength={1} className="wv-draw wv-link" style={d(5)} />
      <path d="M305 192 L431 268" pathLength={1} className="wv-draw wv-link" style={d(5)} />
      {nodes.map(node => <g key={node.label} className="wv-in wv-node-wrap" style={d(node.order)}>
        <rect x={node.x} y={node.y} width={node.w} height={node.main ? 54 : 46} rx="14" className={node.main ? 'wv-node wv-node-main' : 'wv-node'} />
        <text x={node.x + node.w / 2} y={node.y + (node.main ? 33 : 29)} textAnchor="middle" className={node.main ? 'wv-node-text wv-node-text-main' : 'wv-node-text'}>{node.label}</text>
      </g>)}
      <circle r="5" className="wv-dot" />
    </svg>
  </div>;
}

// 3 · Build: code appears and the tests pass.
export function BuildVisual({ es }: Props) {
  return <div className="wv wv-editor">
    <div className="wv-window">
      <div className="wv-window-bar"><i /><i /><i /><span>orders.ts</span></div>
      <pre className="wv-code" aria-hidden="true">
        <code>
          <span className="wv-line wv-in" style={d(0)}><b className="k">export async function</b> <b className="f">createOrder</b>(data: Order) {'{'}</span>
          <span className="wv-line wv-in" style={d(1)}>{'  '}<b className="k">const</b> stock = <b className="k">await</b> <b className="f">checkStock</b>(data.items)</span>
          <span className="wv-line wv-in" style={d(2)}>{'  '}<b className="k">if</b> (!stock.ok) <b className="k">throw new</b> <b className="f">Error</b>(<b className="s">'Out of stock'</b>)</span>
          <span className="wv-line wv-in" style={d(3)}>{'  '}<b className="k">return</b> db.orders.<b className="f">create</b>({'{'} data {'}'})</span>
          <span className="wv-line wv-in" style={d(4)}>{'}'}<i className="wv-caret" /></span>
        </code>
      </pre>
    </div>
    <div className="wv-tests wv-in" style={d(6)}>
      <span className="wv-tests-label">{es ? 'Pruebas' : 'Tests'}</span>
      {[es ? 'Pedidos' : 'Orders', 'Stock', es ? 'Integraciones' : 'Integrations'].map((name, index) => <span key={name} className="wv-pill wv-in" style={d(7 + index * 1.5)}><svg viewBox="0 0 16 16" focusable="false"><path d="M3 8.5 6.5 12 13 4.5" pathLength={1} className="wv-draw" style={d(8 + index * 1.5)} /></svg>{name}</span>)}
    </div>
  </div>;
}

// 4 · Deliver: a deployment log.
export function DeliverVisual({ es }: Props) {
  const lines = [
    { text: '$ git push origin main', kind: 'cmd' },
    { text: es ? '✓ Build correcto' : '✓ Build passed', kind: 'ok' },
    { text: es ? '✓ 12 pruebas pasaron' : '✓ 12 tests passed', kind: 'ok' },
    { text: es ? '→ Publicando en producción…' : '→ Deploying to production…', kind: 'run' },
    { text: es ? '✓ En línea · v1.4.0' : '✓ Live · v1.4.0', kind: 'live' },
  ];
  return <div className="wv wv-terminal">
    <div className="wv-window">
      <div className="wv-window-bar"><i /><i /><i /><span>production</span></div>
      <div className="wv-log" aria-hidden="true">
        {lines.map((line, index) => <p key={line.text} className={`wv-log-${line.kind} wv-in`} style={d(index * 2)}>{line.text}</p>)}
        <p className="wv-log-cmd"><span className="wv-prompt">$</span><i className="wv-caret" /></p>
      </div>
    </div>
  </div>;
}

// 5 · Support: a monitoring dashboard with a resolved incident.
export function SupportVisual({ es }: Props) {
  const stats = [{ label: 'Uptime', value: '99.9%' }, { label: es ? 'Respuesta' : 'Response', value: '120 ms' }, { label: es ? 'Errores' : 'Errors', value: '0' }];
  const tickets = es
    ? [{ id: '#128', text: 'Error al exportar un reporte', done: true }, { id: '#131', text: 'Nuevo filtro por fecha', done: false }]
    : [{ id: '#128', text: 'Report export error', done: true }, { id: '#131', text: 'New date filter', done: false }];
  return <div className="wv wv-dashboard">
    <div className="wv-stats">
      {stats.map((stat, index) => <div key={stat.label} className="wv-stat wv-in" style={d(index)}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}
    </div>
    <div className="wv-chart wv-in" style={d(3)}>
      <svg viewBox="0 0 520 130" preserveAspectRatio="none" focusable="false">
        <path d="M0 32 H520 M0 80 H520" className="wv-grid" />
        <path d="M0 100 L60 92 L120 98 L180 88 L220 34 L262 96 L330 84 L400 90 L460 80 L520 84" pathLength={1} className="wv-draw wv-chart-line" style={d(4)} />
        <circle cx="220" cy="34" r="6" className="wv-chart-point wv-in" style={d(7)} />
      </svg>
    </div>
    <ul className="wv-tickets">
      {tickets.map((ticket, index) => <li key={ticket.id} className="wv-in" style={d(8 + index * 1.5)}>
        <span className="wv-ticket-id">{ticket.id}</span>{ticket.text}
        <em className={ticket.done ? 'wv-done' : 'wv-open'}>{ticket.done ? (es ? 'Resuelto' : 'Resolved') : (es ? 'En curso' : 'In progress')}</em>
      </li>)}
    </ul>
  </div>;
}

export const workVisuals = [UnderstandVisual, DesignVisual, BuildVisual, DeliverVisual, SupportVisual];
