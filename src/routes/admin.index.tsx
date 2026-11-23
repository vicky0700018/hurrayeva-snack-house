import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { formatDate, inr } from "@/lib/format";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from "@/lib/labels";
import { AdminPageHeader, StatusPill, TableCard, adminHead } from "@/components/admin/AdminUI";
import { ArrowRight, BoxIcon, ClockIcon, ReceiptIcon, RupeeIcon, TagIcon } from "@/components/icons";

export const Route = createFileRoute("/admin/")({
  head: () => adminHead("Dashboard", "Overview of products, orders, revenue and recent activity."),
  component: Dashboard,
});

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function Dashboard() {
  const { data } = useStore();
  const live = data.orders.filter((o) => o.status !== "cancelled");
  const revenue = live.reduce((s, o) => s + o.total, 0);

  const days = useMemo(() => {
    const out: Array<{ label: string; value: number; orders: number }> = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const k = dayKey(d);
      const os = live.filter((o) => dayKey(new Date(o.createdAt)) === k);
      out.push({ label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), value: os.reduce((s, o) => s + o.total, 0), orders: os.length });
    }
    return out;
  }, [live]);
  const max = Math.max(1, ...days.map((d) => d.value));
  const twoWeek = days.reduce((s, d) => s + d.value, 0);

  const stats = [
    { label: "Total Products", value: data.products.length, Icon: BoxIcon, to: "/admin/products" as const },
    { label: "Total Categories", value: data.categories.length, Icon: TagIcon, to: "/admin/categories" as const },
    { label: "Total Orders", value: data.orders.length, Icon: ReceiptIcon, to: "/admin/orders" as const },
    { label: "Total Revenue (demo)", value: inr(revenue), Icon: RupeeIcon, to: "/admin/orders" as const },
  ];

  const W = 640, H = 220, pad = 28, bw = (W - pad * 2) / days.length;

  return (
    <div className="space-y-6">
      <AdminPageHeader title={`Welcome back, ${data.settings.adminName}`} subtitle="Here's what's happening in your store." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, Icon, to }) => (
          <Link key={label} to={to} className="card-surface group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"><Icon /></span>
            <div><p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">{label}</p><p className="font-display text-2xl font-bold">{value}</p></div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="card-surface p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div><h2 className="text-lg font-semibold">Sales Overview</h2><p className="text-xs text-muted-foreground">Last 14 days · demo data</p></div>
            <p className="font-display text-2xl font-bold text-primary">{inr(twoWeek)}</p>
          </div>
          <svg viewBox={`0 0 ${W} ${H + 24}`} className="mt-4 w-full" role="img" aria-label="Sales for the last 14 days">
            {[0, 0.25, 0.5, 0.75, 1].map((t) => (
              <line key={t} x1={pad} x2={W - pad} y1={pad + (H - pad * 2) * (1 - t)} y2={pad + (H - pad * 2) * (1 - t)} className="stroke-border" strokeDasharray="3 4" />
            ))}
            {days.map((d, i) => {
              const h = ((H - pad * 2) * d.value) / max;
              const x = pad + i * bw + bw * 0.18;
              return (
                <g key={d.label}>
                  <rect x={x} y={H - pad - h} width={bw * 0.64} height={Math.max(h, 2)} rx={5} className={d.value ? "fill-primary" : "fill-muted"}>
                    <title>{`${d.label}: ${inr(d.value)} (${d.orders} orders)`}</title>
                  </rect>
                  {i % 2 === 1 && <text x={x + bw * 0.32} y={H - pad + 18} textAnchor="middle" className="fill-muted-foreground text-[10px] font-semibold">{d.label}</text>}
                </g>
              );
            })}
          </svg>
        </div>
        <div className="card-surface p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Orders by status</h2>
          <ul className="mt-4 space-y-3">
            {ORDER_STATUSES.map((s) => {
              const n = data.orders.filter((o) => o.status === s).length;
              return (
                <li key={s}>
                  <div className="flex justify-between text-sm"><span className="font-semibold">{ORDER_STATUS_LABELS[s]}</span><span className="font-bold">{n}</span></div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted"><div className={"h-full rounded-full " + (s === "cancelled" ? "bg-destructive" : s === "delivered" ? "bg-success" : "bg-secondary")} style={{ width: `${data.orders.length ? (n / data.orders.length) * 100 : 0}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Recent Orders</h2><Link to="/admin/orders" className="flex items-center gap-1 text-sm font-bold text-primary">View all <ArrowRight size={14} /></Link></div>
          <TableCard>
            <table className="table-base">
              <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {data.orders.slice(0, 6).map((o) => (
                  <tr key={o.id}>
                    <td className="font-bold">{o.id}</td>
                    <td>{o.customer.name}</td>
                    <td className="whitespace-nowrap text-muted-foreground">{formatDate(o.createdAt)}</td>
                    <td className="font-bold">{inr(o.total)}</td>
                    <td><StatusPill tone={ORDER_STATUS_TONE[o.status]}>{ORDER_STATUS_LABELS[o.status]}</StatusPill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold">Recent Activities</h2>
          <div className="card-surface divide-y divide-border">
            {data.activities.length === 0 && <p className="p-5 text-sm text-muted-foreground">No activity yet.</p>}
            {data.activities.slice(0, 8).map((a) => (
              <div key={a.id} className="flex gap-3 p-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-primary"><ClockIcon size={15} /></span>
                <div><p className="text-sm font-semibold">{a.text}</p><p className="text-xs text-muted-foreground">{formatDate(a.createdAt, true)}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
