import { useState } from "react";
import { useStore, useTotals } from "@/lib/store";
import { inr } from "@/lib/format";
import { TagIcon } from "../icons";

export function OrderSummary({ children, showCoupon = true }: { children?: React.ReactNode; showCoupon?: boolean }) {
  const { data, couponCode, applyCoupon, removeCoupon } = useStore();
  const t = useTotals();
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const remaining = data.settings.freeDeliveryThreshold - t.subtotal;
  const activeCoupons = data.coupons.filter((c) => c.active);
  return (
    <div className="card-surface space-y-4 p-5 sm:p-6">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      {showCoupon && (
        <div>
          {couponCode && t.couponDiscount > 0 ? (
            <div className="flex items-center justify-between rounded-xl border border-dashed border-success bg-success/5 px-3 py-2.5 text-sm">
              <span className="flex items-center gap-2 font-bold text-success"><TagIcon size={16} /> {couponCode} applied</span>
              <button type="button" className="text-xs font-bold text-destructive hover:underline" onClick={removeCoupon}>Remove</button>
            </div>
          ) : (
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!code.trim()) return setErr("Enter a coupon code");
                const r = applyCoupon(code);
                setErr(r ?? "");
                if (!r) setCode("");
              }}
            >
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Coupon code" aria-label="Coupon code" className="field py-2.5! uppercase" aria-invalid={!!err} />
              <button type="submit" className="btn btn-outline btn-sm">Apply</button>
            </form>
          )}
          {couponCode && t.couponDiscount === 0 && <p className="field-error">Coupon {couponCode} no longer applies to this cart.</p>}
          {err && <p className="field-error">{err}</p>}
          {activeCoupons.length > 0 && !couponCode && (
            <p className="mt-2 text-xs text-muted-foreground">Try: {activeCoupons.slice(0, 2).map((c) => c.code).join(", ")}</p>
          )}
        </div>
      )}
      <dl className="space-y-2.5 text-sm">
        <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal ({t.itemsCount} items)</dt><dd className="font-bold">{inr(t.subtotal)}</dd></div>
        {t.savings > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">You save on MRP</dt><dd className="font-bold text-success">− {inr(t.savings)}</dd></div>}
        <div className="flex justify-between"><dt className="text-muted-foreground">Coupon discount</dt><dd className="font-bold text-success">{t.couponDiscount ? `− ${inr(t.couponDiscount)}` : inr(0)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Delivery charge</dt><dd className="font-bold">{t.delivery === 0 ? <span className="text-success">FREE</span> : inr(t.delivery)}</dd></div>
        <div className="flex justify-between border-t border-border pt-3 text-base"><dt className="font-extrabold">Grand Total</dt><dd className="font-display text-2xl font-bold text-primary">{inr(t.total)}</dd></div>
      </dl>
      {remaining > 0 && t.subtotal > 0 && (
        <div className="rounded-xl bg-accent/20 p-3 text-xs font-semibold">
          Add {inr(remaining)} more for <span className="text-primary">FREE delivery</span>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-card"><div className="h-full rounded-full bg-secondary" style={{ width: `${Math.min(100, (t.subtotal / data.settings.freeDeliveryThreshold) * 100)}%` }} /></div>
        </div>
      )}
      {children}
    </div>
  );
}
