import type { ChatMessage } from "@/types/chat";

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: "demo-1",
    role: "user",
    content: "I'm visiting Hong Kong for 2 days. I love food! 🍜",
    timestamp: new Date(),
  },
  {
    id: "demo-2",
    role: "assistant",
    content: `# 🇭🇰 2-Day Hong Kong Foodie Itinerary

## Day 1 — Street Food & Local Gems
- **Morning**: Start at **Tim Ho Wan** (Michelin-starred dim sum) in Sham Shui Po
- **Lunch**: Explore **Temple Street** for wonton noodles and curry fish balls
- **Afternoon**: Visit **Mong Kok** for egg waffles and bubble tea
- **Dinner**: **Dai Pai Dong** experience in Sham Shui Po — try the clay pot rice!

## Day 2 — Fine Dining & Harbor Views
- **Morning**: Yum cha at **Maxim's Palace** in City Hall
- **Lunch**: Head to **Central** for international fusion at **Yardbird**
- **Afternoon**: Take the **Star Ferry** to Tsim Sha Tsui, snack on pineapple buns
- **Dinner**: Sunset dinner at **Aqua** overlooking Victoria Harbour 🌇

> 💡 **Pro tip**: Get an Octopus card for seamless transport between food spots!`,
    timestamp: new Date(),
  },
];

interface Props {
  onDemo: (messages: ChatMessage[]) => void;
}

export default function DemoButton({ onDemo }: Props) {
  return (
    <button
      onClick={() => onDemo(DEMO_MESSAGES)}
      className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full font-medium hover:shadow-md transition-all active:scale-95"
    >
      🎭 Demo
    </button>
  );
}
