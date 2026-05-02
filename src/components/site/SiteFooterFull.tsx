import { Link } from "react-router-dom";

export const SiteFooterFull = () => (
  <footer className="border-t border-border bg-card/40 mt-16">
    <div className="container mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm font-sans">
      <div className="col-span-2 sm:col-span-1">
        <div className="font-display font-bold text-primary italic text-lg">Vanlectric</div>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          A simple campervan electrical planning tool for DIY van builders.
        </p>
      </div>
      <div>
        <div className="font-semibold text-foreground mb-2">Product</div>
        <ul className="space-y-1.5 text-muted-foreground">
          <li><Link to="/planner" className="hover:text-primary transition-colors">Planner</Link></li>
          <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How it works</Link></li>
          <li><Link to="/examples" className="hover:text-primary transition-colors">Example setups</Link></li>
          <li><Link to="/checklist" className="hover:text-primary transition-colors">Checklist</Link></li>
        </ul>
      </div>
      <div>
        <div className="font-semibold text-foreground mb-2">Learn</div>
        <ul className="space-y-1.5 text-muted-foreground">
          <li><Link to="/electrical-guide" className="hover:text-primary transition-colors">Electrical Guide</Link></li>
          <li><Link to="/resources" className="hover:text-primary transition-colors">Resources</Link></li>
          <li><Link to="/resources/battery-sizing" className="hover:text-primary transition-colors">Battery sizing</Link></li>
          <li><Link to="/resources/solar-sizing" className="hover:text-primary transition-colors">Solar sizing</Link></li>
          <li><Link to="/resources/shore-vs-inverter" className="hover:text-primary transition-colors">Shore vs inverter</Link></li>
        </ul>
      </div>
      <div>
        <div className="font-semibold text-foreground mb-2">Company</div>
        <ul className="space-y-1.5 text-muted-foreground">
          <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
          <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          <li><Link to="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link></li>
          <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border py-5 text-center text-xs text-muted-foreground font-sans">
      <div className="container mx-auto px-4 flex flex-col gap-1">
        <div>© 2026 Vanlectric · Hana Kunzfeldová</div>
        <div>
          Vanlectric provides indicative sizing and shopping guidance only. It is not a final electrical installation design.
        </div>
      </div>
    </div>
  </footer>
);
