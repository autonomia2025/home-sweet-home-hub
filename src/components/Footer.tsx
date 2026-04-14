interface FooterProps {
  nombre: string;
}

export function Footer({ nombre }: FooterProps) {
  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {nombre}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
