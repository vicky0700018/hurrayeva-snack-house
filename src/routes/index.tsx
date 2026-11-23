import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, useVisibleProducts } from "@/lib/store";
import { SmartImage } from "@/components/SmartImage";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SmartLink } from "@/components/site/SmartLink";
import { Newsletter } from "@/components/site/Newsletter";
import { Stars } from "@/components/site/Stars";
import { ArrowRight, BagIcon, ChevronLeft, ChevronRight, ClockIcon, GiftIcon, LeafIcon, QuoteIcon, ShieldIcon, SmileIcon, SparkleIcon, TruckIcon } from "@/components/icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HURRAYECA – Har Bite Mein Swad Ka Celebration | Indian Namkeen Online" },
      { name: "description", content: "Discover delicious, crunchy and authentic Indian namkeen – bhujia, sev, mixture, chivda, masala peanuts and combo packs. Shop online with HURRAYECA." },
      { property: "og:title", content: "HURRAYECA – Har Bite Mein Swad Ka Celebration" },
      { property: "og:description", content: "Crunchy, authentic Indian namkeen made for every occasion." },
    ],
  }),
  component: Home,
});

function Hero() {
  const { data } = useStore();
  const slides = data.banners.filter((b) => b.placement === "hero" && b.active);
  const [i, setI] = useState(0);
  const n = slides.length;
  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6500);
    return () => clearInterval(t);
  }, [n]);
  if (n === 0) return null;
  const idx = i % n;
  return (
    <section className="relative isolate h-[min(82vh,720px)] min-h-[520px] overflow-hidden bg-ink" aria-roledescription="carousel" aria-label="Featured offers">
      {slides.map((s, k) => (
        <div key={s.id} className={"absolute inset-0 transition-opacity duration-1000 " + (k === idx ? "opacity-100" : "pointer-events-none opacity-0")} aria-hidden={k !== idx}>
          <SmartImage src={s.image} alt={s.title} className={"h-full w-full object-cover " + (k === idx ? "animate-ken-burns" : "")} loading={k === 0 ? "eager" : "lazy"} />
          <div className="hero-overlay absolute inset-0" />
          <div className="container-x absolute inset-0 flex items-center">
            <div className={"max-w-xl text-primary-foreground " + (k === idx ? "animate-fade-up" : "")}>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-ink/30 px-4 py-1.5 text-xs font-bold tracking-wider text-accent backdrop-blur">
                <SparkleIcon size={14} /> Authentic Indian Namkeen
              </p>
              <h1 className="text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">{s.title}</h1>
              <p className="mt-5 max-w-md text-base text-primary-foreground/85 sm:text-lg">{s.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <SmartLink href={s.ctaLink} className="btn btn-primary btn-lg"><BagIcon size={18} /> {s.ctaText || "Shop Now"}</SmartLink>
                <Link to="/categories" className="btn btn-ghost-light btn-lg">Explore Our Collection</Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      {n > 1 && (
        <div className="container-x absolute inset-x-0 bottom-6 flex items-center justify-between">
          <div className="flex gap-2">
            {slides.map((s, k) => (
              <button key={s.id} type="button" onClick={() => setI(k)} aria-label={`Go to slide ${k + 1}`} className={"h-2 rounded-full transition-all " + (k === idx ? "w-8 bg-accent" : "w-2 bg-primary-foreground/50")} />
            ))}
          </div>
          <div className="hidden gap-2 sm:flex">
            <button type="button" className="icon-btn bg-card/15 text-primary-foreground backdrop-blur hover:bg-card hover:text-foreground" aria-label="Previous slide" onClick={() => setI((x) => (x - 1 + n) % n)}><ChevronLeft /></button>
            <button type="button" className="icon-btn bg-card/15 text-primary-foreground backdrop-blur hover:bg-card hover:text-foreground" aria-label="Next slide" onClick={() => setI((x) => (x + 1) % n)}><ChevronRight /></button>
          </div>
        </div>
      )}
    </section>
  );
}

function TrustStrip() {
  const { data } = useStore();
  const items = [
    { Icon: TruckIcon, title: "Free Delivery*", text: `On orders above ₹${data.settings.freeDeliveryThreshold}` },
    { Icon: ShieldIcon, title: "Carefully Packed", text: "Sealed for freshness" },
    { Icon: ClockIcon, title: "Easy Ordering", text: "Quick, simple checkout" },
    { Icon: SmileIcon, title: "Friendly Support", text: "Call or WhatsApp us" },
  ];
  return (
    <section className="border-b border-border bg-card">
      <div className="container-x grid grid-cols-2 gap-x-4 gap-y-5 py-6 lg:grid-cols-4">
        {items.map(({ Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-primary"><Icon /></span>
            <div>
              <p className="text-sm font-extrabold">{title}</p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  const { data } = useStore();
  const cats = data.categories.filter((c) => c.active);
  const products = useVisibleProducts();
  return (
    <section className="container-x py-16 sm:py-20">
      <SectionHeading eyebrow="Explore" title={data.content.home.categoriesTitle} subtitle={data.content.home.categoriesSubtitle} action={<Link to="/categories" className="btn btn-outline btn-sm">All Categories <ArrowRight size={16} /></Link>} />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {cats.map((c, k) => (
          <Link key={c.id} to="/shop" search={{ category: c.slug }} className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted shadow-soft" style={{ animationDelay: `${k * 60}ms` }}>
            <SmartImage src={c.image} alt={c.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            <div className="image-overlay-bottom absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground sm:p-5">
              <h3 className="text-lg leading-tight font-semibold sm:text-xl">{c.name}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs font-bold text-accent">
                {products.filter((p) => p.categoryId === c.id).length} products <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function BestSellers() {
  const { data } = useStore();
  const products = useVisibleProducts();
  const list = products.filter((p) => p.bestSeller).sort((a, b) => b.popularity - a.popularity).slice(0, 8);
  if (!list.length) return null;
  return (
    <section className="bg-muted/60 py-16 sm:py-20">
      <div className="container-x">
        <SectionHeading eyebrow="Customer favourites" title={data.content.home.bestSellersTitle} subtitle={data.content.home.bestSellersSubtitle} action={<Link to="/shop" className="btn btn-outline btn-sm">View All <ArrowRight size={16} /></Link>} />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

function PromoBanner() {
  const { data } = useStore();
  const promo = data.banners.find((b) => b.placement === "promo" && b.active);
  if (!promo) return null;
  return (
    <section className="container-x py-16 sm:py-20">
      <div className="grid overflow-hidden rounded-[2rem] bg-ink text-ink-foreground shadow-lift lg:grid-cols-2">
        <div className="relative min-h-[280px] lg:min-h-[440px]">
          <SmartImage src={promo.image} alt={promo.title} className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="relative flex flex-col justify-center gap-5 p-8 sm:p-12">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-bl-[5rem] bg-primary/30" aria-hidden />
          <p className="eyebrow text-accent!">Made for sharing</p>
          <h2 className="relative text-3xl leading-tight font-semibold sm:text-5xl">{promo.title}</h2>
          <p className="relative max-w-md text-ink-foreground/75">{promo.subtitle}</p>
          <div className="relative flex flex-wrap gap-3">
            <SmartLink href={promo.ctaLink} className="btn btn-saffron btn-lg">{promo.ctaText || "Shop Now"} <ArrowRight size={18} /></SmartLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function Featured() {
  const { data } = useStore();
  const products = useVisibleProducts();
  const tabs = useMemo(
    () => [
      { key: "new", label: "New Arrivals", list: products.filter((p) => p.isNew) },
      { key: "popular", label: "Popular", list: [...products].sort((a, b) => b.popularity - a.popularity) },
      { key: "special", label: "Special Collections", list: products.filter((p) => p.featured) },
    ],
    [products],
  );
  const [tab, setTab] = useState("new");
  const current = (tabs.find((t) => t.key === tab) ?? tabs[0]!).list.slice(0, 8);
  const second = data.banners.filter((b) => b.placement === "promo" && b.active)[1];
  return (
    <section className="bg-card py-16 sm:py-20">
      <div className="container-x">
        <SectionHeading center eyebrow="Handpicked for you" title={data.content.home.featuredTitle} subtitle={data.content.home.featuredSubtitle} />
        <div className="scrollbar-none -mx-4 mb-8 flex justify-start gap-2 overflow-x-auto px-4 sm:justify-center" role="tablist">
          {tabs.map((t) => (
            <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)} className={"chip shrink-0 px-5! py-2.5! " + (tab === t.key ? "chip-active" : "")}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {current.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {second && (
          <div className="relative mt-12 overflow-hidden rounded-[2rem]">
            <SmartImage src={second.image} alt={second.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="hero-overlay absolute inset-0" />
            <div className="relative flex flex-col items-start gap-4 p-8 text-primary-foreground sm:p-12">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><GiftIcon /></span>
              <h3 className="max-w-md text-3xl font-semibold sm:text-4xl">{second.title}</h3>
              <p className="max-w-md text-primary-foreground/80">{second.subtitle}</p>
              <SmartLink href={second.ctaLink} className="btn btn-light">{second.ctaText || "Shop Now"} <ArrowRight size={16} /></SmartLink>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const WHY_ICONS = [SparkleIcon, ShieldIcon, LeafIcon, BagIcon, GiftIcon];

function WhyChooseUs() {
  const { data } = useStore();
  return (
    <section className="container-x py-16 sm:py-20">
      <SectionHeading center eyebrow="Our promise" title={data.content.home.whyTitle} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {data.content.why.map((w, k) => {
          const Icon = WHY_ICONS[k % WHY_ICONS.length]!;
          return (
            <div key={k} className="card-surface group p-6 text-center transition hover:-translate-y-1 hover:border-secondary hover:shadow-lift">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"><Icon size={24} /></span>
              <h3 className="mt-4 text-lg leading-snug font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Testimonials() {
  const { data } = useStore();
  const reviews = data.reviews.filter((r) => r.approved && r.rating >= 4).slice(0, 6);
  if (!reviews.length) return null;
  return (
    <section className="bg-muted/60 py-16 sm:py-20">
      <div className="container-x">
        <SectionHeading center eyebrow="Reviews" title={data.content.home.testimonialsTitle} subtitle="Demo reviews from our happy snackers." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => {
            const p = data.products.find((x) => x.id === r.productId);
            return (
              <figure key={r.id} className="card-surface relative flex flex-col p-6">
                <QuoteIcon size={36} className="text-secondary/50" />
                <Stars value={r.rating} />
                <blockquote className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-foreground/85">“{r.comment}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">{r.name.charAt(0)}</span>
                  <div>
                    <p className="font-bold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.city}{p ? ` · ${p.name}` : ""}</p>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Categories />
      <BestSellers />
      <PromoBanner />
      <Featured />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </>
  );
}
