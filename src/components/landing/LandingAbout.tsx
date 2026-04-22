import { useReveal } from "@/hooks/use-reveal";
import { useConfig } from "@/context/ConfigContext";
import { SkeletonText } from "@/components/ui/skeleton";
import aboutFamily from "@/assets/about-family.jpg";

export function LandingAbout() {
  const { presentacion, loading } = useConfig();
  const revealRef = useReveal();

  return (
    <section
      id="nosotros"
      className="py-24 md:py-32 px-6"
      style={{ backgroundColor: "#faf8f5" }}
      ref={revealRef}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2
            className="reveal-hidden font-display text-3xl md:text-5xl mb-8"
            style={{ fontWeight: 300, color: "#2c2416" }}
          >
            Una inmobiliaria
            <br />
            de familia
          </h2>
          {loading ? (
            <div className="space-y-3 max-w-lg">
              <SkeletonText width="100%" />
              <SkeletonText width="90%" />
              <SkeletonText width="75%" />
            </div>
          ) : (
            <p
              className="reveal-hidden font-body text-base md:text-lg leading-relaxed max-w-lg"
              data-reveal-delay="150"
              style={{ fontWeight: 300, color: "#5a4a3a" }}
            >
              {presentacion}
            </p>
          )}
        </div>

        <div className="reveal-hidden flex justify-center md:justify-end" data-reveal-delay="200">
          <div
            className="relative w-72 h-72 md:w-[420px] md:h-[420px] overflow-hidden"
            style={{
              border: "1px solid rgba(44,36,22,0.08)",
              boxShadow: "20px 20px 60px rgba(44,36,22,0.12), -5px -5px 20px rgba(255,255,255,0.5)",
            }}
          >
            <img
              src={aboutFamily}
              alt="Interior cálido y acogedor de una casa de familia chilena"
              loading="lazy"
              width={1024}
              height={1024}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(44,36,22,0.05) 0%, rgba(44,36,22,0) 40%, rgba(44,36,22,0.15) 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
