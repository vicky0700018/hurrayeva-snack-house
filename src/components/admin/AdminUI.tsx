import { useRef, useState, type ReactNode } from "react";
import { SmartImage } from "../SmartImage";
import { IMAGE_LIBRARY, fileToDataUrl } from "@/lib/images";
import { useToast } from "@/lib/toast";
import type { Tone } from "@/lib/labels";
import { CloseIcon, EditIcon, EyeIcon, ImageIcon, PlusIcon, SearchIcon, TrashIcon, UploadIcon } from "../icons";

/** Shared head() meta for admin pages: unique title, never indexed. */
export function adminHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | HURRAYECA Admin` },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: `${title} | HURRAYECA Admin` },
      { property: "og:description", content: description },
    ],
  };
}

export function AdminPageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="btn btn-primary btn-sm" onClick={onClick}>
      <PlusIcon size={16} /> {label}
    </button>
  );
}

export function RowActions({ name, onView, onEdit, onDelete, extra }: { name: string; onView?: () => void; onEdit?: () => void; onDelete?: () => void; extra?: ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      {extra}
      {onView && <button type="button" className="action-btn action-view" title="View" aria-label={`View ${name}`} onClick={onView}><EyeIcon size={16} /></button>}
      {onEdit && <button type="button" className="action-btn action-edit" title="Edit" aria-label={`Edit ${name}`} onClick={onEdit}><EditIcon size={16} /></button>}
      {onDelete && <button type="button" className="action-btn action-delete" title="Delete" aria-label={`Delete ${name}`} onClick={onDelete}><TrashIcon size={16} /></button>}
    </div>
  );
}

const TONES: Record<Tone, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-secondary/20 text-primary-deep",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-accent/25 text-foreground",
  muted: "bg-muted text-muted-foreground",
};
export function StatusPill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={"badge whitespace-nowrap " + TONES[tone]}>{children}</span>;
}

export function Field({ label, htmlFor, error, hint, children, className = "" }: { label: string; htmlFor?: string; error?: string | undefined; hint?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="label" htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={"relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors " + (checked ? "bg-success" : "bg-input")}
    >
      <span className={"inline-block h-5 w-5 rounded-full bg-card shadow-soft transition-transform " + (checked ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  );
}

export function CheckRow({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold">
      <input type="checkbox" className="h-4 w-4 accent-primary" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <SearchIcon size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
      <input className="field py-2.5! pl-9!" placeholder={placeholder} aria-label={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function TableCard({ children }: { children: ReactNode }) {
  return <div className="card-surface overflow-x-auto">{children}</div>;
}

export function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12 text-center text-sm text-muted-foreground">{text}</td>
    </tr>
  );
}

export function DetailGrid({ items }: { items: Array<[string, ReactNode]> }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt className="text-xs font-bold tracking-wide text-muted-foreground uppercase">{k}</dt>
          <dd className="mt-0.5 text-sm font-semibold break-words">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Pick a built-in photo or upload one (stored as a compact data URL with local preview). */
export function ImagePicker({ value, onChange, label = "Image", error, allowClear = false }: { value: string; onChange: (v: string) => void; label?: string; error?: string | undefined; allowClear?: boolean }) {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [lib, setLib] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <p className="label">{label}</p>
      <div className="flex items-start gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
          {value ? <SmartImage src={value} alt="Selected image preview" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-muted-foreground"><ImageIcon /></div>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => fileRef.current?.click()}>
            <UploadIcon size={15} /> {busy ? "Processing…" : "Upload"}
          </button>
          <button type="button" className="btn btn-muted btn-sm" onClick={() => setLib((v) => !v)}>
            <ImageIcon size={15} /> {lib ? "Hide library" : "Choose from library"}
          </button>
          {allowClear && value && (
            <button type="button" className="btn btn-muted btn-sm" onClick={() => onChange("")}><CloseIcon size={15} /> Remove</button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            aria-label={`Upload ${label}`}
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              setBusy(true);
              try {
                onChange(await fileToDataUrl(f));
                toast("success", "Image ready", "Preview updated – save to keep it.");
              } catch (err) {
                toast("error", "Upload failed", err instanceof Error ? err.message : "Could not use this file");
              } finally {
                setBusy(false);
              }
            }}
          />
        </div>
      </div>
      {lib && (
        <div className="mt-3 grid max-h-56 grid-cols-4 gap-2 overflow-y-auto rounded-2xl border border-border p-2 sm:grid-cols-6">
          {Object.entries(IMAGE_LIBRARY).map(([key, img]) => (
            <button
              key={key}
              type="button"
              title={img.label}
              aria-label={`Use image: ${img.label}`}
              onClick={() => { onChange(key); setLib(false); }}
              className={"aspect-square overflow-hidden rounded-xl border-2 transition " + (value === key ? "border-primary" : "border-transparent hover:border-secondary")}
            >
              <img src={img.src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
