import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
      aria-label="Volver al inicio"
      role="button"
      className="fixed z-50 flex items-center justify-center transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        bottom: 30,
        left: 30,
        width: 44,
        height: 44,
        backgroundColor: "#2c3e2c",
        border: "1px solid rgba(255,255,255,0.15)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#5a7a5a")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
    >
      <ArrowUp className="h-[18px] w-[18px] text-white" />
    </button>
  );
}
