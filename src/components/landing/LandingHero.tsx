import { useEffect, useRef } from "react";
import heroBg from "@/assets/hero-landing.jpg";
import { useConfig } from "@/context/ConfigContext";

export function LandingHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { hero_titulo, hero_subtitulo, hero_imagen_url } = useConfig();
  const subtitle = hero_subtitulo;
  const bgImage = hero_imagen_url || heroBg;
  const titleLines = hero_titulo.split("\n");

  // Parallax effect
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const h1 = el.querySelector("h1") as HTMLElement;
      if (h1) {
        h1.style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
      }
    };

    const handleMouseLeave = () => {
      const h1 = el.querySelector("h1") as HTMLElement;
      if (h1) {
        h1.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
      }
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);


  const scrollToProperties = () => {
    document.getElementById("propiedades")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >
      <img
        src={bgImage}
        alt="Hero inmobiliaria"
        className="absolute inset-0 w-full h-full object-cover object-[center_35%] scale-95 md:scale-100 md:object-center"
        style={{ opacity: 0.4 }}
        width={1920}
        height={1080}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,15,15,0.72) 0%, rgba(15,15,15,0.56) 50%, rgba(15,15,15,0.84) 100%)",
        }}
      />
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <h1
          className="font-display leading-[1.05] mb-8 transition-transform duration-200 ease-out"
          style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 300,
            color: "#ffffff",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}
        >
          {titleLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < titleLines.length - 1 && <br />}
            </span>
          ))}
        </h1>

        {/* Decorative line */}
        <div className="flex justify-center mb-8">
          <div
            className="h-px animate-line-grow"
            style={{ backgroundColor: "#ffffff" }}
          />
        </div>

        {/* Subtitle */}
        <p
          className="font-body text-lg md:text-xl mb-12"
          style={{ fontWeight: 300, color: "rgba(255,255,255,0.85)" }}
        >
          {subtitle}
        </p>

        {/* CTA */}
        <button
          onClick={scrollToProperties}
          className="text-[12px] tracking-[0.2em] uppercase font-body pb-1"
          style={{
            fontWeight: 400,
            color: "#ffffff",
            borderBottom: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          VER PROPIEDADES
        </button>
      </div>
    </section>
  );
}
