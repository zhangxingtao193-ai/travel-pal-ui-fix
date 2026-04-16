export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type PreferenceChip = {
  label: string;
  emoji: string;
  context: string;
};

export const PREFERENCE_CHIPS: PreferenceChip[] = [
  { label: "Foodie", emoji: "🍜", context: "The user is a food enthusiast. Tailor recommendations to local cuisine, street food, hidden gems, and dining experiences." },
  { label: "Culture", emoji: "🏛️", context: "The user loves culture and history. Recommend museums, temples, historical districts, cultural events, and traditional experiences." },
  { label: "Nature", emoji: "🌿", context: "The user enjoys nature and outdoor activities. Suggest parks, hiking trails, beaches, gardens, and scenic viewpoints." },
  { label: "Shopping", emoji: "🛍️", context: "The user enjoys shopping. Recommend markets, malls, boutiques, souvenir shops, and local craft stores." },
  { label: "Nightlife", emoji: "🌃", context: "The user is interested in nightlife. Suggest bars, clubs, night markets, rooftop venues, and evening entertainment." },
];
