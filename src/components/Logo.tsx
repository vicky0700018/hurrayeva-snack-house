import { useStore } from "@/lib/store";
import { resolveImage } from "@/lib/images";

export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      <circle cx="24" cy="24" r="23" className="fill-primary" />
      <circle cx="24" cy="24" r="20" fill="none" className="stroke-accent" strokeWidth="0.8" strokeDasharray="1.5 2.2" />
      <path d="M14.5 16.5c1.6-1.8 3.2.2 4.8-1.6s3.2.2 4.8-1.6 3.2.2 4.8-1.6 3.2.2 4.6-1.4" fill="none" className="stroke-accent" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18.5" cy="22.5" r="2.6" className="fill-secondary" />
      <circle cx="24" cy="20.2" r="3" className="fill-accent" />
      <circle cx="29.5" cy="22.5" r="2.6" className="fill-secondary" />
      <path d="M11 25.5h26a13 13 0 0 1-26 0Z" className="fill-accent" />
      <path d="M14.5 29.5c3 2.6 6 3.4 9.5 3.4s6.5-.8 9.5-3.4" fill="none" className="stroke-primary" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M10 25.5h28" className="stroke-primary-foreground" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  const { data } = useStore();
  const { logo, brandName } = data.settings;
  if (logo) {
    return <img src={resolveImage(logo)} alt={brandName} className="h-11 w-auto max-w-[180px] object-contain" />;
  }
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={compact ? 38 : 44} />
      <span className="flex flex-col leading-none">
        <span className={"font-display text-[1.35rem] font-bold tracking-tight " + (light ? "text-primary-foreground" : "text-primary")}>
          {brandName}
        </span>
        <span className={"mt-1 text-[0.58rem] font-extrabold tracking-[0.32em] " + (light ? "text-accent" : "text-secondary")}>
          FOOD SOLUTIONS
        </span>
      </span>
    </span>
  );
}
