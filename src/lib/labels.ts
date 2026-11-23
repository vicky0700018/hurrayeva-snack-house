import type { EnquiryStatus, OrderStatus, PaymentMethod, StockStatus } from "./types";

export type Tone = "success" | "warning" | "danger" | "info" | "muted";

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  upi: "UPI (demo)",
  card: "Credit / Debit Card (demo)",
  netbanking: "Net Banking (demo)",
};

export const ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
export const ORDER_STATUS_TONE: Record<OrderStatus, Tone> = {
  pending: "warning",
  confirmed: "info",
  packed: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
};

export const STOCK_LABELS: Record<StockStatus, string> = { in_stock: "In stock", low_stock: "Low stock", out_of_stock: "Out of stock" };
export const STOCK_TONE: Record<StockStatus, Tone> = { in_stock: "success", low_stock: "warning", out_of_stock: "danger" };

export const ENQUIRY_STATUSES: EnquiryStatus[] = ["new", "in_progress", "resolved"];
export const ENQUIRY_LABELS: Record<EnquiryStatus, string> = { new: "New", in_progress: "In progress", resolved: "Resolved" };
export const ENQUIRY_TONE: Record<EnquiryStatus, Tone> = { new: "warning", in_progress: "info", resolved: "success" };

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];
