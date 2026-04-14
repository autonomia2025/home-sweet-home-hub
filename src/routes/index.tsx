import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { fetchPropiedadesActivas, fetchConfiguracion, subscribeToPropiedades, subscribeToConfiguracion } from "@/lib/supabase-helpers";
import type { Propiedad } from "@/lib/supabase-helpers";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingProperties } from "@/components/landing/LandingProperties";
import { LandingAbout } from "@/components/landing/LandingAbout";
import { LandingWhyUs } from "@/components/landing/LandingWhyUs";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingCoverage } from "@/components/landing/LandingCoverage";
import { LandingCtaFinal } from "@/components/landing/LandingCtaFinal";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { WhatsAppFloatingButton } from "@/components/landing/WhatsAppFloatingButton";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Inmobiliaria Pérez-Campos | Propiedades en venta y arriendo en Chile" },
      { name: "description", content: "Propiedades únicas en Santiago y costa chilena. Trato directo y personalizado. Inmobiliaria Pérez-Campos." },
      { property: "og:title", content: "Inmobiliaria Pérez-Campos | Propiedades en venta y arriendo en Chile" },
      { property: "og:description", content: "Propiedades únicas en Santiago y costa chilena. Trato directo y personalizado." },
      { property: "og:type", content: "website" },
    ],
  }),
});

function HomePage() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchPropiedadesActivas(), fetchConfiguracion()])
      .then(([props, conf]) => {
        setPropiedades(props);
        setConfig(conf);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <span className="font-display text-2xl text-foreground/30 tracking-widest" style={{ fontWeight: 300 }}>
          PC
        </span>
      </div>
    );
  }

  const nombre = config.nombre_inmobiliaria || "Inmobiliaria Pérez-Campos";
  const whatsapp = config.whatsapp || "+56912345678";
  const presentacion = config.presentacion || "";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <LandingNavbar nombre={nombre} />
      <LandingHero />
      <LandingProperties propiedades={propiedades} whatsapp={whatsapp} />
      <LandingAbout presentacion={presentacion} />
      <LandingWhyUs />
      <LandingHowItWorks />
      <LandingTestimonials />
      <LandingCoverage />
      <LandingCtaFinal whatsapp={whatsapp} />
      <LandingFooter nombre={nombre} whatsapp={whatsapp} />
      <WhatsAppFloatingButton whatsapp={whatsapp} />
    </div>
  );
}
