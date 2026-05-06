import { Suspense } from 'react';
import { ModalProps } from '@/types';
import style from './Modal.module.css';

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={style.overlay} onClick={onClose}>
      <div className={style.content} onClick={(e) => e.stopPropagation()}>
        <button className={style.closeButton} onClick={onClose}>
          &times;
        </button>
        {/* O Suspense segura a renderização até o Lazy Loading terminar */}
        <Suspense fallback={<div className={style.fallBack}>Carregando formulário...</div>}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}