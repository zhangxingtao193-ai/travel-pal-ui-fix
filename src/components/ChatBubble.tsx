import { useState } from "react";
import { Volume2 } from "lucide-react";
import { speakText, detectLanguage } from "@/hooks/useSpeech";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";
import DynamicAvatar from "./DynamicAvatar";

type AvatarState = "idle" | "thinking" | "done";

interface Props {
  message: ChatMessage;
  avatarState?: AvatarState;
}

export default function ChatBubble({ message, avatarState = "idle" }: Props) {
  const isUser = message.role === "user";
  const [expandedImg, setExpandedImg] = useState<string | null>(null);

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

            {/* Travel image gallery */}
            {message.travelImages && message.travelImages.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2 not-prose" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {/* First image spans 2 columns */}
                <div
                  className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => setExpandedImg(expandedImg === message.travelImages![0].url ? null : message.travelImages![0].url)}
                >
                  <img
                    src={message.travelImages[0].url}
                    alt={message.travelImages[0].label}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    style={{ aspectRatio: "1" }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <span className="text-white text-xs font-medium">{message.travelImages[0].label}</span>
                  </div>
                </div>

                {/* Remaining images */}
                {message.travelImages.slice(1).map((img, i) => (
                  <div
                    key={i}
                    className="relative group cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => setExpandedImg(expandedImg === img.url ? null : img.url)}
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      style={{ aspectRatio: "1" }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                      <span className="text-white text-[10px] font-medium">{img.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Expanded image preview */}
            {expandedImg && (
              <div
                className="mt-2 cursor-pointer not-prose"
                onClick={() => setExpandedImg(null)}
              >
                <img
                  src={expandedImg}
                  alt="Preview"
                  className="rounded-lg w-full max-w-md shadow-lg"
                />
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
