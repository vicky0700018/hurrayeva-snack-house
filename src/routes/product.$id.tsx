import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, useVisibleProducts } from "@/lib/store";
import { PRODUCTS } from "@/lib/seed";
import { formatDate } from "@/lib/format";
import { SmartImage } from "@/components/SmartImage";
import { ProductCard } from "@/components/site/ProductCard";
import { PurchasePanel, StockBadge } from "@/components/site/PurchasePanel";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Stars } from "@/components/site/Stars";
import { CheckIcon, ShieldIcon, StarIcon, TruckIcon } from "@/components/icons";
import { useToast } from "@/lib/toast";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = PRODUCTS.find((x) => x.id === params.id);
    const title = p ? `${p.name} (${p.weight}) – Buy Online | HURRAYECA` : "Product Details | HURRAYECA";
    const desc = p ? p.shortDescription : "Authentic Indian namkeen from HURRAYECA.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: ProductPage,
});

function ReviewForm({ productId }: { productId: string }) {
  const { submitReview } = useStore();
  const toast = useToast();
  const [f, setF] = useState({ name: "", city: "", rating: 5, comment: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <form
      noValidate
      className="card-surface space-y-4 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        const er: Record<string, string> = {};
        if (f.name.trim().length < 2) er["name"] = "Please enter your name";
        if (f.comment.trim().length < 10) er["comment"] = "Please write at least 10 characters";
        setErrors(er);
        if (Object.keys(er).length) return;
        submitReview({ productId, name: f.name.trim(), city: f.city.trim() || "India", rating: f.rating, comment: f.comment.trim() });
        toast("success", "Thank you for your review!", "It will appear once approved by our team.");
        setF({ name: "", city: "", rating: 5, comment: "" });
      }}
    >
      <h3 className="text-xl font-semibold">Write a review</h3>
      <div>
        <p className="label">Your rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" aria-label={`${n} star`} onClick={() => setF({ ...f, rating: n })} className={n <= f.rating ? "text-accent" : "text-border"}>
              <StarIcon size={26} />
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="rv-name">Name</label>
          <input id="rv-name" className="field" value={f.name} aria-invalid={!!errors["name"]} onChange={(e) => setF({ ...f, name: e.target.value })} />
          {errors["name"] && <p className="field-error">{errors["name"]}</p>}
        </div>
        <div>
          <label className="label" htmlFor="rv-city">City (optional)</label>
          <input id="rv-city" className="field" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="rv-comment">Your review</label>
        <textarea id="rv-comment" rows={3} className="field" value={f.comment} aria-invalid={!!errors["comment"]} onChange={(e) => setF({ ...f, comment: e.target.value })} />
        {errors["comment"] && <p className="field-error">{errors["comment"]}</p>}
      </div>
      <button type="submit" className="btn btn-primary">Submit review</button>
    </form>
  );
}

function ProductPage() {
  const { id } = Route.useParams();
  const { data, hydrated } = useStore();
  const visible = useVisibleProducts();
  const product = data.products.find((p) => p.id === id && p.visible);
  const [img, setImg] = useState(0);
  const [tab, setTab] = useState<"description" | "ingredients" | "reviews">("description");
  useEffect(() => {
    setImg(0);
    setTab("description");
  }, [id]);

  if (!product) {
    return (
      <div className="container-x flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
        {hydrated ? (
          <>
            <h1 className="text-3xl font-semibold">Product not found</h1>
            <p className="text-muted-foreground">This product may have been removed or is currently unavailable.</p>
            <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
          </>
        ) : (
          <p className="text-muted-foreground">Loading product…</p>
        )}
      </div>
    );
  }

  const cat = data.categories.find((c) => c.id === product.categoryId);
  const reviews = data.reviews.filter((r) => r.productId === product.id && r.approved);
  const related = visible.filter((p) => p.categoryId === product.categoryId && p.id !== product.id);
  const relatedList = (related.length >= 4 ? related : [...related, ...visible.filter((p) => p.categoryId !== product.categoryId && p.id !== product.id)]).slice(0, 4);
  const current = product.images[img] ?? product.images[0];

  return (
    <>
      <div className="border-b border-border bg-muted/50">
        <nav className="container-x py-3 text-xs font-semibold text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-1.5 text-secondary">/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link> <span className="mx-1.5 text-secondary">/</span>
          {cat && <><Link to="/shop" search={{ category: cat.slug }} className="hover:text-primary">{cat.name}</Link> <span className="mx-1.5 text-secondary">/</span></>}
          <span className="text-primary">{product.name}</span>
        </nav>
      </div>

      <section className="container-x grid gap-8 py-10 lg:grid-cols-2 lg:gap-14 lg:py-14">
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex gap-3 sm:flex-col">
            {product.images.map((src, i) => (
              <button key={i} type="button" onClick={() => setImg(i)} aria-label={`Show image ${i + 1}`} className={"h-20 w-20 overflow-hidden rounded-2xl border-2 transition " + (i === img ? "border-primary shadow-soft" : "border-transparent opacity-75 hover:opacity-100")}>
                <SmartImage src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="relative flex-1 overflow-hidden rounded-3xl bg-muted shadow-soft">
            <SmartImage key={current} src={current} alt={product.name} className="animate-fade-up aspect-square h-full w-full object-cover" loading="eager" />
            {product.isNew && <span className="badge absolute top-4 left-4 bg-accent text-accent-foreground">NEW</span>}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {cat && <span className="eyebrow">{cat.name}</span>}
            <StockBadge stock={product.stock} />
          </div>
          <h1 className="text-3xl leading-tight font-semibold sm:text-4xl">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Stars value={product.rating} size={16} showValue count={product.reviewsCount} />
            <span className="text-muted-foreground">·</span>
            <span className="font-semibold text-muted-foreground">Net wt: {product.weight}</span>
          </div>
          <p className="leading-relaxed text-muted-foreground">{product.shortDescription}</p>
          <PurchasePanel product={product} />
          <ul className="grid gap-2 rounded-2xl bg-muted/70 p-5 sm:grid-cols-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm font-semibold"><CheckIcon size={18} className="mt-0.5 shrink-0 text-success" /> {h}</li>
            ))}
          </ul>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-border p-3"><TruckIcon className="text-primary" /> Free delivery above ₹{data.settings.freeDeliveryThreshold} (demo)</div>
            <div className="flex items-center gap-3 rounded-2xl border border-border p-3"><ShieldIcon className="text-primary" /> Carefully sealed packs</div>
          </div>
        </div>
      </section>

      <section className="container-x pb-14">
        <div className="scrollbar-none flex gap-2 overflow-x-auto border-b border-border" role="tablist">
          {(["description", "ingredients", "reviews"] as const).map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={"-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-extrabold capitalize transition " + (tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
              {t === "reviews" ? `Reviews (${reviews.length})` : t}
            </button>
          ))}
        </div>
        <div className="py-8">
          {tab === "description" && <p className="max-w-3xl leading-relaxed text-foreground/85">{product.description}</p>}
          {tab === "ingredients" && (
            <div className="max-w-3xl space-y-3">
              <p className="leading-relaxed text-foreground/85">{product.ingredients}</p>
              <p className="text-xs text-muted-foreground">Ingredient information is indicative for this demo store. Please check the pack before consuming if you have allergies.</p>
            </div>
          )}
          {tab === "reviews" && (
            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
              <div className="space-y-4">
                {reviews.length === 0 && <p className="text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>}
                {reviews.map((r) => (
                  <div key={r.id} className="card-surface p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{r.name.charAt(0)}</span>
                        <div>
                          <p className="font-bold">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.city} · {formatDate(r.createdAt)}</p>
                        </div>
                      </div>
                      <Stars value={r.rating} />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/85">{r.comment}</p>
                  </div>
                ))}
              </div>
              <ReviewForm productId={product.id} />
            </div>
          )}
        </div>
      </section>

      {relatedList.length > 0 && (
        <section className="bg-muted/60 py-14">
          <div className="container-x">
            <SectionHeading eyebrow="You may also like" title="Related Products" />
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {relatedList.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
