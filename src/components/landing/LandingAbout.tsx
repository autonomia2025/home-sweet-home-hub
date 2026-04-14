import { useReveal } from "@/hooks/use-reveal";
import { useConfig } from "@/context/ConfigContext";
import { SkeletonText } from "@/components/ui/skeleton";

export function LandingAbout() {
  const { presentacion, loading } = useConfig();
  const revealRef = useReveal();

  return (
    <section
      id="nosotros"
      className="py-24 md:py-32 px-6"
      style={{ backgroundColor: "#0a0a0a" }}
      ref={revealRef}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2
            className="reveal-hidden font-display text-3xl md:text-5xl text-foreground mb-8"
            style={{ fontWeight: 300 }}
          >
            Una inmobiliaria
            <br />
            de familia
          </h2>
          {loading ? (
            <div className="space-y-3 max-w-lg">
              <SkeletonText width="100%" variant="dark" />
              <SkeletonText width="90%" variant="dark" />
              <SkeletonText width="75%" variant="dark" />
            </div>
          ) : (
            <p
              className="reveal-hidden font-body text-text-secondary text-base md:text-lg leading-relaxed max-w-lg"
              data-reveal-delay="150"
              style={{ fontWeight: 300 }}
            >
              {presentacion}
            </p>
          )}
        </div>

        <div className="reveal-hidden flex justify-center md:justify-end" data-reveal-delay="200">
          <div
            className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center border border-foreground/10"
            style={{
              backgroundColor: "#0f0f0f",
              boxShadow: "20px 20px 60px rgba(0,0,0,0.4), -5px -5px 20px rgba(255,255,255,0.02)",
            }}
          >
            <span
              className="font-display text-6xl md:text-7xl text-foreground/20 tracking-widest"
              style={{ fontWeight: 300 }}
            >
              PC
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
