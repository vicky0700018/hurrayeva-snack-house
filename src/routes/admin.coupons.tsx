import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useStore, todayStr } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { useConfirm } from "@/lib/confirm";
import { formatDate, inr, uid } from "@/lib/format";
import type { Coupon } from "@/lib/types";
import { Modal } from "@/components/Modal";
import { AddButton, AdminPageHeader, CheckRow, DetailGrid, EmptyRow, Field, RowActions, SearchBox, StatusPill, TableCard, Toggle, adminHead } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/coupons")({
  head: () => adminHead("Coupons", "Create and manage discount coupons."),
  component: CouponsAdmin,
});

interface Draft { id: string; code: string; description: string; type: Coupon["type"]; value: string; minOrder: string; expiry: string; active: boolean }
const toDraft = (c?: Coupon): Draft => ({ id: c?.id ?? "", code: c?.code ?? "", description: c?.description ?? "", type: c?.type ?? "percent", value: c ? String(c.value) : "", minOrder: c ? String(c.minOrder) : "0", expiry: c?.expiry ?? "", active: c?.active ?? true });

function statusOf(c: Coupon, today: string) {
  if (!c.active) return { tone: "muted" as const, label: "Inactive" };
  if (c.expiry && c.expiry < today) return { tone: "danger" as const, label: "Expired" };
  return { tone: "success" as const, label: "Active" };
}
const valueText = (c: Coupon) => (c.type === "percent" ? `${c.value}% off` : `${inr(c.value)} off`);

function CouponsAdmin() {
  const { data, upsert, remove, logActivity } = useStore();
  const toast = useToast();
  const confirm = useConfirm();
  const today = todayStr();
  const [q, setQ] = useState("");
  const [view, setView] = useState<Coupon | null>(null);
  const [d, setD] = useState<Draft | null>(null);
  const [er, setEr] = useState<Record<string, string>>({});
  const list = data.coupons.filter((c) => !q || (c.code + c.description).toLowerCase().includes(q.toLowerCase()));

  const save = () => {
    if (!d) return;
    const x: Record<string, string> = {};
    const code = d.code.trim().toUpperCase();
    const value = Number(d.value), min = Number(d.minOrder || 0);
    if (!/^[A-Z0-9]{3,20}$/.test(code)) x["code"] = "Use 3–20 letters or numbers, no spaces";
    else if (data.coupons.some((c) => c.id !== d.id && c.code === code)) x["code"] = "This code already exists";
    if (d.description.trim().length < 5) x["description"] = "Enter a short description";
    if (!(value > 0)) x["value"] = "Enter a discount value above 0";
    else if (d.type === "percent" && value > 90) x["value"] = "Percentage discount can be at most 90%";
    if (!(min >= 0)) x["minOrder"] = "Enter 0 or more";
    if (!d.expiry) x["expiry"] = "Choose an expiry date";
    setEr(x);
    if (Object.keys(x).length) return toast("error", "Please fix the highlighted fields");
    const isNew = !d.id;
    const c: Coupon = { id: d.id || uid("c"), code, description: d.description.trim(), type: d.type, value, minOrder: min, expiry: d.expiry, active: d.active };
    upsert("coupons", c);
    logActivity(`Coupon ${c.code} ${isNew ? "added" : "updated"}`);
    toast("success", isNew ? "Coupon added" : "Coupon updated", c.code);
    setD(null);
  };
  const del = async (c: Coupon) => {
    if (!(await confirm({ title: `Delete coupon ${c.code}?`, message: "Customers will no longer be able to use this code." }))) return;
    remove("coupons", c.id);
    logActivity(`Coupon ${c.code} deleted`);
    toast("success", "Coupon deleted", c.code);
  };

  return (
    <div>
      <AdminPageHeader title="Coupons" subtitle="Discount codes customers can apply in the cart." action={<AddButton label="Add Coupon" onClick={() => { setEr({}); setD(toDraft()); }} />} />
      <div className="mb-4"><SearchBox value={q} onChange={setQ} placeholder="Search coupons" /></div>
      <TableCard>
        <table className="table-base">
          <thead><tr><th>Code</th><th>Discount</th><th>Min. order</th><th>Expiry</th><th>Status</th><th>Active</th><th className="text-right!">Actions</th></tr></thead>
          <tbody>
            {list.length === 0 && <EmptyRow colSpan={7} text="No coupons found." />}
            {list.map((c) => {
              const s = statusOf(c, today);
              return (
                <tr key={c.id}>
                  <td><p className="font-extrabold tracking-wide">{c.code}</p><p className="max-w-[240px] truncate text-xs text-muted-foreground">{c.description}</p></td>
                  <td className="whitespace-nowrap font-bold">{valueText(c)}</td>
                  <td>{inr(c.minOrder)}</td>
                  <td className="whitespace-nowrap">{formatDate(c.expiry)}</td>
                  <td><StatusPill tone={s.tone}>{s.label}</StatusPill></td>
                  <td><Toggle checked={c.active} label={`Active: ${c.code}`} onChange={(v) => { upsert("coupons", { ...c, active: v }); toast("success", v ? "Coupon activated" : "Coupon deactivated", c.code); }} /></td>
                  <td><RowActions name={c.code} onView={() => setView(c)} onEdit={() => { setEr({}); setD(toDraft(c)); }} onDelete={() => del(c)} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableCard>

      <Modal open={!!view} onClose={() => setView(null)} title={`Coupon ${view?.code ?? ""}`} size="sm" footer={view && <button type="button" className="btn btn-primary btn-sm" onClick={() => { const c = view; setView(null); setEr({}); setD(toDraft(c)); }}>Edit coupon</button>}>
        {view && <DetailGrid items={[["Code", view.code], ["Discount", valueText(view)], ["Type", view.type === "percent" ? "Percentage" : "Flat amount"], ["Minimum order", inr(view.minOrder)], ["Expiry", formatDate(view.expiry)], ["Status", statusOf(view, today).label], ["Description", view.description]]} />}
      </Modal>

      <Modal open={!!d} onClose={() => setD(null)} title={d?.id ? "Edit coupon" : "Add coupon"} footer={<><button type="button" className="btn btn-muted btn-sm" onClick={() => setD(null)}>Cancel</button><button type="button" className="btn btn-primary btn-sm" onClick={save}>{d?.id ? "Save changes" : "Add coupon"}</button></>}>
        {d && (
          <form className="space-y-4" noValidate onSubmit={(e) => { e.preventDefault(); save(); }}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Coupon code" htmlFor="kf-code" error={er["code"]}><input id="kf-code" className="field uppercase" value={d.code} onChange={(e) => setD({ ...d, code: e.target.value.toUpperCase() })} aria-invalid={!!er["code"]} /></Field>
              <Field label="Discount type" htmlFor="kf-type">
                <select id="kf-type" className="field" value={d.type} onChange={(e) => setD({ ...d, type: e.target.value as Coupon["type"] })}><option value="percent">Percentage (%)</option><option value="flat">Flat amount (₹)</option></select>
              </Field>
            </div>
            <Field label="Description" htmlFor="kf-desc" error={er["description"]}><input id="kf-desc" className="field" value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} aria-invalid={!!er["description"]} /></Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label={d.type === "percent" ? "Discount (%)" : "Discount (₹)"} htmlFor="kf-val" error={er["value"]}><input id="kf-val" type="number" min={1} className="field" value={d.value} onChange={(e) => setD({ ...d, value: e.target.value })} aria-invalid={!!er["value"]} /></Field>
              <Field label="Min. order (₹)" htmlFor="kf-min" error={er["minOrder"]}><input id="kf-min" type="number" min={0} className="field" value={d.minOrder} onChange={(e) => setD({ ...d, minOrder: e.target.value })} aria-invalid={!!er["minOrder"]} /></Field>
              <Field label="Expiry date" htmlFor="kf-exp" error={er["expiry"]}><input id="kf-exp" type="date" className="field" value={d.expiry} onChange={(e) => setD({ ...d, expiry: e.target.value })} aria-invalid={!!er["expiry"]} /></Field>
            </div>
            <CheckRow label="Active" checked={d.active} onChange={(v) => setD({ ...d, active: v })} />
          </form>
        )}
      </Modal>
    </div>
  );
}
