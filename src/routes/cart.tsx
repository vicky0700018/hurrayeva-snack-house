import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/format";
import { SmartImage } from "@/components/SmartImage";
import { PageHero } from "@/components/site/SectionHeading";
import { OrderSummary } from "@/components/site/OrderSummary";
import { QtyStepper } from "@/components/site/PurchasePanel";
import { ArrowRight, BagIcon, TrashIcon } from "@/components/icons";
import { useConfirm } from "@/lib/confirm";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | HURRAYECA" },
      { name: "description", content: "Review the namkeen in your HURRAYECA cart and proceed to checkout." },
      { property: "og:title", content: "Your Cart | HURRAYECA" },
      { property: "og:description", content: "Review your snacks and checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, data, setQty, removeFromCart, clearCart, hydrated } = useStore();
  const confirm = useConfirm();
  return (
    <>
      <PageHero crumb="Cart" title="Your Shopping Cart" />
      <section className="container-x py-10 lg:py-14">
        {!hydrated ? (
          <p className="text-muted-foreground">Loading your cart…</p>
        ) : cart.length === 0 ? (
          <div className="card-surface mx-auto flex max-w-lg flex-col items-center gap-4 p-12 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-primary"><BagIcon size={36} /></span>
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground">Looks like you haven't added any snacks yet. Let's fix that!</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="card-surface divide-y divide-border">
                {cart.map((i) => {
                  const p = data.products.find((x) => x.id === i.productId)!;
                  return (
                    <div key={i.key} className="flex gap-4 p-4 sm:p-5">
                      <Link to="/product/$id" params={{ id: p.id }} className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted sm:h-28 sm:w-28">
                        <SmartImage src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <Link to="/product/$id" params={{ id: p.id }} className="font-display text-lg font-semibold hover:text-primary">{p.name}</Link>
                          <p className="text-xs font-semibold text-muted-foreground">Weight: {i.weight}</p>
                          <p className="mt-1 text-sm"><span className="font-extrabold text-primary">{inr(i.unitPrice)}</span>{i.unitMrp > i.unitPrice && <span className="ml-2 text-xs text-muted-foreground line-through">{inr(i.unitMrp)}</span>}</p>
                        </div>
                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <QtyStepper value={i.qty} onChange={(n) => setQty(i.key, n)} />
                          <p className="w-20 text-right font-extrabold">{inr(i.unitPrice * i.qty)}</p>
                          <button type="button" className="action-btn action-delete" aria-label={`Remove ${p.name}`} onClick={() => removeFromCart(i.key)}><TrashIcon size={16} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 flex flex-wrap justify-between gap-3">
                <Link to="/shop" className="btn btn-outline">← Continue Shopping</Link>
                <button
                  type="button"
                  className="btn btn-muted"
                  onClick={async () => {
                    if (await confirm({ title: "Clear your cart?", message: "All items will be removed from your cart.", confirmText: "Clear cart" })) clearCart();
                  }}
                >
                  Clear cart
                </button>
              </div>
            </div>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <OrderSummary>
                <Link to="/checkout" className="btn btn-primary btn-lg w-full">Proceed to Checkout <ArrowRight size={18} /></Link>
              </OrderSummary>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
