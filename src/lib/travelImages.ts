import hongKongImg from "@/assets/travel/hong-kong.jpg";
import tokyoImg from "@/assets/travel/tokyo.jpg";
import hkFoodImg from "@/assets/travel/hk-food.jpg";
import hkCultureImg from "@/assets/travel/hk-culture.jpg";
import hkNatureImg from "@/assets/travel/hk-nature.jpg";
import hkShoppingImg from "@/assets/travel/hk-shopping.jpg";
import hkNightlifeImg from "@/assets/travel/hk-nightlife.jpg";
import jpFoodImg from "@/assets/travel/jp-food.jpg";
import jpCultureImg from "@/assets/travel/jp-culture.jpg";
import jpNatureImg from "@/assets/travel/jp-nature.jpg";
import jpShoppingImg from "@/assets/travel/jp-shopping.jpg";
import jpNightlifeImg from "@/assets/travel/jp-nightlife.jpg";
import type { TravelImageSet } from "@/types/chat";

const HK_KEYWORDS = ["hong kong", "香港", "hk", "victoria", "tsim sha tsui", "kowloon", "lantau", "mong kok", "wan chai", "central"];
const JP_KEYWORDS = ["tokyo", "東京", "东京", "japan", "日本", "shibuya", "shinjuku", "akihabara", "harajuku", "ginza", "asakusa", "osaka", "大阪", "kyoto", "京都"];

function hasKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

const HK_IMAGES: TravelImageSet[] = [
  { label: "foodie", emoji: "🍜", url: hkFoodImg },
  { label: "culture", emoji: "🏛️", url: hkCultureImg },
  { label: "nature", emoji: "🌿", url: hkNatureImg },
  { label: "shopping", emoji: "🛍️", url: hkShoppingImg },
  { label: "nightlife", emoji: "🌃", url: hkNightlifeImg },
];

const JP_IMAGES: TravelImageSet[] = [
  { label: "foodie", emoji: "🍜", url: jpFoodImg },
  { label: "culture", emoji: "🏛️", url: jpCultureImg },
  { label: "nature", emoji: "🌿", url: jpNatureImg },
  { label: "shopping", emoji: "🛍️", url: jpShoppingImg },
  { label: "nightlife", emoji: "🌃", url: jpNightlifeImg },
];

export function matchTravelImages(text: string): TravelImageSet[] | null {
  const lower = text.toLowerCase();

  if (hasKeyword(lower, HK_KEYWORDS)) return HK_IMAGES;
  if (hasKeyword(lower, JP_KEYWORDS)) return JP_IMAGES;

  return null;
}
