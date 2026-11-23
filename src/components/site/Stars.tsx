import { StarIcon } from "../icons";

export function Stars({ value, size = 14, showValue = false, count }: { value: number; size?: number; showValue?: boolean; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <span className="relative inline-flex">
        <span className="flex text-border">
          {[0, 1, 2, 3, 4].map((i) => <StarIcon key={i} size={size} />)}
        </span>
        <span className="absolute inset-0 flex overflow-hidden text-accent" style={{ width: `${(value / 5) * 100}%` }}>
          {[0, 1, 2, 3, 4].map((i) => <StarIcon key={i} size={size} className="shrink-0" />)}
        </span>
      </span>
      {showValue && <span className="text-xs font-bold text-foreground">{value.toFixed(1)}</span>}
      {count !== undefined && <span className="text-xs text-muted-foreground">({count})</span>}
    </span>
  );
}
