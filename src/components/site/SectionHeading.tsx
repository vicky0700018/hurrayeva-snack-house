import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, subtitle, action, center = false }: { eyebrow?: string; title: string; subtitle?: string; action?: ReactNode; center?: boolean }) {
  return (
    <div className={"mb-8 flex flex-col gap-4 sm:mb-10 " + (center ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between")}>
      <div className={center ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-[0.95rem] text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHero({ title, subtitle, crumb }: { title: string; subtitle?: string; crumb: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-muted">
      <div className="pattern-dots absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative py-12 sm:py-16">
        <p className="text-xs font-bold tracking-wide text-muted-foreground">
          Home <span className="mx-1.5 text-secondary">/</span> <span className="text-primary">{crumb}</span>
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  );
}
