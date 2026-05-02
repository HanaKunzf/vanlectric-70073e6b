import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooterFull } from "./SiteFooterFull";
import { BackToTop } from "@/components/ui/BackToTop";

const SITE_URL = "https://vanlectric.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.svg`;
const JSONLD_ID = "vanlectric-page-jsonld";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const setJsonLd = (data: SeoProps["jsonLd"]) => {
  // remove previous page-level JSON-LD (keep static ones from index.html, which have no id)
  document.head.querySelectorAll(`script[data-jsonld="${JSONLD_ID}"]`).forEach((n) => n.remove());
  if (!data) return;
  const items = Array.isArray(data) ? data : [data];
  for (const item of items) {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.setAttribute("data-jsonld", JSONLD_ID);
    s.text = JSON.stringify(item);
    document.head.appendChild(s);
  }
};

export const Seo = ({ title, description, image, noindex, jsonLd }: SeoProps) => {
  const location = useLocation();
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
      setMeta("twitter:description", description);
    }
    if (title) {
      setMeta("og:title", title, "property");
      setMeta("twitter:title", title);
    }
    const url = `${SITE_URL}${location.pathname}`;
    setMeta("og:url", url, "property");
    setCanonical(url);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");
    const img = image || DEFAULT_OG_IMAGE;
    setMeta("og:image", img, "property");
    setMeta("twitter:image", img);
    setJsonLd(jsonLd);
  }, [title, description, image, noindex, jsonLd, location.pathname]);
  return null;
};

interface SiteLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export const SiteLayout = ({
  children,
  title,
  description,
  image,
  noindex,
  jsonLd,
}: SiteLayoutProps) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title={title}
        description={description}
        image={image}
        noindex={noindex}
        jsonLd={jsonLd}
      />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooterFull />
      <BackToTop />
    </div>
  );
};

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export const PageHero = ({ eyebrow, title, subtitle }: PageHeroProps) => (
  <section className="border-b border-border bg-card/40">
    <div className="container mx-auto px-4 py-10 sm:py-14 max-w-3xl">
      {eyebrow && (
        <div className="text-xs font-sans uppercase tracking-wide text-accent mb-2">{eyebrow}</div>
      )}
      <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">{subtitle}</p>
      )}
    </div>
  </section>
);

export const Prose = ({ children }: { children: ReactNode }) => (
  <div className="container mx-auto px-4 py-10 max-w-3xl prose-vanlectric font-sans text-foreground/90 leading-relaxed space-y-4">
    {children}
  </div>
);
