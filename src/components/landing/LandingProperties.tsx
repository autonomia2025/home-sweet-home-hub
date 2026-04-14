import type { Propiedad } from "@/lib/supabase-helpers";
import { useReveal } from "@/hooks/use-reveal";
import { MapPin } from "lucide-react";

interface LandingPropertiesProps {
  propiedades: Propiedad[];
  whatsapp: string;
}

export function LandingProperties({ propiedades, whatsapp }: LandingPropertiesProps) {
  const revealRef = useReveal();

  return (
    <section
      id="propiedades"
      className="py-24 md:py-32 px-6"
      style={{ backgroundColor: "#f5f5f3" }}
      ref={revealRef}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="reveal-hidden font-display text-3xl md:text-5xl mb-16 text-center"
          style={{ color: "#0a0a0a", fontWeight: 300 }}
        >
          Propiedades disponibles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propiedades.map((p, i) => (
            <PropertyCardEditorial
              key={p.id}
              propiedad={p}
              whatsapp={whatsapp}
              delay={i * 100}
            />
          ))}
        </div>

        {propiedades.length === 0 && (
          <p className="text-center text-text-secondary font-body" style={{ fontWeight: 300 }}>
            No hay propiedades disponibles en este momento.
          </p>
        )}
      </div>
    </section>
  );
}

function PropertyCardEditorial({
  propiedad,
  whatsapp,
  delay,
}: {
  propiedad: Propiedad;
  whatsapp: string;
  delay: number;
}) {
  const waMessage = `Hola, me interesa la propiedad: ${propiedad.titulo}`;
  const waLink = `https://wa.me/${whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div
      className="reveal-hidden group bg-white transition-all duration-500 hover:-translate-y-1.5"
      data-reveal-delay={delay}
      style={{ borderLeft: "2px solid #c8b8a2" }}
    >
      {/* Image */}
      <div className="relative" style={{ aspectRatio: "4/3" }}>
        {propiedad.imagen_url ? (
          <img
            src={propiedad.imagen_url}
            alt={propiedad.titulo}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "#e8e8e5" }}
          >
            <span className="text-text-secondary text-sm font-body">Sin imagen</span>
          </div>
        )}
        {/* Badge */}
        <span
          className="absolute top-4 left-4 text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 text-white font-body"
          style={{ backgroundColor: "rgba(10,10,10,0.8)", fontWeight: 400 }}
        >
          {propiedad.tipo === "venta" ? "VENTA" : "ARRIENDO"}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3
          className="font-display text-xl md:text-2xl mb-2"
          style={{ color: "#0a0a0a", fontWeight: 400 }}
        >
          {propiedad.titulo}
        </h3>

        {propiedad.comuna && (
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin className="h-3 w-3" style={{ color: "#9a9a9a" }} />
            <span className="text-xs font-body" style={{ color: "#9a9a9a", fontWeight: 300 }}>
              {propiedad.comuna}
            </span>
          </div>
        )}

        {propiedad.descripcion && (
          <p
            className="text-sm font-body mb-4 line-clamp-2 leading-relaxed"
            style={{ color: "#6a6a6a", fontWeight: 300 }}
          >
            {propiedad.descripcion}
          </p>
        )}

        <p className="font-display text-lg mb-4" style={{ color: "#0a0a0a", fontWeight: 400 }}>
          {propiedad.precio}
        </p>

        {/* Separator */}
        <div className="line-separator-light mb-4" />

        {/* CTA */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-anim text-[11px] tracking-[0.15em] uppercase font-body"
          style={{ color: "#0a0a0a", fontWeight: 400 }}
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
