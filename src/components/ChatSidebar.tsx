import { MapPin, Globe, Star } from "lucide-react";
import avatarImg from "@/assets/avatar.png";
import WeatherWidget from "./WeatherWidget";
import ExchangeRateWidget from "./ExchangeRateWidget";

export default function ChatSidebar() {
  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border h-full">
      <div className="p-4 flex flex-col items-center text-center gap-3 border-b border-sidebar-border">
        <img src={avatarImg} alt="Travel Star" className="w-16 h-16 rounded-full object-cover" width={64} height={64} />
        <div>
          <h2 className="font-heading font-semibold text-sm">Travel Star</h2>
          <p className="text-xs text-sidebar-foreground/60 mt-0.5">AI Travel Concierge</p>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        <WeatherWidget />
        <ExchangeRateWidget />

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 mb-2">Specialties</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sidebar-primary" /> Hong Kong 🇭🇰</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sidebar-primary" /> Tokyo 🇯🇵</li>
            <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-sidebar-primary" /> Worldwide</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 mb-2">Features</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Star className="w-4 h-4 text-secondary" /> Personalized tips</li>
            <li className="flex items-center gap-2"><Star className="w-4 h-4 text-secondary" /> Voice input (multilingual)</li>
            <li className="flex items-center gap-2"><Star className="w-4 h-4 text-secondary" /> Read aloud (auto-language)</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
