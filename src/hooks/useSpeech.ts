import { useState, useCallback, useRef } from "react";

// Language code mapping for TTS
const LANG_MAP: Record<string, string> = {
  "cmn-Hans-CN": "zh-CN", "cmn-Hant-TW": "zh-TW",
  "yue-Hant-HK": "zh-HK", "ja-JP": "ja-JP", "ko-KR": "ko-KR",
  "en-US": "en-US", "en-GB": "en-GB", "fr-FR": "fr-FR",
  "de-DE": "de-DE", "es-ES": "es-ES", "it-IT": "it-IT",
  "pt-BR": "pt-BR", "ru-RU": "ru-RU", "ar-SA": "ar-SA",
  "hi-IN": "hi-IN", "th-TH": "th-TH", "vi-VN": "vi-VN",
};

// Detect language from text (heuristic)
function detectLanguage(text: string): string {
  // CJK characters
  if (/[\u4e00-\u9fff]/.test(text)) {
    // Japanese has katakana/hiragana
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return "ja-JP";
    return "zh-CN";
  }
  if (/[\u3040-\u309f\u30a0-\u30ff\u31f0-\u31ff]/.test(text)) return "ja-JP";
  if (/[\uac00-\ud7af]/.test(text)) return "ko-KR";
  if (/[\u0e00-\u0e7f]/.test(text)) return "th-TH";
  if (/[\u0600-\u06ff]/.test(text)) return "ar-SA";
  if (/[\u0900-\u097f]/.test(text)) return "hi-IN";
  if (/[\u0400-\u04ff]/.test(text)) return "ru-RU";
  // Vietnamese diacritics
  if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text)) return "vi-VN";
  // French accents
  if (/[àâçéèêëîïôùûüÿœæ]/i.test(text) && /\b(le|la|les|de|du|des|un|une|et|est|que|qui)\b/i.test(text)) return "fr-FR";
  // German
  if (/[äöüß]/i.test(text) && /\b(der|die|das|und|ist|ein|eine|ich|du)\b/i.test(text)) return "de-DE";
  // Spanish
  if (/[áéíóúñ¿¡]/i.test(text) && /\b(el|la|los|las|de|en|que|es|un|una|y)\b/i.test(text)) return "es-ES";
  // Portuguese
  if (/[ãõçáéíóú]/i.test(text) && /\b(de|do|da|em|que|um|uma|os|as|e)\b/i.test(text)) return "pt-BR";
  return "en-US";
}

// Store the last detected input language for TTS matching
let lastInputLang = "en-US";

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [detectedLang, setDetectedLang] = useState("en-US");
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback((onResult: (text: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    // Use empty string or navigator language for auto-detect
    recognition.lang = "";

    recognition.onresult = (event: any) => {
      const result = event.results[0][0];
      const text = result.transcript;
      // Try to detect language from the transcript
      const lang = detectLanguage(text);
      setDetectedLang(lang);
      lastInputLang = lang;
      onResult(text);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, startListening, stopListening, detectedLang };
}

export function speakText(text: string, lang?: string) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  // Strip markdown and emoji for cleaner speech
  const clean = text
    .replace(/[#*_~`>|[\]()!]/g, "")
    .replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  const utterance = new SpeechSynthesisUtterance(clean);

  // Determine language: explicit > last detected input > detect from response text
  const targetLang = lang || lastInputLang || detectLanguage(clean);
  utterance.lang = targetLang;

  // Try to find a matching voice
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = targetLang.split("-")[0];
  const matchedVoice = voices.find((v) => v.lang === targetLang) ||
    voices.find((v) => v.lang.startsWith(langPrefix));
  if (matchedVoice) utterance.voice = matchedVoice;

  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export function setInputLanguage(lang: string) {
  lastInputLang = lang;
}

export { detectLanguage };
