import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooterFull } from "./SiteFooterFull";

interface SeoProps {
  title?: string;
  description?: string;
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

export const Seo = ({ title, description }: SeoProps) => {
  const location = useLocation();
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
    }
    if (title) setMeta("og:title", title, "property");
    try {
      setCanonical(`https://vanlectric.com${location.pathname}`);
    } catch {
      /* noop */
    }
  }, [title, description, location.pathname]);
  return null;
};

interface SiteLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export const SiteLayout = ({ children, title, description }: SiteLayoutProps) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo title={title} description={description} />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooterFull />
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
