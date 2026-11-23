import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { whatsappLink } from "@/lib/format";
import { ArrowUp, PhoneIcon, WhatsAppIcon } from "../icons";

export function FloatingButtons() {
  const { data } = useStore();
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const base = "group relative flex h-11 w-11 items-center justify-center rounded-full shadow-lift transition duration-300 hover:-translate-y-1 hover:scale-105 sm:h-[3.25rem] sm:w-[3.25rem]";
  const tip = "pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-ink-foreground opacity-0 transition group-hover:opacity-100 sm:block";
  return (
    <div className="fixed right-3 bottom-4 z-40 flex flex-col items-center gap-2.5 sm:right-5 sm:bottom-6 sm:gap-3">
      <a href={whatsappLink(data.settings.whatsapp, `Hi ${data.settings.brandName}, I'd like to know more about your namkeen.`)} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className={base + " bg-whatsapp text-primary-foreground"}>
        <WhatsAppIcon />
        <span className={tip}>Chat on WhatsApp</span>
      </a>
      <a href={`tel:${data.settings.phone}`} aria-label="Call now" className={base + " bg-primary text-primary-foreground"}>
        <PhoneIcon />
        <span className={tip}>Call {data.settings.phone}</span>
      </a>
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={base + " bg-accent text-accent-foreground " + (showTop ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0")}
      >
        <ArrowUp />
        <span className={tip}>Back to top</span>
      </button>
    </div>
  );
}
