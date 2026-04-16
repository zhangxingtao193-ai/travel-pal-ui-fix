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

const HK_KEYWORDS = ["hong kong", "香港", "hk", "victoria", "tsim sha tsui", "kowloon", "lantau", "mong kok", "wan chai", "central"];
const JP_KEYWORDS = ["tokyo", "東京", "东京", "japan", "日本", "shibuya", "shinjuku", "akihabara", "harajuku", "ginza", "asakusa", "osaka", "大阪", "kyoto", "京都"];

const FOOD_KEYWORDS = ["food", "美食", "グルメ", "restaurant", "cuisine", "dim sum", "sushi", "ramen", "street food", "foodie", "吃", "餐", "料理", "飲茶", "点心"];
const CULTURE_KEYWORDS = ["culture", "文化", "temple", "museum", "history", "historical", "heritage", "寺", "博物館", "歴史", "寺庙", "庙"];
const NATURE_KEYWORDS = ["nature", "自然", "beach", "mountain", "park", "hiking", "garden", "海", "山", "公園", "远足", "花园"];
const SHOPPING_KEYWORDS = ["shopping", "购物", "ショッピング", "market", "mall", "boutique", "shop", "买", "買", "商场"];
const NIGHTLIFE_KEYWORDS = ["nightlife", "夜生活", "ナイトライフ", "bar", "club", "rooftop", "night market", "夜市", "酒吧"];

function hasKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

export function matchTravelImage(text: string): string | null {
  const lower = text.toLowerCase();

  const isHK = hasKeyword(lower, HK_KEYWORDS);
  const isJP = hasKeyword(lower, JP_KEYWORDS);

  // Determine category
  const isFood = hasKeyword(lower, FOOD_KEYWORDS);
  const isCulture = hasKeyword(lower, CULTURE_KEYWORDS);
  const isNature = hasKeyword(lower, NATURE_KEYWORDS);
  const isShopping = hasKeyword(lower, SHOPPING_KEYWORDS);
  const isNightlife = hasKeyword(lower, NIGHTLIFE_KEYWORDS);

  // HK + category
  if (isHK) {
    if (isFood) return hkFoodImg;
    if (isCulture) return hkCultureImg;
    if (isNature) return hkNatureImg;
    if (isShopping) return hkShoppingImg;
    if (isNightlife) return hkNightlifeImg;
    return hongKongImg; // default HK skyline
  }

  // JP + category
  if (isJP) {
    if (isFood) return jpFoodImg;
    if (isCulture) return jpCultureImg;
    if (isNature) return jpNatureImg;
    if (isShopping) return jpShoppingImg;
    if (isNightlife) return jpNightlifeImg;
    return tokyoImg; // default Tokyo
  }

  // Category only → default to HK version
  if (isFood) return hkFoodImg;
  if (isCulture) return hkCultureImg;
  if (isNature) return hkNatureImg;
  if (isShopping) return hkShoppingImg;
  if (isNightlife) return hkNightlifeImg;

  // Long response with no match → general HK
  if (text.length > 200) return hongKongImg;
  return null;
}
