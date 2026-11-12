// Education as a small pile of certificates, the counterpart of the staff
// badges above. With a mouse the pile fans out on hover; on touch a tap sends
// the top sheet to the back (the interaction of React Bits Stack). The pile
// repeats what the text beside it says, so it is hidden from assistive
// technology. New certificates only need another entry in `sheets`.
import { useState, type CSSProperties } from 'react';
import './CertificateStack.css';

export interface Sheet { kind: 'degree' | 'language'; title: string; detail: string; note: string; }

export default function CertificateStack({ sheets }: { sheets: Sheet[] }) {
  // order[0] is the sheet on top.
  const [order, setOrder] = useState(() => sheets.map((_, index) => index));
  const cycle = () => setOrder(current => [...current.slice(1), current[0]]);

  return <div className="certs" aria-hidden="true" style={{ '--n': sheets.length } as CSSProperties} onClick={event => { if ((event.nativeEvent as PointerEvent).pointerType !== 'mouse') cycle(); }}>
    {sheets.map((sheet, index) => <div key={sheet.title} className={`cert cert-${sheet.kind}`} style={{ '--i': index, '--depth': order.indexOf(index) } as CSSProperties}>
      <div className="cert-paper">
        {sheet.kind === 'degree'
          ? <span className="university-mark cert-mark"><img src="/education/utn.png" alt="" width={4415} height={854} loading="lazy" decoding="async"/></span>
          : <span className="cert-kind">{sheet.note}</span>}
        <p className="cert-title">{sheet.title}</p>
        <p className="cert-detail">{sheet.detail}</p>
        {sheet.kind === 'degree' && <span className="cert-foot"><span>{sheet.note}</span><i className="cert-seal"/></span>}
      </div>
    </div>)}
  </div>;
}
