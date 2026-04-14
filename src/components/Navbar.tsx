import { Link } from "@tanstack/react-router";
import { Home, Phone } from "lucide-react";

interface NavbarProps {
  nombreInmobiliaria?: string;
  whatsapp?: string;
}

export function Navbar({ nombreInmobiliaria = "Inmobiliaria", whatsapp }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          <span className="font-display text-lg text-foreground tracking-tight">
            {nombreInmobiliaria}
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/\+/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contáctanos</span>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
