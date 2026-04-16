import { useReveal } from "@/hooks/use-reveal";
import { useConfig } from "@/context/ConfigContext";

export function LandingCtaFinal() {
  const { whatsapp } = useConfig();
  const revealRef = useReveal();
  const waLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent("Hola, me gustaría consultar sobre sus propiedades.")}`
    : "#";

  return (
    <section
      id="cta-final"
      className="py-24 md:py-32 px-6"
      style={{ backgroundColor: "#2c3e2c" }}
      ref={revealRef}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="reveal-hidden font-display text-3xl md:text-5xl text-foreground mb-8"
          style={{ fontWeight: 300 }}
        >
          ¿Buscas tu próxima propiedad?
        </h2>
        <p
          className="reveal-hidden font-body text-text-secondary text-base md:text-lg mb-12"
          data-reveal-delay="100"
          style={{ fontWeight: 300 }}
        >
          Cuéntanos qué necesitas. Sin compromiso, sin apuros.
        </p>
        <div className="reveal-hidden" data-reveal-delay="200">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[12px] tracking-[0.2em] uppercase border border-foreground/30 px-8 py-4 text-foreground hover:bg-foreground hover:text-background transition-all duration-300 font-body"
            style={{ fontWeight: 400 }}
          >
            ESCRIBIR POR WHATSAPP
          </a>
        </div>
      </div>
    </section>
  );
}
