import { useState } from "react";
import { Volume2, ImageIcon, Loader2, RefreshCw } from "lucide-react";
import { speakText, detectLanguage } from "@/hooks/useSpeech";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";
import DynamicAvatar from "./DynamicAvatar";

type AvatarState = "idle" | "thinking" | "done";

const IMAGE_STYLES = [
  { label: "📷 Photo", style: "realistic photography" },
  { label: "🎨 Watercolor", style: "watercolor painting" },
  { label: "🖼️ Oil Paint", style: "oil painting, impressionist" },
  { label: "✏️ Sketch", style: "pencil sketch, detailed line art" },
  { label: "🌸 Anime", style: "anime style, Studio Ghibli inspired" },
  { label: "🕹️ Pixel", style: "pixel art, retro game style" },
];

interface Props {
  message: ChatMessage;
  avatarState?: AvatarState;
  onRegenImage?: (messageId: string, style: string) => void;
}

export default function ChatBubble({ message, avatarState = "idle", onRegenImage }: Props) {
  const isUser = message.role === "user";
  const [showStyles, setShowStyles] = useState(false);

  return (
    <div className={cn("flex gap-3 animate-fade-in", isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <DynamicAvatar state={avatarState} size="sm" className="mt-1" />
      )}

      <div className={cn("max-w-[80%] flex flex-col", isUser ? "items-end" : "items-start")}>
        {isUser ? (
          <div className="bg-chat-user text-chat-user-foreground rounded-2xl rounded-br-md px-4 py-2.5 text-sm">
            {message.content}
          </div>
        ) : (
          <div className="bg-chat-bot text-chat-bot-foreground rounded-2xl rounded-bl-md px-4 py-2.5 text-sm prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{message.content}</ReactMarkdown>

            {/* Image loading indicator */}
            {message.imageLoading && (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <ImageIcon className="w-4 h-4" />
                <span>Generating image...</span>
              </div>
            )}

            {/* Generated image */}
            {message.imageUrl && (
              <div className="mt-3 relative group">
                <img
                  src={message.imageUrl}
                  alt="Travel scene"
                  className="rounded-lg max-w-full w-full shadow-md"
                  loading="lazy"
                />
                {/* Regenerate button overlay */}
                {onRegenImage && !message.imageLoading && (
                  <button
                    onClick={() => setShowStyles((v) => !v)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    title="Regenerate with different style"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Style picker */}
            {showStyles && onRegenImage && !message.imageLoading && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {IMAGE_STYLES.map((s) => (
                  <button
                    key={s.style}
                    onClick={() => {
                      setShowStyles(false);
                      onRegenImage(message.id, s.style);
                    }}
                    className="text-[11px] px-2 py-1 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors border border-border"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {!isUser && message.content && (
          <button
            onClick={() => speakText(message.content, detectLanguage(message.content))}
            className="mt-2 p-1 rounded hover:bg-foreground/10 transition-colors"
            title="Read aloud"
          >
            <Volume2 className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
