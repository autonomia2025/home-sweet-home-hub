import { useEffect } from "react";

interface SEOOptions {
  title?: string;
  description?: string;
  imageUrl?: string;
  type?: string;
}

function setMeta(attr: string, attrValue: string, content: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

export function useSEO({ title, description, imageUrl, type = "website" }: SEOOptions) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const canonicalUrl = window.location.href.split("#")[0].split("?")[0];
    setCanonical(canonicalUrl);

    if (title) {
      document.title = title;
      setMeta("property", "og:title", title);
      setMeta("name", "twitter:title", title);
    }

    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }

    if (imageUrl) {
      setMeta("property", "og:image", imageUrl);
      setMeta("name", "twitter:image", imageUrl);
    }

    setMeta("property", "og:type", type);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("name", "twitter:card", imageUrl ? "summary_large_image" : "summary");
  }, [title, description, imageUrl, type]);
}
