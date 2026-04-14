import { useEffect, useRef, useState } from "react";

export function LandingHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState("");
  const subtitle = "Inmuebles únicos en ubicaciones que importan.";

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

  // Typing effect
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= subtitle.length) {
        setTypedText(subtitle.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 40);
    return () => clearInterval(timer);
  }, []);

  const scrollToProperties = () => {
    document.getElementById("propiedades")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 relative"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div className="text-center max-w-5xl mx-auto">
        <h1
          className="font-display text-foreground leading-[1.05] mb-8 transition-transform duration-200 ease-out"
          style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 300,
          }}
        >
          Propiedades
          <br />
          con carácter
        </h1>

        {/* Decorative line */}
        <div className="flex justify-center mb-8">
          <div
            className="h-px animate-line-grow"
            style={{ backgroundColor: "#c8b8a2" }}
          />
        </div>

        {/* Typed subtitle */}
        <p
          className="font-body text-text-secondary text-lg md:text-xl mb-12 min-h-[2em]"
          style={{ fontWeight: 300 }}
        >
          {typedText}
          <span
            className="inline-block w-px h-5 ml-0.5 align-middle animate-typing-cursor"
            style={{
              borderRight: "2px solid",
              borderColor: typedText.length === subtitle.length ? "transparent" : "#c8b8a2",
            }}
          />
        </p>

        {/* CTA */}
        <button
          onClick={scrollToProperties}
          className="underline-anim text-[12px] tracking-[0.2em] uppercase text-foreground font-body"
          style={{ fontWeight: 400 }}
        >
          VER PROPIEDADES
        </button>
      </div>
    </section>
  );
}
