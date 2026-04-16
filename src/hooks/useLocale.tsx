import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

export type UILocale = "en" | "zh" | "ja";

interface Translations {
  appTitle: string;
  appSubtitle: string;
  clearChat: string;
  toggleTheme: string;
  listening: string;
  inputPlaceholder: string;
  specialties: string;
  features: string;
  personalizedTips: string;
  voiceInput: string;
  readAloud: string;
  worldwide: string;
  liveWeather: string;
  exchangeRates: string;
  converter: string;
  refreshWeather: string;
  refreshRates: string;
  baseCurrency: string;
  updated: string;
  swapCurrencies: string;
  welcomeMessage: string;
  foodie: string;
  culture: string;
  nature: string;
  shopping: string;
  nightlife: string;
  demoConversation: string;
  amount: string;
  hongKong: string;
  tokyo: string;
  currencyNames: Record<string, string>;
}

const translations: Record<UILocale, Translations> = {
  en: {
    appTitle: "Travel Star",
    appSubtitle: "AI Travel Concierge",
    clearChat: "Clear chat",
    toggleTheme: "Toggle theme",
    listening: "🎙️ Listening...",
    inputPlaceholder: "Ask in any language — 用中文、日本語、한국어...",
    specialties: "Specialties",
    features: "Features",
    personalizedTips: "Personalized tips",
    voiceInput: "Voice input (multilingual)",
    readAloud: "Read aloud (auto-language)",
    worldwide: "Worldwide",
    liveWeather: "🌤️ Live Weather",
    exchangeRates: "💱 Exchange Rates",
    converter: "💰 Converter",
    refreshWeather: "Refresh weather",
    refreshRates: "Refresh rates",
    baseCurrency: "Base: 1 USD 🇺🇸",
    updated: "Updated",
    swapCurrencies: "Swap currencies",
    welcomeMessage:
      "Hello! 👋 I'm **Travel Star**, your AI travel concierge. I specialize in **Hong Kong** 🇭🇰 and **Tokyo** 🇯🇵 but I'm happy to help with any destination!\n\nTry selecting a preference above, or just ask me anything!",
    foodie: "Foodie",
    culture: "Culture",
    nature: "Nature",
    shopping: "Shopping",
    nightlife: "Nightlife",
    demoConversation: "Demo",
    amount: "Amount",
    hongKong: "Hong Kong",
    tokyo: "Tokyo",
    currencyNames: {
      USD: "US Dollar", HKD: "HK Dollar", JPY: "Japanese Yen", EUR: "Euro",
      GBP: "British Pound", CNY: "Chinese Yuan", KRW: "Korean Won",
      THB: "Thai Baht", SGD: "Singapore Dollar", AUD: "Australian Dollar", TWD: "Taiwan Dollar",
    },
  },
  zh: {
    appTitle: "旅行之星",
    appSubtitle: "AI旅行管家",
    clearChat: "清除聊天",
    toggleTheme: "切换主题",
    listening: "🎙️ 正在聆听...",
    inputPlaceholder: "用任何语言提问 — English, 日本語, 한국어...",
    specialties: "专长领域",
    features: "功能特色",
    personalizedTips: "个性化建议",
    voiceInput: "语音输入（多语言）",
    readAloud: "朗读（自动语言）",
    worldwide: "全球",
    liveWeather: "🌤️ 实时天气",
    exchangeRates: "💱 汇率",
    converter: "💰 货币换算",
    refreshWeather: "刷新天气",
    refreshRates: "刷新汇率",
    baseCurrency: "基准: 1 美元 🇺🇸",
    updated: "更新于",
    swapCurrencies: "交换货币",
    welcomeMessage:
      "你好！👋 我是**旅行之星**，你的AI旅行管家。我专注于**香港** 🇭🇰 和**东京** 🇯🇵，但也很乐意帮助你规划任何目的地的旅行！\n\n试试选择上方的偏好标签，或直接问我任何问题！",
    foodie: "美食",
    culture: "文化",
    nature: "自然",
    shopping: "购物",
    nightlife: "夜生活",
    demoConversation: "示例",
    amount: "金额",
    hongKong: "香港",
    tokyo: "东京",
    currencyNames: {
      USD: "美元", HKD: "港币", JPY: "日元", EUR: "欧元",
      GBP: "英镑", CNY: "人民币", KRW: "韩元",
      THB: "泰铢", SGD: "新加坡元", AUD: "澳元", TWD: "新台币",
    },
  },
  ja: {
    appTitle: "トラベルスター",
    appSubtitle: "AI旅行コンシェルジュ",
    clearChat: "チャットをクリア",
    toggleTheme: "テーマ切替",
    listening: "🎙️ 聞いています...",
    inputPlaceholder: "何語でも質問OK — English, 中文, 한국어...",
    specialties: "専門分野",
    features: "機能",
    personalizedTips: "パーソナルおすすめ",
    voiceInput: "音声入力（多言語）",
    readAloud: "読み上げ（自動言語）",
    worldwide: "世界中",
    liveWeather: "🌤️ リアルタイム天気",
    exchangeRates: "💱 為替レート",
    converter: "💰 通貨換算",
    refreshWeather: "天気を更新",
    refreshRates: "レートを更新",
    baseCurrency: "基準: 1 USD 🇺🇸",
    updated: "更新",
    swapCurrencies: "通貨を入替",
    welcomeMessage:
      "こんにちは！👋 **トラベルスター**です。AI旅行コンシェルジュとして、**香港** 🇭🇰 と **東京** 🇯🇵 を専門にしていますが、世界中どこでもお手伝いします！\n\n上の好みタグを選ぶか、何でも聞いてください！",
    foodie: "グルメ",
    culture: "文化",
    nature: "自然",
    shopping: "ショッピング",
    nightlife: "ナイトライフ",
    demoConversation: "デモ",
    amount: "金額",
    hongKong: "香港",
    tokyo: "東京",
    currencyNames: {
      USD: "米ドル", HKD: "香港ドル", JPY: "日本円", EUR: "ユーロ",
      GBP: "英ポンド", CNY: "中国元", KRW: "韓国ウォン",
      THB: "タイバーツ", SGD: "シンガポールドル", AUD: "豪ドル", TWD: "台湾ドル",
    },
  },
};

interface LocaleContextType {
  locale: UILocale;
  setLocale: (l: UILocale) => void;
  t: Translations;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  setLocale: () => {},
  t: translations.en,
});

export function LocaleProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [locale, setLocaleState] = useState<UILocale>(() => {
    const saved = getStoredLocale();
    if (saved === "zh" || saved === "ja" || saved === "en") return saved;
    return "en";
  });

  const setLocale = useCallback((l: UILocale) => {
    setLocaleState(l);
    setStoredLocale(l);
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, t: translations[locale] }),
    [locale, setLocale]
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

function getStoredLocale() {
  try {
    return globalThis.localStorage.getItem("ui-locale");
  } catch {
    return null;
  }
}

function setStoredLocale(locale: UILocale) {
  try {
    globalThis.localStorage.setItem("ui-locale", locale);
  } catch {
    // Ignore storage failures so UI can still render.
  }
}
