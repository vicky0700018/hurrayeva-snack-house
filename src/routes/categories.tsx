import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, useVisibleProducts } from "@/lib/store";
import { SmartImage } from "@/components/SmartImage";
import { PageHero } from "@/components/site/SectionHeading";
import { ArrowRight } from "@/components/icons";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Namkeen Categories – Bhujia, Sev, Mixture, Chivda | HURRAYECA" },
      { name: "description", content: "Explore HURRAYECA namkeen categories – traditional namkeen, bhujia & sev, mixture, chivda, masala peanuts, chips, special snacks and combo packs." },
      { property: "og:title", content: "Namkeen Categories | HURRAYECA" },
      { property: "og:description", content: "Find your favourite crunch by category." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data } = useStore();
  const products = useVisibleProducts();
  const cats = data.categories.filter((c) => c.active);
  return (
    <>
      <PageHero crumb="Categories" title="Shop by Category" subtitle="Every kind of crunch, neatly organised. Pick a category to see all its products." />
      <section className="container-x py-12 sm:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c, k) => {
            const items = products.filter((p) => p.categoryId === c.id);
            return (
              <Link key={c.id} to="/shop" search={{ category: c.slug }} className={"group card-surface flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift " + (k === 0 ? "sm:col-span-2 lg:col-span-2" : "")}>
                <div className={"relative overflow-hidden bg-muted " + (k === 0 ? "aspect-[16/9] lg:aspect-[2/1]" : "aspect-[4/3]")}>
                  <SmartImage src={c.image} alt={c.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <span className="badge absolute top-4 left-4 bg-card text-primary">{items.length} products</span>
                </div>
                <div className="flex flex-1 items-end justify-between gap-4 p-5 sm:p-6">
                  <div>
                    <h2 className="text-2xl font-semibold">{c.name}</h2>
                    <p className="mt-1.5 text-sm text-muted-foreground">{c.description}</p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition group-hover:bg-secondary group-hover:text-secondary-foreground">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        {cats.length === 0 && <p className="text-center text-muted-foreground">No categories available right now.</p>}
      </section>
    </>
  );
}
