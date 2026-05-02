import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, Info } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { PlannerLink } from "@/components/ui/PlannerLink";

interface SectionProps {
  id: string;
  letter: string;
  title: string;
  children: React.ReactNode;
}

const Section = ({ id, letter, title, children }: SectionProps) => (
  <section id={id} className="step-card p-5 sm:p-7 scroll-mt-24">
    <div className="text-xs font-sans uppercase tracking-[0.18em] text-accent font-semibold mb-1">
      {letter}
    </div>
    <h2 className="font-display font-bold text-2xl sm:text-3xl text-primary tracking-tight mb-4 normal-case">
      {title}
    </h2>
    <div className="space-y-3 text-foreground/90 leading-relaxed font-sans text-[15px]">
      {children}
    </div>
  </section>
);

const FormulaCard = ({ formula, example }: { formula: string; example?: string }) => (
  <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-center">
    <div className="font-display font-bold text-primary text-base sm:text-lg break-words">
      {formula}
    </div>
    {example && (
      <div className="text-xs text-muted-foreground mt-1 font-sans">{example}</div>
    )}
  </div>
);

const Note = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-md border-l-4 border-accent bg-accent/10 p-3 text-sm">
    {children}
  </div>
);

const Warn = ({ children }: { children: React.ReactNode }) => (
  <div className="warning-banner flex items-start gap-2">
    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
    <span>{children}</span>
  </div>
);

const TOC: Array<{ id: string; label: string }> = [
  { id: "estimate", label: "A. Why this is an estimate" },
  { id: "daily-consumption", label: "B. Daily consumption" },
  { id: "fridge", label: "C. Fridges and duty cycle" },
  { id: "diesel-heater", label: "D. Diesel heaters" },
  { id: "inverter", label: "E. 230V appliances and inverter losses" },
  { id: "shore-appliances", label: "F. Shore power appliances" },
  { id: "reserve", label: "G. Safety reserve" },
  { id: "battery", label: "H. Battery sizing" },
  { id: "solar", label: "I. Solar sizing" },
  { id: "roof", label: "J. Roof space" },
  { id: "alternator", label: "K. Alternator / DC-DC charging" },
  { id: "shore", label: "L. Shore power charging" },
  { id: "budget", label: "M. Budget and product tiers" },
  { id: "use-result", label: "N. How to use the result" },
];

export default function CalculationLogic() {
  return (
    <SiteLayout
      title="How Vanlectric Calculates Your Van Electrical System"
      description="Learn how Vanlectric estimates campervan battery size, solar panels, inverter load, shore power use, fridge duty cycle and safety reserve."
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "How Vanlectric Calculates Your Van Electrical System",
        description:
          "A transparent explanation of the assumptions behind Vanlectric's vanlife electrical calculator.",
        mainEntityOfPage: "https://vanlectric.com/calculation-logic",
      }}
    >
      <PageHero
        eyebrow="Transparency"
        title="How Vanlectric calculates your system"
        subtitle="A transparent explanation of the assumptions behind your van electrical system estimate."
      />

      <div className="container mx-auto px-4 py-10 sm:py-14 max-w-3xl">
        {/* Table of contents */}
        <nav
          aria-label="On this page"
          className="step-card p-5 sm:p-6 mb-8"
        >
          <div className="text-xs font-sans uppercase tracking-[0.18em] text-accent font-semibold mb-3">
            On this page
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm font-sans">
            {TOC.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className="text-primary hover:text-accent transition-colors"
                >
                  {t.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-6 sm:space-y-8">
          <Section id="estimate" letter="A" title="Why this is an estimate">
            <p>
              Vanlectric is a planning tool, not a replacement for a qualified
              electrician. It uses typical values, your inputs and conservative
              safety margins to produce a recommended starting point.
            </p>
            <p>
              Real installations depend on the specific appliances you buy, your
              cable lengths, product manuals, vehicle layout and local
              regulations. Always cross-check the numbers here with the labels
              on your actual components, and have 230V and safety-critical work
              verified by a professional.
            </p>
            <Warn>
              Use the result as a baseline for planning and shopping —
              not as a final wiring diagram.
            </Warn>
          </Section>

          <Section id="daily-consumption" letter="B" title="Daily consumption">
            <p>The base principle is simple:</p>
            <FormulaCard
              formula="Energy per day = Power × Usage time"
              example="A 60 W laptop used for 4 hours → 60 W × 4 h = 240 Wh/day"
            />
            <p>
              In practice, many appliances do not run continuously. Vanlectric
              uses more realistic assumptions for fridges, heaters and similar
              cycling loads (see the next sections), so the daily Wh you see in
              the planner is rarely a flat watts × 24 h.
            </p>
          </Section>

          <Section id="fridge" letter="C" title="Fridges and duty cycle">
            <p>
              Compressor fridges do not run for 24 hours straight. They switch
              on and off depending on the inside temperature, the door opening
              frequency, the insulation around the box and the climate outside.
            </p>
            <p>Vanlectric estimates fridge runtime using a duty cycle based on:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>your selected climate zone</li>
              <li>insulation level of the van</li>
              <li>fridge size</li>
              <li>whether a freezer compartment is included</li>
            </ul>
            <FormulaCard
              formula="45 W × 24 h × 0.35 ≈ 378 Wh/day"
              example="Example: a 45 W fridge in a temperate climate with basic insulation, running ~35% of the day."
            />
            <Note>
              You can override the wattage in the planner if you know the real
              value from the product label or manual — that always gives the
              most accurate result.
            </Note>
          </Section>

          <Section id="diesel-heater" letter="D" title="Diesel heaters">
            <p>
              Diesel fuel itself is not an electrical load. Vanlectric only
              counts the <em>electrical</em> part of a diesel heater:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>the fan</li>
              <li>the control unit</li>
              <li>the fuel pump</li>
              <li>a short startup load when the glow plug ignites</li>
            </ul>
            <p>
              How long the heater runs each day depends on your selected
              climate and season.
            </p>
            <Warn>
              If your van has a petrol engine and you select a diesel heater,
              Vanlectric warns you that a separate diesel tank may be needed.
            </Warn>
          </Section>

          <Section
            id="inverter"
            letter="E"
            title="230V appliances and inverter losses"
          >
            <p>
              A 230V appliance used off-grid runs through an inverter that
              converts 12V battery power to 230V AC. Inverters are not 100%
              efficient.
            </p>
            <p>
              Vanlectric adds an estimated 12% loss for 230V appliances used via
              the inverter:
            </p>
            <FormulaCard
              formula="1000 Wh AC × 1.12 ≈ 1120 Wh from the battery"
              example="The inverter pulls more from the battery than the appliance actually uses."
            />
            <Note>
              If you mark a 230V appliance as <strong>shore power only</strong>,
              it is excluded from battery, solar and inverter sizing — it only
              affects shore power planning.
            </Note>
          </Section>

          <Section id="shore-appliances" letter="F" title="Shore power appliances">
            <p>
              High-load appliances such as electric heaters, water boilers,
              flow heaters, ovens or some induction cooking setups are usually
              better used only when plugged into shore power.
            </p>
            <p>
              Vanlectric lists them separately so you can still plan sockets
              and the shore installation, but they do not increase the
              off-grid battery estimate.
            </p>
          </Section>

          <Section id="reserve" letter="G" title="Safety reserve">
            <p>
              Vanlectric adds a safety reserve to avoid designing a system that
              only works on paper. The reserve covers:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>colder or hotter days than expected</li>
              <li>older batteries with reduced capacity</li>
              <li>cloudy weather and lower solar yield</li>
              <li>real-world inefficiencies and small wiring losses</li>
              <li>forgotten small loads (chargers, lights left on, etc.)</li>
              <li>variation in user behavior from day to day</li>
            </ul>
          </Section>

          <Section id="battery" letter="H" title="Battery sizing">
            <p>The battery capacity is based on:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>total daily consumption</li>
              <li>expected autonomy (how long you want to stay off-grid)</li>
              <li>usable capacity of LiFePO4 batteries</li>
            </ul>
            <FormulaCard
              formula="Required Ah ≈ Required Wh ÷ 12 V ÷ usable battery factor"
              example="LiFePO4 is the default assumption — it's the most common modern choice for campervan builds."
            />
          </Section>

          <Section id="solar" letter="I" title="Solar sizing">
            <p>Solar output depends heavily on:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>climate</li>
              <li>season</li>
              <li>shade</li>
              <li>roof space</li>
              <li>panel angle</li>
              <li>real installation conditions</li>
            </ul>
            <p>
              Vanlectric estimates average <em>useful</em> solar hours based on
              your climate and season, not just panel wattage.
            </p>
            <FormulaCard
              formula="Required solar W ≈ Daily Wh ÷ Estimated solar hours"
            />
            <Note>
              In winter or mixed climates, the solar estimate is intentionally
              conservative — better to plan for the bad days than be caught out.
            </Note>
          </Section>

          <Section id="roof" letter="J" title="Roof space">
            <p>Vanlectric estimates available roof area based on:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>van length</li>
              <li>roof obstacles you select</li>
              <li>roof windows</li>
              <li>fans</li>
              <li>roof rack</li>
              <li>roof tent</li>
              <li>AC units</li>
              <li>any custom dimensions you enter</li>
            </ul>
            <Warn>
              The calculation uses area, but real panel placement matters.
              Measure your roof and mark the actual position of components
              before ordering panels.
            </Warn>
          </Section>

          <Section id="alternator" letter="K" title="Alternator / DC-DC charging">
            <p>
              If you drive regularly, Vanlectric estimates the energy added by
              a DC-DC charger based on your driving frequency and typical
              driving duration.
            </p>
            <p>
              If you mostly park in one place, alternator charging may
              contribute very little to the daily energy budget.
            </p>
            <Warn>
              Modern vehicles with smart alternators may require a compatible
              DC-DC charger — check your vehicle and product compatibility
              before buying.
            </Warn>
          </Section>

          <Section id="shore" letter="L" title="Shore power charging">
            <p>
              If you regularly plug into 230V shore power, a shore charger
              becomes more important and solar becomes less critical. Your
              optimal balance between solar, alternator and shore depends on
              how you actually use the van.
            </p>
          </Section>

          <Section id="budget" letter="M" title="Budget and product tiers">
            <p>
              Component prices in Vanlectric are <strong>indicative
              estimates only</strong>. The Low cost, Balanced and Premium
              tiers are planning categories — not exact shopping
              recommendations.
            </p>
            <p>Actual prices vary by:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>country</li>
              <li>brand</li>
              <li>seller</li>
              <li>certification</li>
              <li>availability</li>
            </ul>
          </Section>

          <Section id="use-result" letter="N" title="How to use the result">
            <p>Treat the result as a planning baseline:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Check appliance labels and manuals.</li>
              <li>Adjust wattage and shore-only settings in the planner.</li>
              <li>Measure roof space and mark obstacles.</li>
              <li>Compare Low cost / Balanced / Premium component options.</li>
              <li>
                Ask a qualified professional to verify the final installation,
                especially 230V and safety components.
              </li>
            </ol>
          </Section>

          {/* CTA */}
          <div className="step-card p-6 sm:p-8 text-center">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-primary tracking-tight mb-2">
              Ready to plan your system?
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Run the planner and see exactly how these assumptions apply to
              your van.
            </p>
            <PlannerLink
              to="/planner"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors min-h-[44px] font-sans font-semibold text-sm"
            >
              Start planning <ArrowRight className="w-4 h-4" />
            </PlannerLink>
            <div className="mt-4">
              <Link
                to="/electrical-guide"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                <Info className="w-4 h-4" /> Read the Electrical Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
