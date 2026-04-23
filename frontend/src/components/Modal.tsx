import type { FormEvent, ReactNode } from 'react';
export function Modal({ title, children, onClose, onSubmit }: { title: string; children: ReactNode; onClose(): void; onSubmit(e: FormEvent): void }) {
  return <div className="modalShade"><form className="modal" onSubmit={onSubmit}><div className="modalHead"><h2>{title}</h2><button type="button" onClick={onClose}>x</button></div>{children}<div className="modalActions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button>Save</button></div></form></div>;
}
