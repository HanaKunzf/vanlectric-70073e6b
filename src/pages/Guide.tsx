import { Link } from "react-router-dom";
import { PlannerLink } from "@/components/ui/PlannerLink";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight, AlertTriangle, CheckSquare } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import {
  BigPictureDiagram,
  BatteryDiagram,
  SolarDiagram,
  DcDcDiagram,
  ShoreDiagram,
  TwelveVDiagram,
  AcDiagram,
  InverterDiagram,
} from "@/components/guide/GuideDiagrams";

interface SectionProps {
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
}

const Section = ({ id, number, title, children }: SectionProps) => (
  <section id={id} className="step-card p-5 sm:p-7 scroll-mt-24">
    <div className="text-xs font-sans uppercase tracking-[0.18em] text-accent font-semibold mb-1">
      Part {number}
    </div>
    <h2 className="font-display font-bold text-2xl sm:text-3xl text-primary tracking-tight mb-4 normal-case">
      {title}
    </h2>
    <div className="space-y-3 text-foreground/90 leading-relaxed font-sans text-[15px]">
      {children}
    </div>
  </section>
);

const DiagramFrame = ({ children, caption }: { children: React.ReactNode; caption?: string }) => (
  <figure className="my-4 rounded-lg border border-border bg-card/60 p-4">
    <div className="text-primary">{children}</div>
    {caption && (
      <figcaption className="mt-2 text-xs text-muted-foreground italic font-sans text-center">
        {caption}
      </figcaption>
    )}
  </figure>
);

const FormulaCard = ({ formula, example }: { formula: string; example?: string }) => (
  <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-center">
    <div className="font-display font-bold text-primary text-lg">{formula}</div>
    {example && <div className="text-xs text-muted-foreground mt-1 font-sans">{example}</div>}
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
  { id: "big-picture", label: "1. The big picture" },
  { id: "battery", label: "2. Battery bank" },
  { id: "solar", label: "3. Solar charging" },
  { id: "dcdc", label: "4. DC-DC alternator charging" },
  { id: "shore", label: "5. Shore power charging" },
  { id: "12v", label: "6. 12V DC system" },
  { id: "ac-system", label: "7. 230V AC system" },
  { id: "inverter", label: "8. Inverter" },
  { id: "fuses", label: "9. Fuses and protection" },
  { id: "rcd", label: "10. RCD / RCBO / MCB basics" },
  { id: "cables", label: "11. Cable sizing basics" },
  { id: "cable-chart", label: "12. Cable sizing chart" },
  { id: "examples", label: "13. Typical system examples" },
  { id: "checklist", label: "14. Before you buy" },
  { id: "basics", label: "Electrical basics in your pocket" },
];

export default function Guide() {
  const location = useLocation();

  // Scroll to anchor when navigated with hash, after layout settles.
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        // small delay to let layout settle
        requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    }
  }, [location.hash]);

  return (
    <SiteLayout
      title="Campervan Electrical Basics — 12V, 230V, Current, Voltage and Fuses"
      description="Learn the basics of campervan electrics: voltage, current, watts, fuses, cable sizing, RCDs, batteries and safe 230V shore power."
    >
      <PageHero
        eyebrow="Electrical Guide"
        title="Van Electrical System Guide"
        subtitle="Understand the main parts of a campervan electrical system before you buy components."
      />

      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        {/* Table of contents */}
        <nav aria-label="Guide contents" className="step-card p-5">
          <div className="text-xs font-sans uppercase tracking-wider text-accent font-semibold mb-2">
            On this page
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {TOC.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="text-primary hover:underline font-sans">
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* 1. Big picture */}
        <Section id="big-picture" number={1} title="The big picture">
          <p>
            A campervan electrical system usually has a few core parts working together:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>A <strong>battery bank</strong> that stores your energy.</li>
            <li><strong>Charging sources</strong>: solar, alternator (while driving), and shore power.</li>
            <li><strong>12V DC loads</strong> like lights, fridge, water pump, USB.</li>
            <li>Optional <strong>230V AC loads</strong> through an inverter or shore hookup.</li>
            <li><strong>Protection</strong>: fuses, breakers, RCDs and switches.</li>
          </ul>
          <DiagramFrame caption="Solar / alternator / shore power → battery → 12V loads. Battery → inverter → 230V loads.">
            <BigPictureDiagram className="w-full h-auto max-w-full" />
          </DiagramFrame>
        </Section>

        {/* 2. Battery */}
        <Section id="battery" number={2} title="Battery bank">
          <ul className="list-disc pl-5 space-y-1">
            <li>The battery <strong>stores energy</strong> for when you are not charging.</li>
            <li>Capacity is usually shown in <strong>Ah</strong>, but <strong>Wh</strong> is easier for comparing systems.</li>
            <li><strong>LiFePO4</strong> batteries are common in modern van builds — light, safe, long life.</li>
            <li>Usable capacity depends on battery type. LiFePO4 ≈ 80–90% usable.</li>
            <li>Every battery must be protected by a <strong>main fuse</strong> and a <strong>disconnect switch</strong>.</li>
          </ul>
          <FormulaCard formula="Wh = V × Ah" example="Example: 12V × 200Ah = 2400Wh" />
          <DiagramFrame caption="Battery with main fuse and disconnect switch on the positive line.">
            <BatteryDiagram className="w-full h-auto max-w-full" />
          </DiagramFrame>
        </Section>

        {/* 3. Solar */}
        <Section id="solar" number={3} title="Solar charging system">
          <ul className="list-disc pl-5 space-y-1">
            <li>Solar panels <strong>produce power during daylight</strong>.</li>
            <li>An <strong>MPPT controller</strong> turns raw solar power into safe battery charging.</li>
            <li>Real production depends on <strong>season, weather, shading and panel angle</strong>.</li>
            <li>Roof space and obstacles (windows, fans, AC) limit how much solar you can fit.</li>
          </ul>
          <DiagramFrame caption="Panel → MC4 connectors → roof gland → MPPT → fuse → battery.">
            <SolarDiagram className="w-full h-auto max-w-full" />
          </DiagramFrame>
        </Section>

        {/* 4. DC-DC */}
        <Section id="dcdc" number={4} title="DC-DC charging from alternator">
          <ul className="list-disc pl-5 space-y-1">
            <li>A <strong>DC-DC charger</strong> charges the house battery while you drive.</li>
            <li>It <strong>protects the alternator</strong> and the house battery from each other.</li>
            <li>Modern Euro 6 vehicles often have <strong>smart alternators</strong> with variable voltage.</li>
            <li>Smart alternators usually need a DC-DC charger with <strong>engine-running detection</strong>.</li>
          </ul>
          <DiagramFrame caption="Alternator → input fuse → DC-DC → output fuse → house battery.">
            <DcDcDiagram className="w-full h-auto max-w-full" />
          </DiagramFrame>
        </Section>

        {/* 5. Shore */}
        <Section id="shore" number={5} title="Shore power charging">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Shore power</strong> means plugging into 230V at home or at a campsite.</li>
            <li>A <strong>shore charger</strong> charges the 12V battery from 230V.</li>
            <li>This is <strong>different from</strong> powering internal 230V sockets.</li>
            <li>Simple shore charging may need fewer AC components than a full 230V distribution system.</li>
          </ul>
          <DiagramFrame caption="CEE inlet → AC protection → shore charger → battery.">
            <ShoreDiagram className="w-full h-auto max-w-full" />
          </DiagramFrame>
        </Section>

        {/* 6. 12V */}
        <Section id="12v" number={6} title="12V DC system">
          <ul className="list-disc pl-5 space-y-1">
            <li>Most campervan appliances should ideally <strong>run on 12V</strong>.</li>
            <li>12V is <strong>safer and more efficient</strong> than using an inverter.</li>
            <li>Common 12V loads: fridge, lights, water pump, roof fan, USB sockets.</li>
            <li>Each circuit should be <strong>fused correctly</strong>.</li>
          </ul>
          <DiagramFrame caption="Battery → main fuse → busbar → fuse box → individual circuits.">
            <TwelveVDiagram className="w-full h-auto max-w-full" />
          </DiagramFrame>
        </Section>

        {/* 7. AC */}
        <Section id="ac-system" number={7} title="230V AC system">
          <ul className="list-disc pl-5 space-y-1">
            <li>230V AC is <strong>household-style electricity</strong>.</li>
            <li>It can come from <strong>shore hookup</strong> or from an <strong>inverter</strong>.</li>
            <li>Useful for laptops, kettles, induction hobs and tools.</li>
            <li>High-power appliances <strong>drain batteries quickly</strong> through an inverter.</li>
            <li>Internal 230V sockets need proper protection.</li>
          </ul>
          <Warn>
            230V AC can be dangerous. Use proper RCD/RCBO and MCB protection and have the
            installation checked by a qualified electrician.
          </Warn>
          <DiagramFrame caption="Shore inlet → RCD/RCBO → MCBs → 230V sockets.">
            <AcDiagram className="w-full h-auto max-w-full" />
          </DiagramFrame>
        </Section>

        {/* 8. Inverter */}
        <Section id="inverter" number={8} title="Inverter">
          <ul className="list-disc pl-5 space-y-1">
            <li>An inverter converts <strong>12V battery power into 230V AC</strong>.</li>
            <li>It has efficiency losses — typically around 10%.</li>
            <li>Larger inverters need <strong>thicker cables</strong> and bigger fuses.</li>
            <li>Check both <strong>continuous power</strong> and <strong>peak power</strong>.</li>
            <li>Do not size only by average consumption — check appliance peak watts.</li>
          </ul>
          <DiagramFrame caption="Battery → fuse → inverter → 230V appliance.">
            <InverterDiagram className="w-full h-auto max-w-full" />
          </DiagramFrame>
        </Section>

        {/* 9. Fuses */}
        <Section id="fuses" number={9} title="Fuses and protection">
          <ul className="list-disc pl-5 space-y-1">
            <li>A <strong>fuse protects the cable</strong>, not the appliance.</li>
            <li>Every positive cable from a power source should be fused <strong>close to the source</strong>.</li>
            <li>Fuse size depends on <strong>cable size</strong> and the expected current.</li>
            <li>The main battery fuse protects the main cable.</li>
            <li>Smaller fuses protect individual circuits.</li>
          </ul>
          <FormulaCard formula="A = W ÷ V" example="Example: 120W on 12V = 120 ÷ 12 = 10A" />
          <p>
            Choose a fuse <strong>slightly above</strong> the expected current — but never above
            what the cable can safely carry.
          </p>
        </Section>

        {/* 10. RCD/MCB */}
        <Section id="rcd" number={10} title="RCD / RCBO / MCB basics">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>MCB</strong> protects against overload and short circuit.</li>
            <li><strong>RCD</strong> protects people from electric shock caused by leakage current.</li>
            <li><strong>RCBO</strong> combines both functions in one device.</li>
            <li>In campervan 230V systems, <strong>30mA</strong> RCD/RCBO protection is commonly used.</li>
          </ul>
          <Note>
            <strong>Important:</strong> Rules vary by country. Always follow local electrical
            standards and have your 230V installation checked by a qualified electrician.
          </Note>
        </Section>

        {/* 11. Cables */}
        <Section id="cables" number={11} title="Cable sizing basics">
          <ul className="list-disc pl-5 space-y-1">
            <li>Cables must be <strong>thick enough</strong> for the current and length.</li>
            <li>Long cables suffer from <strong>voltage drop</strong>.</li>
            <li>High-current devices like inverters need <strong>very thick cables</strong>.</li>
            <li>Undersized cables can <strong>overheat</strong>.</li>
          </ul>
          <Note>
            Use a proper cable sizing chart or ask a qualified installer. This guide stays
            beginner-level on purpose.
          </Note>
        </Section>

        {/* 12. Cable sizing chart */}
        <Section id="cable-chart" number={12} title="Cable sizing chart">
          <p>
            Choosing the right cable size is important for safety and performance. In campervan
            systems, cable size depends mainly on <strong>current (A)</strong>,{" "}
            <strong>cable length</strong>, and acceptable <strong>voltage drop</strong>. The
            chart below is a simple guide for common 12V DC circuits.
          </p>

          <div className="not-prose">
            <h3 className="font-display font-bold text-lg text-primary mt-2 mb-2">
              12V DC cable sizing (mm²)
            </h3>
            <div className="rounded-lg border border-border bg-background/60 overflow-hidden">
              <table className="w-full text-xs sm:text-sm font-sans border-collapse table-fixed">
                <colgroup>
                  <col className="w-[14%]" />
                  <col className="w-[34%]" />
                  <col className="w-[17%]" />
                  <col className="w-[17%]" />
                  <col className="w-[18%]" />
                </colgroup>
                <thead>
                  <tr className="bg-primary/10 text-left align-bottom">
                    <th className="px-2 sm:px-3 py-2 font-semibold text-primary">Current</th>
                    <th className="px-2 sm:px-3 py-2 font-semibold text-primary">Typical use</th>
                    <th className="px-2 sm:px-3 py-2 font-semibold text-primary">
                      Short<br /><span className="text-[10px] sm:text-xs font-normal text-muted-foreground">≤ 2 m</span>
                    </th>
                    <th className="px-2 sm:px-3 py-2 font-semibold text-primary">
                      Medium<br /><span className="text-[10px] sm:text-xs font-normal text-muted-foreground">2–4 m</span>
                    </th>
                    <th className="px-2 sm:px-3 py-2 font-semibold text-primary">
                      Long<br /><span className="text-[10px] sm:text-xs font-normal text-muted-foreground">4–6 m</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { a: "5A", use: "Lights, USB chargers", s: "1.0", m: "1.5", l: "2.5" },
                    { a: "10A", use: "Fan, water pump, small fridge", s: "1.5", m: "2.5", l: "4" },
                    { a: "15A", use: "Fridge, sockets, small DC loads", s: "2.5", m: "4", l: "6" },
                    { a: "20A", use: "Larger DC loads", s: "4", m: "6", l: "10" },
                    { a: "30A", use: "DC-DC charger, larger circuits", s: "6", m: "10", l: "16" },
                    { a: "40A", use: "Small inverter feed, heavy DC", s: "10", m: "16", l: "25" },
                    { a: "50A", use: "Larger inverter, short battery links", s: "16", m: "25", l: "35" },
                    { a: "100A", use: "Battery / inverter main cables", s: "35", m: "50", l: "70" },
                  ].map((row) => (
                    <tr key={row.a} className="border-t border-border align-top">
                      <td className="px-2 sm:px-3 py-2 font-display font-bold text-primary break-words">{row.a}</td>
                      <td className="px-2 sm:px-3 py-2 break-words">{row.use}</td>
                      <td className="px-2 sm:px-3 py-2 break-words">{row.s} mm²</td>
                      <td className="px-2 sm:px-3 py-2 break-words">{row.m} mm²</td>
                      <td className="px-2 sm:px-3 py-2 break-words">{row.l} mm²</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground italic mt-2">
              Values are practical guidelines for 12V DC at ~3% voltage drop. Always verify
              against the real run length and conditions.
            </p>
          </div>

          <div className="not-prose">
            <h3 className="font-display font-bold text-lg text-primary mt-5 mb-2">
              Typical cable sizes for common campervan circuits
            </h3>
            <div className="rounded-lg border border-border bg-background/60 overflow-hidden">
              <table className="w-full text-xs sm:text-sm font-sans border-collapse table-fixed">
                <colgroup>
                  <col className="w-[42%]" />
                  <col className="w-[58%]" />
                </colgroup>
                <thead>
                  <tr className="bg-primary/10 text-left">
                    <th className="px-2 sm:px-3 py-2 font-semibold text-primary">Circuit</th>
                    <th className="px-2 sm:px-3 py-2 font-semibold text-primary">Typical size</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["LED lights", "1.0–1.5 mm²"],
                    ["Water pump", "2.5 mm²"],
                    ["Roof fan", "2.5 mm²"],
                    ["12V sockets", "2.5–4 mm²"],
                    ["Compressor fridge", "2.5–4 mm²"],
                    ["Solar panel → MPPT", "4–6 mm²"],
                    ["MPPT → battery", "6–10 mm²"],
                    ["DC-DC charger 30A", "6–10 mm²"],
                    ["Shore charger DC output", "Usually 6–10 mm² (depends on charger current)"],
                    ["1000W inverter", "25–35 mm²"],
                    ["Battery interconnects", "35–70 mm² (depends on current and length)"],
                  ].map(([circuit, size]) => (
                    <tr key={circuit} className="border-t border-border align-top">
                      <td className="px-2 sm:px-3 py-2 break-words">{circuit}</td>
                      <td className="px-2 sm:px-3 py-2 font-medium break-words">{size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Note>
            Always size cables based on the real current, the full cable run length, and the
            allowed voltage drop. Fuse size protects the cable, so cable sizing should be
            checked <strong>before</strong> choosing the fuse.
          </Note>

          <div className="rounded-lg border-2 border-primary bg-primary/5 p-4 not-prose">
            <div className="text-xs font-sans uppercase tracking-[0.18em] text-accent font-semibold mb-2">
              Quick rule of thumb
            </div>
            <ul className="space-y-1 text-sm font-sans">
              <li>• <strong>Small circuits:</strong> 1.0–2.5 mm²</li>
              <li>• <strong>Medium 12V appliance circuits:</strong> 2.5–6 mm²</li>
              <li>• <strong>Chargers and high-current circuits:</strong> 6–16 mm²</li>
              <li>• <strong>Battery and inverter cables:</strong> 25 mm² and above</li>
            </ul>
          </div>
        </Section>

        {/* 13. Examples */}
        <Section id="examples" number={13} title="Typical system examples">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 not-prose">
            <div className="rounded-lg border border-border bg-background/60 p-4">
              <div className="text-xs uppercase tracking-wider text-accent font-sans font-semibold">A</div>
              <div className="font-display font-bold text-lg mt-1">Simple weekend</div>
              <ul className="mt-2 text-sm space-y-1">
                <li>• 100–150Ah LiFePO4</li>
                <li>• 100–200W solar</li>
                <li>• 12V fridge, lights, USB</li>
                <li>• Optional shore charger</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-background/60 p-4">
              <div className="text-xs uppercase tracking-wider text-accent font-sans font-semibold">B</div>
              <div className="font-display font-bold text-lg mt-1">Balanced travel</div>
              <ul className="mt-2 text-sm space-y-1">
                <li>• 200–300Ah LiFePO4</li>
                <li>• 300–500W solar</li>
                <li>• DC-DC charger</li>
                <li>• Shore charger</li>
                <li>• 1000W inverter</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-background/60 p-4">
              <div className="text-xs uppercase tracking-wider text-accent font-sans font-semibold">C</div>
              <div className="font-display font-bold text-lg mt-1">Full-time / winter</div>
              <ul className="mt-2 text-sm space-y-1">
                <li>• 400Ah+ LiFePO4</li>
                <li>• Large solar if roof allows</li>
                <li>• DC-DC charger</li>
                <li>• Shore charger</li>
                <li>• Heated / protected battery</li>
                <li>• Careful winter planning</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 14. Checklist */}
        <Section id="checklist" number={14} title="Before you buy checklist">
          <ul className="space-y-2">
            {[
              "Measure your roof.",
              "Mark panel positions.",
              "Check alternator type (standard or smart).",
              "Confirm battery BMS limits.",
              "Confirm inverter continuous and peak power.",
              "Calculate cable lengths.",
              "Plan fuse positions close to power sources.",
              "Decide which 230V appliances are shore-only.",
              "Ask a qualified electrician to check the 230V installation.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <CheckSquare className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Electrical basics in your pocket */}
        <section
          id="basics"
          className="rounded-xl border-2 border-primary bg-primary/5 p-5 sm:p-7 scroll-mt-24"
        >
          <div className="text-xs font-sans uppercase tracking-[0.18em] text-accent font-semibold mb-1">
            Bonus
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-primary tracking-tight mb-4 normal-case">
            Electrical basics in your pocket
          </h2>
          <div className="space-y-3 font-sans text-[15px] leading-relaxed">
            <div>
              <strong>Voltage (V)</strong> — Voltage is electrical pressure. A camper battery
              system is usually 12V. Home-style appliances use 230V AC in Europe.
            </div>
            <div>
              <strong>Current (A)</strong> — Current is the amount of electricity flowing through
              a cable. More current needs thicker cable.
            </div>
            <div>
              <strong>Power (W)</strong> — Power tells you how much energy an appliance uses at
              one moment.
            </div>
            <div>
              <strong>Energy (Wh)</strong> — Energy tells you how much power is used over time.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <FormulaCard formula="W = V × A" />
              <FormulaCard formula="A = W ÷ V" />
              <FormulaCard formula="Wh = W × hours" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-md border border-border bg-background/60 p-3 text-sm">
                A 60W laptop used for 4 hours:<br />
                <span className="font-mono">60W × 4h = 240Wh</span>
              </div>
              <div className="rounded-md border border-border bg-background/60 p-3 text-sm">
                A 120W 12V appliance:<br />
                <span className="font-mono">120W ÷ 12V = 10A</span>
              </div>
            </div>
            <Note>
              These formulas help you understand the calculator, but they do not replace proper
              electrical design.
            </Note>
          </div>
        </section>

        {/* CTA */}
        <div className="step-card p-6 text-center">
          <h3 className="font-display font-bold text-xl text-primary mb-2">
            Ready to plan your system?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Use the planner to translate this guide into a real component list and budget.
          </p>
          <PlannerLink
            to="/planner"
            data-prose-cta
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] font-sans font-semibold text-sm"
          >
            Open planner <ArrowRight className="w-4 h-4" />
          </PlannerLink>
        </div>
      </div>
    </SiteLayout>
  );
}
