import { useState } from "react";
import { useStore } from "@/lib/store";
import { EMAIL_RE } from "@/lib/format";
import { CheckIcon, MailIcon } from "../icons";

export function Newsletter() {
  const { data, subscribe } = useStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  return (
    <section className="container-x py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-primary-foreground sm:px-12 sm:py-14">
        <div className="pattern-dots absolute inset-0 opacity-25" aria-hidden />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary/40 blur-3xl" aria-hidden />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-extrabold tracking-[0.2em] text-accent uppercase">Newsletter</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">{data.content.home.newsletterTitle}</h2>
            <p className="mt-3 max-w-md text-primary-foreground/80">{data.content.home.newsletterText}</p>
          </div>
          {done ? (
            <div className="flex items-center gap-3 rounded-2xl bg-card/10 p-5" role="status">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground"><CheckIcon /></span>
              <p className="font-semibold">{done}</p>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                const v = email.trim();
                if (!v) return setError("Please enter your email address");
                if (!EMAIL_RE.test(v)) return setError("Please enter a valid email address");
                const ok = subscribe(v);
                setError("");
                setDone(ok ? "Thank you for subscribing! Delicious updates are on their way." : "You're already subscribed – thanks for being part of the Swad Club!");
                setEmail("");
              }}
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <span className="sr-only">Email address</span>
                  <MailIcon className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-invalid={!!error}
                    className="field rounded-full! py-3.5! pl-11!"
                  />
                </label>
                <button type="submit" className="btn btn-saffron btn-lg">Subscribe</button>
              </div>
              {error && <p className="mt-2 text-sm font-bold text-accent">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
