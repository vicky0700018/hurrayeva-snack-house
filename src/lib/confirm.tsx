import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  danger?: boolean;
}
const Ctx = createContext<(o: ConfirmOptions) => Promise<boolean>>(async () => false);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);
  const confirm = useCallback((o: ConfirmOptions) => {
    setOpts(o);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);
  const close = (v: boolean) => {
    resolver.current?.(v);
    resolver.current = null;
    setOpts(null);
  };
  return (
    <Ctx.Provider value={confirm}>
      {children}
      {opts && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm" onClick={() => close(false)}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="animate-fade-up w-full max-w-sm rounded-3xl bg-card p-6 shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={"mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-black " + (opts.danger !== false ? "bg-destructive/10 text-destructive" : "bg-secondary/20 text-primary")}>
              !
            </div>
            <h2 id="confirm-title" className="text-xl font-semibold">{opts.title}</h2>
            {opts.message && <p className="mt-2 text-sm text-muted-foreground">{opts.message}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="btn btn-muted btn-sm" onClick={() => close(false)} autoFocus>
                Cancel
              </button>
              <button type="button" className={"btn btn-sm " + (opts.danger !== false ? "btn-danger" : "btn-primary")} onClick={() => close(true)}>
                {opts.confirmText ?? "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export const useConfirm = () => useContext(Ctx);
