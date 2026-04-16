import { useState, useRef, useEffect, useCallback } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatSidebar from "@/components/ChatSidebar";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import PreferenceChips from "@/components/PreferenceChips";
import TypingIndicator from "@/components/TypingIndicator";
import DemoButton from "@/components/DemoButton";
import { streamChatMessage } from "@/lib/chatApi";
import { matchTravelImages } from "@/lib/travelImages";
import { useTheme } from "@/hooks/useTheme";
import { useLocale } from "@/hooks/useLocale";
import type { ChatMessage, PreferenceChip } from "@/types/chat";

function makeWelcome(msg: string): ChatMessage {
  return { id: "welcome", role: "assistant", content: msg, timestamp: new Date() };
}

export default function Index() {
  const theme = useTheme();
  const { t } = useLocale();

  const [messages, setMessages] = useState<ChatMessage[]>([makeWelcome(t.welcomeMessage)]);
  const [isLoading, setIsLoading] = useState(false);
  const [preference, setPreference] = useState<PreferenceChip | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeAssistantId, setActiveAssistantId] = useState<string | null>(null);
  const [doneMessageId, setDoneMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((prev) => {
      const rest = prev.filter((m) => m.id !== "welcome");
      return [makeWelcome(t.welcomeMessage), ...rest];
    });
  }, [t.welcomeMessage]);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages, isLoading, scrollToBottom]);

  const getAvatarState = (msgId: string) => {
    if (msgId === activeAssistantId) return "thinking" as const;
    if (msgId === doneMessageId) return "done" as const;
    return "idle" as const;
  };

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    setDoneMessageId(null);

    const assistantId = crypto.randomUUID();
    let assistantContent = "";
    setActiveAssistantId(assistantId);

    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
    ]);

    await streamChatMessage(
      updatedMessages,
      preference?.context ?? null,
      (delta) => {
        assistantContent += delta;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: assistantContent } : m
          )
        );
      },
      () => {
        // Match a built-in image based on user question + bot response
        const combinedText = text + " " + assistantContent;
        const imageUrl = matchTravelImage(combinedText) ?? undefined;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, imageUrl } : m
          )
        );

        setIsLoading(false);
        setActiveAssistantId(null);
        setDoneMessageId(assistantId);
        setTimeout(() => setDoneMessageId(null), 3000);
      }
    );
  };

  const handleDemo = (demoMessages: ChatMessage[]) => {
    setMessages([makeWelcome(t.welcomeMessage), ...demoMessages]);
    setDoneMessageId(null);
    setActiveAssistantId(null);
  };

  const handleClear = () => {
    setMessages([makeWelcome(t.welcomeMessage)]);
    setDoneMessageId(null);
    setActiveAssistantId(null);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="hidden md:block">
        <ChatSidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 flex md:hidden">
          <ChatSidebar />
          <div className="flex-1 bg-foreground/30" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          isDark={theme.isDark}
          onToggleTheme={theme.toggle}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          onClear={handleClear}
          messageCount={messages.length}
        />

        <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
          <PreferenceChips selected={preference} onSelect={setPreference} />
          <DemoButton onDemo={handleDemo} />
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              avatarState={msg.role === "assistant" ? getAvatarState(msg.id) : "idle"}
            />
          ))}
          {isLoading && messages[messages.length - 1]?.content === "" && <TypingIndicator />}
        </div>

        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
