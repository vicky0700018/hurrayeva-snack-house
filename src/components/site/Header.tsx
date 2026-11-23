import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useStore, useVisibleProducts } from "@/lib/store";
import { inr } from "@/lib/format";
import { Logo } from "../Logo";
import { SmartImage } from "../SmartImage";
import { BagIcon, CloseIcon, HeartIcon, MailIcon, MenuIcon, PhoneIcon, SearchIcon, UserIcon } from "../icons";

const NAV = [
  { to: "/", label: "Home", exact: true },
  { to: "/shop", label: "Shop", exact: false },
  { to: "/categories", label: "Categories", exact: false },
  { to: "/about", label: "About Us", exact: false },
  { to: "/contact", label: "Contact Us", exact: false },
] as const;

function AnnouncementBar() {
  const { data } = useStore();
  const msgs = data.settings.announcements.filter(Boolean);
  const row = msgs.length ? msgs : ["Welcome to " + data.settings.brandName];
  return (
    <div className="bg-primary-deep text-primary-foreground">
      <div className="container-x flex h-9 items-center justify-between gap-6 text-xs font-semibold">
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
            {[...row, ...row].map((m, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="text-accent" aria-hidden>✦</span> {m}
              </span>
            ))}
          </div>
        </div>
        <div className="hidden shrink-0 items-center gap-5 md:flex">
          <a href={`tel:${data.settings.phone}`} className="flex items-center gap-1.5 hover:text-accent"><PhoneIcon size={14} /> {data.settings.phone}</a>
          <a href={`mailto:${data.settings.email}`} className="flex items-center gap-1.5 hover:text-accent"><MailIcon size={14} /> {data.settings.email}</a>
        </div>
      </div>
    </div>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const products = useVisibleProducts();
  const navigate = useNavigate();
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return products.filter((p) => p.bestSeller).slice(0, 4);
    return products.filter((p) => (p.name + " " + p.shortDescription).toLowerCase().includes(t)).slice(0, 6);
  }, [q, products]);
  return (
    <div className="fixed inset-0 z-[70] bg-ink/60 backdrop-blur-sm" onClick={onClose}>
      <div className="animate-fade-up bg-card shadow-lift" onClick={(e) => e.stopPropagation()}>
        <div className="container-x py-6">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              onClose();
              void navigate({ to: "/shop", search: q.trim() ? { q: q.trim() } : {} });
            }}
            className="flex items-center gap-3"
          >
            <SearchIcon className="text-muted-foreground" />
            <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bhujia, mixture, chivda…" aria-label="Search products" className="flex-1 bg-transparent py-3 font-display text-xl outline-none sm:text-2xl" />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
            <button type="button" className="icon-btn" aria-label="Close search" onClick={onClose}><CloseIcon /></button>
          </form>
          <p className="mt-4 mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">{q.trim() ? `${results.length} result(s)` : "Popular right now"}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <Link key={p.id} to="/product/$id" params={{ id: p.id }} onClick={onClose} className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-muted">
                <SmartImage src={p.images[0]} alt={p.name} className="h-14 w-14 rounded-xl object-cover" />
                <div className="min-w-0">
                  <p className="truncate font-bold">{p.name}</p>
                  <p className="text-sm font-bold text-primary">{inr(p.price)} <span className="font-medium text-muted-foreground">· {p.weight}</span></p>
                </div>
              </Link>
            ))}
            {results.length === 0 && <p className="text-sm text-muted-foreground">No products match “{q}”. Try another word.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { cart, wishlist } = useStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <AnnouncementBar />
      <header className={"sticky top-0 z-50 border-b transition-all duration-300 " + (scrolled ? "border-border bg-card/95 shadow-soft backdrop-blur-md" : "border-transparent bg-background")}>
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button type="button" className="icon-btn lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><MenuIcon /></button>
            <Link to="/" aria-label="HURRAYECA home"><Logo compact /></Link>
          </div>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="nav-link" activeProps={{ className: "nav-link-active" }} activeOptions={{ exact: n.exact, includeSearch: false }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button type="button" className="icon-btn" aria-label="Search" onClick={() => setSearch(true)}><SearchIcon /></button>
            <Link to="/account" className="icon-btn hidden sm:inline-flex" aria-label="My account" activeProps={{ className: "text-primary" }}><UserIcon /></Link>
            <Link to="/wishlist" className="icon-btn" aria-label={`Wishlist, ${wishlist.length} items`} activeProps={{ className: "text-primary" }}>
              <HeartIcon />
              {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full bg-secondary px-1 text-[0.65rem] font-extrabold text-secondary-foreground">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="icon-btn" aria-label={`Cart, ${count} items`} activeProps={{ className: "text-primary" }}>
              <BagIcon />
              {count > 0 && <span className="absolute -top-0.5 -right-0.5 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-extrabold text-primary-foreground">{count}</span>}
            </Link>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}>
          <aside className="animate-fade-up flex h-full w-[82%] max-w-xs flex-col bg-card shadow-lift" onClick={(e) => e.stopPropagation()} aria-label="Mobile menu">
            <div className="flex items-center justify-between border-b border-border p-4">
              <Logo compact />
              <button type="button" className="icon-btn" aria-label="Close menu" onClick={() => setOpen(false)}><CloseIcon /></button>
            </div>
            <nav className="flex flex-col p-3" aria-label="Mobile">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} className="rounded-xl px-4 py-3 font-bold transition hover:bg-muted" activeProps={{ className: "bg-primary/10 text-primary" }} activeOptions={{ exact: n.exact, includeSearch: false }}>
                  {n.label}
                </Link>
              ))}
              <div className="my-2 border-t border-border" />
              <Link to="/account" className="rounded-xl px-4 py-3 font-bold hover:bg-muted" activeProps={{ className: "bg-primary/10 text-primary" }}>My Account</Link>
              <Link to="/wishlist" className="rounded-xl px-4 py-3 font-bold hover:bg-muted" activeProps={{ className: "bg-primary/10 text-primary" }}>Wishlist ({wishlist.length})</Link>
              <Link to="/cart" className="rounded-xl px-4 py-3 font-bold hover:bg-muted" activeProps={{ className: "bg-primary/10 text-primary" }}>Cart ({count})</Link>
            </nav>
          </aside>
        </div>
      )}
      {search && <SearchOverlay onClose={() => setSearch(false)} />}
    </>
  );
}
