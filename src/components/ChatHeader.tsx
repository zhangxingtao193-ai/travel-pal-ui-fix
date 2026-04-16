import { Plane, Moon, Sun, Menu, Trash2, Globe } from "lucide-react";
import { useLocale, type UILocale } from "@/hooks/useLocale";

interface Props {
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  onClear: () => void;
  messageCount: number;
}

const LOCALES: { code: UILocale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "zh", label: "中" },
  { code: "ja", label: "日" },
];

export default function ChatHeader({ isDark, onToggleTheme, onToggleSidebar, onClear, messageCount }: Props) {
  const { locale, setLocale, t } = useLocale();

  const cycleLocale = () => {
    const idx = LOCALES.findIndex((l) => l.code === locale);
    const next = LOCALES[(idx + 1) % LOCALES.length];
    setLocale(next.code);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gradient-sky flex items-center justify-center">
            <Plane className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-heading font-semibold">{t.appTitle}</h1>
            <p className="text-xs text-muted-foreground">{t.appSubtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {messageCount > 1 && (
          <button onClick={onClear} className="p-2 rounded-lg hover:bg-muted transition-colors" title={t.clearChat}>
            <Trash2 className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
        <button onClick={onToggleTheme} className="p-2 rounded-lg hover:bg-muted transition-colors" title={t.toggleTheme}>
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          onClick={cycleLocale}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-xs font-medium"
          title="Language"
        >
          <Globe className="w-4 h-4" />
          <span>{LOCALES.find((l) => l.code === locale)?.label}</span>
        </button>
      </div>
    </header>
  );
}
