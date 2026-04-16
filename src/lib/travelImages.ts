import hongKongImg from "@/assets/travel/hong-kong.jpg";
import tokyoImg from "@/assets/travel/tokyo.jpg";
import foodImg from "@/assets/travel/food.jpg";
import cultureImg from "@/assets/travel/culture.jpg";
import natureImg from "@/assets/travel/nature.jpg";
import shoppingImg from "@/assets/travel/shopping.jpg";
import nightlifeImg from "@/assets/travel/nightlife.jpg";
import singaporeImg from "@/assets/travel/singapore.jpg";
import bangkokImg from "@/assets/travel/bangkok.jpg";
import seoulImg from "@/assets/travel/seoul.jpg";

interface ImageRule {
  keywords: string[];
  image: string;
}

const IMAGE_RULES: ImageRule[] = [
  { keywords: ["hong kong", "香港", "hk", "victoria", "tsim sha tsui", "kowloon", "lantau", "mong kok"], image: hongKongImg },
  { keywords: ["tokyo", "東京", "东京", "shibuya", "shinjuku", "akihabara", "harajuku", "ginza", "asakusa"], image: tokyoImg },
  { keywords: ["singapore", "新加坡", "シンガポール", "marina bay", "sentosa"], image: singaporeImg },
  { keywords: ["bangkok", "曼谷", "バンコク", "thailand", "泰国", "タイ"], image: bangkokImg },
  { keywords: ["seoul", "首尔", "ソウル", "korea", "韩国", "韓国"], image: seoulImg },
  { keywords: ["food", "美食", "グルメ", "restaurant", "cuisine", "dim sum", "sushi", "ramen", "street food", "foodie", "吃", "餐"], image: foodImg },
  { keywords: ["culture", "文化", "temple", "museum", "history", "historical", "heritage", "寺", "博物館", "歴史"], image: cultureImg },
  { keywords: ["nature", "自然", "beach", "mountain", "park", "hiking", "garden", "海", "山", "公園"], image: natureImg },
  { keywords: ["shopping", "购物", "ショッピング", "market", "mall", "boutique", "shop", "买", "買"], image: shoppingImg },
  { keywords: ["nightlife", "夜生活", "ナイトライフ", "bar", "club", "rooftop", "night market", "夜市"], image: nightlifeImg },
];

export function matchTravelImage(text: string): string | null {
  const lower = text.toLowerCase();
  for (const rule of IMAGE_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.image;
    }
  }
  // Default: if response is long enough, show a generic travel image
  if (text.length > 100) return hongKongImg;
  return null;
}
