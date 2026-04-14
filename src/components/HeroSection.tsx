import heroBg from "@/assets/hero-bg.jpg";

interface HeroSectionProps {
  nombre: string;
  presentacion: string;
}

export function HeroSection({ nombre, presentacion }: HeroSectionProps) {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt="Paisaje costero chileno"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-background leading-tight mb-6">
          {nombre}
        </h1>
        <p className="text-background/85 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          {presentacion}
        </p>
      </div>
    </section>
  );
}
