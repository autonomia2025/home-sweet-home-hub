import { useReveal } from "@/hooks/use-reveal";

const items = [
  { numeral: "I", title: "Trato directo", desc: "Sin intermediarios ni complicaciones. Hablas con nosotros, siempre." },
  { numeral: "II", title: "Respuesta rápida", desc: "Contestamos cuando nos necesitas, sin demoras innecesarias." },
  { numeral: "III", title: "Propiedades verificadas", desc: "Cada inmueble que ofrecemos ha sido revisado personalmente." },
  { numeral: "IV", title: "Acompañamiento real", desc: "Te guiamos en todo el proceso, de principio a fin." },
];

export function LandingWhyUs() {
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
          Por qué elegirnos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {items.map((item, i) => (
            <div
              key={item.numeral}
              className="reveal-hidden"
              data-reveal-delay={i * 100}
            >
              <span
                className="font-display text-5xl md:text-6xl block mb-6"
                style={{ color: "#c8b8a2", fontWeight: 300 }}
              >
                {item.numeral}
              </span>
              <h3
                className="font-display text-xl mb-3"
                style={{ color: "#0a0a0a", fontWeight: 400 }}
              >
                {item.title}
              </h3>
              <p
                className="font-body text-sm leading-relaxed"
                style={{ color: "#6a6a6a", fontWeight: 300 }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
