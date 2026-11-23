import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { EMAIL_RE, PIN_RE, digitsOnly, inr } from "@/lib/format";
import { INDIAN_STATES, PAYMENT_LABELS } from "@/lib/labels";
import type { PaymentMethod } from "@/lib/types";
import { PageHero } from "@/components/site/SectionHeading";
import { OrderSummary } from "@/components/site/OrderSummary";
import { SmartImage } from "@/components/SmartImage";
import { BagIcon, LockIcon, ShieldIcon } from "@/components/icons";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | HURRAYECA" },
      { name: "description", content: "Enter your delivery details and place your HURRAYECA namkeen order (demo checkout)." },
      { property: "og:title", content: "Checkout | HURRAYECA" },
      { property: "og:description", content: "Secure demo checkout for your namkeen order." },
    ],
  }),
  component: Checkout,
});

const EMPTY = { name: "", phone: "", email: "", address: "", city: "", state: "", pin: "" };
type Form = typeof EMPTY;
const PAYMENTS: Array<{ id: PaymentMethod; hint: string }> = [
  { id: "cod", hint: "Pay when your order arrives" },
  { id: "upi", hint: "GPay, PhonePe, Paytm – demo only" },
  { id: "card", hint: "Visa, Mastercard, RuPay – demo only" },
  { id: "netbanking", hint: "All major banks – demo only" },
];

function validate(f: Form): Partial<Record<keyof Form, string>> {
  const e: Partial<Record<keyof Form, string>> = {};
  if (f.name.trim().length < 2) e.name = "Please enter your full name";
  if (digitsOnly(f.phone).length !== 10) e.phone = "Enter a valid 10-digit mobile number";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Enter a valid email address";
  if (f.address.trim().length < 8) e.address = "Enter your full delivery address";
  if (f.city.trim().length < 2) e.city = "Enter your city";
  if (!f.state) e.state = "Select your state";
  if (!PIN_RE.test(f.pin.trim())) e.pin = "Enter a valid 6-digit PIN code";
  return e;
}

function Checkout() {
  const { cart, data, hydrated, placeOrder } = useStore();
  const navigate = useNavigate();
  const [f, setF] = useState<Form>(EMPTY);
  const [er, setEr] = useState<Partial<Record<keyof Form, string>>>({});
  const [pay, setPay] = useState<PaymentMethod>("cod");
  const [placing, setPlacing] = useState(false);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const input = (k: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className="label" htmlFor={`co-${k}`}>{label}</label>
      <input id={`co-${k}`} className="field" value={f[k]} onChange={set(k)} aria-invalid={!!er[k]} {...props} />
      {er[k] && <p className="field-error">{er[k]}</p>}
    </div>
  );

  if (!hydrated) {
    return (<><PageHero crumb="Checkout" title="Checkout" /><p className="container-x py-12 text-muted-foreground">Loading…</p></>);
  }
  if (cart.length === 0 && !placing) {
    return (
      <>
        <PageHero crumb="Checkout" title="Checkout" />
        <section className="container-x py-14">
          <div className="card-surface mx-auto flex max-w-lg flex-col items-center gap-4 p-12 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-primary"><BagIcon size={36} /></span>
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground">Add some delicious namkeen before checking out.</p>
            <Link to="/shop" className="btn btn-primary">Browse Snacks</Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero crumb="Checkout" title="Checkout" subtitle="Almost there! Enter your delivery details to place your order." />
      <form
        noValidate
        className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_400px] lg:py-14"
        onSubmit={(e) => {
          e.preventDefault();
          const x = validate(f);
          setEr(x);
          if (Object.keys(x).length) {
            document.getElementById(`co-${Object.keys(x)[0]}`)?.focus();
            return;
          }
          setPlacing(true);
          const order = placeOrder({
            customer: { name: f.name.trim(), phone: digitsOnly(f.phone), email: f.email.trim(), address: f.address.trim(), city: f.city.trim(), state: f.state, pin: f.pin.trim() },
            paymentMethod: pay,
          });
          void navigate({ to: "/order-confirmation/$id", params: { id: order.id } });
        }}
      >
        <div className="space-y-6">
          <div className="card-surface space-y-4 p-5 sm:p-6">
            <h2 className="text-xl font-semibold">Contact details</h2>
            {input("name", "Full name", { autoComplete: "name" })}
            <div className="grid gap-4 sm:grid-cols-2">
              {input("phone", "Mobile number", { type: "tel", inputMode: "numeric", autoComplete: "tel", placeholder: "10-digit number" })}
              {input("email", "Email", { type: "email", autoComplete: "email" })}
            </div>
          </div>
          <div className="card-surface space-y-4 p-5 sm:p-6">
            <h2 className="text-xl font-semibold">Delivery address</h2>
            <div>
              <label className="label" htmlFor="co-address">Address (house no., street, area)</label>
              <textarea id="co-address" rows={3} className="field" value={f.address} onChange={set("address")} aria-invalid={!!er.address} autoComplete="street-address" />
              {er.address && <p className="field-error">{er.address}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {input("city", "City", { autoComplete: "address-level2" })}
              <div>
                <label className="label" htmlFor="co-state">State</label>
                <select id="co-state" className="field" value={f.state} onChange={set("state")} aria-invalid={!!er.state}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {er.state && <p className="field-error">{er.state}</p>}
              </div>
              {input("pin", "PIN code", { inputMode: "numeric", maxLength: 6, autoComplete: "postal-code" })}
            </div>
          </div>
          <div className="card-surface space-y-4 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-semibold">Payment method</h2>
              <span className="badge bg-accent/25 text-foreground">Demo – no real payment is taken</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
              {PAYMENTS.map((p) => (
                <label key={p.id} className={"flex cursor-pointer items-start gap-3 rounded-2xl border-[1.5px] p-4 transition " + (pay === p.id ? "border-primary bg-primary/5" : "border-input hover:border-secondary")}>
                  <input type="radio" name="payment" className="mt-1 h-4 w-4 accent-primary" checked={pay === p.id} onChange={() => setPay(p.id)} />
                  <span><span className="block text-sm font-bold">{PAYMENT_LABELS[p.id]}</span><span className="text-xs text-muted-foreground">{p.hint}</span></span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-surface max-h-72 divide-y divide-border overflow-y-auto">
            {cart.map((i) => {
              const p = data.products.find((x) => x.id === i.productId);
              if (!p) return null;
              return (
                <div key={i.key} className="flex items-center gap-3 p-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <SmartImage src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{p.name}</p><p className="text-xs text-muted-foreground">{i.weight} × {i.qty}</p></div>
                  <p className="text-sm font-extrabold">{inr(i.unitPrice * i.qty)}</p>
                </div>
              );
            })}
          </div>
          <OrderSummary>
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={placing}><LockIcon size={18} /> Place Order</button>
            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground"><ShieldIcon size={14} /> This is a demo store. No real transaction is processed.</p>
          </OrderSummary>
        </div>
      </form>
    </>
  );
}
