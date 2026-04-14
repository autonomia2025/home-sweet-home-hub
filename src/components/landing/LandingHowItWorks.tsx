import { useReveal } from "@/hooks/use-reveal";

const steps = [
  { num: "01", title: "Cuéntanos qué buscas", desc: "Escríbenos por WhatsApp o formulario con lo que necesitas." },
  { num: "02", title: "Te presentamos opciones", desc: "Seleccionamos propiedades que se ajusten a tus necesidades." },
  { num: "03", title: "Acompañamos el proceso", desc: "Desde la visita hasta la firma, estamos contigo." },
];

export function LandingHowItWorks() {
  const revealRef = useReveal();

  return (
    <section
      className="py-24 md:py-32 px-6"
      style={{ backgroundColor: "#0a0a0a" }}
      ref={revealRef}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="reveal-hidden font-display text-3xl md:text-5xl text-foreground text-center mb-20"
          style={{ fontWeight: 300 }}
        >
          Cómo funciona
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector line (desktop only) */}
          <div
            className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          />

          {steps.map((step, i) => (
            <div
              key={step.num}
              className="reveal-hidden relative text-center"
              data-reveal-delay={i * 150}
            >
              <span
                className="font-display text-7xl md:text-8xl block mb-6"
                style={{ color: "#1a1a1a", fontWeight: 300 }}
              >
                {step.num}
              </span>
              <h3
                className="font-display text-xl text-foreground mb-3"
                style={{ fontWeight: 400 }}
              >
                {step.title}
              </h3>
              <p
                className="font-body text-sm text-text-secondary leading-relaxed max-w-xs mx-auto"
                style={{ fontWeight: 300 }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
