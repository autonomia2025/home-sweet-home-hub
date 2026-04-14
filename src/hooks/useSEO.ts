import { useEffect } from "react";

interface SEOOptions {
  title?: string;
  description?: string;
  imageUrl?: string;
  type?: string;
  noIndex?: boolean;
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

function removeMeta(attr: string, attrValue: string) {
  if (typeof document === "undefined") return;
  const el = document.querySelector(`meta[${attr}="${attrValue}"]`);
  if (el) el.remove();
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

function makeAbsolute(url: string): string {
  if (typeof window === "undefined") return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

const OG_PROPERTIES = [
  "og:title", "og:description", "og:image", "og:type", "og:url",
  "og:site_name", "og:locale",
];
const TWITTER_NAMES = [
  "twitter:card", "twitter:title", "twitter:description", "twitter:image",
];
const META_NAMES = ["description", "robots"];

export function useSEO({ title, description, imageUrl, type = "website", noIndex }: SEOOptions) {
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

    const absImage = imageUrl ? makeAbsolute(imageUrl) : undefined;
    if (absImage) {
      setMeta("property", "og:image", absImage);
      setMeta("name", "twitter:image", absImage);
    }

    setMeta("property", "og:type", type);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:site_name", "Inmobiliaria Pérez-Campos");
    setMeta("property", "og:locale", "es_CL");
    setMeta("name", "twitter:card", absImage ? "summary_large_image" : "summary");

    if (noIndex) {
      setMeta("name", "robots", "noindex, nofollow");
    }

    return () => {
      OG_PROPERTIES.forEach((p) => removeMeta("property", p));
      TWITTER_NAMES.forEach((n) => removeMeta("name", n));
      META_NAMES.forEach((n) => removeMeta("name", n));
    };
  }, [title, description, imageUrl, type, noIndex]);
}
