import { useEffect, useRef } from "react";
import AccountBox from "../components/AccountBox";

export default function AuthModal({ show, onClose }) {
  const modalRef = useRef(null);

  // Trap focus inside modal
  useEffect(() => {
    if (!show) return;
    const focusable = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (
          e.shiftKey
            ? document.activeElement === first
            : document.activeElement === last
        ) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        }
      }
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, onClose]);

  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className="relative outline-none"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <AccountBox onAuthSuccess={onClose} />
      </div>
    </div>
  );
}
