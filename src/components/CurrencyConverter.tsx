import { useState, useEffect, useCallback } from "react";
import { ArrowUpDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { code: "USD", flag: "🇺🇸", name: "US Dollar" },
  { code: "HKD", flag: "🇭🇰", name: "Hong Kong Dollar" },
  { code: "JPY", flag: "🇯🇵", name: "Japanese Yen" },
  { code: "EUR", flag: "🇪🇺", name: "Euro" },
  { code: "GBP", flag: "🇬🇧", name: "British Pound" },
  { code: "CNY", flag: "🇨🇳", name: "Chinese Yuan" },
  { code: "KRW", flag: "🇰🇷", name: "Korean Won" },
  { code: "THB", flag: "🇹🇭", name: "Thai Baht" },
  { code: "SGD", flag: "🇸🇬", name: "Singapore Dollar" },
  { code: "AUD", flag: "🇦🇺", name: "Australian Dollar" },
  { code: "TWD", flag: "🇹🇼", name: "Taiwan Dollar" },
];

export default function CurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("JPY");
  const [amount, setAmount] = useState("100");
  const [loading, setLoading] = useState(true);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetch("https://open.er-api.com/v6/latest/USD");
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      if (data.rates) setRates(data.rates);
    } catch {
      /* keep existing */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const numAmount = parseFloat(amount) || 0;
  const fromRate = rates[from] ?? 1;
  const toRate = rates[to] ?? 1;
  const converted = numAmount > 0 ? (numAmount / fromRate) * toRate : 0;

  const formatResult = (val: number) => {
    if (val === 0) return "0";
    if (val >= 1000) return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (val >= 1) return val.toFixed(2);
    return val.toFixed(4);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          💰 Converter
        </h3>
        <button
          onClick={fetchRates}
          disabled={loading}
          className="p-1 rounded hover:bg-sidebar-accent/50 transition-colors"
          title="Refresh rates"
        >
          <RefreshCw className={cn("w-3 h-3 text-sidebar-foreground/50", loading && "animate-spin")} />
        </button>
      </div>

      <div className="space-y-2">
        {/* Amount input */}
        <input
          type="number"
          inputMode="decimal"
          min="0"
          max="999999999"
          step="any"
          value={amount}
          onChange={(e) => {
            const v = e.target.value;
            if (v.length <= 12) setAmount(v);
          }}
          className="w-full bg-sidebar-accent/30 rounded-md px-2.5 py-1.5 text-xs font-mono outline-none focus:ring-1 focus:ring-sidebar-primary text-sidebar-foreground placeholder:text-sidebar-foreground/40"
          placeholder="Amount"
        />

        {/* From currency */}
        <div className="flex items-center gap-1.5">
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="flex-1 bg-sidebar-accent/30 rounded-md px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-sidebar-primary text-sidebar-foreground appearance-none cursor-pointer"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>

          <button
            onClick={swap}
            className="p-1.5 rounded-md hover:bg-sidebar-accent/50 transition-colors"
            title="Swap currencies"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-sidebar-primary" />
          </button>

          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="flex-1 bg-sidebar-accent/30 rounded-md px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-sidebar-primary text-sidebar-foreground appearance-none cursor-pointer"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
        </div>

        {/* Result */}
        {numAmount > 0 && rates[from] && rates[to] && (
          <div className="bg-sidebar-accent/40 rounded-md px-2.5 py-2 text-center">
            <p className="text-[10px] text-sidebar-foreground/50">
              {CURRENCIES.find((c) => c.code === from)?.flag} {numAmount.toLocaleString()} {from} =
            </p>
            <p className="text-sm font-bold text-sidebar-primary font-mono">
              {CURRENCIES.find((c) => c.code === to)?.flag} {formatResult(converted)} {to}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
