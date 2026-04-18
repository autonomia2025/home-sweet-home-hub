import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { fetchPropiedadById } from "@/lib/supabase-helpers";
import type { Propiedad, Caracteristicas } from "@/lib/supabase-helpers";
import { useConfig } from "@/context/ConfigContext";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { WhatsAppFloatingButton } from "@/components/landing/WhatsAppFloatingButton";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SkeletonText, SkeletonBlock } from "@/components/ui/skeleton";
import {
  MapPin, ArrowLeft, Ruler, BedDouble, Bath, Car, Package,
  Layers, Receipt, Compass, CheckCircle, Calendar,
  WashingMachine, DoorOpen, Sun,
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

  // Badges de condiciones
  const condicionesBadges: string[] = [];
  if (prop.permite_mascotas) condicionesBadges.push("Permite mascotas");
  if (prop.amoblado) condicionesBadges.push("Amoblado");
  if (prop.actualmente_ocupado) condicionesBadges.push("Visitas con coordinación previa");
  if (prop.contribuciones === false) condicionesBadges.push("No paga contribuciones");

  // Ficha técnica
  const fichaItems: { icon: React.ReactNode; label: string; value: string }[] = [];
  if (chars.superficie_m2 != null) fichaItems.push({ icon: <Ruler className="h-4 w-4" />, label: "Superficie", value: `${chars.superficie_m2} m²` });
  if (chars.dormitorios != null) fichaItems.push({ icon: <BedDouble className="h-4 w-4" />, label: "Dormitorios", value: String(chars.dormitorios) });
  if (chars.banos != null) fichaItems.push({ icon: <Bath className="h-4 w-4" />, label: "Baños", value: String(chars.banos) });
  if (prop.piso != null) fichaItems.push({ icon: <Layers className="h-4 w-4" />, label: "Piso", value: String(prop.piso) });
  if (chars.estacionamiento != null) fichaItems.push({ icon: <Car className="h-4 w-4" />, label: "Estacionamiento", value: chars.estacionamiento ? "Sí" : "No" });
  if (chars.bodega != null) fichaItems.push({ icon: <Package className="h-4 w-4" />, label: "Bodega", value: chars.bodega ? "Sí" : "No" });
  if (chars.conexion_lavadora) fichaItems.push({ icon: <WashingMachine className="h-4 w-4" />, label: "Conexión lavadora", value: "Sí" });
  if (chars.closet) fichaItems.push({ icon: <DoorOpen className="h-4 w-4" />, label: "Clóset", value: "Sí" });
  if (chars.terraza_propia) fichaItems.push({ icon: <Sun className="h-4 w-4" />, label: "Terraza propia", value: "Sí" });
  if (prop.gastos_comunes) fichaItems.push({ icon: <Receipt className="h-4 w-4" />, label: "Gastos comunes", value: prop.gastos_comunes });
  if (prop.orientacion) fichaItems.push({ icon: <Compass className="h-4 w-4" />, label: "Orientación", value: prop.orientacion });
  if (prop.estado_propiedad) fichaItems.push({ icon: <CheckCircle className="h-4 w-4" />, label: "Estado", value: prop.estado_propiedad });
  if (prop.ano_construccion != null) fichaItems.push({ icon: <Calendar className="h-4 w-4" />, label: "Año construcción", value: String(prop.ano_construccion) });

  const amenidades = prop.amenidades || [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf8f5" }}>
      <LandingNavbar />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="flex w-fit items-center gap-2 text-[11px] tracking-[0.15em] uppercase font-body mb-6 transition-opacity hover:opacity-60"
            style={{ color: "#2c3e2c", fontWeight: 400 }}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Volver
          </Link>

          <span
            className="inline-block text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 mb-5 font-body text-white"
            style={{ backgroundColor: "rgba(10,10,10,0.85)", fontWeight: 400 }}
          >
            {prop.tipo === "venta" ? "VENTA" : "ARRIENDO"}
          </span>

          <h1
            className="font-display mb-3"
            style={{ color: "#2c3e2c", fontWeight: 300, fontSize: "clamp(2rem, 6vw, 5rem)", lineHeight: 1.1 }}
          >
            {prop.titulo}
          </h1>

          {prop.comuna && (
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4" style={{ color: "#8a7a6a" }} />
              <span className="text-sm font-body" style={{ color: "#8a7a6a", fontWeight: 300 }}>{prop.comuna}</span>
            </div>
          )}

          <p className="font-display text-2xl mb-6" style={{ color: "#2c3e2c", fontWeight: 400 }}>{prop.precio}</p>

          {condicionesBadges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {condicionesBadges.map((b) => (
                <span
                  key={b}
                  className="text-[10px] tracking-[0.1em] uppercase font-body px-3 py-1.5"
                  style={{
                    backgroundColor: "rgba(90,122,90,0.08)",
                    color: "#2c3e2c",
                    border: "1px solid rgba(90,122,90,0.25)",
                    fontWeight: 400,
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          )}

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
                      style={{ opacity: i === activeImg ? 1 : 0.5, border: i === activeImg ? "2px solid #5a7a5a" : "2px solid transparent" }}
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
              <div className="mb-8" style={{ borderTop: "1px solid #5a7a5a", paddingTop: "2rem" }}>
                <h2 className="font-display text-2xl mb-4" style={{ color: "#2c3e2c", fontWeight: 300 }}>Descripción</h2>
                <p className="font-body text-sm leading-relaxed whitespace-pre-line" style={{ color: "#6a6a6a", fontWeight: 300 }}>
                  {prop.descripcion_larga || prop.descripcion || "Sin descripción disponible."}
                </p>
              </div>

              {fichaItems.length > 0 && (
                <div className="mb-8" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "2rem" }}>
                  <h2 className="font-display text-2xl mb-6" style={{ color: "#2c3e2c", fontWeight: 300 }}>Características</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {fichaItems.map((item, i) => (
                      <CharItem key={i} icon={item.icon} label={item.label} value={item.value} />
                    ))}
                  </div>
                </div>
              )}

              {amenidades.length > 0 && (
                <div className="mb-8" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "2rem" }}>
                  <h2 className="font-display text-2xl mb-4" style={{ color: "#2c3e2c", fontWeight: 300 }}>Edificio</h2>
                  <div className="flex flex-wrap gap-2">
                    {amenidades.map((a) => (
                      <span
                        key={a}
                        className="text-xs font-body px-3 py-1.5"
                        style={{
                          backgroundColor: "rgba(200,184,162,0.15)",
                          color: "#2c3e2c",
                          fontWeight: 400,
                        }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {prop.condiciones_adicionales && (
                <div className="mb-8" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "2rem" }}>
                  <h2 className="font-display text-2xl mb-4" style={{ color: "#2c3e2c", fontWeight: 300 }}>Condiciones</h2>
                  <p className="font-body text-sm leading-relaxed whitespace-pre-line" style={{ color: "#6a6a6a", fontWeight: 300 }}>
                    {prop.condiciones_adicionales}
                  </p>
                </div>
              )}

              {prop.ubicacion_referencia && (
                <div className="flex items-center gap-2 mb-8">
                  <MapPin className="h-4 w-4" style={{ color: "#5a7a5a" }} />
                  <span className="font-body text-sm" style={{ color: "#6a6a6a", fontWeight: 300 }}>{prop.ubicacion_referencia}</span>
                </div>
              )}
            </div>

            <div>
              <div className="sticky top-24 p-6 border" style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "#fff" }}>
                <p className="font-display text-2xl mb-1" style={{ color: "#2c3e2c", fontWeight: 400 }}>{prop.precio}</p>
                <span className="text-[10px] tracking-[0.15em] uppercase font-body" style={{ color: "#8a7a6a", fontWeight: 400 }}>
                  {prop.tipo === "venta" ? "Venta" : "Arriendo"}
                </span>
                <div className="my-5" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }} />
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-[11px] tracking-[0.15em] uppercase font-body py-3 border transition-all duration-300 hover:bg-[#2c3e2c] hover:text-white mb-3"
                  style={{ borderColor: "#2c3e2c", color: "#2c3e2c", fontWeight: 400 }}
                >
                  Consultar por WhatsApp
                </a>
                <p className="text-xs font-body text-center mb-5" style={{ color: "#8a7a6a", fontWeight: 300 }}>Respondemos el mismo día</p>
                <div className="my-5" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }} />
                <p className="text-xs font-body text-center" style={{ color: "#8a7a6a", fontWeight: 300 }}>
                  ¿Tienes dudas?{" "}
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#2c3e2c" }}>Escríbenos</a>
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
      <span style={{ color: "#5a7a5a" }}>{icon}</span>
      <div>
        <span className="block text-[10px] tracking-[0.1em] uppercase font-body" style={{ color: "#8a7a6a", fontWeight: 400 }}>{label}</span>
        <span className="text-sm font-body" style={{ color: "#2c3e2c", fontWeight: 400 }}>{value}</span>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf8f5" }}>
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
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#faf8f5" }}>
      <div className="text-center">
        <h1 className="font-display text-3xl mb-4" style={{ color: "#2c3e2c", fontWeight: 300 }}>Esta propiedad no está disponible</h1>
        <p className="font-body text-sm mb-8" style={{ color: "#8a7a6a", fontWeight: 300 }}>Es posible que haya sido removida o que el enlace sea incorrecto.</p>
        <Link to="/" className="inline-block text-[11px] tracking-[0.15em] uppercase font-body py-3 px-6 border transition-all duration-300 hover:bg-[#2c3e2c] hover:text-white" style={{ borderColor: "#2c3e2c", color: "#2c3e2c", fontWeight: 400 }}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
