import type { CartItem, Coupon } from "./types";

export interface Totals {
  itemsCount: number;
  subtotal: number;
  mrpTotal: number;
  savings: number;
  couponDiscount: number;
  delivery: number;
  total: number;
}

export function couponError(coupon: Coupon | undefined, subtotal: number, today: string): string | null {
  if (!coupon) return "Invalid coupon code";
  if (!coupon.active) return "This coupon is not active";
  if (coupon.expiry && coupon.expiry < today) return "This coupon has expired";
  if (subtotal < coupon.minOrder) return `Add items worth ₹${coupon.minOrder} or more to use this coupon`;
  return null;
}

export function couponDiscount(coupon: Coupon, subtotal: number): number {
  const raw = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
  return Math.min(Math.round(raw), subtotal);
}

export function computeTotals(
  items: CartItem[],
  opts: { coupon?: Coupon | undefined; freeDeliveryThreshold: number; deliveryCharge: number; today: string },
): Totals {
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const mrpTotal = items.reduce((s, i) => s + Math.max(i.unitMrp, i.unitPrice) * i.qty, 0);
  const itemsCount = items.reduce((s, i) => s + i.qty, 0);
  const valid = opts.coupon && !couponError(opts.coupon, subtotal, opts.today);
  const cDiscount = valid && opts.coupon ? couponDiscount(opts.coupon, subtotal) : 0;
  const delivery = subtotal === 0 || subtotal >= opts.freeDeliveryThreshold ? 0 : opts.deliveryCharge;
  return {
    itemsCount,
    subtotal,
    mrpTotal,
    savings: mrpTotal - subtotal,
    couponDiscount: cDiscount,
    delivery,
    total: Math.max(0, subtotal - cDiscount + delivery),
  };
}

/** Weight options shown on the product page: base pack plus a double pack at ~5% off. */
export function weightOptions(weight: string, price: number, mrp: number) {
  const m = weight.trim().match(/^(\d+(?:\.\d+)?)\s*(g|kg|gm|grams?)$/i);
  const opts = [{ label: weight, price, mrp }];
  if (m && m[1] && m[2]) {
    const n = parseFloat(m[1]) * 2;
    const unit = m[2].toLowerCase().startsWith("k") ? "kg" : "g";
    const label = unit === "g" && n >= 1000 ? `${n / 1000} kg` : `${n} ${unit}`;
    opts.push({ label, price: Math.round(price * 2 * 0.95), mrp: mrp * 2 });
  }
  return opts;
}
