import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { fetchPropiedadesActivas, fetchConfiguracion } from "@/lib/supabase-helpers";
import type { Propiedad } from "@/lib/supabase-helpers";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { PropertyGrid } from "@/components/PropertyGrid";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Inmobiliaria Pérez-Campos — Propiedades en Venta y Arriendo" },
      { name: "description", content: "Inmobiliaria familiar con años de experiencia. Propiedades en venta y arriendo en Chile." },
    ],
  }),
});

function HomePage() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [filtro, setFiltro] = useState<"todos" | "venta" | "arriendo">("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchPropiedadesActivas(), fetchConfiguracion()])
      .then(([props, conf]) => {
        setPropiedades(props);
        setConfig(conf);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filtro === "todos" ? propiedades : propiedades.filter((p) => p.tipo === filtro);
  const nombre = config.nombre_inmobiliaria || "Inmobiliaria Pérez-Campos";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar nombreInmobiliaria={nombre} whatsapp={config.whatsapp} />
      <HeroSection nombre={nombre} presentacion={config.presentacion || ""} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-4">
            Nuestras Propiedades
          </h2>
          <div className="flex items-center justify-center gap-2 mt-6">
            {(["todos", "venta", "arriendo"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filtro === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {f === "todos" ? "Todos" : f === "venta" ? "Venta" : "Arriendo"}
              </button>
            ))}
          </div>
        </div>

        <PropertyGrid propiedades={filtered} whatsapp={config.whatsapp} />
      </main>

      <Footer nombre={nombre} />
    </div>
  );
}
