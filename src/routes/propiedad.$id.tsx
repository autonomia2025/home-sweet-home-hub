import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { fetchPropiedadById } from "@/lib/supabase-helpers";
import type { Propiedad, Caracteristicas } from "@/lib/supabase-helpers";
import { useConfig } from "@/context/ConfigContext";
import { useSEO } from "@/hooks/useSEO";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { WhatsAppFloatingButton } from "@/components/landing/WhatsAppFloatingButton";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SkeletonText, SkeletonBlock } from "@/components/ui/skeleton";
import {
  MapPin, ArrowLeft, Ruler, BedDouble, Bath, Car, Package,
} from "lucide-react";

export const Route = createFileRoute("/propiedad/$id")({
  component: PropiedadDetalle,
  head: () => ({
    meta: [
      { title: "Propiedad | Inmobiliaria Pérez-Campos" },
      { name: "description", content: "Detalle de propiedad — Inmobiliaria Pérez-Campos." },
    ],
  }),
});

function PropiedadDetalle() {
  const { id } = Route.useParams();
  const { whatsapp } = useConfig();
  const [prop, setProp] = useState<Propiedad | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [error, setError] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useSEO({
    title: prop ? `${prop.titulo} | Inmobiliaria Pérez-Campos` : undefined,
    description: prop ? `${prop.descripcion || ""} — ${prop.comuna || ""}` : undefined,
    imageUrl: prop?.imagen_url || undefined,
    type: "article",
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(true), 300);
    fetchPropiedadById(id)
      .then(setProp)
      .catch(() => setError(true))
      .finally(() => {
        clearTimeout(timer);
        setLoading(false);
      });
    return () => clearTimeout(timer);
  }, [id]);

  if (loading && showSkeleton) return <DetailSkeleton />;
  if (loading && !showSkeleton) return null;
  if (error || !prop) return <ErrorState />;

  const allImages: string[] = [];
  if (prop.imagen_url) allImages.push(prop.imagen_url);
  if (prop.imagenes?.length) allImages.push(...prop.imagenes);

  const waMessage = `Hola, me interesa la propiedad: ${prop.titulo}`;
  const waLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(waMessage)}`
    : "#";

  const chars = (prop.caracteristicas || {}) as Caracteristicas;
  const hasChars = Object.values(chars).some((v) => v !== undefined && v !== null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f3" }}>
      <LandingNavbar />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <a
            href="/#propiedades"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/#propiedades";
            }}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase font-body mb-8 transition-opacity hover:opacity-60"
            style={{ color: "#0a0a0a", fontWeight: 400 }}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Volver
          </a>

          <span
            className="inline-block text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 mb-4 font-body text-white"
            style={{ backgroundColor: "rgba(10,10,10,0.85)", fontWeight: 400 }}
          >
            {prop.tipo === "venta" ? "VENTA" : "ARRIENDO"}
          </span>

          <h1
            className="font-display mb-3"
            style={{ color: "#0a0a0a", fontWeight: 300, fontSize: "clamp(2rem, 6vw, 5rem)", lineHeight: 1.1 }}
          >
            {prop.titulo}
          </h1>

          {prop.comuna && (
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4" style={{ color: "#9a9a9a" }} />
              <span className="text-sm font-body" style={{ color: "#9a9a9a", fontWeight: 300 }}>{prop.comuna}</span>
            </div>
          )}

          <p className="font-display text-2xl mb-8" style={{ color: "#0a0a0a", fontWeight: 400 }}>{prop.precio}</p>

          {allImages.length > 0 ? (
            <div className="mb-12">
              <div className="relative mb-3" style={{ aspectRatio: "16/9" }}>
                <img src={allImages[activeImg]} alt={prop.titulo} className="w-full h-full object-cover transition-opacity duration-500" key={activeImg} />
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className="shrink-0 w-20 h-20 overflow-hidden transition-opacity"
                      style={{ opacity: i === activeImg ? 1 : 0.5, border: i === activeImg ? "2px solid #c8b8a2" : "2px solid transparent" }}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-12 flex items-center justify-center" style={{ aspectRatio: "16/9", backgroundColor: "#e8e8e5" }}>
              <span className="font-display text-4xl" style={{ color: "#ccc", fontWeight: 300 }}>PC</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
            <div>
              <div className="mb-8" style={{ borderTop: "1px solid #c8b8a2", paddingTop: "2rem" }}>
                <h2 className="font-display text-2xl mb-4" style={{ color: "#0a0a0a", fontWeight: 300 }}>Descripción</h2>
                <p className="font-body text-sm leading-relaxed whitespace-pre-line" style={{ color: "#6a6a6a", fontWeight: 300 }}>
                  {prop.descripcion_larga || prop.descripcion || "Sin descripción disponible."}
                </p>
              </div>

              {hasChars && (
                <div className="mb-8" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "2rem" }}>
                  <h2 className="font-display text-2xl mb-6" style={{ color: "#0a0a0a", fontWeight: 300 }}>Características</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {chars.superficie_m2 != null && <CharItem icon={<Ruler className="h-4 w-4" />} label="Superficie" value={`${chars.superficie_m2} m²`} />}
                    {chars.dormitorios != null && <CharItem icon={<BedDouble className="h-4 w-4" />} label="Dormitorios" value={String(chars.dormitorios)} />}
                    {chars.banos != null && <CharItem icon={<Bath className="h-4 w-4" />} label="Baños" value={String(chars.banos)} />}
                    {chars.estacionamiento != null && <CharItem icon={<Car className="h-4 w-4" />} label="Estacionamiento" value={chars.estacionamiento ? "Sí" : "No"} />}
                    {chars.bodega != null && <CharItem icon={<Package className="h-4 w-4" />} label="Bodega" value={chars.bodega ? "Sí" : "No"} />}
                  </div>
                </div>
              )}

              {prop.ubicacion_referencia && (
                <div className="flex items-center gap-2 mb-8">
                  <MapPin className="h-4 w-4" style={{ color: "#c8b8a2" }} />
                  <span className="font-body text-sm" style={{ color: "#6a6a6a", fontWeight: 300 }}>{prop.ubicacion_referencia}</span>
                </div>
              )}
            </div>

            <div>
              <div className="sticky top-24 p-6 border" style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "#fff" }}>
                <p className="font-display text-2xl mb-1" style={{ color: "#0a0a0a", fontWeight: 400 }}>{prop.precio}</p>
                <span className="text-[10px] tracking-[0.15em] uppercase font-body" style={{ color: "#9a9a9a", fontWeight: 400 }}>
                  {prop.tipo === "venta" ? "Venta" : "Arriendo"}
                </span>
                <div className="my-5" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }} />
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-[11px] tracking-[0.15em] uppercase font-body py-3 border transition-all duration-300 hover:bg-[#0a0a0a] hover:text-white mb-3"
                  style={{ borderColor: "#0a0a0a", color: "#0a0a0a", fontWeight: 400 }}
                >
                  Consultar por WhatsApp
                </a>
                <p className="text-xs font-body text-center mb-5" style={{ color: "#9a9a9a", fontWeight: 300 }}>Respondemos el mismo día</p>
                <div className="my-5" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }} />
                <p className="text-xs font-body text-center" style={{ color: "#9a9a9a", fontWeight: 300 }}>
                  ¿Tienes dudas?{" "}
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#0a0a0a" }}>Escríbenos</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LandingFooter />
      <WhatsAppFloatingButton />
      <ScrollToTop />
    </div>
  );
}

function CharItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span style={{ color: "#c8b8a2" }}>{icon}</span>
      <div>
        <span className="block text-[10px] tracking-[0.1em] uppercase font-body" style={{ color: "#9a9a9a", fontWeight: 400 }}>{label}</span>
        <span className="text-sm font-body" style={{ color: "#0a0a0a", fontWeight: 400 }}>{value}</span>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f3" }}>
      <LandingNavbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <SkeletonText width="80px" className="mb-8 h-4" />
          <SkeletonBlock className="h-6 w-20 mb-4" />
          <SkeletonBlock className="h-14 w-3/4 mb-3" />
          <SkeletonText width="120px" className="mb-2 h-4" />
          <SkeletonBlock className="h-8 w-40 mb-8" />
          <SkeletonBlock className="w-full mb-12" style={{ aspectRatio: "16/9" }} />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
            <div className="space-y-3">
              <SkeletonText width="100%" />
              <SkeletonText width="100%" />
              <SkeletonText width="80%" />
              <SkeletonText width="60%" />
            </div>
            <SkeletonBlock className="h-72" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#f5f5f3" }}>
      <div className="text-center">
        <h1 className="font-display text-3xl mb-4" style={{ color: "#0a0a0a", fontWeight: 300 }}>Esta propiedad no está disponible</h1>
        <p className="font-body text-sm mb-8" style={{ color: "#9a9a9a", fontWeight: 300 }}>Es posible que haya sido removida o que el enlace sea incorrecto.</p>
        <Link to="/" className="inline-block text-[11px] tracking-[0.15em] uppercase font-body py-3 px-6 border transition-all duration-300 hover:bg-[#0a0a0a] hover:text-white" style={{ borderColor: "#0a0a0a", color: "#0a0a0a", fontWeight: 400 }}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
