import { PREFERENCE_CHIPS, type PreferenceChip } from "@/types/chat";
import { cn } from "@/lib/utils";

interface Props {
  selected: PreferenceChip | null;
  onSelect: (chip: PreferenceChip | null) => void;
}

export default function PreferenceChips({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
      {PREFERENCE_CHIPS.map((chip) => {
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
