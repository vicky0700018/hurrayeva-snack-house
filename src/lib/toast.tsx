import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ToastType = "success" | "error" | "info";
interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  message?: string | undefined;
}
interface ToastCtx {
  toast: (type: ToastType, title: string, message?: string) => void;
}

const Ctx = createContext<ToastCtx>({ toast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s.slice(-3), { id, type, title, message }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3600);
  }, []);
  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-[min(92vw,22rem)] flex-col gap-2" aria-live="polite">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto animate-toast-in flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-lift"
          >
            <span
              className={
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black " +
                (t.type === "success"
                  ? "bg-success text-success-foreground"
                  : t.type === "error"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-secondary text-secondary-foreground")
              }
              aria-hidden
            >
              {t.type === "success" ? "✓" : t.type === "error" ? "!" : "i"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground">{t.title}</p>
              {t.message && <p className="mt-0.5 text-xs text-muted-foreground">{t.message}</p>}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setItems((s) => s.filter((x) => x.id !== t.id))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx).toast;
