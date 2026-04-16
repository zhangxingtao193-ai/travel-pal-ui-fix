import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

interface RateEntry {
  code: string;
  rate: number;
  flag: string;
}

const ALL_CURRENCIES: { code: string; flag: string }[] = [
  { code: "USD", flag: "🇺🇸" },
  { code: "HKD", flag: "🇭🇰" },
  { code: "JPY", flag: "🇯🇵" },
  { code: "EUR", flag: "🇪🇺" },
  { code: "GBP", flag: "🇬🇧" },
  { code: "CNY", flag: "🇨🇳" },
  { code: "KRW", flag: "🇰🇷" },
  { code: "THB", flag: "🇹🇭" },
  { code: "SGD", flag: "🇸🇬" },
];

export default function ExchangeRateWidget() {
  const [base, setBase] = useState("USD");
  const [rates, setRates] = useState<RateEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { t } = useLocale();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetch(`https://open.er-api.com/v6/latest/${base}`);
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      const r = data.rates;
      if (!r) throw new Error();
      setRates(
        ALL_CURRENCIES
          .filter((c) => c.code !== base && r[c.code])
          .map((c) => ({ code: c.code, rate: r[c.code], flag: c.flag }))
      );
      setLastUpdated(new Date());
    } catch { /* keep existing */ }
    setLoading(false);
  }, [base]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  const baseFlag = ALL_CURRENCIES.find((c) => c.code === base)?.flag ?? "";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          {t.exchangeRates}
        </h3>
        <button
          onClick={refresh}
          disabled={loading}
          className="p-1 rounded hover:bg-sidebar-accent/50 transition-colors"
          title={t.refreshRates}
        >
          <RefreshCw className={cn("w-3 h-3 text-sidebar-foreground/50", loading && "animate-spin")} />
        </button>
      </div>

      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-[10px] text-sidebar-foreground/40">Base:</span>
        <select
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className="text-[10px] bg-sidebar-accent/30 text-sidebar-foreground rounded px-1.5 py-0.5 border-none outline-none cursor-pointer"
        >
          {ALL_CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {t.currencyNames[c.code] ?? c.code}
            </option>
          ))}
        </select>
      </div>

      {loading && rates.length === 0 ? (
        <div className="space-y-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-sidebar-accent/30 rounded h-5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1">
          {rates.map((r) => (
            <div key={r.code} className="flex items-center justify-between bg-sidebar-accent/30 rounded px-2 py-1" title={t.currencyNames[r.code] ?? r.code}>
              <span className="text-[10px]">{r.flag} {t.currencyNames[r.code] ?? r.code}</span>
              <span className="text-[10px] font-mono font-medium text-sidebar-primary">
                {r.rate < 10 ? r.rate.toFixed(3) : r.rate < 1000 ? r.rate.toFixed(2) : r.rate.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      )}

      {lastUpdated && (
        <p className="text-[9px] text-sidebar-foreground/30 mt-1.5 text-center">
          {t.updated} {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
