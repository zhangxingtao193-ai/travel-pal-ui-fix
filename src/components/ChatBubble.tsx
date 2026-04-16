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

            {message.imageUrl && (
              <div className="mt-3 max-w-[280px]">
                <img
                  src={message.imageUrl}
                  alt="Travel scene"
                  className="rounded-lg w-full shadow-md"
                  loading="lazy"
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
