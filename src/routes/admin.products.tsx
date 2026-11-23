import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { useConfirm } from "@/lib/confirm";
import { discountPercent, formatDate, inr, slugify, uid } from "@/lib/format";
import { STOCK_LABELS, STOCK_TONE } from "@/lib/labels";
import type { Product, StockStatus } from "@/lib/types";
import { Modal } from "@/components/Modal";
import { SmartImage } from "@/components/SmartImage";
import { AddButton, AdminPageHeader, CheckRow, DetailGrid, EmptyRow, Field, ImagePicker, RowActions, SearchBox, StatusPill, TableCard, Toggle, adminHead } from "@/components/admin/AdminUI";
import { ExternalIcon, PlusIcon, TrashIcon } from "@/components/icons";

export const Route = createFileRoute("/admin/products")({
  head: () => adminHead("Products", "Add, edit, view and delete store products."),
  component: ProductsAdmin,
});

interface Draft {
  id: string;
  name: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  ingredients: string;
  highlights: string;
  weight: string;
  mrp: string;
  price: string;
  images: string[];
  stock: StockStatus;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  visible: boolean;
}

function toDraft(p?: Product, defaultCat = ""): Draft {
  return {
    id: p?.id ?? "",
    name: p?.name ?? "",
    categoryId: p?.categoryId ?? defaultCat,
    shortDescription: p?.shortDescription ?? "",
    description: p?.description ?? "",
    ingredients: p?.ingredients ?? "",
    highlights: p?.highlights.join("\n") ?? "",
    weight: p?.weight ?? "",
    mrp: p ? String(p.mrp) : "",
    price: p ? String(p.price) : "",
    images: p ? [...p.images] : [""],
    stock: p?.stock ?? "in_stock",
    featured: p?.featured ?? false,
    bestSeller: p?.bestSeller ?? false,
    isNew: p?.isNew ?? true,
    visible: p?.visible ?? true,
  };
}

function ProductsAdmin() {
  const { data, upsert, remove, logActivity } = useStore();
  const toast = useToast();
  const confirm = useConfirm();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [view, setView] = useState<Product | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [er, setEr] = useState<Record<string, string>>({});

  const catName = (id: string) => data.categories.find((c) => c.id === id)?.name ?? "—";
  const list = useMemo(
    () => data.products.filter((p) => (!cat || p.categoryId === cat) && (!q || (p.name + " " + p.weight).toLowerCase().includes(q.toLowerCase()))),
    [data.products, cat, q],
  );

  const open = (p?: Product) => { setEr({}); setDraft(toDraft(p, data.categories[0]?.id)); };

  const save = () => {
    if (!draft) return;
    const x: Record<string, string> = {};
    const price = Number(draft.price), mrp = Number(draft.mrp);
    if (draft.name.trim().length < 2) x["name"] = "Enter a product name";
    else if (data.products.some((p) => p.id !== draft.id && p.name.trim().toLowerCase() === draft.name.trim().toLowerCase())) x["name"] = "A product with this name already exists";
    if (!draft.categoryId) x["categoryId"] = "Choose a category";
    if (draft.shortDescription.trim().length < 10) x["shortDescription"] = "Write at least 10 characters";
    if (draft.description.trim().length < 20) x["description"] = "Write at least 20 characters";
    if (!draft.weight.trim()) x["weight"] = "Enter the pack weight, e.g. 400g";
    if (!draft.mrp || !(mrp > 0)) x["mrp"] = "Enter a valid original price";
    if (!draft.price || !(price > 0)) x["price"] = "Enter a valid selling price";
    else if (mrp > 0 && price > mrp) x["price"] = "Selling price can't be more than the original price";
    if (!draft.images.some(Boolean)) x["images"] = "Add at least one image";
    setEr(x);
    if (Object.keys(x).length) return toast("error", "Please fix the highlighted fields");
    const existing = data.products.find((p) => p.id === draft.id);
    const product: Product = {
      id: draft.id || uid("p"),
      name: draft.name.trim(),
      slug: slugify(draft.name),
      categoryId: draft.categoryId,
      shortDescription: draft.shortDescription.trim(),
      description: draft.description.trim(),
      ingredients: draft.ingredients.trim(),
      highlights: draft.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      weight: draft.weight.trim(),
      price: Math.round(price),
      mrp: Math.round(mrp),
      images: draft.images.filter(Boolean),
      rating: existing?.rating ?? 4.5,
      reviewsCount: existing?.reviewsCount ?? 0,
      popularity: existing?.popularity ?? 50,
      stock: draft.stock,
      featured: draft.featured,
      bestSeller: draft.bestSeller,
      isNew: draft.isNew,
      visible: draft.visible,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    upsert("products", product);
    logActivity(`Product “${product.name}” ${existing ? "updated" : "added"}`);
    toast("success", existing ? "Product updated" : "Product added", product.name);
    setDraft(null);
  };

  const del = async (p: Product) => {
    if (!(await confirm({ title: `Delete “${p.name}”?`, message: "This product will be removed from the store and from customers' carts." }))) return;
    remove("products", p.id);
    logActivity(`Product “${p.name}” deleted`);
    toast("success", "Product deleted", p.name);
  };

  const quickSet = (p: Product, patch: Partial<Product>, msg: string) => {
    upsert("products", { ...p, ...patch });
    toast("success", msg, p.name);
  };

  const d = draft;
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => d && setDraft({ ...d, [k]: v });

  return (
    <div>
      <AdminPageHeader title="Products" subtitle={`${data.products.length} products · ${data.products.filter((p) => p.visible).length} visible`} action={<AddButton label="Add Product" onClick={() => open()} />} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchBox value={q} onChange={setQ} placeholder="Search products" />
        <select className="field py-2.5! sm:max-w-xs" aria-label="Filter by category" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {data.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <TableCard>
        <table className="table-base">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Visible</th><th className="text-right!">Actions</th></tr></thead>
          <tbody>
            {list.length === 0 && <EmptyRow colSpan={7} text="No products match your filters." />}
            {list.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="flex min-w-[220px] items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted"><SmartImage src={p.images[0]} alt={p.name} className="h-full w-full object-cover" /></div>
                    <div className="min-w-0"><p className="truncate font-bold">{p.name}</p><p className="text-xs text-muted-foreground">{p.weight}</p></div>
                  </div>
                </td>
                <td className="whitespace-nowrap">{catName(p.categoryId)}</td>
                <td className="whitespace-nowrap"><span className="font-bold">{inr(p.price)}</span> {p.mrp > p.price && <span className="text-xs text-muted-foreground line-through">{inr(p.mrp)}</span>}</td>
                <td><StatusPill tone={STOCK_TONE[p.stock]}>{STOCK_LABELS[p.stock]}</StatusPill></td>
                <td><Toggle checked={p.featured} label={`Featured: ${p.name}`} onChange={(v) => quickSet(p, { featured: v }, v ? "Marked as featured" : "Removed from featured")} /></td>
                <td><Toggle checked={p.visible} label={`Visible: ${p.name}`} onChange={(v) => quickSet(p, { visible: v }, v ? "Product is now visible" : "Product hidden from store")} /></td>
                <td><RowActions name={p.name} onView={() => setView(p)} onEdit={() => open(p)} onDelete={() => del(p)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <Modal open={!!view} onClose={() => setView(null)} title="Product details" size="lg" footer={view && <><Link to="/product/$id" params={{ id: view.id }} target="_blank" className="btn btn-muted btn-sm"><ExternalIcon size={15} /> Open in store</Link><button type="button" className="btn btn-primary btn-sm" onClick={() => { const p = view; setView(null); open(p); }}>Edit product</button></>}>
        {view && (
          <div className="space-y-5">
            <div className="flex gap-2 overflow-x-auto">
              {view.images.map((im, i) => <div key={i} className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-muted"><SmartImage src={im} alt={`${view.name} ${i + 1}`} className="h-full w-full object-cover" /></div>)}
            </div>
            <div><h3 className="text-2xl font-semibold">{view.name}</h3><p className="text-sm text-muted-foreground">{view.shortDescription}</p></div>
            <DetailGrid items={[
              ["Category", catName(view.categoryId)],
              ["Weight", view.weight],
              ["Selling price", inr(view.price)],
              ["Original price (MRP)", `${inr(view.mrp)}${discountPercent(view.price, view.mrp) ? ` · ${discountPercent(view.price, view.mrp)}% off` : ""}`],
              ["Stock", <StatusPill key="s" tone={STOCK_TONE[view.stock]}>{STOCK_LABELS[view.stock]}</StatusPill>],
              ["Flags", [view.featured && "Featured", view.bestSeller && "Best seller", view.isNew && "New arrival", view.visible ? "Visible" : "Hidden"].filter(Boolean).join(" · ")],
              ["Rating", `${view.rating} ★ (${view.reviewsCount} reviews)`],
              ["Added on", formatDate(view.createdAt)],
            ]} />
            <div><p className="label">Description</p><p className="text-sm text-muted-foreground">{view.description}</p></div>
            <div><p className="label">Ingredients</p><p className="text-sm text-muted-foreground">{view.ingredients || "—"}</p></div>
            {view.highlights.length > 0 && <div><p className="label">Highlights</p><ul className="list-disc pl-5 text-sm text-muted-foreground">{view.highlights.map((h) => <li key={h}>{h}</li>)}</ul></div>}
          </div>
        )}
      </Modal>

      <Modal open={!!d} onClose={() => setDraft(null)} title={d?.id ? "Edit product" : "Add product"} size="lg" footer={<><button type="button" className="btn btn-muted btn-sm" onClick={() => setDraft(null)}>Cancel</button><button type="button" className="btn btn-primary btn-sm" onClick={save}>{d?.id ? "Save changes" : "Add product"}</button></>}>
        {d && (
          <form className="space-y-4" noValidate onSubmit={(e) => { e.preventDefault(); save(); }}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product name" htmlFor="pf-name" error={er["name"]}><input id="pf-name" className="field" value={d.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!er["name"]} /></Field>
              <Field label="Category" htmlFor="pf-cat" error={er["categoryId"]}>
                <select id="pf-cat" className="field" value={d.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
                  <option value="">Select category</option>
                  {data.categories.map((c) => <option key={c.id} value={c.id}>{c.name}{c.active ? "" : " (inactive)"}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Short description" htmlFor="pf-short" error={er["shortDescription"]}><input id="pf-short" className="field" value={d.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} aria-invalid={!!er["shortDescription"]} /></Field>
            <Field label="Full description" htmlFor="pf-desc" error={er["description"]}><textarea id="pf-desc" rows={3} className="field" value={d.description} onChange={(e) => set("description", e.target.value)} aria-invalid={!!er["description"]} /></Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Weight" htmlFor="pf-weight" error={er["weight"]}><input id="pf-weight" className="field" placeholder="400g" value={d.weight} onChange={(e) => set("weight", e.target.value)} aria-invalid={!!er["weight"]} /></Field>
              <Field label="Original price (₹)" htmlFor="pf-mrp" error={er["mrp"]}><input id="pf-mrp" type="number" min={1} className="field" value={d.mrp} onChange={(e) => set("mrp", e.target.value)} aria-invalid={!!er["mrp"]} /></Field>
              <Field label="Discount / selling price (₹)" htmlFor="pf-price" error={er["price"]}><input id="pf-price" type="number" min={1} className="field" value={d.price} onChange={(e) => set("price", e.target.value)} aria-invalid={!!er["price"]} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ingredients" htmlFor="pf-ing"><textarea id="pf-ing" rows={3} className="field" value={d.ingredients} onChange={(e) => set("ingredients", e.target.value)} /></Field>
              <Field label="Highlights" htmlFor="pf-hl" hint="One highlight per line"><textarea id="pf-hl" rows={3} className="field" value={d.highlights} onChange={(e) => set("highlights", e.target.value)} /></Field>
            </div>
            <Field label="Stock status" htmlFor="pf-stock">
              <select id="pf-stock" className="field sm:max-w-xs" value={d.stock} onChange={(e) => set("stock", e.target.value as StockStatus)}>
                {(Object.keys(STOCK_LABELS) as StockStatus[]).map((s) => <option key={s} value={s}>{STOCK_LABELS[s]}</option>)}
              </select>
            </Field>
            <div className="grid gap-2 sm:grid-cols-4">
              <CheckRow label="Visible in store" checked={d.visible} onChange={(v) => set("visible", v)} />
              <CheckRow label="Featured" checked={d.featured} onChange={(v) => set("featured", v)} />
              <CheckRow label="Best seller" checked={d.bestSeller} onChange={(v) => set("bestSeller", v)} />
              <CheckRow label="New arrival" checked={d.isNew} onChange={(v) => set("isNew", v)} />
            </div>
            <div className="space-y-4 rounded-2xl border border-border p-4">
              {d.images.map((im, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex-1"><ImagePicker label={i === 0 ? "Main image" : `Gallery image ${i + 1}`} value={im} onChange={(v) => set("images", d.images.map((x, j) => (j === i ? v : x)))} /></div>
                  {d.images.length > 1 && <button type="button" className="action-btn action-delete mt-6" aria-label={`Remove image ${i + 1}`} onClick={() => set("images", d.images.filter((_, j) => j !== i))}><TrashIcon size={15} /></button>}
                </div>
              ))}
              {d.images.length < 5 && <button type="button" className="btn btn-muted btn-sm" onClick={() => set("images", [...d.images, ""])}><PlusIcon size={15} /> Add gallery image</button>}
              {er["images"] && <p className="field-error">{er["images"]}</p>}
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
