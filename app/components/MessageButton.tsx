'use client';

import { useCallback, useState } from "react";
import type { default as React, ReactNode } from "react";
import Modal from "./Modal";
import ContactForm from "./ContactForm";


type ModalButtonProps = {
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return { isOpen, setIsOpen };
};

export const MessageButton: React.FC<ModalButtonProps> = ({ children, ...rest }) => {
  const { isOpen, setIsOpen } = useModal();

  const onSubmit = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <>
      <button onClick={() => setIsOpen(true)} {...rest}>
        {children}
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} rememberState>
        <ContactForm onSubmit={onSubmit} />
      </Modal>
    </>
  );
};