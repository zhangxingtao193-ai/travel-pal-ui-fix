import { useState, useEffect } from "react";
import { Droplets, Wind, RefreshCw } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

interface WeatherData {
  city: string;
  temp_c: string;
  temp_f: string;
  desc: string;
  humidity: string;
  wind: string;
}

const CITIES = ["Hong Kong", "Tokyo"];

async function fetchWeather(city: string): Promise<WeatherData | null> {
  try {
    const resp = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
    if (!resp.ok) return null;
    const data = await resp.json();
    const c = data.current_condition?.[0];
    if (!c) return null;
    return {
      city,
      temp_c: c.temp_C,
      temp_f: c.temp_F,
      desc: c.weatherDesc?.[0]?.value ?? "N/A",
      humidity: c.humidity,
      wind: c.windspeedKmph,
    };
  } catch {
    return null;
  }
}

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { t } = useLocale();

  const refresh = async () => {
    setLoading(true);
    const results = await Promise.all(CITIES.map(fetchWeather));
    setWeatherData(results.filter(Boolean) as WeatherData[]);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          {t.liveWeather}
        </h3>
        <button
          onClick={refresh}
          disabled={loading}
          className="p-1 rounded hover:bg-sidebar-accent/50 transition-colors"
          title={t.refreshWeather}
        >
          <RefreshCw className={cn("w-3 h-3 text-sidebar-foreground/50", loading && "animate-spin")} />
        </button>
      </div>

      {loading && weatherData.length === 0 ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-sidebar-accent/30 rounded-lg p-2.5 animate-pulse h-16" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {weatherData.map((w) => (
            <div key={w.city} className="bg-sidebar-accent/30 rounded-lg p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{w.city}</span>
                <span className="text-xs font-bold text-sidebar-primary">{w.temp_c}°C</span>
              </div>
              <p className="text-[10px] text-sidebar-foreground/60 mt-0.5">{w.desc}</p>
              <div className="flex items-center gap-3 mt-1 text-[10px] text-sidebar-foreground/50">
                <span className="flex items-center gap-0.5"><Droplets className="w-2.5 h-2.5" /> {w.humidity}%</span>
                <span className="flex items-center gap-0.5"><Wind className="w-2.5 h-2.5" /> {w.wind} km/h</span>
              </div>
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
