import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchAllPropiedades,
  fetchConfiguracion,
  subscribeToPropiedades,
  subscribeToConfiguracion,
} from "@/lib/supabase-helpers";
import type { Propiedad } from "@/lib/supabase-helpers";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminProperties } from "@/components/admin/AdminProperties";
import { AdminConfig } from "@/components/admin/AdminConfig";
import { Toaster } from "sonner";

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
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"propiedades" | "configuracion">("propiedades");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/admin/login" });
    }
  }, [user, authLoading, navigate]);

  const loadData = useCallback(async () => {
    try {
      const [props, conf] = await Promise.all([fetchAllPropiedades(), fetchConfiguracion()]);
      setPropiedades(props);
      setConfig(conf);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  // Realtime subscriptions
  useEffect(() => {
    if (!user) return;
    const unsubProps = subscribeToPropiedades(() => {
      fetchAllPropiedades().then(setPropiedades).catch(console.error);
    });
    const unsubConfig = subscribeToConfiguracion(() => {
      fetchConfiguracion().then(setConfig).catch(console.error);
    });
    return () => {
      unsubProps();
      unsubConfig();
    };
  }, [user]);

  if (authLoading || !user) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "#f5f5f3" }}
      >
        <span className="font-display text-xl" style={{ color: "#ccc", fontWeight: 300 }}>
          Cargando...
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#fafaf8" }}>
      <Toaster position="top-right" />
      <AdminSidebar activeSection={activeSection} onChangeSection={setActiveSection} />

      <main className="flex-1 min-w-0">
        {/* Header */}
        <header
          className="h-14 flex items-center px-6 md:px-8 border-b"
          style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "#fff" }}
        >
          <h1
            className="text-[11px] tracking-[0.15em] uppercase font-body ml-10 md:ml-0"
            style={{ color: "#9a9a9a", fontWeight: 400 }}
          >
            Panel de Administración — Pérez-Campos
          </h1>
        </header>

        {/* Content */}
        <div className="p-6 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="text-sm font-body" style={{ color: "#9a9a9a", fontWeight: 300 }}>
                Cargando datos...
              </span>
            </div>
          ) : activeSection === "propiedades" ? (
            <AdminProperties propiedades={propiedades} onRefresh={loadData} />
          ) : (
            <AdminConfig config={config} onRefresh={loadData} />
          )}
        </div>
      </main>
    </div>
  );
}
