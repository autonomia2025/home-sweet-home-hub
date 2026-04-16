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
      style={{ backgroundColor: "#faf8f5" }}
      ref={revealRef}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="reveal-hidden font-display text-3xl md:text-5xl mb-8"
          style={{ fontWeight: 300, color: "#2c2416" }}
        >
          ¿Buscas tu próxima propiedad?
        </h2>
        <p
          className="reveal-hidden font-body text-base md:text-lg mb-12"
          data-reveal-delay="100"
          style={{ fontWeight: 300, color: "#5a4a3a" }}
        >
          Cuéntanos qué necesitas. Sin compromiso, sin apuros.
        </p>
        <div className="reveal-hidden" data-reveal-delay="200">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[12px] tracking-[0.2em] uppercase px-8 py-4 transition-all duration-300 font-body"
            style={{
              fontWeight: 400,
              border: "1px solid #2c3e2c",
              color: "#2c3e2c",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#2c3e2c";
              e.currentTarget.style.color = "#faf8f5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#2c3e2c";
            }}
          >
            ESCRIBIR POR WHATSAPP
          </a>
        </div>
      </div>
    </section>
  );
}
