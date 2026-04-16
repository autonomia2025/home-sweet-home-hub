import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, MessageCircle } from "lucide-react";
import type { Propiedad } from "@/lib/supabase-helpers";
import { useConfig } from "@/context/ConfigContext";


interface LandingMapProps {
  propiedades: Propiedad[];
}

// Bounding box for the visible map area (centered on RM + costa VI región)
const BBOX = {
  minLat: -34.6,  // south
  maxLat: -33.0,  // north
  minLng: -72.2,  // west (coast)
  maxLng: -70.2,  // east (cordillera)
};

const MAP_W = 500;
const MAP_H = 600;

function project(lat: number, lng: number) {
  const x = ((lng - BBOX.minLng) / (BBOX.maxLng - BBOX.minLng)) * MAP_W;
  const y = ((BBOX.maxLat - lat) / (BBOX.maxLat - BBOX.minLat)) * MAP_H;
  return { x, y };
}

export function LandingMap({ propiedades }: LandingMapProps) {
  const { whatsapp } = useConfig();
  
  const [activeId, setActiveId] = useState<string | null>(null);

  const withCoords = useMemo(
    () => propiedades.filter((p) => p.lat != null && p.lng != null),
    [propiedades]
  );

  if (withCoords.length === 0) return null;

  const waLink = (titulo: string) =>
    whatsapp
      ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
          `Hola, me interesa la propiedad: ${titulo}`
        )}`
      : "#";

  return (
    <section
      id="mapa"
      className="py-24 md:py-32 px-6"
      style={{ backgroundColor: "#f0ebe3" }}
     
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-[11px] tracking-[0.3em] uppercase mb-4 font-body"
            style={{ color: "#5a7a5a", fontWeight: 400 }}
          >
            — Cobertura —
          </p>
          <h2
            className="font-display text-3xl md:text-5xl mb-4"
            style={{ color: "#2c3e2c", fontWeight: 300 }}
          >
            Dónde estamos
          </h2>
          <p
            className="font-body text-base md:text-lg max-w-xl mx-auto"
            style={{ color: "#8a7a6a", fontWeight: 300 }}
          >
            Propiedades en Santiago y la costa chilena
          </p>
        </div>

        {/* Desktop / Tablet: Visual map */}
        <div className="hidden md:flex justify-center">
          <div className="relative" style={{ width: MAP_W, maxWidth: "100%" }}>
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              className="w-full h-auto"
              style={{ maxHeight: 600 }}
            >
              {/* Simplified Chile silhouette (RM + VI costa) */}
              <path
                d="M 180 20 L 220 30 L 240 60 L 260 90 L 280 120 L 295 150 L 310 180 L 320 210 L 325 240 L 320 270 L 315 300 L 305 330 L 295 360 L 285 390 L 280 420 L 275 450 L 270 480 L 260 510 L 245 540 L 230 570 L 215 590 L 200 580 L 190 555 L 185 525 L 180 495 L 175 465 L 170 435 L 165 405 L 160 375 L 155 345 L 150 315 L 145 285 L 140 255 L 145 225 L 155 195 L 165 165 L 170 135 L 172 105 L 175 75 L 178 45 Z"
                fill="#ffffff"
                stroke="#5a7a5a"
                strokeWidth="1.5"
                opacity="0.85"
              />
              {/* Coast indicator line */}
              <path
                d="M 175 75 L 170 135 L 165 195 L 155 255 L 150 315 L 155 375 L 165 435 L 175 495 L 195 555"
                stroke="#5a7a5a"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="2 3"
                opacity="0.5"
              />

              {/* Region labels */}
              <text
                x={285}
                y={195}
                className="font-body"
                style={{ fontSize: 9, fill: "#8a7a6a", letterSpacing: "0.15em" }}
              >
                R.M.
              </text>
              <text
                x={210}
                y={385}
                className="font-body"
                style={{ fontSize: 9, fill: "#8a7a6a", letterSpacing: "0.15em" }}
              >
                VI REGIÓN
              </text>

              {/* Property points */}
              {withCoords.map((p) => {
                const { x, y } = project(p.lat!, p.lng!);
                const isActive = activeId === p.id;
                return (
                  <g
                    key={p.id}
                    onMouseEnter={() => setActiveId(p.id)}
                    onMouseLeave={() => setActiveId(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Pulsing aura */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 18 : 14}
                      fill="#5a7a5a"
                      opacity="0.25"
                      style={{
                        transition: "r 0.3s ease",
                        animation: "wa-pulse 2s ease-in-out infinite",
                      }}
                    />
                    {/* Inner dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r={6}
                      fill="#2c3e2c"
                      stroke="#faf8f5"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Tooltip cards (positioned absolutely over the SVG) */}
            {withCoords.map((p) => {
              if (activeId !== p.id) return null;
              const { x, y } = project(p.lat!, p.lng!);
              const leftPct = (x / MAP_W) * 100;
              const topPct = (y / MAP_H) * 100;
              return (
                <div
                  key={p.id}
                  onMouseEnter={() => setActiveId(p.id)}
                  onMouseLeave={() => setActiveId(null)}
                  className="absolute z-10 pointer-events-auto"
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    transform: "translate(-50%, -110%)",
                    minWidth: 240,
                    backgroundColor: "#faf8f5",
                    border: "1px solid #5a7a5a",
                    padding: "16px",
                    boxShadow: "0 8px 24px rgba(44,36,22,0.15)",
                  }}
                >
                  <p
                    className="text-[10px] tracking-[0.2em] uppercase mb-2 font-body"
                    style={{ color: "#5a7a5a", fontWeight: 400 }}
                  >
                    {p.tipo === "venta" ? "EN VENTA" : "EN ARRIENDO"}
                  </p>
                  <h3
                    className="font-display text-lg mb-1"
                    style={{ color: "#2c3e2c", fontWeight: 400, lineHeight: 1.2 }}
                  >
                    {p.titulo}
                  </h3>
                  {p.comuna && (
                    <p
                      className="text-xs font-body mb-3"
                      style={{ color: "#8a7a6a", fontWeight: 300 }}
                    >
                      {p.comuna}
                    </p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Link
                      to="/propiedad/$id"
                      params={{ id: p.id }}
                      className="flex-1 text-center text-[10px] tracking-[0.15em] uppercase font-body py-2 px-3 transition-all"
                      style={{
                        backgroundColor: "#2c3e2c",
                        color: "#faf8f5",
                        fontWeight: 400,
                      }}
                    >
                      Ver detalle
                    </Link>
                    {whatsapp && (
                      <a
                        href={waLink(p.titulo)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-3 transition-all"
                        style={{
                          border: "1px solid #5a7a5a",
                          color: "#5a7a5a",
                        }}
                        aria-label="Contactar por WhatsApp"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Visual list with pin icons */}
        <div className="md:hidden space-y-3">
          {withCoords.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-4 transition-all"
              style={{
                backgroundColor: "#faf8f5",
                borderLeft: "3px solid #5a7a5a",
              }}
            >
              <div
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: "#2c3e2c" }}
              >
                <MapPin className="h-5 w-5" style={{ color: "#faf8f5" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] tracking-[0.2em] uppercase font-body"
                  style={{ color: "#5a7a5a", fontWeight: 400 }}
                >
                  {p.tipo === "venta" ? "EN VENTA" : "EN ARRIENDO"}
                </p>
                <h3
                  className="font-display text-base truncate"
                  style={{ color: "#2c3e2c", fontWeight: 400 }}
                >
                  {p.titulo}
                </h3>
                {p.comuna && (
                  <p
                    className="text-xs font-body truncate"
                    style={{ color: "#8a7a6a", fontWeight: 300 }}
                  >
                    {p.comuna}
                  </p>
                )}
              </div>
              <Link
                to="/propiedad/$id"
                params={{ id: p.id }}
                className="flex-shrink-0 text-[10px] tracking-[0.15em] uppercase font-body px-3 py-2"
                style={{
                  border: "1px solid #2c3e2c",
                  color: "#2c3e2c",
                  fontWeight: 400,
                }}
              >
                Ver
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
