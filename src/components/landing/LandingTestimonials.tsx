import { useReveal } from "@/hooks/use-reveal";

const testimonials = [
  {
    quote: "Nos ayudaron a encontrar nuestra casa de playa ideal. Un trato impecable de principio a fin.",
    name: "Familia Rodríguez",
    location: "Navidad",
  },
  {
    quote: "Profesionales, cercanos y sin apuros. Se nota que les importa que estés tranquilo con tu decisión.",
    name: "Carolina M.",
    location: "Santiago Centro",
  },
  {
    quote: "Vendimos nuestro terreno sin complicaciones. Siempre estuvieron disponibles para responder dudas.",
    name: "Andrés P.",
    location: "Puertecillo",
  },
];

export function LandingTestimonials() {
  const revealRef = useReveal();

  return (
    <section
      className="py-24 md:py-32 px-6"
      style={{ backgroundColor: "#f5f5f3" }}
      ref={revealRef}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="reveal-hidden font-display text-3xl md:text-5xl text-center mb-20"
          style={{ color: "#0a0a0a", fontWeight: 300 }}
        >
          Lo que dicen nuestros clientes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="reveal-hidden p-8 bg-white border"
              data-reveal-delay={i * 100}
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <span
                className="font-display text-5xl block mb-4 leading-none"
                style={{ color: "#c8b8a2" }}
              >
                &ldquo;
              </span>
              <p
                className="font-body text-sm leading-relaxed mb-6"
                style={{ color: "#4a4a4a", fontWeight: 300 }}
              >
                {t.quote}
              </p>
              <div className="line-separator-light mb-4" />
              <p
                className="font-body text-sm"
                style={{ color: "#0a0a0a", fontWeight: 500 }}
              >
                {t.name}
              </p>
              <p
                className="font-body text-xs"
                style={{ color: "#9a9a9a", fontWeight: 300 }}
              >
                {t.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
