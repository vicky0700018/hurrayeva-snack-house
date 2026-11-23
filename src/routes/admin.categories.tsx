import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { useConfirm } from "@/lib/confirm";
import { formatDate, slugify, uid } from "@/lib/format";
import type { Category } from "@/lib/types";
import { Modal } from "@/components/Modal";
import { SmartImage } from "@/components/SmartImage";
import { AddButton, AdminPageHeader, CheckRow, DetailGrid, Field, ImagePicker, RowActions, SearchBox, StatusPill, Toggle, adminHead } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/categories")({
  head: () => adminHead("Categories", "Add, edit, view and delete product categories."),
  component: CategoriesAdmin,
});

type Draft = Pick<Category, "id" | "name" | "description" | "image" | "active">;

function CategoriesAdmin() {
  const { data, upsert, remove, logActivity } = useStore();
  const toast = useToast();
  const confirm = useConfirm();
  const [q, setQ] = useState("");
  const [view, setView] = useState<Category | null>(null);
  const [d, setD] = useState<Draft | null>(null);
  const [er, setEr] = useState<Record<string, string>>({});
  const count = (id: string) => data.products.filter((p) => p.categoryId === id).length;
  const list = data.categories.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()));

  const open = (c?: Category) => { setEr({}); setD(c ? { id: c.id, name: c.name, description: c.description, image: c.image, active: c.active } : { id: "", name: "", description: "", image: "", active: true }); };

  const save = () => {
    if (!d) return;
    const x: Record<string, string> = {};
    if (d.name.trim().length < 2) x["name"] = "Enter a category name";
    else if (data.categories.some((c) => c.id !== d.id && slugify(c.name) === slugify(d.name))) x["name"] = "A category with this name already exists";
    if (d.description.trim().length < 10) x["description"] = "Write at least 10 characters";
    if (!d.image) x["image"] = "Choose a category image";
    setEr(x);
    if (Object.keys(x).length) return toast("error", "Please fix the highlighted fields");
    const existing = data.categories.find((c) => c.id === d.id);
    const cat: Category = { id: d.id || uid("cat-"), name: d.name.trim(), slug: slugify(d.name), description: d.description.trim(), image: d.image, active: d.active, createdAt: existing?.createdAt ?? new Date().toISOString() };
    upsert("categories", cat);
    logActivity(`Category “${cat.name}” ${existing ? "updated" : "added"}`);
    toast("success", existing ? "Category updated" : "Category added", cat.name);
    setD(null);
  };

  const del = async (c: Category) => {
    const n = count(c.id);
    if (!(await confirm({ title: `Delete “${c.name}”?`, message: n ? `${n} product(s) in this category will be hidden from the store until you move them to another category.` : "This category will be removed." }))) return;
    remove("categories", c.id);
    logActivity(`Category “${c.name}” deleted`);
    toast("success", "Category deleted", c.name);
  };

  return (
    <div>
      <AdminPageHeader title="Categories" subtitle={`${data.categories.length} categories · ${data.categories.filter((c) => c.active).length} active`} action={<AddButton label="Add Category" onClick={() => open()} />} />
      <div className="mb-4"><SearchBox value={q} onChange={setQ} placeholder="Search categories" /></div>
      {list.length === 0 && <p className="card-surface p-10 text-center text-sm text-muted-foreground">No categories found.</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <div key={c.id} className="card-surface overflow-hidden">
            <div className="relative h-36 bg-muted">
              <SmartImage src={c.image} alt={c.name} className="h-full w-full object-cover" />
              <div className="absolute top-3 left-3"><StatusPill tone={c.active ? "success" : "muted"}>{c.active ? "Active" : "Inactive"}</StatusPill></div>
            </div>
            <div className="space-y-3 p-4">
              <div><h3 className="text-lg font-semibold">{c.name}</h3><p className="line-clamp-2 text-sm text-muted-foreground">{c.description}</p></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground"><Toggle checked={c.active} label={`Active: ${c.name}`} onChange={(v) => { upsert("categories", { ...c, active: v }); toast("success", v ? "Category activated" : "Category deactivated", c.name); }} /> {count(c.id)} products</div>
                <RowActions name={c.name} onView={() => setView(c)} onEdit={() => open(c)} onDelete={() => del(c)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!view} onClose={() => setView(null)} title="Category details" footer={view && <button type="button" className="btn btn-primary btn-sm" onClick={() => { const c = view; setView(null); open(c); }}>Edit category</button>}>
        {view && (
          <div className="space-y-4">
            <div className="h-48 overflow-hidden rounded-2xl bg-muted"><SmartImage src={view.image} alt={view.name} className="h-full w-full object-cover" /></div>
            <DetailGrid items={[["Name", view.name], ["Link", `/shop?category=${view.slug}`], ["Status", view.active ? "Active" : "Inactive"], ["Products", String(count(view.id))], ["Created", formatDate(view.createdAt)]]} />
            <div><p className="label">Description</p><p className="text-sm text-muted-foreground">{view.description}</p></div>
          </div>
        )}
      </Modal>

      <Modal open={!!d} onClose={() => setD(null)} title={d?.id ? "Edit category" : "Add category"} footer={<><button type="button" className="btn btn-muted btn-sm" onClick={() => setD(null)}>Cancel</button><button type="button" className="btn btn-primary btn-sm" onClick={save}>{d?.id ? "Save changes" : "Add category"}</button></>}>
        {d && (
          <form className="space-y-4" noValidate onSubmit={(e) => { e.preventDefault(); save(); }}>
            <Field label="Category name" htmlFor="cf-name" error={er["name"]}><input id="cf-name" className="field" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} aria-invalid={!!er["name"]} /></Field>
            <Field label="Description" htmlFor="cf-desc" error={er["description"]}><textarea id="cf-desc" rows={3} className="field" value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} aria-invalid={!!er["description"]} /></Field>
            <ImagePicker label="Category image" value={d.image} onChange={(v) => setD({ ...d, image: v })} error={er["image"]} />
            <CheckRow label="Active (shown on website)" checked={d.active} onChange={(v) => setD({ ...d, active: v })} />
          </form>
        )}
      </Modal>
    </div>
  );
}
