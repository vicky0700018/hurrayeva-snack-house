import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { weightOptions } from "@/lib/pricing";
import { discountPercent, inr } from "@/lib/format";
import type { Product } from "@/lib/types";
import { BagIcon, HeartFilledIcon, HeartIcon, MinusIcon, PlusIcon } from "../icons";

export function StockBadge({ stock }: { stock: Product["stock"] }) {
  if (stock === "out_of_stock") return <span className="badge bg-destructive/10 text-destructive">Out of stock</span>;
  if (stock === "low_stock") return <span className="badge bg-secondary/20 text-primary-deep">Only a few left</span>;
  return <span className="badge bg-success/10 text-success">In stock</span>;
}

export function QtyStepper({ value, onChange, min = 1 }: { value: number; onChange: (n: number) => void; min?: number }) {
  return (
    <div className="inline-flex items-center rounded-full border-[1.5px] border-input bg-card">
      <button type="button" aria-label="Decrease quantity" className="icon-btn h-10 w-10" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>
        <MinusIcon size={16} />
      </button>
      <span className="w-8 text-center text-sm font-bold" aria-live="polite">{value}</span>
      <button type="button" aria-label="Increase quantity" className="icon-btn h-10 w-10" onClick={() => onChange(Math.min(20, value + 1))}>
        <PlusIcon size={16} />
      </button>
    </div>
  );
}

export function PurchasePanel({ product, onDone }: { product: Product; onDone?: () => void }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const navigate = useNavigate();
  const options = weightOptions(product.weight, product.price, product.mrp);
  const [sel, setSel] = useState(0);
  const [qty, setQty] = useState(1);
  const opt = options[sel] ?? options[0]!;
  const off = discountPercent(opt.price, opt.mrp);
  const wished = wishlist.includes(product.id);
  const out = product.stock === "out_of_stock";

  const add = () => {
    addToCart(product, { weight: opt.label, price: opt.price, mrp: opt.mrp, qty });
    onDone?.();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <span className="font-display text-3xl font-bold text-primary">{inr(opt.price)}</span>
        {opt.mrp > opt.price && <span className="pb-1 text-base text-muted-foreground line-through">{inr(opt.mrp)}</span>}
        {off > 0 && <span className="badge mb-1.5 bg-success text-success-foreground">{off}% OFF</span>}
        <span className="mb-1.5 text-xs text-muted-foreground">Inclusive of all taxes</span>
      </div>

      <div>
        <p className="label">Select weight</p>
        <div className="flex flex-wrap gap-2">
          {options.map((o, i) => (
            <button key={o.label} type="button" onClick={() => setSel(i)} className={"chip " + (i === sel ? "chip-active" : "")} aria-pressed={i === sel}>
              {o.label} · {inr(o.price)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="label">Quantity</p>
        <QtyStepper value={qty} onChange={setQty} />
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary btn-lg flex-1" onClick={add} disabled={out}>
          <BagIcon size={18} /> {out ? "Out of stock" : "Add to Cart"}
        </button>
        <button
          type="button"
          className="btn btn-saffron btn-lg flex-1"
          disabled={out}
          onClick={() => {
            addToCart(product, { weight: opt.label, price: opt.price, mrp: opt.mrp, qty });
            onDone?.();
            void navigate({ to: "/checkout" });
          }}
        >
          Buy Now
        </button>
        <button type="button" className="icon-btn h-[3.25rem] w-[3.25rem] border-[1.5px] border-input" aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} onClick={() => toggleWishlist(product.id)}>
          {wished ? <HeartFilledIcon className="text-primary" /> : <HeartIcon />}
        </button>
      </div>
    </div>
  );
}
