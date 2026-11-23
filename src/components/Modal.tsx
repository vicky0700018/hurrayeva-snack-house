import { useEffect, type ReactNode } from "react";
import { CloseIcon } from "./icons";

export function Modal({ open, onClose, title, children, size = "md", footer }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; size?: "sm" | "md" | "lg" | "xl"; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  const w = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl", xl: "max-w-5xl" }[size];
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/60 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={"relative animate-fade-up flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-card shadow-lift sm:rounded-3xl " + w}
        onClick={(e) => e.stopPropagation()}
      >
        {title !== undefined ? (
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}><CloseIcon /></button>
          </div>
        ) : (
          <button type="button" className="icon-btn absolute top-3 right-3 z-10 bg-card shadow-soft" aria-label="Close" onClick={onClose}><CloseIcon /></button>
        )}
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-border bg-muted/40 px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </div>
  );
}
