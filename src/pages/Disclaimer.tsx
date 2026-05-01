import { SiteLayout, PageHero, Prose } from "@/components/site/SiteLayout";

export default function Disclaimer() {
  return (
    <SiteLayout
      title="Safety disclaimer — Vanlectric"
      description="Vanlectric is an educational planning tool. It does not replace a certified electrical design or qualified electrician."
    >
      <PageHero eyebrow="Disclaimer" title="Safety disclaimer" />
      <Prose>
        <p>
          <strong>
            Vanlectric is an educational planning tool and does not replace a certified electrical design,
            qualified electrician or local legal requirements.
          </strong>
        </p>
        <p>
          Users must verify component compatibility, cable sizing, fusing and installation safety before
          building their system. All numbers, recommendations and prices shown by Vanlectric are{" "}
          <strong>indicative only</strong> and may not reflect your specific vehicle, components, country or
          installation conditions.
        </p>
        <h2>What Vanlectric does</h2>
        <ul>
          <li>Estimates daily energy consumption based on your declared appliances.</li>
          <li>Suggests an indicative battery capacity, solar size, inverter size and shore power setup.</li>
          <li>Provides an indicative shopping list with three component tiers.</li>
        </ul>
        <h2>What Vanlectric does NOT do</h2>
        <ul>
          <li>Issue a final electrical installation design.</li>
          <li>Replace a qualified electrician's site survey or sign-off.</li>
          <li>Guarantee compliance with national or local regulations (e.g. UK BS 7671, German VDE, EN 1648, etc.).</li>
        </ul>
        <p>
          By using Vanlectric, you accept that you are solely responsible for the safety, compliance and
          correctness of your campervan electrical installation.
        </p>
      </Prose>
    </SiteLayout>
  );
}
