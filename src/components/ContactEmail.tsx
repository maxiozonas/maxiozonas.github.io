// The page opens with the name in large type and closes with the address in
// large type, with the same pointer effect. The address is an ordinary mailto
// link (it works without JavaScript); a button beside it copies it.
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import type { Locale } from '@/data/content';
import { glyphPressure } from '@/lib/glyph-pressure';

export default function ContactEmail({ email, locale }: { email: string; locale: Locale }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);
  const es = locale === 'es';

  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;
    const media = gsap.matchMedia();
    media.add('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const pressure = glyphPressure(link, '.contact-glyph');
      return () => pressure.dispose();
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(email); setCopied(true); } catch { /* The address stays selectable and the link still works. */ }
  };

  return <div className="contact-mail">
    <a ref={linkRef} className="contact-email" href={`mailto:${email}`} aria-label={`${es ? 'Escribir a' : 'Email'} ${email}`}>
      <span aria-hidden="true">{Array.from(email).map((letter, index) => <span className="contact-glyph-slot" key={index}><span className="contact-glyph">{letter}</span></span>)}</span>
    </a>
    <div className="contact-actions">
      <button type="button" className="contact-copy" data-copied={copied || undefined} onClick={copy}>
        {copied ? <IconCheck size={18} aria-hidden="true"/> : <IconCopy size={18} aria-hidden="true"/>}
        <span aria-live="polite">{copied ? (es ? 'Copiado' : 'Copied') : (es ? 'Copiar dirección' : 'Copy address')}</span>
      </button>
      <p>{es ? 'O hacé click en la dirección para abrir tu correo.' : 'Or click the address to open your mail app.'}</p>
    </div>
  </div>;
}
