// Adapted from React Bits Micro/FolderFloat. See README.md and LICENSE.md.
// Native details provide exclusive opening and a usable static fallback.
import { useId, useRef, type CSSProperties, type ReactNode } from 'react';
import './FolderFloat.css';

export interface FolderFloatItem { id: string; label: string; content: ReactNode; }
interface Props {
  label: string;
  sublabel: string;
  groupName: string;
  frontColor: string;
  backColor: string;
  items: FolderFloatItem[];
  preview: ReactNode;
  selected?: string;
  detail?: ReactNode;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function FolderFloat({ label, sublabel, groupName, frontColor, backColor, items, preview, selected, detail, onSelect, onClose }: Props) {
  const root = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const openedByHover = useRef(false);
  const detailId = useId();
  return <details
    ref={root}
    name={groupName}
    className="folder-float"
    style={{ '--ff-front': frontColor, '--ff-back': backColor } as CSSProperties}
    onToggle={event => {
      if (!event.currentTarget.open) {
        openedByHover.current = false;
        onClose();
      }
    }}
    onKeyDown={event => {
      if (event.key === 'Escape' && root.current?.open) {
        event.stopPropagation();
        root.current.open = false;
        summary.current?.focus();
      }
    }}
  >
    <summary ref={summary} className="folder-float__folder" onPointerEnter={event => {
      if (event.pointerType === 'mouse' && root.current && !root.current.open) {
        root.current.open = true;
        openedByHover.current = true;
      }
    }} onClick={event => {
      // The animated flap can trigger pointerleave; preserve the first click.
      if (event.detail > 0 && openedByHover.current) {
        event.preventDefault();
        openedByHover.current = false;
      }
    }}>
      <span className="folder-float__back" aria-hidden="true"/>
      <span className="folder-float__paper" aria-hidden="true"/>
      <span className="folder-float__peek" aria-hidden="true">{preview}</span>
      <span className="folder-float__front"><span className="folder-float__label">{label}</span><span className="folder-float__sub">{sublabel}</span></span>
    </summary>
    <div className="folder-float__items" role="group" aria-label={label}>
      {items.map((item, index) => <button
        type="button"
        key={item.id}
        className="folder-float__item"
        aria-label={item.label}
        aria-pressed={selected === item.id}
        aria-controls={detailId}
        style={{ '--column': items.length <= 3 ? index - (items.length - 1) / 2 : index % 3 - 1, '--row': Math.floor(index / 3), '--i': index, '--r': `${[-6, 3, -3, 5, -4, 4][index % 6]}deg` } as CSSProperties}
        onClick={() => onSelect(item.id)}
        onFocus={() => onSelect(item.id)}
        onPointerEnter={event => { if (event.pointerType === 'mouse') onSelect(item.id); }}
      >
        {item.content}<span className="folder-float__item-name" aria-hidden="true">{item.label}</span>
      </button>)}
    </div>
    <div id={detailId} className="folder-float__detail">{detail}</div>
  </details>;
}
