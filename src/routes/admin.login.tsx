import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { EMAIL_RE } from "@/lib/format";
import { Logo } from "@/components/Logo";
import { SmartImage } from "@/components/SmartImage";
import { adminHead } from "@/components/admin/AdminUI";
import { EyeIcon, LockIcon } from "@/components/icons";

export const Route = createFileRoute("/admin/login")({
  head: () => adminHead("Admin Login", "Sign in to manage the HURRAYECA store."),
  component: AdminLogin,
});

function AdminLogin() {
  const { login, isAdmin, hydrated } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [er, setEr] = useState<{ email?: string; password?: string; form?: string }>({});

  useEffect(() => {
    if (hydrated && isAdmin) void navigate({ to: "/admin", replace: true });
  }, [hydrated, isAdmin, navigate]);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <SmartImage src="img:hero" alt="Bowls of Indian namkeen" className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative flex h-full flex-col justify-end p-12 text-primary-foreground">
          <p className="eyebrow text-accent">Store admin</p>
          <h2 className="mt-3 max-w-md text-4xl font-semibold leading-tight">Manage products, orders and content in one place.</h2>
        </div>
      </div>
      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-block"><Logo /></Link>
          <h1 className="mt-8 text-3xl font-semibold">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to the HURRAYECA dashboard.</p>
          <form
            noValidate
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const x: typeof er = {};
              if (!EMAIL_RE.test(email.trim())) x.email = "Enter a valid email address";
              if (!password) x.password = "Enter your password";
              if (Object.keys(x).length) return setEr(x);
              if (login(email, password)) {
                setEr({});
                toast("success", "Welcome back!", "You are now signed in.");
                void navigate({ to: "/admin" });
              } else {
                setEr({ form: "Incorrect email or password" });
                toast("error", "Login failed", "Incorrect email or password");
              }
            }}
          >
            {er.form && <p className="rounded-xl bg-destructive/10 p-3 text-sm font-bold text-destructive" role="alert">{er.form}</p>}
            <div>
              <label className="label" htmlFor="al-email">Email</label>
              <input id="al-email" type="email" autoComplete="username" className="field" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!er.email} />
              {er.email && <p className="field-error">{er.email}</p>}
            </div>
            <div>
              <label className="label" htmlFor="al-pass">Password</label>
              <div className="relative">
                <input id="al-pass" type={show ? "text" : "password"} autoComplete="current-password" className="field pr-12!" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!er.password} />
                <button type="button" className="icon-btn absolute top-1/2 right-1 h-9 w-9 -translate-y-1/2" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((v) => !v)}><EyeIcon size={18} /></button>
              </div>
              {er.password && <p className="field-error">{er.password}</p>}
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full"><LockIcon size={18} /> Sign in</button>
          </form>
          <div className="mt-6 rounded-2xl border border-dashed border-secondary bg-secondary/10 p-4 text-sm">
            <p className="font-bold">Default demo credentials</p>
            <p className="mt-1 text-muted-foreground">Email: <b className="text-foreground">admin@hurrayeca.com</b></p>
            <p className="text-muted-foreground">Password: <b className="text-foreground">Admin@123</b></p>
            <button type="button" className="mt-2 text-xs font-bold text-primary hover:underline" onClick={() => { setEmail("admin@hurrayeca.com"); setPassword("Admin@123"); }}>Fill demo credentials</button>
          </div>
          <Link to="/" className="mt-6 inline-block text-sm font-bold text-muted-foreground hover:text-primary">← Back to website</Link>
        </div>
      </div>
    </div>
  );
}
