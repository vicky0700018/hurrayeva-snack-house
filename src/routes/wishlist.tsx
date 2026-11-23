import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, useVisibleProducts } from "@/lib/store";
import { PageHero } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist | HURRAYECA" },
      { name: "description", content: "Your saved HURRAYECA namkeen favourites." },
      { property: "og:title", content: "My Wishlist | HURRAYECA" },
      { property: "og:description", content: "Your saved snacks." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist } = useStore();
  const list = useVisibleProducts().filter((p) => wishlist.includes(p.id));
  return (
    <>
      <PageHero crumb="Wishlist" title="My Wishlist" />
      <section className="container-x py-12">
        {list.length === 0 ? (
          <div className="card-surface mx-auto max-w-lg p-10 text-center">
            <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">Tap the heart on any product to save it here.</p>
            <Link to="/shop" className="btn btn-primary mt-5">Browse products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        )}
      </section>
    </>
  );
}
