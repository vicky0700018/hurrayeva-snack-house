import type { ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";

/** Link for admin-editable URLs: internal paths use client navigation, external open in a new tab. */
export function SmartLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const router = useRouter();
  const external = /^https?:\/\//.test(href);
  const target = href || "/shop";
  return (
    <a
      href={target}
      className={className}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      onClick={(e) => {
        if (external || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        router.history.push(target.startsWith("/") ? target : "/" + target);
      }}
    >
      {children}
    </a>
  );
}
