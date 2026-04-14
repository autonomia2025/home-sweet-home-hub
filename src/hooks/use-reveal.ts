import { useEffect, useRef } from "react";

export function useReveal() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const timeouts = new Set<number>();
    const observed = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const delay = target.dataset.revealDelay || "0";
            const timeoutId = window.setTimeout(() => {
              target.classList.add("reveal-visible");
              timeouts.delete(timeoutId);
            }, parseInt(delay));

            timeouts.add(timeoutId);
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const observeRevealNodes = (root: Element) => {
      const nodes = [root, ...Array.from(root.querySelectorAll(".reveal-hidden"))];

      nodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (!node.classList.contains("reveal-hidden")) return;
        if (node.classList.contains("reveal-visible")) return;
        if (observed.has(node)) return;

        observed.add(node);
        observer.observe(node);
      });
    };

    observeRevealNodes(el);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            observeRevealNodes(node);
          }
        });
      });
    });

    mutationObserver.observe(el, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  return ref;
}
