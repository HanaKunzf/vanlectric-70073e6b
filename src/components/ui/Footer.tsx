import { Link } from "react-router-dom";

export const SiteFooter = () => (
  <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground font-sans">
    <div className="container mx-auto px-4 flex flex-col gap-1.5">
      <div>© 2025 Vanlectric · Hana Kunzfeldová</div>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <Link to="/privacy" className="hover:text-primary hover:underline transition-colors">
          Privacy Policy
        </Link>
        <span aria-hidden>·</span>
        <a href="mailto:hello@vanlectric.com" className="hover:text-primary hover:underline transition-colors">
          hello@vanlectric.com
        </a>
      </div>
      <div>Free to use · No account required</div>
    </div>
  </footer>
);
