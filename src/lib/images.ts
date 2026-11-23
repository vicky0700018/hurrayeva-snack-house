import hero from "@/assets/hero.webp";
import catTraditional from "@/assets/cat-traditional.webp";
import catBhujia from "@/assets/cat-bhujia.webp";
import catMixture from "@/assets/cat-mixture.webp";
import catChivda from "@/assets/cat-chivda.webp";
import catPeanuts from "@/assets/cat-peanuts.webp";
import catChips from "@/assets/cat-chips.webp";
import catSpecial from "@/assets/cat-special.webp";
import catCombo from "@/assets/cat-combo.webp";
import promoHappiness from "@/assets/promo-happiness.webp";
import promoFestive from "@/assets/promo-festive.webp";
import aboutSpices from "@/assets/about-spices.webp";
import aboutStore from "@/assets/about-store.webp";
import aboutPacking from "@/assets/about-packing.webp";
import pAlooBhujia from "@/assets/p-aloo-bhujia.webp";
import pRatlamiSev from "@/assets/p-ratlami-sev.webp";
import pGarlicSev from "@/assets/p-garlic-sev.webp";
import pPunjabiMixture from "@/assets/p-punjabi-mixture.webp";
import pKhattaMeetha from "@/assets/p-khatta-meetha.webp";
import pCornflakesMixture from "@/assets/p-cornflakes-mixture.webp";
import pGujaratiChivda from "@/assets/p-gujarati-chivda.webp";
import pPohaChivda from "@/assets/p-poha-chivda.webp";
import pMasalaPeanuts from "@/assets/p-masala-peanuts.webp";
import pChanaDal from "@/assets/p-chana-dal.webp";
import pMoongDal from "@/assets/p-moong-dal.webp";
import pGathiya from "@/assets/p-gathiya.webp";
import pBananaChips from "@/assets/p-banana-chips.webp";
import pPotatoWafers from "@/assets/p-potato-wafers.webp";
import pBhakarwadi from "@/assets/p-bhakarwadi.webp";
import pCombo from "@/assets/p-combo.webp";

/**
 * Built-in images are stored in data as stable keys ("img:<name>") so that saved
 * localStorage data keeps working across rebuilds. Uploaded images are data URLs.
 */
export const IMAGE_LIBRARY: Record<string, { src: string; label: string }> = {
  "img:hero": { src: hero, label: "Hero – namkeen bowls" },
  "img:cat-traditional": { src: catTraditional, label: "Traditional namkeen" },
  "img:cat-bhujia": { src: catBhujia, label: "Bhujia & sev" },
  "img:cat-mixture": { src: catMixture, label: "Mixture" },
  "img:cat-chivda": { src: catChivda, label: "Chivda" },
  "img:cat-peanuts": { src: catPeanuts, label: "Masala peanuts" },
  "img:cat-chips": { src: catChips, label: "Chips & wafers" },
  "img:cat-special": { src: catSpecial, label: "Special snacks" },
  "img:cat-combo": { src: catCombo, label: "Combo gift box" },
  "img:promo-happiness": { src: promoHappiness, label: "Family snack time" },
  "img:promo-festive": { src: promoFestive, label: "Festive jars" },
  "img:about-spices": { src: aboutSpices, label: "Spices" },
  "img:about-store": { src: aboutStore, label: "Snack shelf" },
  "img:about-packing": { src: aboutPacking, label: "Packing" },
  "img:p-aloo-bhujia": { src: pAlooBhujia, label: "Aloo bhujia" },
  "img:p-ratlami-sev": { src: pRatlamiSev, label: "Ratlami sev" },
  "img:p-garlic-sev": { src: pGarlicSev, label: "Garlic sev" },
  "img:p-punjabi-mixture": { src: pPunjabiMixture, label: "Punjabi mixture" },
  "img:p-khatta-meetha": { src: pKhattaMeetha, label: "Khatta meetha" },
  "img:p-cornflakes-mixture": { src: pCornflakesMixture, label: "Cornflakes mixture" },
  "img:p-gujarati-chivda": { src: pGujaratiChivda, label: "Gujarati chivda" },
  "img:p-poha-chivda": { src: pPohaChivda, label: "Poha chivda" },
  "img:p-masala-peanuts": { src: pMasalaPeanuts, label: "Masala peanuts" },
  "img:p-chana-dal": { src: pChanaDal, label: "Chana dal" },
  "img:p-moong-dal": { src: pMoongDal, label: "Moong dal" },
  "img:p-gathiya": { src: pGathiya, label: "Gathiya farsan" },
  "img:p-banana-chips": { src: pBananaChips, label: "Banana chips" },
  "img:p-potato-wafers": { src: pPotatoWafers, label: "Potato wafers" },
  "img:p-bhakarwadi": { src: pBhakarwadi, label: "Bhakarwadi" },
  "img:p-combo": { src: pCombo, label: "Snack combo" },
};

export function resolveImage(src: string | undefined | null): string {
  if (!src) return "";
  if (src.startsWith("img:")) return IMAGE_LIBRARY[src]?.src ?? "";
  return src;
}

/** Downscale an uploaded file to a compact JPEG data URL for localStorage. */
export function fileToDataUrl(file: File, maxSize = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not load image"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
