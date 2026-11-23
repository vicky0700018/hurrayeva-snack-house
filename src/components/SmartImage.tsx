import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { resolveImage } from "@/lib/images";
import { LogoMark } from "./Logo";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { src: string | undefined };

/** Image with graceful fallback so a broken source never breaks the layout. */
export function SmartImage({ src, alt = "", className = "", ...rest }: Props) {
  const resolved = resolveImage(src);
  const [failed, setFailed] = useState(!resolved);
  useEffect(() => setFailed(!resolved), [resolved]);
  if (failed) {
    return (
      <div role="img" aria-label={alt} className={"flex items-center justify-center bg-muted pattern-dots " + className}>
        <div className="flex flex-col items-center gap-2 p-4 text-center opacity-70">
          <LogoMark size={36} />
          <span className="text-xs font-semibold text-muted-foreground">{alt || "Image unavailable"}</span>
        </div>
      </div>
    );
  }
  return <img src={resolved} alt={alt} className={className} loading="lazy" decoding="async" onError={() => setFailed(true)} {...rest} />;
}
