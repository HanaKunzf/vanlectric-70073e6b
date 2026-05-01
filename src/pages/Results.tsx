import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, FileText, FileSpreadsheet, Mail, RotateCcw, Save, Lock, Zap, AlertTriangle } from "lucide-react";
import { calculate, type CalculationResult, type ApplianceLine } from "@/logic/calculator";
import { initialWizardState, type WizardState, type ExistingStep } from "@/types";
import { FEATURES } from "@/config/features";
import { en } from "@/i18n/en";
import { cn } from "@/lib/utils";
import { ProModal } from "@/components/ui/ProModal";
import { EmailReportModal } from "@/components/ui/EmailReportModal";

const fmt = (n: number) => Math.round(n).toLocaleString("en-GB");
const eur = (n: number) => `€${fmt(n)}`;

const sourceLabel = (s: ApplianceLine["powerSource"]) =>
  s === "12v" ? "12V" : s === "230v-inverter" ? "230V (inverter)" : "230V (shore)";

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

// ---------- Section wrapper ----------
const SectionCard = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
  <section className={cn("step-card p-6 sm:p-8", className)}>
    <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-1 normal-case tracking-tight">{title}</h2>
    <div className="h-px w-12 bg-primary/40 mb-5" />
    {children}
  </section>
);

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

// ---------- Component card with detail ----------
const ComponentCard = ({ c }: { c: CalculationResult["components"][number] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-sans uppercase tracking-wider text-accent font-semibold">{c.category}</div>
          <div className="font-display text-lg font-bold mt-0.5">{c.name}</div>
          <div className="text-sm text-muted-foreground mt-1">{c.why}</div>
        </div>
        <div className="text-right font-display text-xl font-bold text-primary whitespace-nowrap">~{eur(c.price)}</div>
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-3 inline-flex items-center gap-1 text-xs font-sans font-semibold text-primary hover:underline"
      >
        {open ? "Hide details" : "Why this?"}
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
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

// ---------- Shopping list editable row ----------
interface ShopRow { item: string; qty: number; estimate: number; userPrice: number }

const ShoppingList = ({ result }: { result: CalculationResult }) => {
  const initial: ShopRow[] = useMemo(
    () => [
      ...result.components.map((c) => ({ item: c.name, qty: 1, estimate: c.price, userPrice: 0 })),
      ...result.materials.map((m) => ({ item: m.item, qty: 1, estimate: m.price, userPrice: 0 })),
    ],
    [result],
  );
  const [rows, setRows] = useState<ShopRow[]>(initial);
  const grandEstimate = rows.reduce((s, r) => s + r.qty * r.estimate, 0);
  const grandUser = rows.reduce((s, r) => s + r.qty * r.userPrice, 0);

  const update = (i: number, patch: Partial<ShopRow>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  return (
    <div className="overflow-x-auto">
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
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border/60">
              <td className="py-2 pr-3 font-sans">{r.item}</td>
              <td className="py-2 px-2">
                <input
                  type="number" min={0} value={r.qty}
                  onChange={(e) => update(i, { qty: Number(e.target.value) })}
                  className="w-full bg-background border border-border rounded px-2 py-1 text-center"
                />
              </td>
              <td className="py-2 px-2 text-right font-mono text-muted-foreground">{r.estimate}</td>
              <td className="py-2 px-2">
                <input
                  type="number" min={0} value={r.userPrice || ""}
                  placeholder="—"
                  onChange={(e) => update(i, { userPrice: Number(e.target.value) })}
                  className="w-full bg-background border border-border rounded px-2 py-1 text-right"
                />
              </td>
              <td className="py-2 pl-2 text-right font-mono font-semibold">
                {r.userPrice ? eur(r.qty * r.userPrice) : eur(r.qty * r.estimate)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold">
            <td className="pt-3 pr-3 text-right" colSpan={4}>Estimate total</td>
            <td className="pt-3 pl-2 text-right font-mono">{eur(grandEstimate)}</td>
          </tr>
          <tr className="font-bold text-primary">
            <td className="pr-3 text-right" colSpan={4}>Your total</td>
            <td className="pl-2 text-right font-mono">{grandUser ? eur(grandUser) : "—"}</td>
          </tr>
        </tfoot>
      </table>
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
  capacityAh: number;
  capacityWh: number;
  existingSolarW: number;
  existingSolarWh: number;
  autonomyNoSolar: number;
  autonomyWithSolar: number;
  dailyGapWh: number;
  sufficient: string[];
  upgrades: string[];
  reduceTo: number;
}

const analyzeExisting = (e: ExistingStep, result: CalculationResult): ExistingAnalysis => {
  const usableFactor = e.battery?.chemistry === "lifepo4" ? 0.8 : e.battery?.chemistry === "agm" ? 0.5 : 0.6;
  const capacityAh = (e.battery?.qty ?? 0) * (e.battery?.ah ?? 0);
  const capacityWh = capacityAh * 12 * usableFactor;
  const existingSolarW = (e.solar?.qty ?? 0) * (e.solar?.watts ?? 0);
  const peakSunHours = result.solarDailyWh > 0 && (result.components.find(c => c.category.toLowerCase().includes("solar"))) ? 3.5 : 3.5;
  const existingSolarWh = existingSolarW * peakSunHours * 0.75;
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
          <ul className="text-sm space-y-1">
            {a.sufficient.map((s) => <li key={s} className="text-foreground">• {s}</li>)}
          </ul>
        </div>
      )}
      {a.upgrades.length > 0 && (
        <div className="mb-3">
          <div className="font-sans font-semibold text-accent mb-1">⚠️ Upgrade or add</div>
          <ul className="text-sm space-y-1">
            {a.upgrades.map((s) => <li key={s} className="text-foreground">• {s}</li>)}
          </ul>
        </div>
      )}
      <div className="mt-4 rounded-lg bg-accent/10 border-l-4 border-accent p-3 text-sm">
        <span className="font-semibold">Alternative:</span> reduce your daily consumption to ~{fmt(a.reduceTo)} Wh/day
        to make your existing system work without upgrades.
      </div>
    </SectionCard>
  );
};

// ---------- Page ----------
export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const state: WizardState = (location.state as { wizard?: WizardState })?.wizard ?? initialWizardState;
  const result = useMemo(() => calculate(state), [state]);
  const [proOpen, setProOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

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
            Based on your inputs, here's a balanced 12V system sized for your real-world use.
            Prices are indicative European market averages.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Section 1 */}
          <ProfileSummary s={state} />

          {/* Edit chips */}
          <EditChips state={state} />

          {showExisting && <ExistingSystemSection state={state} result={result} />}

          {/* Section 2 — Daily consumption */}
          <SectionCard title="Daily consumption">
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
                        ) : (
                          l.hours
                        )}
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
                      <td colSpan={4} className="text-right text-muted-foreground text-xs">Inverter losses (+12%) — included above</td>
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

          {/* Section 3 — Shore power appliances */}
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

          {/* Section 4+5 — Components & materials */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <SectionCard title="Recommended system">
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
              <div className="space-y-3">
                {result.components.map((c) => <ComponentCard key={c.key} c={c} />)}
              </div>
              <div className="mt-4 flex justify-between font-display font-bold text-primary border-t border-border pt-3">
                <span>Components total</span>
                <span>{eur(result.componentsTotal)}</span>
              </div>
            </SectionCard>

            <SectionCard title="Installation materials">
              <ul className="text-sm space-y-1">
                {result.materials.map((m) => (
                  <li key={m.item} className="flex justify-between border-b border-border/60 py-1.5">
                    <span className="font-sans">{m.item}</span>
                    <span className="font-mono text-muted-foreground">{eur(m.price)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between font-display font-bold text-primary border-t border-border pt-3">
                <span>Materials total</span>
                <span>{eur(result.materialsTotal)}</span>
              </div>
            </SectionCard>
          </div>

          {/* Section 6 — Cost summary */}
          <SectionCard title="Cost summary">
            <dl className="space-y-2 text-sm max-w-md ml-auto">
              <div className="flex justify-between"><dt className="text-muted-foreground">Components total</dt><dd className="font-mono">{eur(result.componentsTotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Materials total</dt><dd className="font-mono">{eur(result.materialsTotal)}</dd></div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold"><dt>Subtotal</dt><dd className="font-mono">{eur(result.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">+ 15% contingency</dt><dd className="font-mono">{eur(result.contingency)}</dd></div>
              <div className="border-t-2 border-primary pt-2 flex justify-between font-display text-xl font-bold text-primary">
                <dt>Recommended budget</dt><dd className="font-mono">{eur(result.totalBudget)}</dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground mt-4 italic">
              Prices are indicative European market averages. Actual prices vary by country.
            </p>
          </SectionCard>

          {/* Section 7 — Warnings */}
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

          {/* Section 8 — Shopping list */}
          <SectionCard title="Shopping list">
            <p className="text-sm text-muted-foreground mb-4">
              Fill in real prices as you shop — totals update automatically.
            </p>
            <ShoppingList result={result} />
          </SectionCard>

          {/* Section 9 — Actions */}
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
