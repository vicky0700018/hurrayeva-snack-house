import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { useConfirm } from "@/lib/confirm";
import { uid } from "@/lib/format";
import type { Banner } from "@/lib/types";
import { Modal } from "@/components/Modal";
import { SmartImage } from "@/components/SmartImage";
import { AddButton, AdminPageHeader, CheckRow, DetailGrid, Field, ImagePicker, RowActions, StatusPill, Toggle, adminHead } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/banners")({
  head: () => adminHead("Banners", "Manage homepage hero slides and promotional banners."),
  component: BannersAdmin,
});

const PLACEMENT = { hero: "Homepage hero slider", promo: "Promotional banner" } as const;
const EMPTY: Banner = { id: "", placement: "hero", title: "", subtitle: "", ctaText: "Shop Now", ctaLink: "/shop", image: "", active: true };

function BannersAdmin() {
  const { data, upsert, remove, logActivity } = useStore();
  const toast = useToast();
  const confirm = useConfirm();
  const [view, setView] = useState<Banner | null>(null);
  const [d, setD] = useState<Banner | null>(null);
  const [er, setEr] = useState<Record<string, string>>({});

  const save = () => {
    if (!d) return;
    const x: Record<string, string> = {};
    if (d.title.trim().length < 3) x["title"] = "Enter a headline";
    if (d.subtitle.trim().length < 5) x["subtitle"] = "Enter a subtitle";
    if (!d.ctaText.trim()) x["ctaText"] = "Enter button text";
    if (!/^(\/|https?:\/\/)/.test(d.ctaLink.trim())) x["ctaLink"] = "Use a page path like /shop or a full https:// link";
    if (!d.image) x["image"] = "Choose a banner image";
    setEr(x);
    if (Object.keys(x).length) return toast("error", "Please fix the highlighted fields");
    const isNew = !d.id;
    const b: Banner = { ...d, id: d.id || uid("b"), title: d.title.trim(), subtitle: d.subtitle.trim(), ctaText: d.ctaText.trim(), ctaLink: d.ctaLink.trim() };
    upsert("banners", b);
    logActivity(`Banner “${b.title}” ${isNew ? "added" : "updated"}`);
    toast("success", isNew ? "Banner added" : "Banner updated", b.title);
    setD(null);
  };
  const del = async (b: Banner) => {
    if (!(await confirm({ title: "Delete this banner?", message: `“${b.title}” will be removed from the website.` }))) return;
    remove("banners", b.id);
    logActivity(`Banner “${b.title}” deleted`);
    toast("success", "Banner deleted");
  };

  return (
    <div>
      <AdminPageHeader title="Banners" subtitle="Hero slides rotate on the homepage; the first active promo banner shows mid-page." action={<AddButton label="Add Banner" onClick={() => { setEr({}); setD({ ...EMPTY }); }} />} />
      {(["hero", "promo"] as const).map((pl) => {
        const list = data.banners.filter((b) => b.placement === pl);
        return (
          <section key={pl} className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">{PLACEMENT[pl]} <span className="text-sm text-muted-foreground">({list.length})</span></h2>
            {list.length === 0 && <p className="card-surface p-8 text-center text-sm text-muted-foreground">No banners here yet.</p>}
            <div className="grid gap-4 lg:grid-cols-2">
              {list.map((b) => (
                <div key={b.id} className="card-surface flex flex-col overflow-hidden sm:flex-row">
                  <div className="h-40 shrink-0 bg-muted sm:h-auto sm:w-48"><SmartImage src={b.image} alt={b.title} className="h-full w-full object-cover" /></div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-2"><h3 className="font-semibold leading-snug">{b.title}</h3><StatusPill tone={b.active ? "success" : "muted"}>{b.active ? "Enabled" : "Disabled"}</StatusPill></div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{b.subtitle}</p>
                    <p className="text-xs font-bold text-primary">{b.ctaText} → {b.ctaLink}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <Toggle checked={b.active} label={`Enable ${b.title}`} onChange={(v) => { upsert("banners", { ...b, active: v }); toast("success", v ? "Banner enabled" : "Banner disabled"); }} />
                      <RowActions name={b.title} onView={() => setView(b)} onEdit={() => { setEr({}); setD({ ...b }); }} onDelete={() => del(b)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <Modal open={!!view} onClose={() => setView(null)} title="Banner details" footer={view && <button type="button" className="btn btn-primary btn-sm" onClick={() => { const b = view; setView(null); setEr({}); setD({ ...b }); }}>Edit banner</button>}>
        {view && (
          <div className="space-y-4">
            <div className="h-52 overflow-hidden rounded-2xl bg-muted"><SmartImage src={view.image} alt={view.title} className="h-full w-full object-cover" /></div>
            <DetailGrid items={[["Headline", view.title], ["Placement", PLACEMENT[view.placement]], ["Button text", view.ctaText], ["Button link", view.ctaLink], ["Status", view.active ? "Enabled" : "Disabled"]]} />
            <div><p className="label">Subtitle</p><p className="text-sm text-muted-foreground">{view.subtitle}</p></div>
          </div>
        )}
      </Modal>

      <Modal open={!!d} onClose={() => setD(null)} title={d?.id ? "Edit banner" : "Add banner"} footer={<><button type="button" className="btn btn-muted btn-sm" onClick={() => setD(null)}>Cancel</button><button type="button" className="btn btn-primary btn-sm" onClick={save}>{d?.id ? "Save changes" : "Add banner"}</button></>}>
        {d && (
          <form className="space-y-4" noValidate onSubmit={(e) => { e.preventDefault(); save(); }}>
            <Field label="Placement" htmlFor="bf-pl">
              <select id="bf-pl" className="field" value={d.placement} onChange={(e) => setD({ ...d, placement: e.target.value as Banner["placement"] })}>
                <option value="hero">{PLACEMENT.hero}</option><option value="promo">{PLACEMENT.promo}</option>
              </select>
            </Field>
            <Field label="Headline" htmlFor="bf-title" error={er["title"]}><input id="bf-title" className="field" value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} aria-invalid={!!er["title"]} /></Field>
            <Field label="Subtitle" htmlFor="bf-sub" error={er["subtitle"]}><textarea id="bf-sub" rows={2} className="field" value={d.subtitle} onChange={(e) => setD({ ...d, subtitle: e.target.value })} aria-invalid={!!er["subtitle"]} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Button text" htmlFor="bf-cta" error={er["ctaText"]}><input id="bf-cta" className="field" value={d.ctaText} onChange={(e) => setD({ ...d, ctaText: e.target.value })} aria-invalid={!!er["ctaText"]} /></Field>
              <Field label="Button link" htmlFor="bf-link" error={er["ctaLink"]} hint="e.g. /shop or /shop?category=combo-packs"><input id="bf-link" className="field" value={d.ctaLink} onChange={(e) => setD({ ...d, ctaLink: e.target.value })} aria-invalid={!!er["ctaLink"]} /></Field>
            </div>
            <ImagePicker label="Banner image" value={d.image} onChange={(v) => setD({ ...d, image: v })} error={er["image"]} />
            <CheckRow label="Enabled (show on website)" checked={d.active} onChange={(v) => setD({ ...d, active: v })} />
          </form>
        )}
      </Modal>
    </div>
  );
}
