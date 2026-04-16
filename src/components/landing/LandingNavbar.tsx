import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useConfig } from "@/context/ConfigContext";

export function LandingNavbar() {
  const { nombre_inmobiliaria } = useConfig();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border" : ""
      }`}
      style={{ backgroundColor: "#2c3e2c" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center border border-foreground/20">
            <span className="font-display text-lg tracking-widest text-foreground">PC</span>
          </div>
          <span
            className="hidden lg:block text-foreground text-[11px] font-body tracking-[0.2em] uppercase"
            style={{ fontWeight: 300 }}
          >
            {nombre_inmobiliaria}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "INICIO", target: "hero" },
            { label: "PROPIEDADES", target: "propiedades" },
            { label: "NOSOTROS", target: "nosotros" },
            { label: "CONTACTO", target: "cta-final" },
          ].map((item) => (
            <button
              key={item.target}
              onClick={() => scrollTo(item.target)}
              className="text-[11px] tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors uppercase font-body"
              style={{ fontWeight: 300 }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTo("cta-final")}
          className="text-[11px] tracking-[0.2em] uppercase border border-foreground/30 px-5 py-2.5 text-foreground hover:bg-foreground hover:text-background transition-all duration-300 font-body"
          style={{ fontWeight: 400 }}
        >
          CONTACTAR
        </button>
      </div>
    </nav>
  );
}
