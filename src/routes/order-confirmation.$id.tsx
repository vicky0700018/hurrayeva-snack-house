import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { formatDate, inr } from "@/lib/format";
import { ORDER_STATUS_LABELS, PAYMENT_LABELS } from "@/lib/labels";
import { SmartImage } from "@/components/SmartImage";
import { ArrowRight, CheckIcon } from "@/components/icons";

export const Route = createFileRoute("/order-confirmation/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.id} Confirmed | HURRAYECA` },
      { name: "description", content: "Your HURRAYECA demo order has been placed. View your order summary and delivery details." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Order Confirmed | HURRAYECA" },
      { property: "og:description", content: "Thank you for shopping with HURRAYECA." },
    ],
  }),
  component: Confirmation,
});

function Confirmation() {
  const { id } = Route.useParams();
  const { data, hydrated } = useStore();
  const order = data.orders.find((o) => o.id === id);

  if (!hydrated) return <p className="container-x py-20 text-muted-foreground">Loading your order…</p>;
  if (!order) {
    return (
      <section className="container-x py-20">
        <div className="card-surface mx-auto max-w-lg p-10 text-center">
          <h1 className="text-3xl font-semibold">Order not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">We couldn't find order <b>{id}</b> in this browser.</p>
          <div className="mt-6 flex justify-center gap-3"><Link to="/account" className="btn btn-outline">Find my orders</Link><Link to="/shop" className="btn btn-primary">Shop now</Link></div>
        </div>
      </section>
    );
  }
  const c = order.customer;
  return (
    <section className="relative overflow-hidden bg-muted">
      <div className="pattern-dots absolute inset-0 opacity-50" aria-hidden />
      <div className="container-x relative max-w-4xl py-12 sm:py-16">
        <div className="card-surface animate-fade-up overflow-hidden">
          <div className="bg-primary px-6 py-10 text-center text-primary-foreground sm:px-10">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lift"><CheckIcon size={34} strokeWidth={2.6} /></span>
            <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">Thank you, {c.name.split(" ")[0]}!</h1>
            <p className="mt-2 text-primary-foreground/85">Your order has been placed successfully.</p>
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl bg-primary-deep px-5 py-3 text-sm">
              <span>Order ID: <b className="font-extrabold tracking-wide text-accent">{order.id}</b></span>
              <span>{formatDate(order.createdAt, true)}</span>
              <span>Status: <b>{ORDER_STATUS_LABELS[order.status]}</b></span>
            </div>
          </div>
          <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="text-lg font-semibold">Items ordered</h2>
              <ul className="mt-3 divide-y divide-border">
                {order.items.map((i) => (
                  <li key={i.productId + i.weight} className="flex items-center gap-3 py-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted"><SmartImage src={i.image} alt={i.name} className="h-full w-full object-cover" /></div>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{i.name}</p><p className="text-xs text-muted-foreground">{i.weight} × {i.qty}</p></div>
                    <p className="text-sm font-extrabold">{inr(i.unitPrice * i.qty)}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-bold">{inr(order.subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Coupon {order.couponCode && `(${order.couponCode})`}</dt><dd className="font-bold text-success">− {inr(order.discount)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className="font-bold">{order.delivery ? inr(order.delivery) : "FREE"}</dd></div>
                <div className="flex justify-between border-t border-border pt-3"><dt className="font-extrabold">Grand Total</dt><dd className="font-display text-2xl font-bold text-primary">{inr(order.total)}</dd></div>
              </dl>
            </div>
            <div className="space-y-5">
              <div className="rounded-2xl bg-muted p-5 text-sm">
                <h2 className="mb-2 text-base font-semibold">Delivering to</h2>
                <p className="font-bold">{c.name}</p>
                <p className="text-muted-foreground">{c.address}</p>
                <p className="text-muted-foreground">{c.city}, {c.state} – {c.pin}</p>
                <p className="mt-2 text-muted-foreground">{c.phone} · {c.email}</p>
              </div>
              <div className="rounded-2xl bg-muted p-5 text-sm">
                <h2 className="mb-1 text-base font-semibold">Payment</h2>
                <p className="font-bold">{PAYMENT_LABELS[order.paymentMethod]}</p>
                <p className="mt-1 text-xs text-muted-foreground">This is a demo order. No real payment has been collected.</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link to="/shop" className="btn btn-primary">Continue Shopping <ArrowRight size={16} /></Link>
                <Link to="/account" className="btn btn-outline">Track in My Account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
