import { useState, useMemo, lazy, Suspense, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { Propiedad } from "@/lib/supabase-helpers";
import { useConfig } from "@/context/ConfigContext";

const LeafletMap = lazy(() => import("./LeafletMap"));

interface LandingMapProps {
  propiedades: Propiedad[];
}

export function LandingMap({ propiedades }: LandingMapProps) {
  const { whatsapp } = useConfig();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [flyToId, setFlyToId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const withCoords = useMemo(
    () => propiedades.filter((p) => p.lat != null && p.lng != null),
    [propiedades]
  );

  if (withCoords.length === 0) return null;

  const handleListClick = (id: string) => {
    setActiveId(id);
    setFlyToId(id);
    // reset so same id can be clicked again
    setTimeout(() => setFlyToId(null), 100);
  };

  const MapPlaceholder = (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#f0ebe3",
      }}
    />
  );

  return (
    <section
      id="mapa"
      className="py-24 md:py-32 px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f0ebe3 0%, #e8e0d3 100%)",
        isolation: "isolate",
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
          <div className="md:col-span-7">
            <div
              style={{
                width: "100%",
                height: 520,
                boxShadow: "0 20px 40px rgba(44,36,22,0.12)",
                position: "relative",
              }}
            >
              <Suspense fallback={MapPlaceholder}>
                {mounted && (
                  <LeafletMap
                    propiedades={withCoords}
                    activeId={activeId}
                    setActiveId={setActiveId}
                    flyToId={flyToId}
                    isMobile={false}
                  />
                )}
              </Suspense>
            </div>
            <p
              className="text-[9px] tracking-[0.15em] uppercase mt-2 font-body text-right"
              style={{ color: "#8a7a6a", fontWeight: 400 }}
            >
              © OpenStreetMap · © CARTO
            </p>
          </div>

          {/* SIDE LIST */}
          <div className="md:col-span-5">
            <p
              className="text-[10px] tracking-[0.3em] uppercase mb-6 font-body"
              style={{ color: "#5a7a5a", fontWeight: 600 }}
            >
              {withCoords.length}{" "}
              {withCoords.length === 1 ? "PROPIEDAD" : "PROPIEDADES"} EN EL MAPA
              {withCoords.length > 3 && (
                <span style={{ color: "#8a7a6a", fontWeight: 400 }}>
                  {" · DESLIZA PARA VER TODAS"}
                </span>
              )}
            </p>
            <div style={{ position: "relative" }}>
            <ul
              className="space-y-1 max-h-[520px] overflow-y-auto pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#5a7a5a transparent",
              }}
            >
              {withCoords.map((p, idx) => {
                const isActive = activeId === p.id;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveId(p.id)}
                      onMouseLeave={() => setActiveId(null)}
                      onClick={() => handleListClick(p.id)}
                      className="group block w-full text-left py-5 transition-all"
                      style={{
                        borderTop: "1px solid rgba(44,36,22,0.12)",
                        borderBottom:
                          idx === withCoords.length - 1
                            ? "1px solid rgba(44,36,22,0.12)"
                            : "none",
                        paddingLeft: isActive ? 16 : 8,
                        backgroundColor: isActive
                          ? "rgba(90,122,90,0.06)"
                          : "transparent",
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
                          <Link
                            to="/propiedad/$id"
                            params={{ id: p.id }}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-block mt-3 text-[10px] tracking-[0.2em] uppercase font-body"
                            style={{
                              color: "#5a7a5a",
                              fontWeight: 600,
                              borderBottom: "1px solid #5a7a5a",
                              paddingBottom: 2,
                            }}
                          >
                            Ver detalle →
                          </Link>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 mt-3 ml-4 text-[10px] tracking-[0.2em] uppercase font-body"
                            style={{
                              color: "#5a7a5a",
                              fontWeight: 600,
                              borderBottom: "1px solid #5a7a5a",
                              paddingBottom: 2,
                            }}
                          >
                            Google Maps <ExternalLink style={{ width: 10, height: 10 }} />
                          </a>
                        </div>
                        <ArrowUpRight
                          className="flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                          style={{ color: "#5a7a5a", width: 20, height: 20 }}
                        />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
            {withCoords.length > 3 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 8,
                  height: 60,
                  background:
                    "linear-gradient(180deg, rgba(240,235,227,0) 0%, #f0ebe3 100%)",
                  pointerEvents: "none",
                }}
              />
            )}
            </div>
          </div>
        </div>

        {/* MOBILE: sticky map + scroll list */}
        <div className="md:hidden">
          <div
            className="sticky z-10"
            style={{
              top: 12,
              width: "100%",
              height: 280,
              boxShadow: "0 12px 28px rgba(44,36,22,0.15)",
              marginBottom: 20,
            }}
          >
            <Suspense fallback={MapPlaceholder}>
              {mounted && (
                <LeafletMap
                  propiedades={withCoords}
                  activeId={activeId}
                  setActiveId={setActiveId}
                  flyToId={flyToId}
                  isMobile={true}
                />
              )}
            </Suspense>
          </div>
          <p
            className="text-[9px] tracking-[0.15em] uppercase mb-4 font-body text-right"
            style={{ color: "#8a7a6a", fontWeight: 400 }}
          >
            © OpenStreetMap · © CARTO
          </p>

          <ul className="space-y-3">
            {withCoords.map((p) => {
              const isActive = activeId === p.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => handleListClick(p.id)}
                    className="w-full text-left flex items-start gap-4 p-5 transition-all"
                    style={{
                      backgroundColor: "#faf8f5",
                      borderLeft: isActive
                        ? "5px solid #2c3e2c"
                        : "3px solid #5a7a5a",
                      boxShadow: "0 4px 12px rgba(44,36,22,0.06)",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[10px] tracking-[0.25em] uppercase mb-1 font-body"
                        style={{ color: "#5a7a5a", fontWeight: 600 }}
                      >
                        {p.tipo === "venta" ? "EN VENTA" : "EN ARRIENDO"}
                        {p.comuna && (
                          <span style={{ color: "#8a7a6a", fontWeight: 400 }}>
                            {" · "}
                            {p.comuna}
                          </span>
                        )}
                      </p>
                      <h3
                        className="font-display text-lg"
                        style={{ color: "#2c2416", fontWeight: 500 }}
                      >
                        {p.titulo}
                      </h3>
                      {p.precio && (
                        <p
                          className="font-body text-xs mt-1"
                          style={{ color: "#5a4a3a", fontWeight: 500 }}
                        >
                          {p.precio}
                        </p>
                      )}
                      <Link
                        to="/propiedad/$id"
                        params={{ id: p.id }}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-block mt-2 text-[10px] tracking-[0.2em] uppercase font-body"
                        style={{
                          color: "#5a7a5a",
                          fontWeight: 600,
                          borderBottom: "1px solid #5a7a5a",
                          paddingBottom: 2,
                        }}
                      >
                        Ver detalle →
                      </Link>
                    </div>
                    <ArrowUpRight
                      className="flex-shrink-0"
                      style={{ color: "#5a7a5a", width: 22, height: 22 }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
