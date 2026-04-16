import DynamicAvatar from "./DynamicAvatar";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <DynamicAvatar state="thinking" size="sm" className="mt-1" />
      <div className="bg-chat-bot text-chat-bot-foreground rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce-dots"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>
    </div>
  );
}
