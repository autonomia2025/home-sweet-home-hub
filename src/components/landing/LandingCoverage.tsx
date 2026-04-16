import { useReveal } from "@/hooks/use-reveal";

const comunas = ["Santiago Centro", "Navidad", "Puertecillo", "Pupuya"];

export function LandingCoverage() {
  const revealRef = useReveal();

  return (
    <section
      className="py-24 md:py-32 px-6"
      style={{ backgroundColor: "#f0ebe3" }}
      ref={revealRef}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="reveal-hidden font-display text-3xl md:text-5xl mb-16"
          style={{ fontWeight: 300, color: "#2c2416" }}
        >
          Cobertura
        </h2>

        <div className="reveal-hidden" data-reveal-delay="150">
          {comunas.map((comuna, i) => (
            <div key={comuna}>
              <div className="py-5">
                <span
                  className="font-display text-xl md:text-2xl"
                  style={{ fontWeight: 300, color: "#2c2416" }}
                >
                  {comuna}
                </span>
              </div>
              {i < comunas.length - 1 && (
                <div className="line-separator-light" />
              )}
            </div>
          ))}
          <div className="line-separator-light mt-1" />
          <p
            className="font-body text-sm mt-8"
            style={{ fontWeight: 300, color: "#5a4a3a" }}
          >
            y más comunas próximamente
          </p>
        </div>
      </div>
    </section>
  );
}
