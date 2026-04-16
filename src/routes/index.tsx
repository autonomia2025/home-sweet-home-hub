import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { fetchPropiedadesActivas, subscribeToPropiedades } from "@/lib/supabase-helpers";
import type { Propiedad } from "@/lib/supabase-helpers";
import { useConfig } from "@/context/ConfigContext";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingProperties } from "@/components/landing/LandingProperties";
import { LandingAbout } from "@/components/landing/LandingAbout";
import { LandingMap } from "@/components/landing/LandingMap";
import { LandingWhyUs } from "@/components/landing/LandingWhyUs";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { LandingCoverage } from "@/components/landing/LandingCoverage";
import { LandingCtaFinal } from "@/components/landing/LandingCtaFinal";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { WhatsAppFloatingButton } from "@/components/landing/WhatsAppFloatingButton";
import { ScrollToTop } from "@/components/ScrollToTop";

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
  const { loading: configLoading } = useConfig();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [propsLoading, setPropsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(true), 300);
    fetchPropiedadesActivas()
      .then(setPropiedades)
      .catch(console.error)
      .finally(() => {
        clearTimeout(timer);
        setPropsLoading(false);
      });
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsub = subscribeToPropiedades(() => {
      fetchPropiedadesActivas().then(setPropiedades).catch(console.error);
    });
    return unsub;
  }, []);

  if (configLoading && !showSkeleton) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#2c3e2c" }}>
        <span className="font-display text-2xl text-foreground/30 tracking-widest" style={{ fontWeight: 300 }}>PC</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#2c3e2c" }}>
      <LandingNavbar />
      <LandingHero />
      <LandingProperties propiedades={propiedades} loading={propsLoading && showSkeleton} />
      <LandingMap propiedades={propiedades} />
      <LandingAbout />
      <LandingWhyUs />
      <LandingHowItWorks />
      <LandingTestimonials />
      <LandingFAQ />
      <LandingCoverage />
      <LandingCtaFinal />
      <LandingFooter />
      <WhatsAppFloatingButton />
      <ScrollToTop />
    </div>
  );
}
