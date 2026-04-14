interface LandingFooterProps {
  nombre: string;
  whatsapp: string;
}

export function LandingFooter({ nombre, whatsapp }: LandingFooterProps) {
  return (
    <footer style={{ backgroundColor: "#0a0a0a" }}>
      <div className="line-separator-dark" />
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Logo + name */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center border border-foreground/20">
              <span className="font-display text-lg tracking-widest text-foreground">PC</span>
            </div>
            <span
              className="text-foreground text-[11px] tracking-[0.15em] uppercase font-body"
              style={{ fontWeight: 300 }}
            >
              {nombre}
            </span>
          </div>

          {/* Info */}
          <div className="text-center">
            <p
              className="font-body text-text-secondary text-sm mb-1"
              style={{ fontWeight: 300 }}
            >
              Lunes a Viernes — 9:00 a 18:00
            </p>
            <p
              className="font-body text-text-secondary text-sm"
              style={{ fontWeight: 300 }}
            >
              Sábado — 10:00 a 14:00
            </p>
          </div>

          {/* WhatsApp */}
          <div className="md:text-right">
            <a
              href={`https://wa.me/${whatsapp.replace(/\+/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-text-secondary hover:text-foreground transition-colors"
              style={{ fontWeight: 300 }}
            >
              WhatsApp: {whatsapp}
            </a>
          </div>
        </div>

        <div className="line-separator-dark mt-8 mb-6" />
        <p
          className="font-body text-[11px] text-text-secondary text-center"
          style={{ fontWeight: 300 }}
        >
          © {new Date().getFullYear()} {nombre}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
