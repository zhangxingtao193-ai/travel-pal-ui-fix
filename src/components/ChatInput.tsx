import { useState } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { useSpeechRecognition, setInputLanguage, detectLanguage } from "@/hooks/useSpeech";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [input, setInput] = useState("");
  const { isListening, startListening, stopListening } = useSpeechRecognition();
  const { t } = useLocale();

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    setInputLanguage(detectLanguage(trimmed));
    onSend(trimmed);
    setInput("");
  };

  const handleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((text) => {
        setInput(text);
        setTimeout(() => {
          onSend(text);
          setInput("");
        }, 300);
      });
    }
  };

  return (
    <div className="border-t border-border bg-card/80 backdrop-blur-sm px-4 py-3">
      {isListening && (
        <div className="mb-2 text-center">
          <span className="text-xs text-destructive animate-pulse">{t.listening}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button onClick={handleVoice} className={cn("p-2 rounded-full transition-colors", isListening ? "bg-destructive text-destructive-foreground" : "hover:bg-muted")}>
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={t.inputPlaceholder}
          disabled={disabled}
          className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/60 disabled:opacity-50"
        />
        <button onClick={handleSend} disabled={disabled || !input.trim()} className="p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
