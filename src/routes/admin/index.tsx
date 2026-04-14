import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchAllPropiedades,
  fetchConfiguracion,
  fetchAllFAQs,
  subscribeToPropiedades,
  subscribeToConfiguracion,
} from "@/lib/supabase-helpers";
import type { Propiedad, FAQ } from "@/lib/supabase-helpers";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminProperties } from "@/components/admin/AdminProperties";
import { AdminConfig } from "@/components/admin/AdminConfig";
import { AdminFAQs } from "@/components/admin/AdminFAQs";
import { Toaster } from "sonner";
import { useConfig } from "@/context/ConfigContext";
import { useSEO } from "@/hooks/useSEO";

export const Route = createFileRoute("/admin/")({
  component: AdminPanel,
  head: () => ({
    meta: [
      { title: "Panel Admin — Pérez-Campos" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AdminPanel() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { refresh: refreshConfig } = useConfig();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"propiedades" | "configuracion" | "faqs">("propiedades");

  useSEO({ title: "Admin | Inmobiliaria Pérez-Campos", noIndex: true });


    if (!authLoading && !user) {
      navigate({ to: "/admin/login" });
    }
  }, [user, authLoading, navigate]);

  const loadData = useCallback(async () => {
    try {
      const [props, conf, faqData] = await Promise.all([
        fetchAllPropiedades(),
        fetchConfiguracion(),
        fetchAllFAQs(),
      ]);
      setPropiedades(props);
      setConfig(conf);
      setFaqs(faqData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  useEffect(() => {
    if (!user) return;
    const unsubProps = subscribeToPropiedades(() => {
      fetchAllPropiedades().then(setPropiedades).catch(console.error);
    });
    const unsubConfig = subscribeToConfiguracion(() => {
      fetchConfiguracion().then(setConfig).catch(console.error);
      refreshConfig();
    });
    return () => { unsubProps(); unsubConfig(); };
  }, [user, refreshConfig]);

  const handleConfigRefresh = async () => {
    await loadData();
    await refreshConfig();
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#f5f5f3" }}>
        <span className="font-display text-xl" style={{ color: "#ccc", fontWeight: 300 }}>Cargando...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#fafaf8" }}>
      <Toaster position="top-right" />
      <AdminSidebar activeSection={activeSection} onChangeSection={setActiveSection} />

      <main className="flex-1 min-w-0">
        <header className="h-14 flex items-center px-6 md:px-8 border-b" style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "#fff" }}>
          <h1 className="text-[11px] tracking-[0.15em] uppercase font-body ml-10 md:ml-0" style={{ color: "#9a9a9a", fontWeight: 400 }}>
            Panel de Administración — Pérez-Campos
          </h1>
        </header>

        <div className="p-6 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="text-sm font-body" style={{ color: "#9a9a9a", fontWeight: 300 }}>Cargando datos...</span>
            </div>
          ) : activeSection === "propiedades" ? (
            <AdminProperties propiedades={propiedades} onRefresh={loadData} />
          ) : activeSection === "faqs" ? (
            <AdminFAQs faqs={faqs} onRefresh={loadData} />
          ) : (
            <AdminConfig config={config} onRefresh={handleConfigRefresh} />
          )}
        </div>
      </main>
    </div>
  );
}
