import { useState, useEffect } from "react";
import type { FAQ } from "@/lib/supabase-helpers";
import { fetchFAQsActivas } from "@/lib/supabase-helpers";
import { useReveal } from "@/hooks/use-reveal";
import { SkeletonFAQRow } from "@/components/ui/skeleton";

export function LandingFAQ() {
  const revealRef = useReveal();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(true), 300);
    fetchFAQsActivas()
      .then(setFaqs)
      .catch(console.error)
      .finally(() => {
        clearTimeout(timer);
        setLoading(false);
      });
    return () => clearTimeout(timer);
  }, []);

  if (loading && !showSkeleton) return null;
  if (faqs.length === 0 && !loading) return null;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.respuesta,
      },
    })),
  };

  return (
    <section
      className="py-24 md:py-32 px-6"
      style={{ backgroundColor: "#f5f5f3" }}
      ref={revealRef}
    >
      {!loading && faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="max-w-3xl mx-auto">
        <h2
          className="reveal-hidden font-display text-3xl md:text-5xl mb-16 text-center"
          style={{ color: "#0a0a0a", fontWeight: 300 }}
        >
          Preguntas frecuentes
        </h2>

        {loading && showSkeleton ? (
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonFAQRow key={i} />
            ))}
          </div>
        ) : (
          <div>
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="reveal-hidden"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between py-5 text-left transition-colors"
                  >
                    <span
                      className="font-body text-sm md:text-base pr-4"
                      style={{ color: "#0a0a0a", fontWeight: 400 }}
                    >
                      {faq.pregunta}
                    </span>
                    <span
                      className="shrink-0 w-6 h-6 flex items-center justify-center text-lg transition-transform duration-300"
                      style={{
                        color: "#c8b8a2",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-400 ease-in-out"
                    style={{
                      maxHeight: isOpen ? "300px" : "0px",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <p
                      className="font-body text-sm leading-relaxed pb-5"
                      style={{ color: "#6a6a6a", fontWeight: 300 }}
                    >
                      {faq.respuesta}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
