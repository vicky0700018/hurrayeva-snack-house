import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { Logo } from "@/components/Logo";
import { adminHead } from "@/components/admin/AdminUI";
import {
  BoxIcon, CloseIcon, DashboardIcon, ExternalIcon, FileIcon, ImageIcon, InboxIcon, LogoutIcon, MenuIcon,
  MessageIcon, ReceiptIcon, SettingsIcon, TagIcon, TicketIcon, UsersIcon,
} from "@/components/icons";

export const Route = createFileRoute("/admin")({
  head: () => adminHead("Admin Panel", "HURRAYECA store administration."),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", Icon: DashboardIcon, exact: true },
  { to: "/admin/products", label: "Products", Icon: BoxIcon, exact: false },
  { to: "/admin/categories", label: "Categories", Icon: TagIcon, exact: false },
  { to: "/admin/orders", label: "Orders", Icon: ReceiptIcon, exact: false },
  { to: "/admin/customers", label: "Customers", Icon: UsersIcon, exact: false },
  { to: "/admin/banners", label: "Banners", Icon: ImageIcon, exact: false },
  { to: "/admin/coupons", label: "Coupons", Icon: TicketIcon, exact: false },
  { to: "/admin/reviews", label: "Reviews", Icon: MessageIcon, exact: false },
  { to: "/admin/content", label: "Website Content", Icon: FileIcon, exact: false },
  { to: "/admin/enquiries", label: "Enquiries", Icon: InboxIcon, exact: false },
  { to: "/admin/settings", label: "Settings", Icon: SettingsIcon, exact: false },
] as const;

function AdminLayout() {
  const { isAdmin, hydrated, logout, data } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname.replace(/\/$/, "") === "/admin/login";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !isAdmin && !isLogin) void navigate({ to: "/admin/login", replace: true });
  }, [hydrated, isAdmin, isLogin, navigate]);
  useEffect(() => setOpen(false), [pathname]);

  if (isLogin) return <Outlet />;
  if (!hydrated || !isAdmin) {
    return <div className="flex min-h-screen items-center justify-center bg-muted text-sm font-semibold text-muted-foreground">Checking admin access…</div>;
  }

  const newEnquiries = data.enquiries.filter((e) => e.status === "new").length;
  const pendingOrders = data.orders.filter((o) => o.status === "pending").length;
  const pendingReviews = data.reviews.filter((r) => !r.approved).length;
  const counts: Record<string, number> = { "/admin/enquiries": newEnquiries, "/admin/orders": pendingOrders, "/admin/reviews": pendingReviews };

  const doLogout = () => {
    logout();
    toast("info", "Logged out", "See you soon!");
    void navigate({ to: "/admin/login" });
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-ink text-ink-foreground">
      <div className="flex items-center justify-between px-5 py-5">
        <Link to="/admin"><Logo light compact /></Link>
        <button type="button" className="icon-btn text-ink-foreground lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)}><CloseIcon /></button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4" aria-label="Admin">
        {NAV.map(({ to, label, Icon, exact }) => (
          <Link key={to} to={to} activeOptions={{ exact }} className="admin-nav-link" activeProps={{ className: "admin-nav-link-active" }}>
            <Icon size={18} /> <span className="flex-1">{label}</span>
            {(counts[to] ?? 0) > 0 && <span className="badge bg-accent text-accent-foreground">{counts[to]}</span>}
          </Link>
        ))}
      </nav>
      <div className="space-y-1 border-t border-ink-foreground/10 p-3">
        <a href="/" target="_blank" rel="noreferrer" className="admin-nav-link"><ExternalIcon size={18} /> View website</a>
        <button type="button" onClick={doLogout} className="admin-nav-link w-full"><LogoutIcon size={18} /> Logout</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/60">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} aria-hidden />
          <aside className="animate-fade-up absolute inset-y-0 left-0 w-72 max-w-[85vw]">{sidebar}</aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <button type="button" className="icon-btn lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><MenuIcon /></button>
            <p className="text-sm font-bold text-muted-foreground">HURRAYECA <span className="text-primary">Admin</span></p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold leading-tight">{data.settings.adminName}</p>
              <p className="text-xs text-muted-foreground">{data.settings.adminEmail}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{data.settings.adminName.charAt(0).toUpperCase() || "A"}</span>
            <button type="button" className="btn btn-muted btn-sm" onClick={doLogout}><LogoutIcon size={15} /> <span className="hidden sm:inline">Logout</span></button>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
