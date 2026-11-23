import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { EMAIL_RE, digitsOnly } from "@/lib/format";
import { PageHero } from "@/components/site/SectionHeading";
import { MailIcon, PhoneIcon, PinIcon, UserIcon } from "@/components/icons";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | HURRAYECA FOOD SOLUTIONS LLP" },
      { name: "description", content: "Contact HURRAYECA FOOD SOLUTIONS LLP for orders, bulk and business enquiries. Call 3543581426 or email hurrayecafood@support.com." },
      { property: "og:title", content: "Contact HURRAYECA" },
      { property: "og:description", content: "Orders, bulk and business enquiries." },
    ],
  }),
  component: Contact,
});

const EMPTY = { name: "", email: "", phone: "", subject: "", message: "" };

function Contact() {
  const { data, submitEnquiry } = useStore();
  const toast = useToast();
  const s = data.settings;
  const [f, setF] = useState(EMPTY);
  const [er, setEr] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const field = (k: keyof typeof EMPTY, label: string, type = "text") => (
    <div>
      <label className="label" htmlFor={`c-${k}`}>{label}</label>
      {k === "message" ? (
        <textarea id={`c-${k}`} rows={5} className="field" value={f[k]} aria-invalid={!!er[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
      ) : (
        <input id={`c-${k}`} type={type} className="field" value={f[k]} aria-invalid={!!er[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
      )}
      {er[k] && <p className="field-error">{er[k]}</p>}
    </div>
  );
  const cards = [
    { Icon: UserIcon, title: "Contact persons", lines: s.contactPersons },
    { Icon: PhoneIcon, title: "Phone", lines: [s.phone] },
    { Icon: MailIcon, title: "Email", lines: [s.email] },
    { Icon: PinIcon, title: "Address", lines: [s.address || "Address will be updated soon"] },
  ];
  return (
    <>
      <PageHero crumb="Contact Us" title="We'd love to hear from you" subtitle={s.companyName} />
      <section className="container-x grid gap-8 py-14 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          {cards.map(({ Icon, title, lines }) => (
            <div key={title} className="card-surface flex gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon /></span>
              <div><p className="font-bold">{title}</p>{lines.map((l) => <p key={l} className="text-sm text-muted-foreground">{l}</p>)}</div>
            </div>
          ))}
          <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
            <h2 className="text-xl font-semibold">Business enquiries</h2>
            <p className="mt-2 text-sm text-primary-foreground/80">For bulk orders, corporate gifting or retail partnerships, send us a message and our team will get back to you.</p>
          </div>
        </div>
        <form
          noValidate
          className="card-surface space-y-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            const x: Record<string, string> = {};
            if (f.name.trim().length < 2) x["name"] = "Please enter your full name";
            if (!EMAIL_RE.test(f.email.trim())) x["email"] = "Please enter a valid email";
            if (digitsOnly(f.phone).length !== 10) x["phone"] = "Please enter a 10-digit mobile number";
            if (f.subject.trim().length < 3) x["subject"] = "Please enter a subject";
            if (f.message.trim().length < 10) x["message"] = "Please write at least 10 characters";
            setEr(x);
            if (Object.keys(x).length) return;
            submitEnquiry({ ...f, phone: digitsOnly(f.phone) });
            toast("success", "Message sent", "We'll get back to you soon.");
            setF(EMPTY);
            setSent(true);
          }}
        >
          <h2 className="text-2xl font-semibold">Send us a message</h2>
          {sent && <p className="rounded-xl bg-success/10 p-3 text-sm font-bold text-success" role="status">Thank you! Your message has been received.</p>}
          <div className="grid gap-4 sm:grid-cols-2">{field("name", "Full Name")}{field("email", "Email", "email")}</div>
          <div className="grid gap-4 sm:grid-cols-2">{field("phone", "Mobile Number", "tel")}{field("subject", "Subject")}</div>
          {field("message", "Message")}
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </section>
    </>
  );
}
