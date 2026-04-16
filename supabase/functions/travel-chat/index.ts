import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Travel Star, a friendly and knowledgeable AI travel concierge. You specialize in Hong Kong and Tokyo but can help with any destination worldwide.

CRITICAL LANGUAGE RULE:
- You MUST respond in the SAME language the user writes in.
- If the user writes in Chinese, respond entirely in Chinese.
- If the user writes in Japanese, respond entirely in Japanese.
- If the user writes in Korean, respond entirely in Korean.
- If the user writes in French, respond entirely in French.
- Match the user's language exactly — never switch to English unless the user writes in English.

Guidelines:
- Be warm, enthusiastic, and use relevant emojis 🌏✈️🗺️
- Provide specific, actionable travel recommendations
- Include local tips and hidden gems
- Format responses with markdown headers, bullet points, and bold text for key places
- Mention approximate costs when relevant
- Suggest time-efficient itineraries
- Consider the user's stated preferences (foodie, culture, nature, shopping, nightlife)
- Keep responses comprehensive but well-structured
- When discussing weather, use the REAL-TIME WEATHER DATA provided below
- When discussing costs or currency, use the REAL-TIME EXCHANGE RATES provided below
- Always mention the data is live/real-time when sharing weather or exchange rate info`;

async function fetchWeather(city: string): Promise<string> {
  try {
    const resp = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!resp.ok) return `${city}: unavailable`;
    const data = await resp.json();
    const current = data.current_condition?.[0];
    if (!current) return `${city}: unavailable`;
    return `${city}: ${current.temp_C}°C (${current.temp_F}°F), ${current.weatherDesc?.[0]?.value ?? "N/A"}, Humidity ${current.humidity}%, Wind ${current.windspeedKmph} km/h ${current.winddir16Point}`;
  } catch {
    return `${city}: unavailable`;
  }
}

async function fetchExchangeRates(): Promise<string> {
  try {
    const resp = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: AbortSignal.timeout(5000),
    });
    if (!resp.ok) return "Exchange rates: unavailable";
    const data = await resp.json();
    const rates = data.rates;
    if (!rates) return "Exchange rates: unavailable";
    const keys = ["HKD", "JPY", "EUR", "GBP", "CNY", "KRW", "THB", "SGD", "AUD", "TWD", "MYR", "PHP", "IDR", "VND", "INR"];
    const lines = keys
      .filter((k) => rates[k])
      .map((k) => `  1 USD = ${rates[k]} ${k}`);
    return `Exchange rates (live, base USD):\n${lines.join("\n")}`;
  } catch {
    return "Exchange rates: unavailable";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, stream } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Detect cities mentioned in last user message for weather lookup
    const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === "user")?.content?.toLowerCase() ?? "";
    const weatherCities = ["Hong Kong", "Tokyo", "Singapore", "Bangkok", "Seoul", "Taipei", "Shanghai", "Beijing", "Osaka", "Kyoto"];
    const mentionedCities = weatherCities.filter(
      (c) => lastUserMsg.includes(c.toLowerCase())
    );
    // Always include HK and Tokyo as defaults
    const citiesToFetch = [...new Set(["Hong Kong", "Tokyo", ...mentionedCities])];

    // Fetch weather and exchange rates in parallel
    const [weatherResults, exchangeRates] = await Promise.all([
      Promise.all(citiesToFetch.map(fetchWeather)),
      fetchExchangeRates(),
    ]);

    const liveContext = `\n\n--- REAL-TIME DATA (updated now) ---\n🌤️ Weather:\n${weatherResults.join("\n")}\n\n💱 ${exchangeRates}\n---`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + liveContext },
          ...messages,
        ],
        stream: stream ?? true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (stream) {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("travel-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
