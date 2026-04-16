import { Plane, Moon, Sun, Menu, Trash2 } from "lucide-react";

interface Props {
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  onClear: () => void;
  messageCount: number;
}

export default function ChatHeader({ isDark, onToggleTheme, onToggleSidebar, onClear, messageCount }: Props) {
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
            <h1 className="text-sm font-heading font-semibold">Travel Star</h1>
            <p className="text-xs text-muted-foreground">AI Travel Concierge</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {messageCount > 1 && (
          <button onClick={onClear} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Clear chat">
            <Trash2 className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
        <button onClick={onToggleTheme} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Toggle theme">
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
