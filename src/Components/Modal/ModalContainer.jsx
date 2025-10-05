import React, { useMemo, useEffect, useCallback, useRef, memo } from "react";
import { X } from "lucide-react";

const ModalContainer = memo(({ 
  onClose, 
  children, 
  maxWidth = 400, 
  padding = 16,
  backdropBlur = 4,
  backdropOpacity = 0.6,
  borderRadius = 12
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    // Focus first focusable element
    const timer = setTimeout(() => {
      const firstInput = modalRef.current?.querySelector("input, button, textarea, select, [tabindex]:not([tabindex='-1'])");
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, []);

  const backdropStyle = useMemo(
    () => ({
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`,
      backdropFilter: `blur(${backdropBlur}px)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "16px",
      transition: "opacity 0.3s ease",
    }),
    [backdropBlur, backdropOpacity]
  );

  const cardStyle = useMemo(
    () => ({
      backgroundColor: "white",
      borderRadius: `${borderRadius}px`,
      width: "100%",
      maxWidth: `${maxWidth}px`,
      maxHeight: "90vh",
      overflow: "auto",
      position: "relative",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      padding: `${padding}px`,
    }),
    [maxWidth, padding, borderRadius]
  );

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose?.();
    },
    [onClose]
  );

  return (
    <div style={backdropStyle} onClick={handleBackdropClick}>
      <div ref={modalRef} style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            color: "#6b7280",
            zIndex: 10,
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
});

ModalContainer.displayName = "ModalContainer";

export default ModalContainer;


