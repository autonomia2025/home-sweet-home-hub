import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { fetchConfiguracion, subscribeToConfiguracion } from "@/lib/supabase-helpers";

interface ConfigState {
  whatsapp: string;
  nombre_inmobiliaria: string;
  presentacion: string;
  loading: boolean;
  refresh: () => Promise<void>;
}

const ConfigContext = createContext<ConfigState>({
  whatsapp: "",
  nombre_inmobiliaria: "Inmobiliaria Pérez-Campos",
  presentacion: "",
  loading: true,
  refresh: async () => {},
});

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchConfiguracion();
      setConfig(data);
    } catch {
      // fallback values
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime subscription
  useEffect(() => {
    const unsub = subscribeToConfiguracion(() => {
      fetchConfiguracion().then(setConfig).catch(console.error);
    });
    return unsub;
  }, []);

  const value: ConfigState = {
    whatsapp: config.whatsapp || "",
    nombre_inmobiliaria: config.nombre_inmobiliaria || "Inmobiliaria Pérez-Campos",
    presentacion: config.presentacion || "",
    loading,
    refresh: load,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  return useContext(ConfigContext);
}
