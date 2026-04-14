import type { Propiedad } from "@/lib/supabase-helpers";
import { PropertyCard } from "./PropertyCard";

interface PropertyGridProps {
  propiedades: Propiedad[];
  whatsapp?: string;
}

export function PropertyGrid({ propiedades, whatsapp }: PropertyGridProps) {
  if (propiedades.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No hay propiedades disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {propiedades.map((p) => (
        <PropertyCard key={p.id} propiedad={p} whatsapp={whatsapp} />
      ))}
    </div>
  );
}
