import type { Banner, Category, Content, Coupon, Customer, Enquiry, Order, Product, Review, Settings, StoreData, Activity } from "./types";

const day = 24 * 60 * 60 * 1000;
function daysAgo(n: number, hour = 11): string {
  const d = new Date();
  d.setHours(hour, 15, 0, 0);
  return new Date(d.getTime() - n * day).toISOString();
}

export const CATEGORIES: Category[] = [
  { id: "cat-traditional", name: "Traditional Namkeen", slug: "traditional-namkeen", description: "Time-honoured dal namkeens and farsan with classic Indian spices.", image: "img:cat-traditional", active: true, createdAt: "2026-01-05T10:00:00.000Z" },
  { id: "cat-bhujia", name: "Bhujia & Sev", slug: "bhujia-sev", description: "Fine, crunchy besan strands – from mild aloo bhujia to fiery Ratlami sev.", image: "img:cat-bhujia", active: true, createdAt: "2026-01-05T10:00:00.000Z" },
  { id: "cat-mixture", name: "Mixture", slug: "mixture", description: "Bold, flavour-packed blends of sev, boondi, dals and nuts.", image: "img:cat-mixture", active: true, createdAt: "2026-01-05T10:00:00.000Z" },
  { id: "cat-chivda", name: "Chivda", slug: "chivda", description: "Light and crispy poha chivda tempered with curry leaves and peanuts.", image: "img:cat-chivda", active: true, createdAt: "2026-01-05T10:00:00.000Z" },
  { id: "cat-peanuts", name: "Masala Peanuts", slug: "masala-peanuts", description: "Crunchy coated peanuts with tangy, spicy masala.", image: "img:cat-peanuts", active: true, createdAt: "2026-01-05T10:00:00.000Z" },
  { id: "cat-chips", name: "Chips & Crispy Snacks", slug: "chips-crispy-snacks", description: "Wafer-thin chips and crisps for every craving.", image: "img:cat-chips", active: true, createdAt: "2026-01-05T10:00:00.000Z" },
  { id: "cat-special", name: "Special Snacks", slug: "special-snacks", description: "Regional favourites like bhakarwadi made for tea-time.", image: "img:cat-special", active: true, createdAt: "2026-01-05T10:00:00.000Z" },
  { id: "cat-combo", name: "Combo Packs", slug: "combo-packs", description: "Curated assortments – perfect for gifting and festivals.", image: "img:cat-combo", active: true, createdAt: "2026-01-05T10:00:00.000Z" },
];

type P = Omit<Product, "slug" | "visible" | "createdAt" | "stock"> & Partial<Pick<Product, "stock" | "createdAt">>;
const raw: P[] = [
  { id: "p01", name: "Classic Aloo Bhujia", categoryId: "cat-bhujia", shortDescription: "Thin, crunchy potato and besan bhujia with a gentle spice kick.", description: "Our Classic Aloo Bhujia brings together potato, gram flour and a carefully balanced spice blend for the crunchy, melt-in-the-mouth bite everyone loves. Enjoy it straight from the pack, sprinkle it over poha or chaat, or serve it alongside evening chai.", ingredients: "Gram flour (besan), potato, edible vegetable oil, moth bean flour, salt, red chilli powder, black pepper, dried mint, spices & condiments.", highlights: ["Fine, crunchy texture", "Perfect chai-time companion", "Great topping for chaat & poha", "Resealable pack"], weight: "400g", price: 129, mrp: 149, images: ["img:p-aloo-bhujia", "img:cat-bhujia", "img:hero"], rating: 4.8, reviewsCount: 214, popularity: 98, featured: true, bestSeller: true, isNew: false, createdAt: "2026-02-01T10:00:00.000Z" },
  { id: "p02", name: "Ratlami Sev", categoryId: "cat-bhujia", shortDescription: "Bold, peppery Ratlami-style sev with clove and spice notes.", description: "Inspired by the famous sev of Ratlam, this thick, spicy sev is seasoned with black pepper, clove and red chilli for a warm, lingering heat. A must-have for those who like their namkeen bold.", ingredients: "Gram flour, edible vegetable oil, salt, red chilli, black pepper, clove, ajwain, asafoetida.", highlights: ["Spicy & peppery", "Thick crunchy strands", "Classic Malwa flavour"], weight: "400g", price: 139, mrp: 160, images: ["img:p-ratlami-sev", "img:cat-bhujia", "img:about-spices"], rating: 4.7, reviewsCount: 168, popularity: 90, featured: false, bestSeller: true, isNew: false, createdAt: "2026-02-03T10:00:00.000Z" },
  { id: "p03", name: "Garlic Sev", categoryId: "cat-bhujia", shortDescription: "Crispy sev infused with the aroma of roasted garlic.", description: "A garlic lover's delight – fine besan sev flavoured with garlic and mild spices. Light, crisp and very hard to stop eating.", ingredients: "Gram flour, edible vegetable oil, garlic, salt, red chilli, turmeric, spices.", highlights: ["Aromatic garlic flavour", "Light and crispy", "Mildly spiced"], weight: "250g", price: 89, mrp: 99, images: ["img:p-garlic-sev", "img:cat-bhujia", "img:about-spices"], rating: 4.5, reviewsCount: 76, popularity: 70, featured: false, bestSeller: false, isNew: true, createdAt: "2026-10-20T10:00:00.000Z" },
  { id: "p04", name: "Punjabi Masala Mixture", categoryId: "cat-mixture", shortDescription: "Robust mix of chana, peanuts, sev and dals with tangy Punjabi masala.", description: "A hearty, full-flavoured mixture inspired by Punjabi tastes – roasted chana, peanuts, moong dal and crunchy sev tossed in a tangy, spicy masala. Perfect for parties and get-togethers.", ingredients: "Gram flour, peanuts, chana dal, moong dal, edible vegetable oil, salt, red chilli, dry mango powder, spices.", highlights: ["Tangy & spicy", "Loaded with peanuts & dals", "Party favourite"], weight: "400g", price: 139, mrp: 165, images: ["img:p-punjabi-mixture", "img:cat-mixture", "img:promo-festive"], rating: 4.7, reviewsCount: 189, popularity: 94, featured: true, bestSeller: true, isNew: false, createdAt: "2026-02-10T10:00:00.000Z" },
  { id: "p05", name: "Spicy Khatta Meetha", categoryId: "cat-mixture", shortDescription: "The perfect sweet, sour and spicy balance in every handful.", description: "Our Khatta Meetha brings together sweet boondi, raisins, sev and peanuts with a tangy, spicy finish. A family favourite that pleases every age group.", ingredients: "Gram flour, sugar, peanuts, raisins, edible vegetable oil, salt, citric acid, red chilli, spices.", highlights: ["Sweet, sour & spicy", "With raisins & peanuts", "Loved by kids and adults"], weight: "400g", price: 125, mrp: 145, images: ["img:p-khatta-meetha", "img:cat-mixture", "img:promo-happiness"], rating: 4.6, reviewsCount: 142, popularity: 88, featured: false, bestSeller: true, isNew: false, createdAt: "2026-02-12T10:00:00.000Z" },
  { id: "p06", name: "Cornflakes Mixture", categoryId: "cat-mixture", shortDescription: "Crispy cornflakes with cashews, peanuts, raisins and curry leaves.", description: "A lighter, crunchy mixture made with golden cornflakes, cashews, peanuts and raisins, tempered with curry leaves and a hint of spice.", ingredients: "Corn flakes, peanuts, cashews, raisins, edible vegetable oil, curry leaves, salt, sugar, turmeric, spices.", highlights: ["Light & crunchy", "With cashews & raisins", "Great with tea"], weight: "300g", price: 119, mrp: 140, images: ["img:p-cornflakes-mixture", "img:cat-mixture", "img:cat-chivda"], rating: 4.5, reviewsCount: 64, popularity: 72, featured: true, bestSeller: false, isNew: true, createdAt: "2026-10-28T10:00:00.000Z" },
  { id: "p07", name: "Special Gujarati Chivda", categoryId: "cat-chivda", shortDescription: "Sweet-spicy Gujarati style chivda with fennel, sesame and raisins.", description: "Thick poha flakes roasted with fennel, sesame, peanuts and raisins in the classic Gujarati style – mildly sweet, mildly spicy and wonderfully crunchy.", ingredients: "Flattened rice (poha), peanuts, raisins, sesame, fennel, edible vegetable oil, sugar, salt, turmeric, green chilli.", highlights: ["Gujarati style", "Sweet & mildly spicy", "Roasted, crunchy flakes"], weight: "400g", price: 129, mrp: 150, images: ["img:p-gujarati-chivda", "img:cat-chivda", "img:about-store"], rating: 4.6, reviewsCount: 98, popularity: 80, featured: true, bestSeller: false, isNew: false, createdAt: "2026-03-01T10:00:00.000Z" },
  { id: "p08", name: "Nylon Poha Chivda", categoryId: "cat-chivda", shortDescription: "Feather-light thin poha chivda with chana dal and curry leaves.", description: "Made with thin 'nylon' poha, this chivda is airy, crisp and tempered with peanuts, roasted chana dal, green chilli and curry leaves. A light snack for any time of day.", ingredients: "Thin flattened rice, peanuts, roasted chana dal, edible vegetable oil, curry leaves, green chilli, salt, sugar, turmeric.", highlights: ["Extra light & airy", "Lightly tempered", "Anytime snack"], weight: "250g", price: 95, mrp: 110, images: ["img:p-poha-chivda", "img:cat-chivda", "img:about-packing"], rating: 4.4, reviewsCount: 51, popularity: 66, featured: false, bestSeller: false, isNew: true, createdAt: "2026-11-02T10:00:00.000Z" },
  { id: "p09", name: "Masala Peanuts", categoryId: "cat-peanuts", shortDescription: "Crunchy besan-coated peanuts with a tangy, spicy masala.", description: "Whole peanuts coated in a spiced gram flour batter and fried until perfectly crunchy. Squeeze some lemon and add chopped onion for an instant chakna.", ingredients: "Peanuts, gram flour, rice flour, edible vegetable oil, salt, red chilli, black salt, spices.", highlights: ["Extra crunchy coating", "Tangy & spicy", "Perfect for chakna"], weight: "300g", price: 99, mrp: 120, images: ["img:p-masala-peanuts", "img:cat-peanuts", "img:hero"], rating: 4.7, reviewsCount: 176, popularity: 92, featured: false, bestSeller: true, isNew: false, createdAt: "2026-03-05T10:00:00.000Z" },
  { id: "p10", name: "Crispy Chana Dal", categoryId: "cat-traditional", shortDescription: "Golden fried chana dal with salt and cracked pepper.", description: "Simple and satisfying – split chickpeas fried until golden and crisp, finished with salt and cracked black pepper.", ingredients: "Chana dal, edible vegetable oil, salt, black pepper.", highlights: ["Simple & classic", "Protein-rich lentils", "Lightly salted"], weight: "250g", price: 89, mrp: 105, images: ["img:p-chana-dal", "img:cat-traditional", "img:about-spices"], rating: 4.5, reviewsCount: 83, popularity: 74, featured: false, bestSeller: false, isNew: false, createdAt: "2026-03-10T10:00:00.000Z" },
  { id: "p11", name: "Moong Dal Namkeen", categoryId: "cat-traditional", shortDescription: "Light, crunchy salted moong dal – a timeless classic.", description: "Crunchy yellow moong dal, lightly salted. A light, timeless snack enjoyed across India – on its own or as a topping.", ingredients: "Moong dal, edible vegetable oil, salt.", highlights: ["Light & crunchy", "Lightly salted", "Classic favourite"], weight: "250g", price: 85, mrp: 99, images: ["img:p-moong-dal", "img:cat-traditional", "img:about-store"], rating: 4.6, reviewsCount: 121, popularity: 85, featured: false, bestSeller: true, isNew: false, createdAt: "2026-03-12T10:00:00.000Z" },
  { id: "p12", name: "Traditional Farsan – Bhavnagari Gathiya", categoryId: "cat-traditional", shortDescription: "Soft, thick besan gathiya – a Gujarati farsan staple.", description: "Soft and thick gathiya made from gram flour with ajwain and black pepper. Traditionally enjoyed with fried green chillies and papaya sambharo for breakfast or tea.", ingredients: "Gram flour, edible vegetable oil, salt, ajwain, black pepper, papad khar.", highlights: ["Soft, thick texture", "Gujarati breakfast staple", "Ajwain & pepper flavour"], weight: "400g", price: 149, mrp: 175, images: ["img:p-gathiya", "img:cat-traditional", "img:cat-special"], rating: 4.6, reviewsCount: 88, popularity: 77, featured: true, bestSeller: false, isNew: false, createdAt: "2026-04-01T10:00:00.000Z" },
  { id: "p13", name: "Kerala Banana Chips", categoryId: "cat-chips", shortDescription: "Thin, crisp banana chips in the classic Kerala style.", description: "Thin slices of raw banana fried till golden and crisp, lightly salted the Kerala way. A naturally delicious crunchy snack.", ingredients: "Raw banana, edible vegetable oil, salt, turmeric.", highlights: ["Kerala style", "Thin & crisp", "Lightly salted"], weight: "200g", price: 99, mrp: 120, images: ["img:p-banana-chips", "img:cat-chips", "img:about-packing"], rating: 4.5, reviewsCount: 69, popularity: 75, featured: false, bestSeller: false, isNew: true, createdAt: "2026-10-15T10:00:00.000Z" },
  { id: "p14", name: "Masala Potato Wafers", categoryId: "cat-chips", shortDescription: "Ridged potato wafers with a fiery red masala seasoning.", description: "Crunchy ridged potato wafers tossed in a punchy red chilli masala. Ideal for movie nights and road trips.", ingredients: "Potato, edible vegetable oil, salt, red chilli, dry mango powder, onion powder, spices.", highlights: ["Ridged & extra crunchy", "Fiery masala", "Movie-night favourite"], weight: "150g", price: 69, mrp: 80, stock: "low_stock", images: ["img:p-potato-wafers", "img:cat-chips", "img:promo-festive"], rating: 4.3, reviewsCount: 47, popularity: 68, featured: false, bestSeller: false, isNew: false, createdAt: "2026-04-10T10:00:00.000Z" },
  { id: "p15", name: "Mini Bhakarwadi", categoryId: "cat-special", shortDescription: "Bite-sized spirals with sweet, spicy and tangy masala filling.", description: "Crispy, bite-sized bhakarwadi spirals filled with a fragrant mix of sesame, coconut, spices and tangy tamarind – a beloved tea-time special.", ingredients: "Wheat flour, gram flour, edible vegetable oil, sesame, desiccated coconut, sugar, tamarind, salt, spices.", highlights: ["Sweet, spicy & tangy", "Bite-sized spirals", "Tea-time special"], weight: "250g", price: 119, mrp: 135, images: ["img:p-bhakarwadi", "img:cat-special", "img:about-spices"], rating: 4.7, reviewsCount: 133, popularity: 89, featured: true, bestSeller: true, isNew: false, createdAt: "2026-04-15T10:00:00.000Z" },
  { id: "p16", name: "Premium Snack Combo", categoryId: "cat-combo", shortDescription: "Four favourites in one: bhujia, mixture, chivda and masala peanuts.", description: "Can't decide? Our Premium Snack Combo brings together four best-loved namkeens – Aloo Bhujia, Punjabi Mixture, Gujarati Chivda and Masala Peanuts – in one thoughtful pack. Great for gifting and family snacking.", ingredients: "Contains gram flour, potato, peanuts, flattened rice, dals, edible vegetable oil, salt, sugar and spices.", highlights: ["4 best-sellers in one pack", "Ideal for gifting", "Great value"], weight: "4 x 200g", price: 449, mrp: 560, images: ["img:p-combo", "img:cat-combo", "img:promo-festive"], rating: 4.9, reviewsCount: 97, popularity: 96, featured: true, bestSeller: true, isNew: true, createdAt: "2026-11-05T10:00:00.000Z" },
  { id: "p17", name: "Festive Namkeen Gift Box", categoryId: "cat-combo", shortDescription: "A festive box of six assorted namkeens to share joy.", description: "A beautifully packed festive gift box featuring six assorted namkeens in pouches and jars. A thoughtful gift for Diwali, weddings and celebrations.", ingredients: "Assorted namkeens containing gram flour, potato, peanuts, flattened rice, dals, edible vegetable oil, salt, sugar and spices.", highlights: ["Six assorted namkeens", "Festive gift packaging", "Perfect for celebrations"], weight: "6 x 150g", price: 699, mrp: 850, images: ["img:cat-combo", "img:promo-festive", "img:promo-happiness"], rating: 4.8, reviewsCount: 58, popularity: 84, featured: false, bestSeller: false, isNew: true, createdAt: "2026-11-10T10:00:00.000Z" },
];

export const PRODUCTS: Product[] = raw.map((p) => ({
  ...p,
  slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  stock: p.stock ?? "in_stock",
  visible: true,
  createdAt: p.createdAt ?? "2026-01-10T10:00:00.000Z",
}));

const REVIEWS: Review[] = [
  { id: "r01", productId: "p01", name: "Priya Shah", city: "Mumbai", rating: 5, comment: "The bhujia is so fresh and crunchy! Reminds me of the namkeen we used to get at my nani's place. Already reordered.", createdAt: "2026-11-02T09:00:00.000Z", approved: true },
  { id: "r02", productId: "p04", name: "Arjun Mehta", city: "Pune", rating: 5, comment: "Punjabi mixture is the perfect level of spicy. Finished the whole pack during a cricket match with friends.", createdAt: "2026-10-28T09:00:00.000Z", approved: true },
  { id: "r03", productId: "p16", name: "Neha Kapoor", city: "Ahmedabad", rating: 5, comment: "Gifted the combo to my in-laws for Diwali – everyone loved the variety. Packaging looked premium too.", createdAt: "2026-11-08T09:00:00.000Z", approved: true },
  { id: "r04", productId: "p15", name: "Rohan Desai", city: "Surat", rating: 4, comment: "Bhakarwadi has that perfect sweet-spicy balance. Great with evening chai.", createdAt: "2026-10-22T09:00:00.000Z", approved: true },
  { id: "r05", productId: "p09", name: "Kavita Iyer", city: "Bengaluru", rating: 5, comment: "Masala peanuts are addictive! Super crunchy coating and nice tang.", createdAt: "2026-10-18T09:00:00.000Z", approved: true },
  { id: "r06", productId: "p07", name: "Manish Patel", city: "Vadodara", rating: 4, comment: "Tastes just like homemade Gujarati chivda. Would love a bigger pack size.", createdAt: "2026-10-12T09:00:00.000Z", approved: true },
  { id: "r07", productId: "p02", name: "Sneha Joshi", city: "Indore", rating: 5, comment: "As someone from Indore, I'm picky about Ratlami sev – this one is genuinely good!", createdAt: "2026-10-05T09:00:00.000Z", approved: true },
  { id: "r08", productId: "p05", name: "Amit Verma", city: "Delhi", rating: 4, comment: "Kids love the khatta meetha. Ordering it every month now.", createdAt: "2026-09-29T09:00:00.000Z", approved: true },
  { id: "r09", productId: "p11", name: "Pooja Nair", city: "Thane", rating: 5, comment: "Light, crispy moong dal – perfect with a cup of tea. Very fresh.", createdAt: "2026-09-20T09:00:00.000Z", approved: true },
  { id: "r10", productId: "p13", name: "Vikram Rao", city: "Hyderabad", rating: 4, comment: "Banana chips were thin and crisp. Good quantity for the price.", createdAt: "2026-11-12T09:00:00.000Z", approved: true },
  { id: "r11", productId: "p01", name: "Deepa Kulkarni", city: "Nashik", rating: 4, comment: "Nice taste, delivered quickly. Will try other flavours next.", createdAt: "2026-11-15T09:00:00.000Z", approved: false },
  { id: "r12", productId: "p06", name: "Sahil Khanna", city: "Chandigarh", rating: 5, comment: "Cornflakes mixture with cashews is a winner. Not too oily at all.", createdAt: "2026-11-18T09:00:00.000Z", approved: false },
];

const COUPONS: Coupon[] = [
  { id: "c1", code: "WELCOME10", description: "10% off on your first order", type: "percent", value: 10, minOrder: 299, expiry: "2027-12-31", active: true },
  { id: "c2", code: "SWAD150", description: "Flat ₹150 off on orders above ₹999", type: "flat", value: 150, minOrder: 999, expiry: "2027-06-30", active: true },
  { id: "c3", code: "FESTIVE20", description: "20% off festive orders above ₹1499", type: "percent", value: 20, minOrder: 1499, expiry: "2026-11-01", active: true },
  { id: "c4", code: "CHAI50", description: "Flat ₹50 off on tea-time snacks", type: "flat", value: 50, minOrder: 399, expiry: "2027-03-31", active: false },
];

const BANNERS: Banner[] = [
  { id: "b1", placement: "hero", title: "Har Bite Mein Swad Ka Celebration!", subtitle: "Discover delicious, crunchy and authentic Indian namkeen made for every occasion.", ctaText: "Shop Now", ctaLink: "/shop", image: "img:hero", active: true },
  { id: "b2", placement: "hero", title: "Festive Combos, Packed with Love", subtitle: "Curated namkeen boxes for gifting, celebrations and family get-togethers.", ctaText: "Explore Combos", ctaLink: "/shop?category=combo-packs", image: "img:promo-festive", active: true },
  { id: "b3", placement: "promo", title: "Bring Home The Taste of Happiness", subtitle: "From chai-time bhujia to festive mixtures – crunchy, flavourful snacks the whole family will love.", ctaText: "Shop Now", ctaLink: "/shop", image: "img:promo-happiness", active: true },
  { id: "b4", placement: "promo", title: "Gift a Box of Swad", subtitle: "Combo packs and gift boxes for every celebration.", ctaText: "View Combo Packs", ctaLink: "/shop?category=combo-packs", image: "img:cat-combo", active: true },
];

function makeOrders(): Order[] {
  const list: Array<[string, number, Order["customer"], Array<[string, number]>, Order["paymentMethod"], Order["status"], string]> = [
    ["HFS-24816", 0, { name: "Priya Shah", phone: "9820012345", email: "priya.shah@example.com", address: "12 Shanti Kunj, Linking Road", city: "Mumbai", state: "Maharashtra", pin: "400050" }, [["p01", 2], ["p04", 1]], "upi", "pending", ""],
    ["HFS-24809", 1, { name: "Arjun Mehta", phone: "9876543210", email: "arjun.mehta@example.com", address: "B-204, Green Park Society, Baner", city: "Pune", state: "Maharashtra", pin: "411045" }, [["p16", 1]], "card", "confirmed", ""],
    ["HFS-24795", 2, { name: "Neha Kapoor", phone: "9898123456", email: "neha.k@example.com", address: "45 Satellite Road", city: "Ahmedabad", state: "Gujarat", pin: "380015" }, [["p17", 2], ["p15", 2]], "netbanking", "packed", "SWAD150"],
    ["HFS-24781", 3, { name: "Kavita Iyer", phone: "9845098450", email: "kavita.iyer@example.com", address: "88 4th Cross, Indiranagar", city: "Bengaluru", state: "Karnataka", pin: "560038" }, [["p09", 3], ["p13", 1]], "cod", "shipped", ""],
    ["HFS-24760", 5, { name: "Rohan Desai", phone: "9825011223", email: "rohan.desai@example.com", address: "301 Ghod Dod Road", city: "Surat", state: "Gujarat", pin: "395007" }, [["p02", 2], ["p05", 2], ["p11", 1]], "upi", "delivered", "WELCOME10"],
    ["HFS-24742", 7, { name: "Amit Verma", phone: "9811122233", email: "amit.verma@example.com", address: "C-12 Lajpat Nagar II", city: "Delhi", state: "Delhi", pin: "110024" }, [["p05", 3]], "cod", "delivered", ""],
    ["HFS-24728", 9, { name: "Priya Shah", phone: "9820012345", email: "priya.shah@example.com", address: "12 Shanti Kunj, Linking Road", city: "Mumbai", state: "Maharashtra", pin: "400050" }, [["p07", 1], ["p08", 2]], "upi", "delivered", ""],
    ["HFS-24710", 12, { name: "Pooja Nair", phone: "9833344455", email: "pooja.nair@example.com", address: "7 Hiranandani Estate", city: "Thane", state: "Maharashtra", pin: "400607" }, [["p12", 1], ["p10", 2]], "card", "cancelled", ""],
  ];
  return list.map(([id, ago, customer, items, paymentMethod, status, couponCode]) => {
    const orderItems = items.map(([pid, qty]) => {
      const p = PRODUCTS.find((x) => x.id === pid)!;
      return { productId: pid, name: p.name, image: p.images[0] ?? "", weight: p.weight, unitPrice: p.price, qty };
    });
    const subtotal = orderItems.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const coupon = COUPONS.find((c) => c.code === couponCode);
    const discount = coupon ? Math.round(coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value) : 0;
    const delivery = subtotal >= 499 ? 0 : 49;
    return { id, createdAt: daysAgo(ago, 10 + (ago % 8)), customer, items: orderItems, subtotal, discount, couponCode, delivery, total: subtotal - discount + delivery, paymentMethod, status };
  });
}

function customersFromOrders(orders: Order[]): Customer[] {
  const map = new Map<string, Customer>();
  [...orders].reverse().forEach((o) => {
    if (!map.has(o.customer.phone)) {
      map.set(o.customer.phone, { id: "cu-" + o.customer.phone, name: o.customer.name, email: o.customer.email, phone: o.customer.phone, city: o.customer.city, createdAt: o.createdAt });
    }
  });
  return [...map.values()];
}

const ENQUIRIES = (): Enquiry[] => [
  { id: "e1", name: "Sanjay Gupta", email: "sanjay.gupta@example.com", phone: "9822233344", subject: "Bulk order for office Diwali gifting", message: "Hello, we would like to order around 150 combo boxes for our office Diwali celebration. Please share bulk pricing and delivery timelines.", createdAt: daysAgo(1, 15), status: "new" },
  { id: "e2", name: "Meera Reddy", email: "meera.reddy@example.com", phone: "9848012345", subject: "Retail partnership enquiry", message: "I run a grocery store in Hyderabad and would like to stock your namkeen range. Could you share distributor details?", createdAt: daysAgo(3, 12), status: "in_progress" },
  { id: "e3", name: "Farhan Ali", email: "farhan.ali@example.com", phone: "9819098190", subject: "Ingredients query", message: "Do your chivda products contain any added preservatives? My mother is diet-conscious.", createdAt: daysAgo(6, 18), status: "resolved" },
];

const ACTIVITIES = (): Activity[] => [
  { id: "a1", text: "New order HFS-24816 placed by Priya Shah", createdAt: daysAgo(0, 10) },
  { id: "a2", text: "New enquiry from Sanjay Gupta", createdAt: daysAgo(1, 15) },
  { id: "a3", text: "Order HFS-24795 marked as Packed", createdAt: daysAgo(1, 17) },
  { id: "a4", text: "Product “Festive Namkeen Gift Box” added", createdAt: daysAgo(2, 12) },
  { id: "a5", text: "Coupon SWAD150 updated", createdAt: daysAgo(4, 9) },
];

export const DEFAULT_SETTINGS: Settings = {
  companyName: "HURRAYECA FOOD SOLUTIONS LLP",
  brandName: "HURRAYECA",
  tagline: "Har Bite Mein Swad",
  phone: "3543581426",
  whatsapp: "3543581426",
  email: "hurrayecafood@support.com",
  address: "",
  contactPersons: ["Rahul Sandeep Dedhia", "Vaishali Kiran Dedhia"],
  logo: "",
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
    twitter: "https://x.com/",
    linkedin: "https://www.linkedin.com/",
  },
  announcements: [
    "Free delivery on orders above ₹499 (demo offer)",
    "Use code WELCOME10 for 10% off your first order",
    "Festive combo packs are live – limited time only",
  ],
  freeDeliveryThreshold: 499,
  deliveryCharge: 49,
  footerAbout: "HURRAYECA FOOD SOLUTIONS LLP brings you a delicious range of authentic Indian namkeen and snacks – crunchy, flavourful and perfect for every occasion.",
  adminName: "Store Admin",
  adminEmail: "admin@hurrayeca.com",
  adminPassword: "Admin@123",
};

export const DEFAULT_CONTENT: Content = {
  home: {
    categoriesTitle: "Shop by Categories",
    categoriesSubtitle: "From fine bhujia to festive combos – find your favourite crunch.",
    bestSellersTitle: "Our Best Sellers",
    bestSellersSubtitle: "The namkeens our customers keep coming back for.",
    featuredTitle: "Featured Collections",
    featuredSubtitle: "New arrivals, popular picks and special snack collections.",
    whyTitle: "Why Choose HURRAYECA",
    testimonialsTitle: "What Our Customers Say",
    newsletterTitle: "Join the Swad Club",
    newsletterText: "Get new launches, festive offers and snack ideas straight to your inbox.",
  },
  why: [
    { title: "Delicious Indian Snacks", text: "Authentic flavours inspired by regional recipes from across India." },
    { title: "Quality-Focused Products", text: "Carefully selected ingredients and hygienic, sealed packaging." },
    { title: "Variety of Namkeen", text: "Bhujia, sev, mixtures, chivda, chips, combos and more in one place." },
    { title: "Convenient Shopping", text: "Easy browsing, quick checkout and doorstep delivery." },
    { title: "Great Taste for Every Occasion", text: "From chai-time cravings to festive gifting – we have you covered." },
  ],
  about: {
    heroTitle: "Bringing the Joy of Namkeen to Every Home",
    intro: "HURRAYECA FOOD SOLUTIONS LLP is a retail business dedicated to all types of namkeen and Indian snacks. We bring together a wide variety of crunchy, flavourful snacks so families can enjoy their favourite tastes, any time.",
    story: "HURRAYECA was started with a simple idea – that great namkeen brings people together. Whether it's a cup of evening chai, a festival get-together or a long road trip, snacks are a part of every Indian celebration. We set out to make a trusted range of these much-loved snacks easy to discover and order.",
    overview: "We specialise in the retail of namkeen – traditional dal namkeens, bhujia and sev, mixtures, chivda, masala peanuts, chips and crispy snacks, special regional snacks and curated combo packs for gifting.",
    quality: "We focus on offering products that are fresh, flavourful and carefully packed. We work to keep our range consistent in taste and to store and handle every product with care.",
    mission: "To make authentic, delicious Indian namkeen easily accessible to every household with a convenient and delightful shopping experience.",
    vision: "To become a trusted, much-loved name for Indian snacks – known for taste, variety and customer care.",
    whyChoose: ["A wide variety of namkeen under one roof", "Focus on freshness and taste", "Carefully packed products", "Friendly customer support", "Thoughtful combo packs for gifting"],
  },
};

export function createSeed(): StoreData {
  const orders = makeOrders();
  return {
    products: PRODUCTS.map((p) => ({ ...p, images: [...p.images], highlights: [...p.highlights] })),
    categories: CATEGORIES.map((c) => ({ ...c })),
    orders,
    customers: customersFromOrders(orders),
    reviews: REVIEWS.map((r) => ({ ...r })),
    coupons: COUPONS.map((c) => ({ ...c })),
    banners: BANNERS.map((b) => ({ ...b })),
    enquiries: ENQUIRIES(),
    activities: ACTIVITIES(),
    subscribers: [],
    settings: { ...DEFAULT_SETTINGS, contactPersons: [...DEFAULT_SETTINGS.contactPersons], social: { ...DEFAULT_SETTINGS.social }, announcements: [...DEFAULT_SETTINGS.announcements] },
    content: JSON.parse(JSON.stringify(DEFAULT_CONTENT)) as typeof DEFAULT_CONTENT,
  };
}
