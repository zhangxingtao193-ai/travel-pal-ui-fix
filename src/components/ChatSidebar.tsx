import { MapPin, Globe, Star } from "lucide-react";
import avatarImg from "@/assets/avatar.png";
import WeatherWidget from "./WeatherWidget";
import ExchangeRateWidget from "./ExchangeRateWidget";
import CurrencyConverter from "./CurrencyConverter";
import { useLocale } from "@/hooks/useLocale";

export default function ChatSidebar() {
  const { t } = useLocale();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border h-full">
      <div className="p-4 flex flex-col items-center text-center gap-3 border-b border-sidebar-border">
        <img src={avatarImg} alt="Travel Star" className="w-16 h-16 rounded-full object-cover" width={64} height={64} />
        <div>
          <h2 className="font-heading font-semibold text-sm">{t.appTitle}</h2>
          <p className="text-xs text-sidebar-foreground/60 mt-0.5">{t.appSubtitle}</p>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        <WeatherWidget />
        <ExchangeRateWidget />
        <CurrencyConverter />

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 mb-2">{t.specialties}</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sidebar-primary" /> {t.hongKong} 🇭🇰</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sidebar-primary" /> {t.tokyo} 🇯🇵</li>
            <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-sidebar-primary" /> {t.worldwide}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 mb-2">{t.features}</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Star className="w-4 h-4 text-secondary" /> {t.personalizedTips}</li>
            <li className="flex items-center gap-2"><Star className="w-4 h-4 text-secondary" /> {t.voiceInput}</li>
            <li className="flex items-center gap-2"><Star className="w-4 h-4 text-secondary" /> {t.readAloud}</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
