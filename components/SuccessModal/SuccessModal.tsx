"use client";

import React from "react";

import { SuccessModalProps } from "@/types";

import style from './SuccessModal.module.css'

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  message,
  title = "Sucesso!!!",
}) => {
  if (!isOpen) return null;

  return (
    <div className={style.modalOverlay} onClick={onClose}>
      <div
        className={style.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={style.modalClose} onClick={onClose}>
          ×
        </button>

        <h2 className={style.modalTitle}>{title}</h2>
        <p className={style.modalMessage}>{message}</p>
        
      </div>
    </div>
  );
};

export default SuccessModal