import type { ChatMessage } from "@/types/chat";
import { toast } from "@/hooks/use-toast";

const FALLBACK_RESPONSES = [
  "I'd love to help with your travel plans! However, I'm having trouble connecting right now. Try again in a moment! 🌏",
  "Hmm, it seems the connection is a bit shaky. In the meantime — Hong Kong's Victoria Peak and Tokyo's Shibuya Crossing are absolute must-sees! 🗼",
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const CHAT_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/travel-chat` : null;

export async function streamChatMessage(
  messages: ChatMessage[],
  preferenceContext: string | null,
  onDelta: (text: string) => void,
  onDone: () => void
): Promise<void> {
  try {
    if (!CHAT_URL) {
      const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      onDelta(fallback);
      onDone();
      return;
    }

    const apiMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    if (preferenceContext) {
      apiMessages.unshift({ role: "user", content: preferenceContext });
    }

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: apiMessages, stream: true }),
    });

    if (!resp.ok || !resp.body) {
      if (resp.status === 429) {
        toast({ title: "Rate limited", description: "Too many requests. Please wait a moment and try again.", variant: "destructive" });
      } else if (resp.status === 402) {
        toast({ title: "Credits exhausted", description: "Please add funds to your workspace at Settings → Workspace → Usage.", variant: "destructive" });
      }
      const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      onDelta(fallback);
      onDone();
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone();
  } catch (e) {
    console.error("Chat stream error:", e);
    const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    onDelta(fallback);
    onDone();
  }
}
