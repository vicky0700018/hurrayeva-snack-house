import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Logo } from "../Logo";
import { FacebookIcon, InstagramIcon, LinkedinIcon, LockIcon, MailIcon, PhoneIcon, PinIcon, XSocialIcon, YoutubeIcon } from "../icons";

export function Footer() {
  const { data } = useStore();
  const s = data.settings;
  const cats = data.categories.filter((c) => c.active);
  const socials = [
    { href: s.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: s.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: s.social.youtube, label: "YouTube", Icon: YoutubeIcon },
    { href: s.social.twitter, label: "X (Twitter)", Icon: XSocialIcon },
    { href: s.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  ].filter((x) => x.href);
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm leading-relaxed text-ink-foreground/70">{s.footerAbout}</p>
          <div className="flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-foreground/20 transition hover:border-accent hover:bg-accent hover:text-accent-foreground">
                <Icon />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-sans text-sm font-extrabold tracking-[0.15em] text-accent uppercase">Quick Links</h3>
          <ul className="space-y-2.5 text-sm text-ink-foreground/75">
            <li><Link to="/" className="hover:text-accent">Home</Link></li>
            <li><Link to="/shop" className="hover:text-accent">Shop</Link></li>
            <li><Link to="/categories" className="hover:text-accent">Categories</Link></li>
            <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact Us</Link></li>
            <li><Link to="/cart" className="hover:text-accent">My Cart</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-sans text-sm font-extrabold tracking-[0.15em] text-accent uppercase">Shop Categories</h3>
          <ul className="space-y-2.5 text-sm text-ink-foreground/75">
            {cats.slice(0, 8).map((c) => (
              <li key={c.id}><Link to="/shop" search={{ category: c.slug }} className="hover:text-accent">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-sans text-sm font-extrabold tracking-[0.15em] text-accent uppercase">Get in Touch</h3>
          <ul className="space-y-3 text-sm text-ink-foreground/75">
            <li className="font-bold text-ink-foreground">{s.companyName}</li>
            <li className="flex gap-2.5"><PhoneIcon size={18} className="mt-0.5 shrink-0 text-secondary" /><a href={`tel:${s.phone}`} className="hover:text-accent">{s.phone}</a></li>
            <li className="flex gap-2.5"><MailIcon size={18} className="mt-0.5 shrink-0 text-secondary" /><a href={`mailto:${s.email}`} className="break-all hover:text-accent">{s.email}</a></li>
            <li className="flex gap-2.5"><PinIcon size={18} className="mt-0.5 shrink-0 text-secondary" /><span>{s.address || "Address will be updated soon"}</span></li>
          </ul>
          <Link to="/admin/login" className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/60 px-4 py-2 text-xs font-extrabold tracking-wide text-accent transition hover:bg-accent hover:text-accent-foreground">
            <LockIcon size={14} /> Admin Login
          </Link>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {s.companyName}. All rights reserved. Demo store – no real payments are processed.</p>
          <p className="font-semibold text-ink-foreground/80">Designed and development by SOSynch Ai Tech</p>
        </div>
      </div>
    </footer>
  );
}
