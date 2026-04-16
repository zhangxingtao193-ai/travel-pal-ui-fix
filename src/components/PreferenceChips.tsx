import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";
import type { PreferenceChip } from "@/types/chat";

interface Props {
  selected: PreferenceChip | null;
  onSelect: (chip: PreferenceChip | null) => void;
}

const CHIP_KEYS = ["foodie", "culture", "nature", "shopping", "nightlife"] as const;
const EMOJIS = ["🍜", "🏛️", "🌿", "🛍️", "🌃"];
const CONTEXTS = [
  "The user is a food enthusiast. Tailor recommendations to local cuisine, street food, hidden gems, and dining experiences.",
  "The user loves culture and history. Recommend museums, temples, historical districts, cultural events, and traditional experiences.",
  "The user enjoys nature and outdoor activities. Suggest parks, hiking trails, beaches, gardens, and scenic viewpoints.",
  "The user enjoys shopping. Recommend markets, malls, boutiques, souvenir shops, and local craft stores.",
  "The user is interested in nightlife. Suggest bars, clubs, night markets, rooftop venues, and evening entertainment.",
];

export default function PreferenceChips({ selected, onSelect }: Props) {
  const { t } = useLocale();

  const chips: PreferenceChip[] = CHIP_KEYS.map((key, i) => ({
    label: t[key],
    emoji: EMOJIS[i],
    context: CONTEXTS[i],
  }));

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
      {chips.map((chip) => {
        const active = selected?.label === chip.label;
        return (
          <button
            key={chip.label}
            onClick={() => onSelect(active ? null : chip)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
              active
                ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                : "bg-card text-foreground border-border hover:border-primary/40 hover:shadow-sm"
            )}
          >
            {chip.emoji}{chip.label}
          </button>
        );
      })}
    </div>
  );
}
