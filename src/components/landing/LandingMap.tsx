import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, MessageCircle, ArrowUpRight } from "lucide-react";
import type { Propiedad } from "@/lib/supabase-helpers";
import { useConfig } from "@/context/ConfigContext";

interface LandingMapProps {
  propiedades: Propiedad[];
}

// Bounding box: RM + costa VI región
const BBOX = {
  minLat: -34.6,
  maxLat: -33.0,
  minLng: -72.2,
  maxLng: -70.2,
};

const MAP_W = 440;
const MAP_H = 580;

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
      className="py-24 md:py-32 px-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #f0ebe3 0%, #e8e0d3 100%)",
      }}
    >
      {/* Decorative top line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{ width: 1, height: 60, backgroundColor: "#5a7a5a", opacity: 0.4 }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <p
            className="text-[11px] tracking-[0.35em] uppercase mb-5 font-body"
            style={{ color: "#5a7a5a", fontWeight: 500 }}
          >
            — COBERTURA —
          </p>
          <h2
            className="font-display text-4xl md:text-6xl mb-5"
            style={{ color: "#2c2416", fontWeight: 400, letterSpacing: "-0.01em" }}
          >
            Dónde estamos
          </h2>
          <p
            className="font-body text-base md:text-lg max-w-xl mx-auto"
            style={{ color: "#5a4a3a", fontWeight: 400 }}
          >
            Propiedades seleccionadas en Santiago y la costa chilena
          </p>
        </div>

        {/* Desktop: side-by-side map + list */}
        <div className="hidden md:grid md:grid-cols-12 gap-12 items-start">
          {/* MAP */}
          <div className="md:col-span-7 flex justify-center">
            <div className="relative" style={{ width: MAP_W, maxWidth: "100%" }}>
              <svg
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                className="w-full h-auto"
                style={{
                  filter: "drop-shadow(0 20px 40px rgba(44,36,22,0.12))",
                }}
              >
                <defs>
                  {/* Gradient for landmass */}
                  <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#faf8f5" />
                    <stop offset="100%" stopColor="#f5efe5" />
                  </linearGradient>
                  {/* Ocean pattern */}
                  <pattern id="oceanLines" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
                    <line x1="0" y1="4" x2="8" y2="4" stroke="#5a7a5a" strokeWidth="0.4" opacity="0.18" />
                  </pattern>
                </defs>

                {/* Ocean background (left side) */}
                <rect width={MAP_W} height={MAP_H} fill="url(#oceanLines)" />

                {/* Chile landmass — more realistic curvy silhouette of central Chile */}
                <path
                  d="
                    M 165 10
                    C 175 30, 178 50, 182 80
                    C 185 110, 188 140, 192 170
                    C 200 200, 215 220, 230 235
                    C 245 250, 258 260, 268 275
                    C 278 295, 282 320, 285 345
                    C 286 370, 282 395, 275 420
                    C 268 445, 258 465, 248 485
                    C 240 505, 232 525, 222 545
                    C 215 560, 208 572, 200 580
                    C 192 575, 185 565, 180 550
                    C 175 530, 172 510, 170 490
                    C 167 465, 162 440, 155 415
                    C 148 385, 142 355, 138 325
                    C 134 295, 132 265, 134 235
                    C 138 205, 144 175, 148 145
                    C 150 115, 152 85, 155 55
                    C 158 35, 161 20, 165 10
                    Z
                  "
                  fill="url(#landGrad)"
                  stroke="#5a7a5a"
                  strokeWidth="1.2"
                />

                {/* Coastline accent (subtle) */}
                <path
                  d="
                    M 155 55
                    C 152 85, 150 115, 148 145
                    C 144 175, 138 205, 134 235
                    C 132 265, 134 295, 138 325
                    C 142 355, 148 385, 155 415
                  "
                  fill="none"
                  stroke="#5a7a5a"
                  strokeWidth="0.6"
                  strokeDasharray="3 4"
                  opacity="0.5"
                />

                {/* Cordillera shading on east */}
                <path
                  d="
                    M 240 240
                    C 255 255, 268 275, 278 300
                    C 284 325, 286 355, 282 385
                    C 276 415, 266 445, 255 470
                  "
                  fill="none"
                  stroke="#2c3e2c"
                  strokeWidth="0.8"
                  opacity="0.25"
                />

                {/* Region labels */}
                <g style={{ fontFamily: "DM Sans, sans-serif" }}>
                  <text
                    x={250}
                    y={205}
                    style={{ fontSize: 9, fill: "#5a4a3a", letterSpacing: "0.25em", fontWeight: 500 }}
                  >
                    REGIÓN
                  </text>
                  <text
                    x={250}
                    y={218}
                    style={{ fontSize: 11, fill: "#2c3e2c", letterSpacing: "0.15em", fontWeight: 600 }}
                  >
                    METROPOLITANA
                  </text>

                  <text
                    x={195}
                    y={400}
                    style={{ fontSize: 9, fill: "#5a4a3a", letterSpacing: "0.25em", fontWeight: 500 }}
                  >
                    REGIÓN
                  </text>
                  <text
                    x={195}
                    y={413}
                    style={{ fontSize: 11, fill: "#2c3e2c", letterSpacing: "0.15em", fontWeight: 600 }}
                  >
                    DEL LIB. B. O&apos;HIGGINS
                  </text>

                  {/* Compass */}
                  <g transform={`translate(${MAP_W - 50}, 40)`}>
                    <circle r="18" fill="none" stroke="#5a7a5a" strokeWidth="0.8" opacity="0.5" />
                    <line x1="0" y1="-15" x2="0" y2="15" stroke="#5a7a5a" strokeWidth="0.6" opacity="0.5" />
                    <line x1="-15" y1="0" x2="15" y2="0" stroke="#5a7a5a" strokeWidth="0.6" opacity="0.5" />
                    <text y="-22" textAnchor="middle" style={{ fontSize: 9, fill: "#2c3e2c", fontWeight: 600 }}>
                      N
                    </text>
                  </g>
                </g>

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
                      {/* Outer pulsing ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r={20}
                        fill="#5a7a5a"
                        opacity="0.15"
                        style={{
                          animation: "wa-pulse 2.5s ease-in-out infinite",
                          transformOrigin: `${x}px ${y}px`,
                        }}
                      />
                      {/* Mid ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isActive ? 14 : 11}
                        fill="#5a7a5a"
                        opacity="0.35"
                        style={{ transition: "r 0.3s ease" }}
                      />
                      {/* Inner solid pin */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isActive ? 7 : 5.5}
                        fill="#2c3e2c"
                        stroke="#faf8f5"
                        strokeWidth="2"
                        style={{ transition: "r 0.3s ease" }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip */}
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
                    className="absolute z-20 pointer-events-auto"
                    style={{
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      transform: "translate(-50%, calc(-100% - 18px))",
                      minWidth: 260,
                      backgroundColor: "#faf8f5",
                      borderTop: "2px solid #5a7a5a",
                      padding: "18px 20px",
                      boxShadow: "0 12px 32px rgba(44,36,22,0.18)",
                    }}
                  >
                    <p
                      className="text-[10px] tracking-[0.25em] uppercase mb-2 font-body"
                      style={{ color: "#5a7a5a", fontWeight: 600 }}
                    >
                      {p.tipo === "venta" ? "EN VENTA" : "EN ARRIENDO"}
                    </p>
                    <h3
                      className="font-display text-xl mb-1.5"
                      style={{ color: "#2c2416", fontWeight: 500, lineHeight: 1.15 }}
                    >
                      {p.titulo}
                    </h3>
                    {p.comuna && (
                      <p
                        className="text-xs font-body mb-3"
                        style={{ color: "#5a4a3a", fontWeight: 400 }}
                      >
                        {p.comuna}
                      </p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Link
                        to="/propiedad/$id"
                        params={{ id: p.id }}
                        className="flex-1 text-center text-[10px] tracking-[0.18em] uppercase font-body py-2.5 px-3 transition-all hover:opacity-90"
                        style={{
                          backgroundColor: "#2c3e2c",
                          color: "#faf8f5",
                          fontWeight: 500,
                        }}
                      >
                        Ver detalle
                      </Link>
                      {whatsapp && (
                        <a
                          href={waLink(p.titulo)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-3.5 transition-all hover:bg-[#5a7a5a]/10"
                          style={{
                            border: "1px solid #5a7a5a",
                            color: "#5a7a5a",
                          }}
                          aria-label="Contactar por WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    {/* Pointer */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{
                        bottom: -8,
                        width: 0,
                        height: 0,
                        borderLeft: "8px solid transparent",
                        borderRight: "8px solid transparent",
                        borderTop: "8px solid #faf8f5",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIDE LIST */}
          <div className="md:col-span-5">
            <p
              className="text-[10px] tracking-[0.3em] uppercase mb-6 font-body"
              style={{ color: "#5a7a5a", fontWeight: 600 }}
            >
              {withCoords.length} {withCoords.length === 1 ? "PROPIEDAD" : "PROPIEDADES"} EN EL MAPA
            </p>
            <ul className="space-y-1">
              {withCoords.map((p, idx) => {
                const isActive = activeId === p.id;
                return (
                  <li key={p.id}>
                    <Link
                      to="/propiedad/$id"
                      params={{ id: p.id }}
                      onMouseEnter={() => setActiveId(p.id)}
                      onMouseLeave={() => setActiveId(null)}
                      className="group block py-5 transition-all"
                      style={{
                        borderTop: "1px solid rgba(44,36,22,0.12)",
                        borderBottom:
                          idx === withCoords.length - 1
                            ? "1px solid rgba(44,36,22,0.12)"
                            : "none",
                        paddingLeft: isActive ? 16 : 8,
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[10px] tracking-[0.25em] uppercase mb-2 font-body"
                            style={{
                              color: isActive ? "#2c3e2c" : "#5a7a5a",
                              fontWeight: 600,
                              transition: "color 0.3s",
                            }}
                          >
                            {p.tipo === "venta" ? "VENTA" : "ARRIENDO"}
                            {p.comuna && (
                              <span style={{ color: "#8a7a6a", fontWeight: 400 }}>
                                {" · "}
                                {p.comuna}
                              </span>
                            )}
                          </p>
                          <h3
                            className="font-display text-xl md:text-2xl"
                            style={{
                              color: "#2c2416",
                              fontWeight: 400,
                              lineHeight: 1.2,
                            }}
                          >
                            {p.titulo}
                          </h3>
                          {p.precio && (
                            <p
                              className="font-body text-sm mt-2"
                              style={{ color: "#5a4a3a", fontWeight: 500 }}
                            >
                              {p.precio}
                            </p>
                          )}
                        </div>
                        <ArrowUpRight
                          className="flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                          style={{ color: "#5a7a5a", width: 20, height: 20 }}
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* MOBILE: list-only */}
        <div className="md:hidden space-y-3">
          {withCoords.map((p) => (
            <Link
              key={p.id}
              to="/propiedad/$id"
              params={{ id: p.id }}
              className="flex items-center gap-4 p-5 transition-all"
              style={{
                backgroundColor: "#faf8f5",
                borderLeft: "3px solid #5a7a5a",
                boxShadow: "0 4px 12px rgba(44,36,22,0.06)",
              }}
            >
              <div
                className="flex-shrink-0 w-11 h-11 flex items-center justify-center"
                style={{ backgroundColor: "#2c3e2c" }}
              >
                <MapPin className="h-5 w-5" style={{ color: "#faf8f5" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] tracking-[0.25em] uppercase mb-1 font-body"
                  style={{ color: "#5a7a5a", fontWeight: 600 }}
                >
                  {p.tipo === "venta" ? "EN VENTA" : "EN ARRIENDO"}
                </p>
                <h3
                  className="font-display text-lg truncate"
                  style={{ color: "#2c2416", fontWeight: 500 }}
                >
                  {p.titulo}
                </h3>
                {p.comuna && (
                  <p
                    className="text-xs font-body truncate"
                    style={{ color: "#5a4a3a", fontWeight: 400 }}
                  >
                    {p.comuna}
                  </p>
                )}
              </div>
              <ArrowUpRight
                className="flex-shrink-0"
                style={{ color: "#5a7a5a", width: 22, height: 22 }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
