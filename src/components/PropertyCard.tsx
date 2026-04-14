import type { Propiedad } from "@/lib/supabase-helpers";
import { MapPin } from "lucide-react";

interface PropertyCardProps {
  propiedad: Propiedad;
  whatsapp?: string;
}

export function PropertyCard({ propiedad, whatsapp }: PropertyCardProps) {
  const waMessage = `Hola, me interesa la propiedad: ${propiedad.titulo}`;
  const waLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(waMessage)}`
    : undefined;

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {propiedad.imagen_url ? (
          <img
            src={propiedad.imagen_url}
            alt={propiedad.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-accent">
            <span className="text-muted-foreground text-sm">Sin imagen</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide">
          {propiedad.tipo === "venta" ? "Venta" : "Arriendo"}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-card-foreground mb-2 leading-snug">
          {propiedad.titulo}
        </h3>
        {propiedad.comuna && (
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="h-3.5 w-3.5" />
            <span>{propiedad.comuna}</span>
          </div>
        )}
        {propiedad.descripcion && (
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
            {propiedad.descripcion}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{propiedad.precio}</span>
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Consultar →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
