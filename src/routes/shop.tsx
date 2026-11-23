import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore, useVisibleProducts } from "@/lib/store";
import { discountPercent, inr } from "@/lib/format";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHero } from "@/components/site/SectionHeading";
import { CloseIcon, FilterIcon, GridIcon, ListIcon, SearchIcon } from "@/components/icons";

interface ShopSearch {
  category?: string;
  q?: string;
}

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    ...(typeof s["category"] === "string" && s["category"] ? { category: s["category"] } : {}),
    ...(typeof s["q"] === "string" && s["q"] ? { q: s["q"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Shop Namkeen Online – Bhujia, Mixture, Chivda & More | HURRAYECA" },
      { name: "description", content: "Browse the complete HURRAYECA range of Indian namkeen. Filter by category, price and discount, and add your favourites to cart." },
      { property: "og:title", content: "Shop Namkeen Online | HURRAYECA" },
      { property: "og:description", content: "Bhujia, sev, mixture, chivda, peanuts, chips and combo packs." },
    ],
  }),
  component: Shop,
});

type Sort = "popularity" | "newest" | "price-asc" | "price-desc" | "rating";

function Shop() {
  const { data } = useStore();
  const products = useVisibleProducts();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const cats = data.categories.filter((c) => c.active);
  const maxPrice = useMemo(() => Math.max(100, ...products.map((p) => p.price)), [products]);

  const [price, setPrice] = useState<number | null>(null);
  const [minDiscount, setMinDiscount] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<Sort>("popularity");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [drawer, setDrawer] = useState(false);
  const priceCap = price ?? maxPrice;

  const activeCat = cats.find((c) => c.slug === search.category);
  const q = search.q ?? "";

  const setSearch = (next: ShopSearch) => {
    void navigate({
      search: (prev) => {
        const merged = { ...prev, ...next };
        const out: ShopSearch = {};
        if (merged.category) out.category = merged.category;
        if (merged.q) out.q = merged.q;
        return out;
      },
      replace: true,
    });
  };

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    let r = products.filter((p) => {
      if (activeCat && p.categoryId !== activeCat.id) return false;
      if (t && !(p.name + " " + p.shortDescription + " " + p.description).toLowerCase().includes(t)) return false;
      if (p.price > priceCap) return false;
      if (minDiscount && discountPercent(p.price, p.mrp) < minDiscount) return false;
      if (inStock && p.stock === "out_of_stock") return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      switch (sort) {
        case "newest": return b.createdAt.localeCompare(a.createdAt);
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "rating": return b.rating - a.rating;
        default: return b.popularity - a.popularity;
      }
    });
    return r;
  }, [products, activeCat, q, priceCap, minDiscount, inStock, sort]);

  const clearAll = () => {
    setPrice(null);
    setMinDiscount(0);
    setInStock(false);
    void navigate({ search: {}, replace: true });
  };

  const filters = (
    <div className="space-y-7">
      <div>
        <p className="label">Search</p>
        <label className="relative block">
          <SearchIcon size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setSearch({ q: e.target.value })} placeholder="Search products" aria-label="Search products" className="field pl-10!" />
        </label>
      </div>
      <div>
        <p className="label">Categories</p>
        <div className="flex flex-col gap-1">
          <button type="button" onClick={() => setSearch({ category: "" })} className={"flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition " + (!activeCat ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
            All Products <span className="text-xs opacity-75">{products.length}</span>
          </button>
          {cats.map((c) => (
            <button key={c.id} type="button" onClick={() => setSearch({ category: c.slug })} className={"flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition " + (activeCat?.id === c.id ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
              {c.name} <span className="text-xs opacity-75">{products.filter((p) => p.categoryId === c.id).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <p className="label">Max price</p>
          <span className="text-sm font-extrabold text-primary">{inr(priceCap)}</span>
        </div>
        <input type="range" min={50} max={maxPrice} step={10} value={priceCap} onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-[var(--primary)]" aria-label="Maximum price" />
        <div className="flex justify-between text-xs text-muted-foreground"><span>₹50</span><span>{inr(maxPrice)}</span></div>
      </div>
      <div>
        <p className="label">Discount</p>
        <div className="flex flex-wrap gap-2">
          {[0, 10, 15, 20].map((d) => (
            <button key={d} type="button" onClick={() => setMinDiscount(d)} className={"chip " + (minDiscount === d ? "chip-active" : "")} aria-pressed={minDiscount === d}>
              {d === 0 ? "Any" : `${d}% +`}
            </button>
          ))}
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
        <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
        Show in-stock items only
      </label>
      <button type="button" className="btn btn-muted w-full" onClick={clearAll}>Clear all filters</button>
    </div>
  );

  return (
    <>
      <PageHero crumb={activeCat ? activeCat.name : "Shop"} title={activeCat ? activeCat.name : "Shop All Namkeen"} subtitle={activeCat ? activeCat.description : "Crunchy, flavourful Indian snacks – filter, sort and find your perfect bite."} />
      <div className="container-x grid gap-8 py-10 lg:grid-cols-[260px_1fr] lg:py-14">
        <aside className="hidden lg:block">
          <div className="card-surface sticky top-24 p-5">{filters}</div>
        </aside>
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button type="button" className="btn btn-muted btn-sm lg:hidden" onClick={() => setDrawer(true)}><FilterIcon size={16} /> Filters</button>
              <p className="text-sm text-muted-foreground"><span className="font-extrabold text-foreground">{list.length}</span> products{q && <> for “{q}”</>}</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="sort">Sort by</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field w-auto! py-2! text-sm">
                <option value="popularity">Sort: Popularity</option>
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <div className="flex rounded-full border-[1.5px] border-input bg-card p-0.5">
                <button type="button" aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={"rounded-full p-2 " + (view === "grid" ? "bg-primary text-primary-foreground" : "")}><GridIcon size={16} /></button>
                <button type="button" aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")} className={"rounded-full p-2 " + (view === "list" ? "bg-primary text-primary-foreground" : "")}><ListIcon size={16} /></button>
              </div>
            </div>
          </div>

          {(activeCat || q || minDiscount > 0 || price !== null || inStock) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {activeCat && <button type="button" className="chip" onClick={() => setSearch({ category: "" })}>{activeCat.name} <CloseIcon size={14} /></button>}
              {q && <button type="button" className="chip" onClick={() => setSearch({ q: "" })}>“{q}” <CloseIcon size={14} /></button>}
              {price !== null && <button type="button" className="chip" onClick={() => setPrice(null)}>Up to {inr(price)} <CloseIcon size={14} /></button>}
              {minDiscount > 0 && <button type="button" className="chip" onClick={() => setMinDiscount(0)}>{minDiscount}%+ off <CloseIcon size={14} /></button>}
              {inStock && <button type="button" className="chip" onClick={() => setInStock(false)}>In stock <CloseIcon size={14} /></button>}
            </div>
          )}

          {list.length === 0 ? (
            <div className="card-surface flex flex-col items-center gap-3 p-12 text-center">
              <SearchIcon size={36} className="text-secondary" />
              <h2 className="text-2xl font-semibold">No products found</h2>
              <p className="text-sm text-muted-foreground">Try changing your filters or search term.</p>
              <button type="button" className="btn btn-primary btn-sm" onClick={clearAll}>Clear filters</button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
              {list.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {list.map((p) => <ProductCard key={p.id} product={p} layout="list" />)}
            </div>
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm lg:hidden" onClick={() => setDrawer(false)}>
          <div className="animate-fade-up absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-card p-5" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Filters">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button type="button" className="icon-btn" aria-label="Close filters" onClick={() => setDrawer(false)}><CloseIcon /></button>
            </div>
            {filters}
            <button type="button" className="btn btn-primary mt-4 w-full" onClick={() => setDrawer(false)}>Show {list.length} products</button>
          </div>
        </div>
      )}
    </>
  );
}
