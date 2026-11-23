export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  ingredients: string;
  highlights: string[];
  weight: string;
  price: number; // selling (discounted) price
  mrp: number; // original price
  images: string[];
  rating: number;
  reviewsCount: number;
  popularity: number;
  stock: StockStatus;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  visible: boolean;
  createdAt: string;
}

export interface CartItem {
  key: string;
  productId: string;
  weight: string;
  unitPrice: number;
  unitMrp: number;
  qty: number;
}

export type PaymentMethod = "cod" | "upi" | "card" | "netbanking";
export type OrderStatus = "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  weight: string;
  unitPrice: number;
  qty: number;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pin: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode: string;
  delivery: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  name: string;
  city: string;
  rating: number;
  comment: string;
  createdAt: string;
  approved: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  expiry: string; // yyyy-mm-dd
  active: boolean;
}

export interface Banner {
  id: string;
  placement: "hero" | "promo";
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  active: boolean;
}

export type EnquiryStatus = "new" | "in_progress" | "resolved";

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: EnquiryStatus;
}

export interface Activity {
  id: string;
  text: string;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface Settings {
  companyName: string;
  brandName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  contactPersons: string[];
  logo: string;
  social: { facebook: string; instagram: string; youtube: string; twitter: string; linkedin: string };
  announcements: string[];
  freeDeliveryThreshold: number;
  deliveryCharge: number;
  footerAbout: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

export interface Content {
  home: {
    categoriesTitle: string;
    categoriesSubtitle: string;
    bestSellersTitle: string;
    bestSellersSubtitle: string;
    featuredTitle: string;
    featuredSubtitle: string;
    whyTitle: string;
    testimonialsTitle: string;
    newsletterTitle: string;
    newsletterText: string;
  };
  why: { title: string; text: string }[];
  about: {
    heroTitle: string;
    intro: string;
    story: string;
    overview: string;
    quality: string;
    mission: string;
    vision: string;
    whyChoose: string[];
  };
}

export interface Collections {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  reviews: Review[];
  coupons: Coupon[];
  banners: Banner[];
  enquiries: Enquiry[];
  activities: Activity[];
  subscribers: Subscriber[];
}

export interface StoreData extends Collections {
  settings: Settings;
  content: Content;
}
