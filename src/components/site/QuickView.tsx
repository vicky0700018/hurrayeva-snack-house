import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Modal } from "../Modal";
import { SmartImage } from "../SmartImage";
import { Stars } from "./Stars";
import { PurchasePanel, StockBadge } from "./PurchasePanel";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { ArrowRight } from "../icons";

export function QuickView({ product, open, onClose }: { product: Product; open: boolean; onClose: () => void }) {
  const { data } = useStore();
  const [img, setImg] = useState(0);
  const cat = data.categories.find((c) => c.id === product.categoryId);
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
            <SmartImage src={product.images[img]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 flex gap-2">
            {product.images.map((src, i) => (
              <button key={i} type="button" onClick={() => setImg(i)} aria-label={`Show image ${i + 1}`} className={"h-16 w-16 overflow-hidden rounded-xl border-2 " + (i === img ? "border-primary" : "border-transparent")}>
                <SmartImage src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4 md:pr-6">
          <div className="flex flex-wrap items-center gap-2">
            {cat && <span className="eyebrow">{cat.name}</span>}
            <StockBadge stock={product.stock} />
          </div>
          <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">{product.name}</h2>
          <Stars value={product.rating} showValue count={product.reviewsCount} />
          <p className="text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>
          <PurchasePanel product={product} onDone={onClose} />
          <Link to="/product/$id" params={{ id: product.id }} onClick={onClose} className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            View full details <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </Modal>
  );
}
