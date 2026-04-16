import { useEffect, useRef, useState } from "react";
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

function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div
      className="p-8 bg-white border h-full"
      style={{ borderColor: "rgba(0,0,0,0.08)" }}
    >
      <span
        className="font-display text-5xl block mb-4 leading-none"
        style={{ color: "#5a7a5a" }}
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
      <p className="font-body text-sm" style={{ color: "#2c3e2c", fontWeight: 500 }}>
        {t.name}
      </p>
      <p className="font-body text-xs" style={{ color: "#8a7a6a", fontWeight: 300 }}>
        {t.location}
      </p>
    </div>
  );
}

export function LandingTestimonials() {
  const revealRef = useReveal();
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const isHovering = useRef(false);

  // Autoplay (mobile only, paused on hover/touch)
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!isHovering.current) {
        setActive((prev) => (prev + 1) % testimonials.length);
      }
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  const goTo = (i: number) => setActive((i + testimonials.length) % testimonials.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isHovering.current = true;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      goTo(dx < 0 ? active + 1 : active - 1);
    }
    touchStartX.current = null;
    window.setTimeout(() => { isHovering.current = false; }, 1500);
  };

  return (
    <section
      className="py-24 md:py-32 px-6"
      style={{ backgroundColor: "#faf8f5" }}
      ref={revealRef}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="reveal-hidden font-display text-3xl md:text-5xl text-center mb-20"
          style={{ color: "#2c3e2c", fontWeight: 300 }}
        >
          Lo que dicen nuestros clientes
        </h2>

        {/* Desktop: 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="reveal-hidden" data-reveal-delay={i * 100}>
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>

        {/* Mobile: rotating carousel */}
        <div className="md:hidden">
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => { isHovering.current = true; }}
            onMouseLeave={() => { isHovering.current = false; }}
          >
            <div
              ref={trackRef}
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="w-full flex-shrink-0 px-1">
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir a reseña ${i + 1}`}
                className="h-1 transition-all duration-300"
                style={{
                  width: i === active ? 24 : 8,
                  backgroundColor: i === active ? "#2c3e2c" : "rgba(44,36,22,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
