import { useState, useEffect } from "react";
import { Droplets, Wind, RefreshCw } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

interface WeatherData {
  cityKey: string;
  temp_c: number;
  humidity: number;
  wind: number;
  weatherCode: number;
}

const CITIES = [
  { key: "hongKong", lat: 22.3193, lon: 114.1694 },
  { key: "tokyo", lat: 35.6762, lon: 139.6503 },
];

const WMO_DESC: Record<string, Record<number, string>> = {
  en: {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow",
    75: "Heavy snow", 80: "Light showers", 81: "Showers", 82: "Heavy showers",
    95: "Thunderstorm", 96: "Thunderstorm w/ hail", 99: "Severe thunderstorm",
  },
  zh: {
    0: "晴朗", 1: "大部晴朗", 2: "多云", 3: "阴天",
    45: "雾", 48: "雾凇", 51: "小毛毛雨", 53: "毛毛雨", 55: "浓毛毛雨",
    61: "小雨", 63: "中雨", 65: "大雨", 71: "小雪", 73: "中雪",
    75: "大雪", 80: "小阵雨", 81: "阵雨", 82: "大阵雨",
    95: "雷暴", 96: "雷暴伴冰雹", 99: "强雷暴",
  },
  ja: {
    0: "快晴", 1: "おおむね晴れ", 2: "一部曇り", 3: "曇り",
    45: "霧", 48: "着氷性の霧", 51: "弱い霧雨", 53: "霧雨", 55: "強い霧雨",
    61: "小雨", 63: "雨", 65: "大雨", 71: "小雪", 73: "雪",
    75: "大雪", 80: "弱いにわか雨", 81: "にわか雨", 82: "強いにわか雨",
    95: "雷雨", 96: "雹を伴う雷雨", 99: "激しい雷雨",
  },
};

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { t } = useLocale();

  const refresh = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        CITIES.map(async (city) => {
          const resp = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
          );
          if (!resp.ok) return null;
          const data = await resp.json();
          const c = data.current;
          if (!c) return null;
          return {
            cityKey: city.key,
            temp_c: Math.round(c.temperature_2m),
            humidity: c.relative_humidity_2m,
            wind: Math.round(c.wind_speed_10m),
            weatherCode: c.weather_code,
          } as WeatherData;
        })
      );
      setWeatherData(results.filter(Boolean) as WeatherData[]);
      setLastUpdated(new Date());
    } catch { /* keep existing */ }
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
          {weatherData.map((w) => {
            const cityName = (t as unknown as Record<string, string>)[w.cityKey] ?? w.cityKey;
            return (
              <div key={w.cityKey} className="bg-sidebar-accent/30 rounded-lg p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{cityName}</span>
                  <span className="text-xs font-bold text-sidebar-primary">{w.temp_c}°C</span>
                </div>
                <p className="text-[10px] text-sidebar-foreground/60 mt-0.5">
                  {WMO_DESC[w.weatherCode] ?? "N/A"}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-sidebar-foreground/50">
                  <span className="flex items-center gap-0.5"><Droplets className="w-2.5 h-2.5" /> {w.humidity}%</span>
                  <span className="flex items-center gap-0.5"><Wind className="w-2.5 h-2.5" /> {w.wind} km/h</span>
                </div>
              </div>
            );
          })}
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
