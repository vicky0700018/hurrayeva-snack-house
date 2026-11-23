import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createSeed, DEFAULT_CONTENT, DEFAULT_SETTINGS } from "./seed";
import { computeTotals, couponError } from "./pricing";
import { uid } from "./format";
import { useToast } from "./toast";
import type { CartItem, Collections, Content, Order, OrderCustomer, PaymentMethod, Product, Review, Settings, StoreData, Enquiry } from "./types";

const DATA_KEY = "hurrayeca:data:v1";
const CART_KEY = "hurrayeca:cart:v1";
const WISH_KEY = "hurrayeca:wishlist:v1";
const COUPON_KEY = "hurrayeca:coupon:v1";
const ADMIN_KEY = "hurrayeca:admin-session:v1";

type CollectionKey = keyof Collections;
type ItemOf<K extends CollectionKey> = Collections[K][number];

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function mergeStored(stored: Partial<StoreData> | null): StoreData {
  const seed = createSeed();
  if (!stored) return seed;
  return {
    ...seed,
    ...stored,
    settings: { ...DEFAULT_SETTINGS, ...(stored.settings ?? {}), social: { ...DEFAULT_SETTINGS.social, ...(stored.settings?.social ?? {}) } },
    content: {
      home: { ...DEFAULT_CONTENT.home, ...(stored.content?.home ?? {}) },
      why: stored.content?.why ?? DEFAULT_CONTENT.why,
      about: { ...DEFAULT_CONTENT.about, ...(stored.content?.about ?? {}) },
    },
  } as StoreData;
}

export interface PlaceOrderInput {
  customer: OrderCustomer;
  paymentMethod: PaymentMethod;
}

interface StoreCtx {
  data: StoreData;
  hydrated: boolean;
  cart: CartItem[];
  wishlist: string[];
  couponCode: string;
  isAdmin: boolean;
  upsert: <K extends CollectionKey>(key: K, item: ItemOf<K>) => void;
  remove: <K extends CollectionKey>(key: K, id: string) => void;
  updateSettings: (s: Partial<Settings>) => void;
  updateContent: (c: Content) => void;
  logActivity: (text: string) => void;
  addToCart: (p: Product, opts?: { weight?: string; price?: number; mrp?: number; qty?: number }) => void;
  setQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  applyCoupon: (code: string) => string | null;
  removeCoupon: () => void;
  placeOrder: (input: PlaceOrderInput) => Order;
  submitEnquiry: (e: Omit<Enquiry, "id" | "createdAt" | "status">) => void;
  submitReview: (r: Omit<Review, "id" | "createdAt" | "approved">) => void;
  subscribe: (email: string) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  resetDemo: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [data, setData] = useState<StoreData>(() => createSeed());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const quotaWarned = useRef(false);

  // Load persisted state after mount (localStorage is browser-only).
  useEffect(() => {
    setData(mergeStored(readJSON<Partial<StoreData>>(DATA_KEY)));
    setCart(readJSON<CartItem[]>(CART_KEY) ?? []);
    setWishlist(readJSON<string[]>(WISH_KEY) ?? []);
    setCouponCode(readJSON<string>(COUPON_KEY) ?? "");
    setIsAdmin(readJSON<boolean>(ADMIN_KEY) === true);
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === DATA_KEY) setData(mergeStored(readJSON<Partial<StoreData>>(DATA_KEY)));
      if (e.key === CART_KEY) setCart(readJSON<CartItem[]>(CART_KEY) ?? []);
      if (e.key === WISH_KEY) setWishlist(readJSON<string[]>(WISH_KEY) ?? []);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback(
    (key: string, value: unknown) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        if (!quotaWarned.current) {
          quotaWarned.current = true;
          toast("error", "Browser storage is full", "Try using smaller images or reset demo data.");
        }
      }
    },
    [toast],
  );

  useEffect(() => { if (hydrated) persist(DATA_KEY, data); }, [data, hydrated, persist]);
  useEffect(() => { if (hydrated) persist(CART_KEY, cart); }, [cart, hydrated, persist]);
  useEffect(() => { if (hydrated) persist(WISH_KEY, wishlist); }, [wishlist, hydrated, persist]);
  useEffect(() => { if (hydrated) persist(COUPON_KEY, couponCode); }, [couponCode, hydrated, persist]);
  useEffect(() => { if (hydrated) persist(ADMIN_KEY, isAdmin); }, [isAdmin, hydrated, persist]);

  const logActivity = useCallback((text: string) => {
    setData((d) => ({ ...d, activities: [{ id: uid("a"), text, createdAt: new Date().toISOString() }, ...d.activities].slice(0, 40) }));
  }, []);

  const upsert = useCallback(<K extends CollectionKey>(key: K, item: ItemOf<K>) => {
    setData((d) => {
      const list = d[key] as Array<{ id: string }>;
      const exists = list.some((x) => x.id === (item as { id: string }).id);
      const next = exists ? list.map((x) => (x.id === (item as { id: string }).id ? item : x)) : [item, ...list];
      return { ...d, [key]: next };
    });
  }, []);

  const remove = useCallback(<K extends CollectionKey>(key: K, id: string) => {
    setData((d) => ({ ...d, [key]: (d[key] as Array<{ id: string }>).filter((x) => x.id !== id) }));
  }, []);

  const updateSettings = useCallback((s: Partial<Settings>) => setData((d) => ({ ...d, settings: { ...d.settings, ...s } })), []);
  const updateContent = useCallback((c: Content) => setData((d) => ({ ...d, content: c })), []);

  const addToCart: StoreCtx["addToCart"] = useCallback(
    (p, opts = {}) => {
      if (p.stock === "out_of_stock") {
        toast("error", "Out of stock", `${p.name} is currently unavailable.`);
        return;
      }
      const weight = opts.weight ?? p.weight;
      const unitPrice = opts.price ?? p.price;
      const unitMrp = opts.mrp ?? p.mrp;
      const qty = opts.qty ?? 1;
      const key = `${p.id}__${weight}`;
      setCart((c) => {
        const found = c.find((i) => i.key === key);
        if (found) return c.map((i) => (i.key === key ? { ...i, qty: Math.min(20, i.qty + qty) } : i));
        return [...c, { key, productId: p.id, weight, unitPrice, unitMrp, qty }];
      });
      toast("success", "Added to cart", `${p.name} (${weight}) × ${qty}`);
    },
    [toast],
  );

  const setQty = useCallback((key: string, qty: number) => {
    setCart((c) => (qty <= 0 ? c.filter((i) => i.key !== key) : c.map((i) => (i.key === key ? { ...i, qty: Math.min(20, qty) } : i))));
  }, []);
  const removeFromCart = useCallback((key: string) => setCart((c) => c.filter((i) => i.key !== key)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (id: string) => {
      const has = wishlist.includes(id);
      setWishlist((w) => (has ? w.filter((x) => x !== id) : [...w.filter((x) => x !== id), id]));
      toast(has ? "info" : "success", has ? "Removed from wishlist" : "Saved to wishlist");
    },
    [toast, wishlist],
  );

  // Cart lines whose product still exists; prices follow live product data for base weights.
  const liveCart = useMemo(
    () =>
      cart
        .map((i) => {
          const p = data.products.find((x) => x.id === i.productId);
          if (!p) return null;
          return i.weight === p.weight ? { ...i, unitPrice: p.price, unitMrp: p.mrp } : i;
        })
        .filter((x): x is CartItem => x !== null),
    [cart, data.products],
  );

  const applyCoupon = useCallback(
    (code: string) => {
      const c = data.coupons.find((x) => x.code.toUpperCase() === code.trim().toUpperCase());
      const subtotal = liveCart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
      const err = couponError(c, subtotal, todayStr());
      if (err) return err;
      setCouponCode(c!.code);
      return null;
    },
    [data.coupons, liveCart],
  );
  const removeCoupon = useCallback(() => setCouponCode(""), []);

  const placeOrder = useCallback(
    (input: PlaceOrderInput): Order => {
      const coupon = data.coupons.find((c) => c.code === couponCode);
      const t = computeTotals(liveCart, { coupon, freeDeliveryThreshold: data.settings.freeDeliveryThreshold, deliveryCharge: data.settings.deliveryCharge, today: todayStr() });
      const order: Order = {
        id: "HFS-" + String(Date.now()).slice(-6),
        createdAt: new Date().toISOString(),
        customer: input.customer,
        items: liveCart.map((i) => {
          const p = data.products.find((x) => x.id === i.productId)!;
          return { productId: i.productId, name: p.name, image: p.images[0] ?? "", weight: i.weight, unitPrice: i.unitPrice, qty: i.qty };
        }),
        subtotal: t.subtotal,
        discount: t.couponDiscount,
        couponCode: t.couponDiscount > 0 ? couponCode : "",
        delivery: t.delivery,
        total: t.total,
        paymentMethod: input.paymentMethod,
        status: "pending",
      };
      setData((d) => {
        const phone = input.customer.phone;
        const existing = d.customers.find((c) => c.phone === phone);
        const customers = existing
          ? d.customers.map((c) => (c.phone === phone ? { ...c, name: input.customer.name, email: input.customer.email, city: input.customer.city } : c))
          : [{ id: uid("cu-"), name: input.customer.name, email: input.customer.email, phone, city: input.customer.city, createdAt: order.createdAt }, ...d.customers];
        return {
          ...d,
          orders: [order, ...d.orders],
          customers,
          activities: [{ id: uid("a"), text: `New order ${order.id} placed by ${input.customer.name}`, createdAt: order.createdAt }, ...d.activities].slice(0, 40),
        };
      });
      setCart([]);
      setCouponCode("");
      return order;
    },
    [couponCode, data.coupons, data.products, data.settings, liveCart],
  );

  const submitEnquiry = useCallback((e: Omit<Enquiry, "id" | "createdAt" | "status">) => {
    const createdAt = new Date().toISOString();
    setData((d) => ({
      ...d,
      enquiries: [{ ...e, id: uid("e"), createdAt, status: "new" }, ...d.enquiries],
      activities: [{ id: uid("a"), text: `New enquiry from ${e.name}`, createdAt }, ...d.activities].slice(0, 40),
    }));
  }, []);

  const submitReview = useCallback((r: Omit<Review, "id" | "createdAt" | "approved">) => {
    const createdAt = new Date().toISOString();
    setData((d) => ({
      ...d,
      reviews: [{ ...r, id: uid("r"), createdAt, approved: false }, ...d.reviews],
      activities: [{ id: uid("a"), text: `New review from ${r.name} awaiting approval`, createdAt }, ...d.activities].slice(0, 40),
    }));
  }, []);

  const subscribe = useCallback(
    (email: string) => {
      if (data.subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) return false;
      setData((d) => ({ ...d, subscribers: [{ id: uid("s"), email, createdAt: new Date().toISOString() }, ...d.subscribers] }));
      return true;
    },
    [data.subscribers],
  );

  const login = useCallback(
    (email: string, password: string) => {
      const ok = email.trim().toLowerCase() === data.settings.adminEmail.toLowerCase() && password === data.settings.adminPassword;
      if (ok) setIsAdmin(true);
      return ok;
    },
    [data.settings.adminEmail, data.settings.adminPassword],
  );
  const logout = useCallback(() => setIsAdmin(false), []);

  const resetDemo = useCallback(() => {
    setData(createSeed());
    setCart([]);
    setWishlist([]);
    setCouponCode("");
  }, []);

  const value: StoreCtx = {
    data,
    hydrated,
    cart: liveCart,
    wishlist,
    couponCode,
    isAdmin,
    upsert,
    remove,
    updateSettings,
    updateContent,
    logActivity,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    applyCoupon,
    removeCoupon,
    placeOrder,
    submitEnquiry,
    submitReview,
    subscribe,
    login,
    logout,
    resetDemo,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used inside StoreProvider");
  return c;
}

export function useTotals() {
  const { cart, data, couponCode } = useStore();
  const coupon = data.coupons.find((c) => c.code === couponCode);
  return computeTotals(cart, {
    coupon,
    freeDeliveryThreshold: data.settings.freeDeliveryThreshold,
    deliveryCharge: data.settings.deliveryCharge,
    today: todayStr(),
  });
}

export function useVisibleProducts() {
  const { data } = useStore();
  return useMemo(() => {
    const activeCats = new Set(data.categories.filter((c) => c.active).map((c) => c.id));
    return data.products.filter((p) => p.visible && activeCats.has(p.categoryId));
  }, [data.products, data.categories]);
}
