"use client";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FocusTrap } from "focus-trap-react";
import ExitSymbol from "./ExitSymbol";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  rememberState?: boolean;
};

export default function Modal({ isOpen, onClose, children, rememberState = false }: ModalProps) {
  const modalRoot = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const clickStartedOutside = useRef(false);

  // Create portal container
  useEffect(() => {
    let container = document.getElementById("modal-root") as HTMLElement | null;
    if (!container) {
      container = document.createElement("div");
      container.id = "modal-root";
      document.body.appendChild(container);
    }
    modalRoot.current = container;
  }, []);

  // Manage scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);
  
  // Handle outside clicks
  useEffect(() => {
    if (!isOpen) return;
    // Track clicks
    const handleMouseDown = (e: MouseEvent) => {
      if (!modalRef.current) return;
      clickStartedOutside.current = !modalRef.current.contains(e.target as Node);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!modalRef.current) return;
      const endedOutside = !modalRef.current.contains(e.target as Node);
      if (clickStartedOutside.current && endedOutside) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isOpen, onClose]);


  if (!modalRoot.current || (!isOpen && !rememberState)) return null;

  return createPortal(
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <FocusTrap
        active={isOpen}
        focusTrapOptions={{
          escapeDeactivates: () => {
            onClose();
            return true;
          },
        }}
      >
        <div
          ref={modalRef}
          className={`relative bg-white rounded-2xl shadow-xl p-8 max-w-lg w-[90%] transform transition-all duration-200 ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Dialog window"
          onClick={(e) => e.stopPropagation()}
        >
          {children}

          {/* 🔹 Accessible Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
            aria-label="Close dialog"
          >
            <ExitSymbol />
          </button>
        </div>
      </FocusTrap>
    </div>,
    modalRoot.current
  );
}
