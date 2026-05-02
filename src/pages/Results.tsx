import { Fragment, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, FileText, FileSpreadsheet, Mail, RotateCcw, Save, Lock, Zap, AlertTriangle, CheckSquare, Square, Wrench } from "lucide-react";
import { calculate, type CalculationResult, type ApplianceLine } from "@/logic/calculator";
import { initialWizardState, type WizardState, type ExistingStep } from "@/types";
import { FEATURES } from "@/config/features";
import { en } from "@/i18n/en";
import { cn } from "@/lib/utils";
import { ProModal } from "@/components/ui/ProModal";
import { EmailReportModal } from "@/components/ui/EmailReportModal";

const fmt = (n: number) => Math.round(n).toLocaleString("en-GB");
const eur = (n: number) => `€${fmt(n)}`;

// ---------- Price profiles ----------
type PriceProfile = "low" | "balanced" | "premium";
const PRICE_MULTIPLIER: Record<PriceProfile, number> = { low: 0.75, balanced: 1.0, premium: 1.6 };
const PROFILE_LABEL: Record<PriceProfile, string> = { low: "Low-cost", balanced: "Balanced", premium: "Premium" };
const adjust = (price: number, p: PriceProfile) => Math.round(price * PRICE_MULTIPLIER[p]);
const componentNameForProfile = (name: string, p: PriceProfile): string => {
  if (p === "low") return `Budget-friendly equivalent — ${name.replace(/^Victron\s+/i, "")}`;
  if (p === "premium") return `Premium-grade — ${name}`;
  return name;
};

const sourceLabel = (s: ApplianceLine["powerSource"]) =>
  s === "12v" ? "12V" : s === "230v-inverter" ? "230V (inverter)" : "230V (shore)";

// ---------- Section wrapper ----------
const SectionCard = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
  <section className={cn("step-card p-6 sm:p-8", className)}>
    <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-1 normal-case tracking-tight">{title}</h2>
    <div className="h-px w-12 bg-primary/40 mb-5" />
    {children}
  </section>
);

// ---------- Profile summary ----------
const ProfileSummary = ({ s }: { s: WizardState }) => {
  const t = en.steps;
  const items: Array<{ k: string; v: string }> = [];
  if (s.step1.brand) {
    const brandLabel = s.step1.brand === "other" ? (s.step1.brandOther || "Other") : t.s1.brandOptions[s.step1.brand];
    items.push({ k: "Vehicle", v: `${brandLabel}${s.step1.size ? " · " + t.s1.sizeOptions[s.step1.size] : ""}` });
  }
  if (s.step2.profile) items.push({ k: "Usage", v: t.s2.profileOptions[s.step2.profile].label });
  if (s.step3.climate) items.push({ k: "Climate", v: t.s3.options[s.step3.climate].label });
  if (s.step10.season) items.push({ k: "Season", v: t.s10.options[s.step10.season].label });
  if (s.step8.people) items.push({ k: "People", v: String(s.step8.people) });
  if (s.step9.remoteWork) items.push({ k: "Remote work", v: t.s9.options[s.step9.remoteWork].label });
  if (s.step11.insulation) items.push({ k: "Insulation", v: t.s11.options[s.step11.insulation].label });
  if (s.step6.shorePower) items.push({ k: "Shore power", v: t.s6.options[s.step6.shorePower].label });
  if (s.step5.frequency) items.push({ k: "Driving", v: t.s5.frequencyOptions[s.step5.frequency].label });
  return (
    <SectionCard title="Your profile">
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {items.map((i) => (
          <div key={i.k} className="flex justify-between gap-3 border-b border-border/60 py-1.5">
            <dt className="text-muted-foreground font-sans">{i.k}</dt>
            <dd className="font-sans font-medium text-right">{i.v}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  );
};

// ---------- Locked button ----------
const LockedAction = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="relative flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-muted/40 text-muted-foreground min-h-[44px] font-sans font-semibold text-sm hover:border-primary transition-colors"
  >
    <span className="opacity-60">{icon}</span>
    <span className="opacity-80">{label}</span>
    <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold text-primary border border-primary rounded px-1.5 py-0.5">
      <Lock className="w-3 h-3" /> {en.pro.badge}
    </span>
  </button>
);

// ---------- Component card ----------
const COMPONENT_GUIDE_LINK: Record<string, { label: string; hash: string }> = {
  solar: { label: "Learn how solar charging works", hash: "#solar" },
  mppt: { label: "Learn how solar charging works", hash: "#solar" },
  dcdc: { label: "Learn how alternator charging works", hash: "#dcdc" },
  shore: { label: "Learn how shore power works", hash: "#shore" },
  inverter: { label: "Learn what an inverter does", hash: "#inverter" },
  battery: { label: "Learn about battery banks", hash: "#battery" },
};

const ComponentCard = ({ c, profile }: { c: CalculationResult["components"][number]; profile: PriceProfile }) => {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const toggle = () => {
    setOpen((o) => {
      const next = !o;
      if (next) {
        // Keep the header in view rather than scrolling to the bottom of expanded content.
        requestAnimationFrame(() => {
          headerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      }
      return next;
    });
  };
  const adjusted = adjust(c.price, profile);
  const displayName = componentNameForProfile(c.name, profile);
  const guide = COMPONENT_GUIDE_LINK[c.key];
  return (
    <div ref={headerRef} className="rounded-lg border border-border bg-card p-4 scroll-mt-24">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-sans uppercase tracking-wider text-accent font-semibold">{c.category}</div>
          <div className="font-display text-lg font-bold mt-0.5">{displayName}</div>
          <div className="text-sm text-muted-foreground mt-1">{c.why}</div>
        </div>
        <div className="text-right font-display text-xl font-bold text-primary whitespace-nowrap">~{eur(adjusted)}</div>
      </div>
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-primary hover:underline"
        >
          {open ? "Hide details" : "Why this?"}
          {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        {guide && (
          <Link
            to={`/electrical-guide${guide.hash}`}
            className="text-xs font-sans text-primary hover:underline"
          >
            {guide.label} →
          </Link>
        )}
      </div>
      {open && (
        <div className="mt-2 text-sm text-muted-foreground bg-background/60 rounded-md p-3 border border-border">
          {c.detail}
        </div>
      )}
      {c.note && (
        <div className="mt-3 text-sm bg-accent/10 border-l-4 border-accent rounded-md p-3 text-foreground">
          {c.note}
        </div>
      )}
    </div>
  );
};

// ---------- Shopping list ----------
interface ShopRow { item: string; qty: number; estimate: number; userPrice: number; noEstimate?: boolean }
interface ShopGroup { key: string; title: string; description: string; rows: ShopRow[]; warning?: string }

// Match a material item label to a logical shopping group.
const classifyMaterial = (label: string): string => {
  const l = label.toLowerCase();
  // Solar
  if (/solar|mppt|mc4|roof cable gland|solar isolator|dc breaker/.test(l)) return "solar";
  // DC-DC
  if (/dc-dc|alternator side|battery side/.test(l)) return "dcdc";
  // Shore charging-only specifics (charger feed, simple AC box)
  if (/cee shore inlet|shore power hookup|shore charger|mcb for shore/.test(l)) return "shore";
  // 230V AC distribution
  if (/rcd|rcbo|consumer unit|mcb for socket|mcb for high|internal 230v|labels \/ warning|professional electrician|protective earth|ac protection box|small ac protection|ac cable, glands|ac cable, conduits|inverter feed/.test(l))
    return "ac";
  // Battery connection & protection
  if (/main battery fuse|battery disconnect|busbar|smartshunt|battery monitor|temperature sensor|cable lugs|battery labels/.test(l))
    return "battery";
  // 12V distribution
  if (/12v fuse box|12v wiring|wago|anderson|cable management|mounting hardware/.test(l)) return "dc12v";
  // General wiring fall-through
  return "general";
};

const ShoppingList = ({ result, profile, state }: { result: CalculationResult; profile: PriceProfile; state: WizardState }) => {
  const groups: ShopGroup[] = useMemo(() => {
    const mkComp = (c: CalculationResult["components"][number]): ShopRow => ({
      item: componentNameForProfile(c.name, profile),
      qty: 1,
      estimate: adjust(c.price, profile),
      userPrice: 0,
    });
    const mkMat = (m: { item: string; price: number }): ShopRow => ({
      item: m.item,
      qty: 1,
      estimate: adjust(m.price, profile),
      userPrice: 0,
    });

    // Group components by key
    const compsByKey: Record<string, ShopRow[]> = {};
    for (const c of result.components) {
      const k = c.key; // battery|solar|mppt|dcdc|shore|inverter
      (compsByKey[k] ||= []).push(mkComp(c));
    }

    // Group materials by classification
    const matBuckets: Record<string, ShopRow[]> = {
      battery: [], solar: [], dcdc: [], shore: [], ac: [], dc12v: [], general: [],
    };
    for (const g of result.materialGroups) {
      for (const m of g.items) {
        const bucket = classifyMaterial(m.item);
        matBuckets[bucket].push(mkMat(m));
      }
    }

    // Battery connection & protection
    const battery: ShopRow[] = [...(compsByKey.battery ?? []), ...matBuckets.battery];

    // Solar charging
    const solar: ShopRow[] = [...(compsByKey.solar ?? []), ...(compsByKey.mppt ?? []), ...matBuckets.solar];

    // DC-DC
    const dcdc: ShopRow[] = [...(compsByKey.dcdc ?? []), ...matBuckets.dcdc];

    // Shore charging
    const shore: ShopRow[] = [...(compsByKey.shore ?? []), ...matBuckets.shore];

    // 230V AC distribution: only when full-AC mode or inverter present, otherwise the
    // "ac" bucket should be empty anyway.
    const ac: ShopRow[] = [...(compsByKey.inverter ?? []), ...matBuckets.ac];

    // 12V distribution
    const dc12v: ShopRow[] = [...matBuckets.dc12v];
    // Add convenience items often needed (12V sockets / USB / switch panel) as
    // simple suggestions priced from profile baselines.
    dc12v.push(
      { item: "12V cigarette / DIN sockets (×2)", qty: 1, estimate: adjust(15, profile), userPrice: 0 },
      { item: "USB sockets (×2)", qty: 1, estimate: adjust(15, profile), userPrice: 0 },
      { item: "Switch panel & switches", qty: 1, estimate: adjust(20, profile), userPrice: 0 },
    );

    // Appliance circuits — derived from enabled 12V appliances
    const enabledIds = Object.entries(state.step4.appliances)
      .filter(([, e]) => e.enabled)
      .map(([id]) => id);
    const circuitMap: Array<{ match: (id: string) => boolean; label: string }> = [
      { match: (id) => /^lights-/.test(id), label: "LED lighting circuit (cable + fuse)" },
      { match: (id) => id === "water-pump" || id === "shower-pump", label: "Water pump circuit (cable + fuse)" },
      { match: (id) => id === "fan", label: "Roof fan circuit (cable + fuse)" },
      { match: (id) => /^fridge/.test(id), label: "Fridge circuit (cable + fuse)" },
      { match: (id) => id === "diesel-heater", label: "Diesel heater circuit (cable + fuse)" },
      { match: (id) => id === "router" || id === "starlink", label: "Router / Starlink circuit (cable + fuse)" },
    ];
    const circuits: ShopRow[] = circuitMap
      .filter((c) => enabledIds.some(c.match))
      .map((c) => ({ item: c.label, qty: 1, estimate: adjust(8, profile), userPrice: 0 }));

    // General wiring & install
    const general: ShopRow[] = [
      ...matBuckets.general,
      { item: "Cable glands & grommets", qty: 1, estimate: adjust(10, profile), userPrice: 0 },
      { item: "Cable conduits & loom", qty: 1, estimate: adjust(15, profile), userPrice: 0 },
      { item: "Cable ties (assorted)", qty: 1, estimate: adjust(6, profile), userPrice: 0 },
      { item: "Heat shrink (assorted)", qty: 1, estimate: adjust(8, profile), userPrice: 0 },
      { item: "Terminal blocks / Wago set", qty: 1, estimate: adjust(12, profile), userPrice: 0 },
      { item: "Mounting screws & hardware", qty: 1, estimate: adjust(10, profile), userPrice: 0 },
      { item: "Labels", qty: 1, estimate: adjust(5, profile), userPrice: 0 },
    ];

    // Optional shore-only appliances (no estimate)
    const optional: ShopRow[] = result.shoreLines.map((l) => ({
      item: `${l.label} (shore-only appliance)`, qty: 1, estimate: 0, userPrice: 0, noEstimate: true,
    }));

    const out: ShopGroup[] = [
      {
        key: "battery", title: "1. Battery connection & protection",
        description: "Battery bank and the protection that surrounds it.",
        rows: battery,
      },
      {
        key: "solar", title: "2. Solar charging system",
        description: "Solar panels, MPPT and roof-side wiring.",
        rows: solar,
      },
    ];
    if (dcdc.length > 0) {
      out.push({
        key: "dcdc", title: "3. DC-DC charging system",
        description: "Charging the house battery from the alternator while driving.",
        rows: dcdc,
      });
    }
    if (shore.length > 0) {
      out.push({
        key: "shore", title: "4. Shore charging system",
        description: "Charging the battery from a 230V hookup.",
        rows: shore,
      });
    }
    if (ac.length > 0) {
      out.push({
        key: "ac", title: "5. 230V AC distribution system",
        description: "Internal 230V sockets, inverter feed and AC protection.",
        rows: ac,
        warning:
          "230V AC systems can be dangerous. Always use proper RCD/MCB protection and have the final installation checked by a qualified electrician.",
      });
    }
    out.push({
      key: "dc12v", title: "6. 12V distribution system",
      description: "Low-voltage circuits, sockets and switch panel.",
      rows: dc12v,
    });
    if (circuits.length > 0) {
      out.push({
        key: "circuits", title: "7. Appliance circuits",
        description: "Cabling and fuses for the appliances you selected.",
        rows: circuits,
      });
    }
    out.push({
      key: "general", title: "8. General wiring & installation materials",
      description: "Common materials used across the whole system.",
      rows: general,
    });
    if (optional.length > 0) {
      out.push({
        key: "optional", title: "Optional appliances",
        description: "Shore-only appliances — purchase prices not estimated.",
        rows: optional,
      });
    }
    return out;
  }, [result, profile, state.step4.appliances]);

  const [groupRows, setGroupRows] = useState<ShopRow[][]>(() => groups.map((g) => g.rows));
  // Re-sync rows when profile/groups change (preserves user-entered prices where indices align).
  const profileRef = useRef(profile);
  const groupsLenRef = useRef(groups.length);
  if (profileRef.current !== profile || groupsLenRef.current !== groups.length) {
    profileRef.current = profile;
    groupsLenRef.current = groups.length;
    setGroupRows(groups.map((g, gi) => g.rows.map((r, ri) => {
      const prev = groupRows[gi]?.[ri];
      return { ...r, userPrice: prev?.userPrice ?? 0, qty: prev?.qty ?? r.qty };
    })));
  }
  const update = (gi: number, ri: number, patch: Partial<ShopRow>) =>
    setGroupRows((gs) => gs.map((rows, i) => i !== gi ? rows : rows.map((r, j) => j === ri ? { ...r, ...patch } : r)));

  const subtotalFor = (rows: ShopRow[]) =>
    rows.reduce((s, r) => s + (r.noEstimate ? 0 : r.qty * (r.userPrice || r.estimate)), 0);
  const grand = groupRows.reduce((s, rows) => s + subtotalFor(rows), 0);
  const contingency = Math.round(grand * 0.15);
  const recommended = grand + contingency;

  return (
    <div className="space-y-6">
      {groups.map((g, gi) => {
        const rows = groupRows[gi] ?? g.rows;
        const subtotal = subtotalFor(rows);
        return (
          <div key={g.key} className="rounded-lg border border-border bg-background/40 p-4 sm:p-5">
            <h3 className="font-display text-lg sm:text-xl font-bold text-primary">{g.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-3">{g.description}</p>

            {g.warning && (
              <div className="warning-banner flex items-start gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{g.warning}</span>
              </div>
            )}

            {/* Desktop / tablet table */}
            <div className="hidden sm:block">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground font-sans font-semibold border-b border-border">
                  <tr>
                    <th className="py-2 pr-3">Item</th>
                    <th className="py-2 px-2 w-16 text-center">Qty</th>
                    <th className="py-2 px-2 w-24 text-right">Est. €</th>
                    <th className="py-2 px-2 w-28 text-right">Your €</th>
                    <th className="py-2 pl-2 w-24 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, ri) => (
                    <tr key={ri} className="border-b border-border/60">
                      <td className="py-2 pr-3 font-sans">{r.item}</td>
                      <td className="py-2 px-2">
                        <input type="number" min={0} value={r.qty}
                          onChange={(e) => update(gi, ri, { qty: Number(e.target.value) })}
                          className="w-full bg-background border border-border rounded px-2 py-1 text-center" />
                      </td>
                      <td className="py-2 px-2 text-right font-mono text-muted-foreground">
                        {r.noEstimate ? "—" : r.estimate}
                      </td>
                      <td className="py-2 px-2">
                        <input type="number" min={0} value={r.userPrice || ""} placeholder="—"
                          onChange={(e) => update(gi, ri, { userPrice: Number(e.target.value) })}
                          className="w-full bg-background border border-border rounded px-2 py-1 text-right" />
                      </td>
                      <td className="py-2 pl-2 text-right font-mono font-semibold">
                        {r.userPrice ? eur(r.qty * r.userPrice) : (r.noEstimate ? "—" : eur(r.qty * r.estimate))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked rows */}
            <ul className="sm:hidden space-y-3">
              {rows.map((r, ri) => (
                <li key={ri} className="rounded-md border border-border bg-card/60 p-3">
                  <div className="font-sans text-sm font-medium break-words">{r.item}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Est. {r.noEstimate ? "—" : eur(r.estimate)}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <label className="text-xs font-sans text-muted-foreground">
                      Qty
                      <input type="number" min={0} value={r.qty}
                        onChange={(e) => update(gi, ri, { qty: Number(e.target.value) })}
                        className="mt-1 w-full bg-background border border-border rounded px-2 py-1.5 text-center" />
                    </label>
                    <label className="text-xs font-sans text-muted-foreground">
                      Your €
                      <input type="number" min={0} value={r.userPrice || ""} placeholder="—"
                        onChange={(e) => update(gi, ri, { userPrice: Number(e.target.value) })}
                        className="mt-1 w-full bg-background border border-border rounded px-2 py-1.5 text-right" />
                    </label>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Line total</span>
                    <span className="font-mono font-semibold">
                      {r.userPrice ? eur(r.qty * r.userPrice) : (r.noEstimate ? "—" : eur(r.qty * r.estimate))}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex justify-between text-sm font-semibold text-primary border-t border-border pt-2">
              <span>{g.title.replace(/^\d+\.\s*/, "")} subtotal</span>
              <span className="font-mono">{eur(subtotal)}</span>
            </div>
          </div>
        );
      })}

      {/* Totals */}
      <div className="rounded-lg border border-primary bg-primary/5 p-4 sm:p-5">
        <dl className="space-y-1.5 text-sm">
          {groups.map((g, gi) => {
            const sub = subtotalFor(groupRows[gi] ?? g.rows);
            if (g.key === "optional" || sub === 0) return null;
            return (
              <div key={g.key} className="flex justify-between">
                <dt className="text-muted-foreground">{g.title.replace(/^\d+\.\s*/, "")} total</dt>
                <dd className="font-mono">{eur(sub)}</dd>
              </div>
            );
          })}
          <div className="border-t border-border pt-2 flex justify-between font-semibold">
            <dt>Subtotal</dt>
            <dd className="font-mono">{eur(grand)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">+ 15% contingency</dt>
            <dd className="font-mono">{eur(contingency)}</dd>
          </div>
          <div className="border-t-2 border-primary pt-2 flex justify-between font-display text-lg sm:text-xl font-bold text-primary">
            <dt>Recommended budget</dt>
            <dd className="font-mono">{eur(recommended)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

// ---------- Edit chips ----------
const EDIT_CHIPS: Array<{ step: number; emoji: string; label: string }> = [
  { step: 1, emoji: "🚐", label: "Vehicle" },
  { step: 2, emoji: "🏕️", label: "Usage" },
  { step: 3, emoji: "🌤️", label: "Climate" },
  { step: 4, emoji: "🔌", label: "Appliances" },
  { step: 5, emoji: "🛣️", label: "Driving" },
  { step: 6, emoji: "⚡", label: "Shore power" },
  { step: 7, emoji: "🏠", label: "Roof" },
  { step: 8, emoji: "👥", label: "People" },
  { step: 9, emoji: "💻", label: "Remote work" },
  { step: 10, emoji: "🍂", label: "Season" },
  { step: 11, emoji: "🧱", label: "Insulation" },
  { step: 12, emoji: "💰", label: "Budget" },
  { step: 13, emoji: "🔧", label: "Existing" },
];

const EditChips = ({ state }: { state: WizardState }) => {
  const navigate = useNavigate();
  const editStep = (n: number) =>
    navigate("/wizard", { state: { wizard: state, resumeAtStep: n, editMode: true } });
  return (
    <section className="step-card p-5 sm:p-6">
      <h2 className="font-display text-lg font-bold text-primary mb-3 normal-case">Edit your inputs</h2>
      <div className="flex flex-wrap gap-2">
        {EDIT_CHIPS.map((c) => (
          <button
            key={c.step}
            type="button"
            onClick={() => editStep(c.step)}
            className="basis-[calc((100%-1rem)/3)] sm:basis-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/40 bg-background text-foreground hover:border-primary hover:bg-primary/5 transition-colors font-sans text-xs font-semibold"
          >
            <span aria-hidden>{c.emoji}</span>
            <span className="truncate">{c.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

// ---------- Existing system analysis ----------
const hasExistingData = (e?: ExistingStep) =>
  !!e && (!!e.battery || !!e.solar || !!e.mppt || !!e.dcdc || !!e.shore || !!e.inverter);

interface ExistingAnalysis {
  capacityAh: number; capacityWh: number; existingSolarW: number; existingSolarWh: number;
  autonomyNoSolar: number; autonomyWithSolar: number; dailyGapWh: number;
  sufficient: string[]; upgrades: string[]; reduceTo: number;
}

const analyzeExisting = (e: ExistingStep, result: CalculationResult): ExistingAnalysis => {
  const usableFactor = e.battery?.chemistry === "lifepo4" ? 0.8 : e.battery?.chemistry === "agm" ? 0.5 : 0.6;
  const capacityAh = (e.battery?.qty ?? 0) * (e.battery?.ah ?? 0);
  const capacityWh = capacityAh * 12 * usableFactor;
  const existingSolarW = (e.solar?.qty ?? 0) * (e.solar?.watts ?? 0);
  const existingSolarWh = existingSolarW * 3.5 * 0.75;
  const dailyNet = Math.max(0, result.totalDailyWh - existingSolarWh);
  const autonomyNoSolar = result.totalDailyWh > 0 ? capacityWh / result.totalDailyWh : 0;
  const autonomyWithSolar = dailyNet > 0 ? capacityWh / dailyNet : Infinity;
  const dailyGapWh = Math.max(0, result.totalDailyWh - existingSolarWh);
  const sufficient: string[] = [];
  const upgrades: string[] = [];
  if (capacityWh >= result.totalDailyWh * 1.5) sufficient.push("Battery capacity"); else if (e.battery) upgrades.push("Battery — too small for daily load");
  if (existingSolarWh >= result.totalDailyWh * 0.7) sufficient.push("Solar array"); else if (e.solar) upgrades.push("Solar — add more panels to cover daily load");
  if (e.mppt && e.mppt.amps * 12 >= existingSolarW) sufficient.push("MPPT controller"); else if (e.mppt) upgrades.push("MPPT — undersized for current panels");
  if (e.dcdc) sufficient.push("DC-DC charger"); else upgrades.push("DC-DC charger — recommended");
  if (e.inverter && result.hasInverterLoad) sufficient.push("Inverter"); else if (!e.inverter && result.hasInverterLoad) upgrades.push("Inverter — needed for 230V appliances");
  if (e.shore) sufficient.push("Shore power charger");
  const reduceTo = Math.max(0, Math.round(capacityWh / 1.5));
  return { capacityAh, capacityWh, existingSolarW, existingSolarWh, autonomyNoSolar, autonomyWithSolar, dailyGapWh, sufficient, upgrades, reduceTo };
};

const ExistingSystemSection = ({ state, result }: { state: WizardState; result: CalculationResult }) => {
  const e = state.step13;
  const a = analyzeExisting(e, result);
  return (
    <SectionCard title="Your existing system">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="rounded-lg bg-background/60 border border-border p-3">
          <div className="text-xs text-muted-foreground">Existing capacity</div>
          <div className="font-display text-lg font-bold mt-1">{fmt(a.capacityAh)} Ah</div>
          <div className="text-xs text-muted-foreground">~{fmt(a.capacityWh)} Wh usable</div>
        </div>
        <div className="rounded-lg bg-background/60 border border-border p-3">
          <div className="text-xs text-muted-foreground">Autonomy (no solar)</div>
          <div className="font-display text-lg font-bold mt-1">{a.autonomyNoSolar.toFixed(1)} days</div>
        </div>
        <div className="rounded-lg bg-background/60 border border-border p-3">
          <div className="text-xs text-muted-foreground">Autonomy (with solar)</div>
          <div className="font-display text-lg font-bold mt-1">
            {Number.isFinite(a.autonomyWithSolar) ? `${a.autonomyWithSolar.toFixed(1)} days` : "∞"}
          </div>
          <div className="text-xs text-muted-foreground">Gap: {fmt(a.dailyGapWh)} Wh/day</div>
        </div>
      </div>
      {a.sufficient.length > 0 && (
        <div className="mb-3">
          <div className="font-sans font-semibold text-primary mb-1">✓ Sufficient</div>
          <ul className="text-sm space-y-1">{a.sufficient.map((s) => <li key={s}>• {s}</li>)}</ul>
        </div>
      )}
      {a.upgrades.length > 0 && (
        <div className="mb-3">
          <div className="font-sans font-semibold text-accent mb-1">⚠️ Upgrade or add</div>
          <ul className="text-sm space-y-1">{a.upgrades.map((s) => <li key={s}>• {s}</li>)}</ul>
        </div>
      )}
      <div className="mt-4 rounded-lg bg-accent/10 border-l-4 border-accent p-3 text-sm">
        <span className="font-semibold">Alternative:</span> reduce your daily consumption to ~{fmt(a.reduceTo)} Wh/day
        to make your existing system work without upgrades.
      </div>
    </SectionCard>
  );
};

// ---------- Autonomy formatting ----------
const formatDays = (d: number): string => {
  if (!Number.isFinite(d) || d > 30) return "Potentially continuous in good conditions";
  return `${d.toFixed(1)} days`;
};

// ---------- Autonomy Section ----------
const AutonomySection = ({ result }: { result: CalculationResult }) => {
  const eps = 1;
  const noCharge = result.usableBatteryWh / Math.max(eps, result.totalDailyWh);
  const withSolar = result.usableBatteryWh / Math.max(eps, result.totalDailyWh - result.solarDailyWh);
  const withAll = result.usableBatteryWh / Math.max(eps, result.totalDailyWh - result.solarDailyWh - result.alternatorDailyWh);
  const dailyBalance = result.solarDailyWh + result.alternatorDailyWh - result.totalDailyWh;
  const positive = dailyBalance >= 0;

  return (
    <SectionCard title="Your off-grid autonomy">
      <p className="text-sm text-muted-foreground mb-4">
        Estimated days you can stay parked before recharging — based on your usable battery capacity
        (~{fmt(result.usableBatteryWh)} Wh) and daily consumption (~{fmt(result.totalDailyWh)} Wh).
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-background/60 p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-sans font-semibold">Without charging</div>
          <div className="font-display text-2xl font-bold text-foreground mt-1">{formatDays(noCharge)}</div>
          <div className="text-xs text-muted-foreground mt-1">Battery only — no solar, no driving.</div>
        </div>
        <div className="rounded-lg border border-border bg-background/60 p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-sans font-semibold">With average solar</div>
          <div className="font-display text-2xl font-bold text-foreground mt-1">{formatDays(withSolar)}</div>
          <div className="text-xs text-muted-foreground mt-1">~{fmt(result.solarDailyWh)} Wh/day from solar.</div>
        </div>
        <div className="rounded-lg border border-border bg-background/60 p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-sans font-semibold">With solar + driving</div>
          <div className="font-display text-2xl font-bold text-foreground mt-1">{formatDays(withAll)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {result.alternatorDailyWh > 0 ? `+~${fmt(result.alternatorDailyWh)} Wh/day from alternator.` : "No alternator charging in your profile."}
          </div>
        </div>
      </div>
      <div className={cn("mt-5 rounded-lg p-3 text-sm border-l-4",
        positive ? "bg-primary/5 border-primary text-foreground" : "bg-accent/10 border-accent text-foreground")}>
        {positive
          ? "Your daily charging sources can cover your estimated consumption in these conditions."
          : `Daily deficit: ~${fmt(Math.abs(dailyBalance))} Wh/day. Plan for shore-power top-ups or reduce consumption.`}
      </div>
      <p className="text-xs text-muted-foreground mt-3 italic">
        Estimated values. Actual autonomy depends on real-world weather, temperature and usage patterns.
      </p>
    </SectionCard>
  );
};

// ---------- Scenarios ----------
const ScenariosSection = ({ result }: { result: CalculationResult }) => {
  const scenarios = [
    { key: "good", label: "Good sun", emoji: "☀️", mult: 1.2, desc: "Clear summer days. Strong solar harvest." },
    { key: "avg", label: "Average weather", emoji: "🌤️", mult: 1.0, desc: "Typical mixed conditions." },
    { key: "cloudy", label: "Cloudy", emoji: "☁️", mult: 0.35, desc: "Overcast days. Solar covers only part of consumption." },
    { key: "winter", label: "Winter / poor solar", emoji: "❄️", mult: 0.15, desc: "Short days, low sun angle. Plan alternator or shore." },
  ];
  const eps = 1;
  return (
    <SectionCard title="Solar & weather scenarios">
      <p className="text-sm text-muted-foreground mb-4">
        How your system behaves under different weather conditions. Useful for planning real-world trips.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {scenarios.map((s) => {
          const solarWh = result.solarDailyWh * s.mult;
          const balance = solarWh + result.alternatorDailyWh - result.totalDailyWh;
          const auto = result.usableBatteryWh / Math.max(eps, result.totalDailyWh - solarWh - result.alternatorDailyWh);
          return (
            <div key={s.key} className="rounded-lg border border-border bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <div className="font-display text-lg font-bold">{s.emoji} {s.label}</div>
                <div className="text-xs font-sans text-muted-foreground">{(s.mult * 100).toFixed(0)}%</div>
              </div>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Solar</dt><dd className="font-mono">~{fmt(solarWh)} Wh/day</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Daily balance</dt>
                  <dd className={cn("font-mono", balance >= 0 ? "text-primary" : "text-accent")}>
                    {balance >= 0 ? "+" : ""}{fmt(balance)} Wh
                  </dd>
                </div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Autonomy</dt><dd className="font-mono">{formatDays(auto)}</dd></div>
              </dl>
              <p className="text-xs text-muted-foreground mt-2">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

// ---------- Optimization ----------
const OptimizationSection = ({ state, result }: { state: WizardState; result: CalculationResult }) => {
  const navigate = useNavigate();
  const top = useMemo(() => {
    return [...result.lines]
      .filter((l) => !l.informational && l.wh > 0)
      .sort((a, b) => b.wh - a.wh)
      .slice(0, 3);
  }, [result.lines]);

  const heavy230v = new Set(["kettle", "hairdryer", "induction", "oven", "tools", "coffee", "microwave", "toaster", "straightener"]);
  const tips: string[] = [];
  for (const l of top) {
    if (heavy230v.has(l.id)) {
      tips.push(`${l.label}: Move to shore power only to reduce inverter and battery size.`);
    }
    if (l.id === "fridge-freezer") {
      tips.push("Freezer function increases daily consumption. Removing it can reduce battery and solar requirements.");
    }
    if (l.id === "laptop" || l.id === "monitor") {
      tips.push("Reducing laptop/screen use or charging while driving can lower battery needs.");
    }
  }
  if ((state.step3.climate === "cold" || state.step3.climate === "mixed") &&
      (state.step10.season === "year-round" || state.step10.season === "winter")) {
    tips.push("Your climate and season settings are conservative (worst case). If you mainly travel in summer, update your season profile for a more realistic estimate.");
  }
  if (tips.length === 0) {
    tips.push("Your appliance mix already looks well balanced — no obvious optimizations.");
  }

  return (
    <SectionCard title="Can this system be smaller?">
      <p className="text-sm text-muted-foreground mb-4">
        Your top energy consumers and ways to reduce battery and solar requirements.
      </p>
      <div className="mb-4">
        <div className="text-xs uppercase tracking-wider text-accent font-sans font-semibold mb-2">Top 3 consumers</div>
        {top.length === 0 ? (
          <div className="text-sm text-muted-foreground italic">No appliances selected yet.</div>
        ) : (
          <ul className="space-y-1">
            {top.map((l) => (
              <li key={l.id} className="flex justify-between border-b border-border/60 py-1.5 text-sm">
                <span className="font-sans">{l.label}</span>
                <span className="font-mono text-muted-foreground">~{fmt(l.wh)} Wh/day</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ul className="space-y-2 text-sm">
        {tips.map((t, i) => (
          <li key={i} className="rounded-md bg-primary/5 border-l-4 border-primary p-3">{t}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => navigate("/wizard", { state: { wizard: state, resumeAtStep: 4, editMode: true } })}
        className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors min-h-[44px] font-sans font-semibold text-sm"
      >
        <Wrench className="w-4 h-4" />
        Review high-consumption appliances
      </button>
    </SectionCard>
  );
};

// ---------- Red flags ----------
const RedFlagsSection = ({ state, result }: { state: WizardState; result: CalculationResult }) => {
  const flags: string[] = [];
  const shoreAccess = state.step6.shorePower;

  if (result.shoreLines.length > 0 && (!shoreAccess || shoreAccess === "never")) {
    flags.push("You selected shore-only appliances but no shore power access. These appliances will not be usable off-grid.");
  }
  const max230V = result.lines.filter((l) => l.powerSource === "230v-inverter").reduce((m, l) => Math.max(m, l.watts), 0);
  if (max230V >= 2000) {
    flags.push("High-power 230V appliances significantly increase inverter and battery requirements.");
  }
  if (state.step3.climate === "cold" || state.step10.season === "winter" || state.step10.season === "year-round") {
    flags.push("Cold-weather use requires attention to LiFePO4 charging below 0°C. Use batteries with low-temperature protection or heating.");
  }
  const availableArea = Math.max(0, result.roofArea - result.obstacleArea - 0.4);
  if (availableArea < 1.0) {
    flags.push("Roof space appears tight. Measure your actual roof and mark out panel positions before purchasing.");
  }
  if (result.recommendedSolarW < result.requiredSolarW * 0.95) {
    flags.push("Your roof cannot fit the calculated ideal solar capacity. Plan for alternator or shore charging.");
  }
  if (result.shoreLines.length >= 3) {
    flags.push("Your setup depends strongly on 230V hookup. This is fine for campsite use but not for wild camping.");
  }

  if (flags.length === 0) return null;

  return (
    <SectionCard title="Red flags to review">
      <ul className="space-y-2">
        {flags.map((f, i) => (
          <li key={i} className="warning-banner flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
};

// ---------- Confidence ----------
const ConfidenceSection = ({ state, result }: { state: WizardState; result: CalculationResult }) => {
  let score = 0;
  const reasons: string[] = [];

  // Custom appliance wattages
  const apps = state.step4.appliances ?? {};
  const enabled = Object.values(apps).filter((a) => a.enabled);
  const customWatts = enabled.filter((a) => a.wattsOverride).length;
  if (enabled.length > 0 && customWatts >= Math.max(2, Math.floor(enabled.length * 0.3))) {
    score += 1;
  } else {
    reasons.push("most appliance wattages use defaults");
  }

  // Custom roof dims
  const obs = Object.values(state.step7.obstacles ?? {});
  const usedObs = obs.filter((o) => o && o.count > 0);
  const customObs = usedObs.filter((o) => o?.customSize && o.lengthCm && o.widthCm).length;
  if (usedObs.length > 0 && customObs > 0) score += 1;
  else if (usedObs.length > 0) reasons.push("roof obstacles use default sizes");

  // Clear profile
  if (state.step3.climate && state.step3.climate !== "mixed" &&
      state.step10.season && state.step10.season !== "year-round" &&
      state.step5.frequency) {
    score += 1;
  } else {
    if (state.step3.climate === "mixed") reasons.push("climate is 'mixed'");
    if (state.step10.season === "year-round") reasons.push("season is 'year-round'");
  }

  // Penalty: high-power 230V
  const max230V = result.lines.filter((l) => l.powerSource === "230v-inverter").reduce((m, l) => Math.max(m, l.watts), 0);
  if (max230V >= 1500) {
    score -= 1;
    reasons.push("high-power 230V appliances are selected");
  }

  let level: "High" | "Medium" | "Low" = "Medium";
  if (score >= 2) level = "High";
  else if (score <= 0) level = "Low";

  const tone = level === "High" ? "text-primary border-primary bg-primary/5"
    : level === "Low" ? "text-accent border-accent bg-accent/10"
    : "text-foreground border-border bg-muted/40";

  return (
    <SectionCard title="Calculation confidence">
      <div className={cn("rounded-lg border-l-4 p-4", tone)}>
        <div className="font-display text-xl font-bold">Confidence: {level}</div>
        <p className="text-sm mt-2">
          <span className="font-semibold">Why:</span>{" "}
          {reasons.length === 0
            ? "You provided clear inputs and customized key values."
            : reasons.join("; ") + "."}
        </p>
        {level !== "High" && (
          <p className="text-sm mt-2 text-muted-foreground">
            Add real appliance wattage or roof dimensions to improve accuracy.
          </p>
        )}
      </div>
    </SectionCard>
  );
};

// ---------- Before-you-buy checklist ----------
const CHECKLIST_ITEMS = [
  "Measure your actual roof and obstacle positions.",
  "Verify your vehicle alternator type (smart vs. standard).",
  "Check whether your LiFePO4 battery supports low-temperature charging protection.",
  "Verify the BMS maximum discharge current.",
  "Check inverter continuous and peak power rating.",
  "Confirm cable lengths before buying cables.",
  "Fuse every positive cable close to the power source.",
  "Use proper RCD / MCB protection for 230V shore power.",
  "Have 230V installation checked by a qualified electrician.",
];

const BeforeYouBuySection = () => {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  return (
    <SectionCard title="Before you buy">
      <p className="text-sm text-muted-foreground mb-4">
        A practical checklist to verify before placing orders or starting installation.
      </p>
      <ul className="space-y-2">
        {CHECKLIST_ITEMS.map((item, i) => {
          const on = !!checked[i];
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                className="w-full flex items-start gap-3 text-left rounded-md border border-border bg-background/60 hover:border-primary p-3 transition-colors"
              >
                {on
                  ? <CheckSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  : <Square className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />}
                <span className={cn("text-sm font-sans", on && "line-through text-muted-foreground")}>{item}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
};

// ---------- Installer PRO preview ----------
const InstallerPreview = ({ onClick }: { onClick: () => void }) => (
  <SectionCard title="For electrician / installer">
    <p className="text-sm text-muted-foreground mb-4">
      A condensed report tailored for the professional fitting your system. Coming soon in PRO.
    </p>
    <div className="relative">
      <div className="rounded-lg border border-border bg-background/60 p-5 blur-sm select-none pointer-events-none" aria-hidden>
        <ul className="space-y-2 text-sm">
          <li>• Input summary</li>
          <li>• Daily energy calculation</li>
          <li>• Recommended components</li>
          <li>• Safety notes</li>
          <li>• Open questions for installer</li>
          <li>• 230V shore-power checklist</li>
        </ul>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-card border border-primary text-primary font-sans font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Lock className="w-4 h-4" />
          PRO — Coming Soon
        </button>
      </div>
    </div>
  </SectionCard>
);

// ---------- Page ----------
export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const state: WizardState = (location.state as { wizard?: WizardState })?.wizard ?? initialWizardState;
  const result = useMemo(() => calculate(state), [state]);
  const [proOpen, setProOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [profile, setProfile] = useState<PriceProfile>("balanced");

  // Profile-adjusted totals
  const adjComponentsTotal = adjust(result.componentsTotal, profile);
  const adjDcTotal = adjust(result.dcMaterialsTotal, profile);
  const adjSolarTotal = adjust(result.solarMaterialsTotal, profile);
  const adjShoreTotal = adjust(result.shoreMaterialsTotal, profile);
  const adjSubtotal = adjComponentsTotal + adjDcTotal + adjSolarTotal + adjShoreTotal;
  const adjContingency = Math.round(adjSubtotal * 0.15);
  const adjTotalBudget = adjSubtotal + adjContingency;
  const shoreGroupTitle = result.materialGroups.find((g) => g.key === "shore")?.title ?? "230V shore-power installation";

  const goBack = () => navigate("/wizard", { state: { resumeAtStep: 13, wizard: state } });
  const recalculate = () => navigate("/wizard", { state: { resumeAtStep: 4, wizard: state } });
  const showExisting = FEATURES.EXISTING_COMPONENTS && state.step13?.skip !== true && hasExistingData(state.step13);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <Link to="/" className="ml-auto flex items-center gap-2 text-foreground hover:text-primary">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-display text-base font-semibold tracking-tight hidden sm:inline">{en.app.name}</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-5xl">
        <div className="mb-8 sm:mb-12">
          <div className="text-xs font-sans uppercase tracking-[0.2em] text-accent font-semibold mb-2">Your results</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Your van's electrical system
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Indicative sizing based on your inputs. Use it as a recommended starting point —
            verify before buying and depend on real-world conditions.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* 1. Profile summary */}
          <ProfileSummary s={state} />

          {/* 2. Edit chips */}
          <EditChips state={state} />

          {showExisting && <ExistingSystemSection state={state} result={result} />}

          {/* 3. Off-grid autonomy */}
          <AutonomySection result={result} />

          {/* 4. Daily consumption */}
          <SectionCard title="Daily consumption">
            {/* Energy split breakdown — 12V vs 230V via inverter vs losses */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="rounded-lg bg-background/60 border border-border p-3">
                <div className="text-xs text-muted-foreground">12V appliances</div>
                <div className="font-display text-lg font-bold mt-1">{fmt(result.dailyWh12V)} Wh</div>
                <div className="text-[10px] text-muted-foreground font-sans mt-0.5">Direct battery draw</div>
              </div>
              <div className="rounded-lg bg-background/60 border border-border p-3">
                <div className="text-xs text-muted-foreground">230V via inverter</div>
                <div className="font-display text-lg font-bold mt-1">{fmt(result.dailyWh230VInverter)} Wh</div>
                <div className="text-[10px] text-muted-foreground font-sans mt-0.5">Battery-side, incl. losses</div>
              </div>
              <div className="rounded-lg bg-background/60 border border-border p-3">
                <div className="text-xs text-muted-foreground">Inverter losses</div>
                <div className="font-display text-lg font-bold mt-1">{fmt(result.inverterLossWh)} Wh</div>
                <div className="text-[10px] text-muted-foreground font-sans mt-0.5">~90% efficiency</div>
              </div>
              <div className="rounded-lg bg-primary/5 border border-primary/30 p-3">
                <div className="text-xs text-primary/80 font-semibold">Total battery draw</div>
                <div className="font-display text-lg font-bold mt-1 text-primary">{fmt(result.totalDailyWh)} Wh</div>
                <div className="text-[10px] text-muted-foreground font-sans mt-0.5">incl. reserve & remote work</div>
              </div>
            </div>

            {/* AC system recommendation */}
            {(() => {
              const rec = result.acRecommendation;
              if (rec === "none") return null;
              const text =
                rec === "shore-only"
                  ? "Shore power AC outlets are recommended, but an inverter is not required."
                  : rec === "inverter-required"
                  ? `Inverter and AC outlets are required. Recommended size: ${fmt(result.inverterSizeRecommendedW)}W (sized from battery-powered 230V appliances only).`
                  : `Your system should support both shore power and an inverter for AC outlets. Recommended inverter size: ${fmt(result.inverterSizeRecommendedW)}W.`;
              return (
                <div className="mb-5 rounded-lg border-l-4 border-primary bg-primary/5 p-3 text-sm">
                  <div className="font-sans font-semibold text-primary mb-0.5">AC system recommendation</div>
                  <div className="text-foreground">{text}</div>
                </div>
              );
            })()}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground font-sans font-semibold border-b border-border">
                  <tr>
                    <th className="py-2 pr-3">Appliance</th>
                    <th className="py-2 px-2">Source</th>
                    <th className="py-2 px-2 text-right w-16">W</th>
                    <th className="py-2 px-2 text-right w-16">h</th>
                    <th className="py-2 pl-2 text-right w-24">Wh/day</th>
                  </tr>
                </thead>
                <tbody>
                  {result.lines.length === 0 && (
                    <tr><td colSpan={5} className="py-3 text-muted-foreground italic">No appliances selected.</td></tr>
                  )}
                  {result.lines.filter(l => !l.informational).map((l) => (
                    <tr key={l.id} className="border-b border-border/60">
                      <td className="py-2 pr-3 font-sans">{l.label}</td>
                      <td className="py-2 px-2 text-muted-foreground text-xs">{sourceLabel(l.powerSource)}</td>
                      <td className="py-2 px-2 text-right font-mono">{l.watts}</td>
                      <td className="py-2 px-2 text-right font-mono">
                        {l.isDutyCycle ? (
                          <span>~{l.hours.toFixed(1)}<span className="block text-[10px] text-muted-foreground font-sans">(duty cycle)</span></span>
                        ) : (l.hours)}
                      </td>
                      <td className="py-2 pl-2 text-right font-mono">{fmt(l.wh)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="font-sans">
                  <tr>
                    <td colSpan={4} className="pt-3 text-right text-muted-foreground">Appliance subtotal</td>
                    <td className="pt-3 pl-2 text-right font-mono">{fmt(result.applianceSubtotalWh)}</td>
                  </tr>
                  {result.hasInverterLoad && (
                    <tr>
                      <td colSpan={4} className="text-right text-muted-foreground text-xs">Inverter losses (~90% efficiency) — included above</td>
                      <td className="pl-2 text-right font-mono text-xs text-muted-foreground">+{fmt(result.inverterLossWh)}</td>
                    </tr>
                  )}
                  {result.remoteWorkWh > 0 && (
                    <tr>
                      <td colSpan={4} className="text-right text-muted-foreground">Remote work addition</td>
                      <td className="pl-2 text-right font-mono">+{fmt(result.remoteWorkWh)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={4} className="text-right text-muted-foreground">Safety reserve (+25%)</td>
                    <td className="pl-2 text-right font-mono">+{fmt(result.reserveWh)}</td>
                  </tr>
                  <tr className="font-bold text-primary text-base">
                    <td colSpan={4} className="pt-2 text-right">TOTAL daily consumption</td>
                    <td className="pt-2 pl-2 text-right font-mono">{fmt(result.totalDailyWh)} Wh</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg bg-background/60 border border-border p-3">
                <div className="text-xs text-muted-foreground">☀️ Solar (avg)</div>
                <div className="font-display text-lg font-bold mt-1">~{fmt(result.solarDailyWh)} Wh/day</div>
              </div>
              <div className="rounded-lg bg-background/60 border border-border p-3">
                <div className="text-xs text-muted-foreground">🚗 Alternator</div>
                <div className="font-display text-lg font-bold mt-1">
                  {result.alternatorDailyWh > 0 ? `~${fmt(result.alternatorDailyWh)} Wh/day` : "Not applicable"}
                </div>
              </div>
              <div className="rounded-lg bg-background/60 border border-border p-3">
                <div className="text-xs text-muted-foreground">🔌 Shore power</div>
                <div className="font-display text-lg font-bold mt-1">
                  {state.step6.shorePower && state.step6.shorePower !== "never" ? "As needed" : "Not used"}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Shore appliances list (kept inline) */}
          {result.shoreLines.length > 0 && (
            <SectionCard title="Shore power appliances">
              <p className="text-sm text-muted-foreground mb-3">
                These appliances require 230V hookup and are excluded from off-grid sizing:
              </p>
              <ul className="space-y-1 text-sm">
                {result.shoreLines.map((l) => (
                  <li key={l.id} className="flex justify-between border-b border-border/60 py-1.5">
                    <span className="font-sans">{l.label}</span>
                    <span className="font-mono text-muted-foreground">{l.watts}W</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {/* 5. Solar & weather scenarios */}
          <ScenariosSection result={result} />

          {/* 6. Recommended system */}
          <SectionCard title="Recommended system">
            {/* Component variant selector */}
            <div className="mb-5 rounded-lg border border-border bg-background/60 p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-xs font-sans uppercase tracking-wider text-accent font-semibold">Component variant</div>
                  <div className="font-display text-base font-bold mt-0.5">{PROFILE_LABEL[profile]}</div>
                </div>
                <div className="inline-flex rounded-md border border-border overflow-hidden" role="tablist" aria-label="Component variant">
                  {(["low", "balanced", "premium"] as PriceProfile[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      role="tab"
                      aria-selected={profile === p}
                      onClick={() => setProfile(p)}
                      className={cn(
                        "px-3 py-2 text-xs font-sans font-semibold transition-colors",
                        profile === p
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground hover:text-primary",
                      )}
                    >
                      {PROFILE_LABEL[p]}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Switch between <strong>Low cost</strong>, <strong>Balanced</strong> (good price/performance) and
                <strong> Premium</strong>. This affects recommended batteries, solar panels, inverter, DC/DC charger,
                shore charger, cables, fuses, distribution, monitoring and installation accessories.
              </p>
              <p className="text-xs text-muted-foreground mt-2 italic">
                Prices are indicative and may vary by brand, country and supplier.
              </p>
            </div>
            {(() => {
              const tight = result.recommendedSolarW < result.requiredSolarW * 1.2;
              const customLabels = Object.entries(state.step7.obstacles ?? {})
                .filter(([, e]) => e && e.count > 0 && e.customSize && e.lengthCm && e.widthCm)
                .map(([id, e]) => {
                  const meta = en.steps.s7.obstacles[id as keyof typeof en.steps.s7.obstacles];
                  const name = id === "other" ? (e?.name?.trim() || meta.label) : meta.label;
                  return name;
                });
              return (
                <>
                  {tight && (
                    <div className="mb-4 rounded-lg border-l-4 border-accent bg-accent/10 p-3 text-sm leading-relaxed">
                      ⚠️ Your roof space is tight. The calculation uses typical obstacle dimensions —
                      your actual available area may differ depending on exact placement of windows,
                      fans and other components. We strongly recommend measuring your roof carefully
                      and marking out panel positions before purchasing.
                    </div>
                  )}
                  {customLabels.length > 0 && (
                    <div className="mb-4 space-y-1">
                      {customLabels.map((n) => (
                        <div key={n} className="text-xs font-sans text-primary">
                          ✓ Using your custom dimensions for {n} — more accurate result.
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.components.map((c) => <ComponentCard key={c.key} c={c} profile={profile} />)}
            </div>
            <div className="mt-4 flex justify-between font-display font-bold text-primary border-t border-border pt-3">
              <span>Components total</span>
              <span>{eur(adjComponentsTotal)}</span>
            </div>
          </SectionCard>

          {/* 7. Optimization */}
          <OptimizationSection state={state} result={result} />

          {/* 8. Red flags */}
          <RedFlagsSection state={state} result={result} />

          {/* 9. Installation materials & safety */}
          <SectionCard title="Installation materials & safety components">
            <p className="text-sm text-muted-foreground mb-5">
              Protection, distribution and wiring parts you'll need alongside the main components.
              Prices are rough European market averages — adjust as you shop.
            </p>

            {result.materialGroups.map((g) => (
              g.items.length === 0 ? null : (
                <div key={g.key} className="mb-6 last:mb-0">
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{g.title}</h3>

                  {g.key === "shore" && result.shoreInstallMode === "charging-only" && (
                    <p className="mb-3 text-sm text-muted-foreground italic">
                      Because you only need shore power for battery charging, this estimate uses
                      a simpler shore charging setup.
                    </p>
                  )}
                  {g.key === "shore" && result.shoreInstallMode === "full-ac" && (
                    <p className="mb-3 text-sm text-muted-foreground italic">
                      Because you selected 230V shore-only appliances, this estimate includes a
                      protected internal 230V distribution system.
                    </p>
                  )}

                  <ul className="text-sm space-y-1">
                    {g.items.map((m) => (
                      <li key={m.item} className="flex justify-between border-b border-border/60 py-1.5">
                        <span className="font-sans">{m.item}</span>
                        <span className="font-mono text-muted-foreground">{eur(adjust(m.price, profile))}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex justify-between text-sm font-semibold text-primary">
                    <span>{g.title} subtotal</span>
                    <span className="font-mono">{eur(adjust(g.total, profile))}</span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    {g.key === "dc" && (
                      <Link to="/electrical-guide#fuses" className="text-primary hover:underline">
                        Learn how fuses protect cables →
                      </Link>
                    )}
                    {g.key === "solar" && (
                      <Link to="/electrical-guide#solar" className="text-primary hover:underline">
                        Learn how solar charging works →
                      </Link>
                    )}
                    {g.key === "shore" && (
                      <Link to="/electrical-guide#shore" className="text-primary hover:underline">
                        Learn how shore power works →
                      </Link>
                    )}
                    {g.key === "shore" && result.shoreInstallMode === "full-ac" && (
                      <Link to="/electrical-guide#ac-system" className="text-primary hover:underline">
                        Learn about 230V safety →
                      </Link>
                    )}
                  </div>

                  {g.key === "shore" && result.shoreInstallMode === "full-ac" && (
                    <div className="mt-4 warning-banner flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        230V shore-power installation must include proper RCD/MCB protection and
                        protective earth wiring. Have the final installation checked by a qualified
                        electrician.
                      </span>
                    </div>
                  )}
                </div>
              )
            ))}

            <div className="mt-6 rounded-lg bg-muted/40 border border-border p-3 text-xs text-muted-foreground italic">
              Vanlectric provides indicative sizing and shopping guidance only. It is not a final
              electrical installation design.
            </div>
          </SectionCard>

          {/* 10. Cost summary */}
          <SectionCard title="Cost summary">
            <div className="mb-5 rounded-lg border border-border bg-background/60 p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-xs font-sans uppercase tracking-wider text-accent font-semibold">Component variant</div>
                  <div className="font-display text-base font-bold mt-0.5">{PROFILE_LABEL[profile]}</div>
                </div>
                <div className="inline-flex rounded-md border border-border overflow-hidden" role="tablist" aria-label="Component variant">
                  {(["low", "balanced", "premium"] as PriceProfile[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      role="tab"
                      aria-selected={profile === p}
                      onClick={() => setProfile(p)}
                      className={cn(
                        "px-3 py-2 text-xs font-sans font-semibold transition-colors",
                        profile === p
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground hover:text-primary",
                      )}
                    >
                      {PROFILE_LABEL[p]}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Low cost means budget-friendly components, Balanced means good price/performance,
                Premium means higher-end brands such as Victron or similar. The variant affects
                estimated prices only — not technical sizing.
              </p>
              <p className="text-xs text-muted-foreground mt-2 italic">
                Prices are indicative and may vary by brand, country and supplier.
              </p>
            </div>

            <dl className="space-y-2 text-sm max-w-md ml-auto">
              <div className="flex justify-between"><dt className="text-muted-foreground">Components total</dt><dd className="font-mono">{eur(adjComponentsTotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">DC installation materials</dt><dd className="font-mono">{eur(adjDcTotal)}</dd></div>
              {adjSolarTotal > 0 && (
                <div className="flex justify-between"><dt className="text-muted-foreground">Solar installation materials</dt><dd className="font-mono">{eur(adjSolarTotal)}</dd></div>
              )}
              {adjShoreTotal > 0 && (
                <div className="flex justify-between"><dt className="text-muted-foreground">{shoreGroupTitle}</dt><dd className="font-mono">{eur(adjShoreTotal)}</dd></div>
              )}
              <div className="border-t border-border pt-2 flex justify-between font-semibold"><dt>Subtotal</dt><dd className="font-mono">{eur(adjSubtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">+ 15% contingency</dt><dd className="font-mono">{eur(adjContingency)}</dd></div>
              <div className="border-t-2 border-primary pt-2 flex justify-between font-display text-xl font-bold text-primary">
                <dt>Recommended budget</dt><dd className="font-mono">{eur(adjTotalBudget)}</dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground mt-4 italic">
              Prices are indicative European market averages. Actual prices vary by country.
            </p>
          </SectionCard>

          {/* Things to watch (calculator-generated) */}
          {result.warnings.length > 0 && (
            <SectionCard title="Things to watch">
              <ul className="space-y-2">
                {result.warnings.map((w, i) => (
                  <li key={i} className="warning-banner flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {/* 11. Shopping list */}
          <SectionCard title="Shopping list">
            <p className="text-sm text-muted-foreground mb-2">
              Fill in real prices as you shop — totals update automatically.
            </p>
            {result.shoreLines.length > 0 && (
              <p className="text-xs text-muted-foreground italic mb-4">
                Appliance purchase prices are not estimated. Add your own prices if you plan to buy them.
              </p>
            )}
            <ShoppingList result={result} profile={profile} state={state} />
          </SectionCard>

          {/* 12. Confidence */}
          <ConfidenceSection state={state} result={result} />

          {/* 13. Before-you-buy */}
          <BeforeYouBuySection />

          {/* 14. PRO preview */}
          <InstallerPreview onClick={() => setProOpen(true)} />

          {/* Disclaimer */}
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground italic">
            Vanlectric provides indicative sizing and shopping guidance only. It is not a final
            electrical installation design. Always verify your setup and have 230V installations
            checked by a qualified electrician.
          </div>

          {/* 15. Actions */}
          <SectionCard title="Next steps">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEmailOpen(true)}
                className="sm:col-span-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors min-h-[44px] font-sans font-semibold text-sm"
              >
                <Mail className="w-4 h-4" />
                Email me report
                <span className="ml-1 text-[10px] font-bold border border-primary-foreground/60 rounded px-1.5 py-0.5">FREE</span>
              </button>
              <LockedAction icon={<FileText className="w-4 h-4" />} label="Download PDF" onClick={() => setProOpen(true)} />
              <LockedAction icon={<FileSpreadsheet className="w-4 h-4" />} label="Download Excel" onClick={() => setProOpen(true)} />
              <LockedAction icon={<Save className="w-4 h-4" />} label="Save design" onClick={() => setProOpen(true)} />
              <button
                type="button"
                onClick={recalculate}
                className="sm:col-span-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors min-h-[44px] font-sans font-semibold text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Recalculate (back to appliances)
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate("/", { replace: true })}
                className="text-xs font-sans text-muted-foreground hover:text-primary hover:underline transition-colors"
              >
                ↺ Start a new calculation
              </button>
            </div>
          </SectionCard>
        </div>
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground font-sans">
        <div className="container mx-auto px-4 flex flex-col gap-1.5">
          <div>{en.app.name} — indicative sizing, not a substitute for professional electrical advice.</div>
          <div>© 2025 Vanlectric · Hana Kunzfeldová</div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <Link to="/privacy" className="hover:text-primary hover:underline">Privacy Policy</Link>
            <span aria-hidden>·</span>
            <a href="mailto:hello@vanlectric.com" className="hover:text-primary hover:underline">hello@vanlectric.com</a>
          </div>
          <div>Free to use · No account required</div>
        </div>
      </footer>
      <ProModal open={proOpen} onClose={() => setProOpen(false)} />
      <EmailReportModal open={emailOpen} onClose={() => setEmailOpen(false)} />
    </div>
  );
}
