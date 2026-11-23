import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { digitsOnly, formatDate, inr } from "@/lib/format";
import { PageHero } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account – Track Orders | HURRAYECA" },
      { name: "description", content: "Look up your HURRAYECA demo orders using your mobile number." },
      { property: "og:title", content: "My Account | HURRAYECA" },
      { property: "og:description", content: "Track your orders." },
    ],
  }),
  component: Account,
});

function Account() {
  const { data } = useStore();
  const [phone, setPhone] = useState("");
  const [query, setQuery] = useState("");
  const orders = query ? data.orders.filter((o) => o.customer.phone === query) : [];
  return (
    <>
      <PageHero crumb="My Account" title="My Account" subtitle="Enter the mobile number used at checkout to see your orders." />
      <section className="container-x max-w-3xl py-12">
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setQuery(digitsOnly(phone)); }}>
          <input className="field" placeholder="10-digit mobile number" aria-label="Mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button type="submit" className="btn btn-primary">Find orders</button>
        </form>
        <div className="mt-6 space-y-3">
          {query && orders.length === 0 && <p className="text-muted-foreground">No orders found for this number.</p>}
          {orders.map((o) => (
            <Link key={o.id} to="/order-confirmation/$id" params={{ id: o.id }} className="card-surface flex items-center justify-between p-4 hover:shadow-lift">
              <div><p className="font-bold">{o.id}</p><p className="text-xs text-muted-foreground">{formatDate(o.createdAt)} · {o.items.length} items</p></div>
              <div className="text-right"><p className="font-extrabold text-primary">{inr(o.total)}</p><p className="text-xs font-bold capitalize">{o.status}</p></div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
