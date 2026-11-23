import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { discountPercent, inr } from "@/lib/format";
import type { Product } from "@/lib/types";
import { SmartImage } from "../SmartImage";
import { Stars } from "./Stars";
import { QuickView } from "./QuickView";
import { BagIcon, EyeIcon, HeartFilledIcon, HeartIcon } from "../icons";

export function ProductCard({ product, layout = "grid" }: { product: Product; layout?: "grid" | "list" }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [qv, setQv] = useState(false);
  const off = discountPercent(product.price, product.mrp);
  const wished = wishlist.includes(product.id);
  const out = product.stock === "out_of_stock";

  const badges = (
    <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
      {off > 0 && <span className="badge bg-primary text-primary-foreground shadow-soft">{off}% OFF</span>}
      {product.isNew && <span className="badge bg-accent text-accent-foreground">NEW</span>}
      {product.bestSeller && !product.isNew && <span className="badge bg-card text-primary-deep">BESTSELLER</span>}
      {out && <span className="badge bg-ink text-ink-foreground">SOLD OUT</span>}
    </div>
  );

  const wishBtn = (
    <button
      type="button"
      onClick={() => toggleWishlist(product.id)}
      aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/95 shadow-soft transition hover:scale-110"
    >
      {wished ? <HeartFilledIcon size={18} className="text-primary" /> : <HeartIcon size={18} />}
    </button>
  );

  if (layout === "list") {
    return (
      <article className="group card-surface flex flex-col overflow-hidden transition hover:shadow-lift sm:flex-row">
        <div className="relative aspect-square shrink-0 overflow-hidden bg-muted sm:w-56">
          <Link to="/product/$id" params={{ id: product.id }} aria-label={product.name}>
            <SmartImage src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          </Link>
          {badges}
          {wishBtn}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <Stars value={product.rating} count={product.reviewsCount} />
          <Link to="/product/$id" params={{ id: product.id }} className="font-display text-xl font-semibold hover:text-primary">{product.name}</Link>
          <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
          <p className="text-xs font-bold text-muted-foreground">Net wt: {product.weight}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-primary">{inr(product.price)}</span>
              {product.mrp > product.price && <span className="text-sm text-muted-foreground line-through">{inr(product.mrp)}</span>}
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn btn-muted btn-sm" onClick={() => setQv(true)}><EyeIcon size={16} /> Quick View</button>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => addToCart(product)} disabled={out}><BagIcon size={16} /> Add to Cart</button>
            </div>
          </div>
        </div>
        <QuickView product={product} open={qv} onClose={() => setQv(false)} />
      </article>
    );
  }

  return (
    <article className="group card-surface relative flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link to="/product/$id" params={{ id: product.id }} aria-label={product.name}>
          <SmartImage src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
        </Link>
        {badges}
        {wishBtn}
        <button
          type="button"
          onClick={() => setQv(true)}
          className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-full bg-card/95 py-2 text-xs font-bold shadow-soft transition duration-300 hover:bg-accent lg:translate-y-14 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
        >
          <EyeIcon size={16} /> Quick View
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <Stars value={product.rating} count={product.reviewsCount} size={13} />
          <span className="text-[0.7rem] font-bold text-muted-foreground">{product.weight}</span>
        </div>
        <Link to="/product/$id" params={{ id: product.id }} className="line-clamp-1 font-display text-lg font-semibold leading-snug hover:text-primary">
          {product.name}
        </Link>
        <p className="line-clamp-2 text-[0.8rem] leading-relaxed text-muted-foreground">{product.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-extrabold text-primary">{inr(product.price)}</span>
            {product.mrp > product.price && <span className="text-xs text-muted-foreground line-through">MRP {inr(product.mrp)}</span>}
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => addToCart(product)} disabled={out} aria-label={`Add ${product.name} to cart`}>
            <BagIcon size={16} /> <span className="hidden min-[400px]:inline">Add</span>
          </button>
        </div>
      </div>
      <QuickView product={product} open={qv} onClose={() => setQv(false)} />
    </article>
  );
}
