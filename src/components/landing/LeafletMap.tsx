import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import type { Propiedad } from "@/lib/supabase-helpers";

// Fix default icon (required by Leaflet even if we don't use it)
L.Marker.prototype.options.icon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const createCustomIcon = (isActive: boolean) => {
  const size = isActive ? 20 : 16;
  const halo = isActive ? 8 : 5;
  return L.divIcon({
    className: "",
    html: `<div style="
        width: ${size}px;
        height: ${size}px;
        background: #2c3e2c;
        border: 3px solid #faf8f5;
        border-radius: 50%;
        box-shadow: 0 0 0 ${halo}px rgba(90,122,90,0.25);
        transition: all 0.3s ease;
      "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

interface LeafletMapProps {
  propiedades: Propiedad[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  flyToId: string | null;
  isMobile?: boolean;
}

function FlyTo({
  propiedades,
  flyToId,
}: {
  propiedades: Propiedad[];
  flyToId: string | null;
}) {
  const map = useMap();
  const lastId = useRef<string | null>(null);

  useEffect(() => {
    if (!flyToId || flyToId === lastId.current) return;
    const p = propiedades.find((x) => x.id === flyToId);
    if (p && p.lat != null && p.lng != null) {
      map.flyTo([p.lat, p.lng], 12, { duration: 1.2 });
      lastId.current = flyToId;
    }
  }, [flyToId, propiedades, map]);

  return null;
}

export default function LeafletMap({
  propiedades,
  activeId,
  setActiveId,
  flyToId,
  isMobile = false,
}: LeafletMapProps) {
  return (
    <MapContainer
      center={[-33.8, -71.2]}
      zoom={8}
      zoomControl={false}
      attributionControl={false}
      dragging={!isMobile}
      scrollWheelZoom={!isMobile}
      touchZoom={!isMobile}
      doubleClickZoom={!isMobile}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#f0ebe3",
      }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      <FlyTo propiedades={propiedades} flyToId={flyToId} />
      {propiedades.map((p) => {
        if (p.lat == null || p.lng == null) return null;
        return (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={createCustomIcon(activeId === p.id)}
            eventHandlers={{
              click: () => setActiveId(p.id),
              mouseover: () => setActiveId(p.id),
            }}
          />
        );
      })}
    </MapContainer>
  );
}
