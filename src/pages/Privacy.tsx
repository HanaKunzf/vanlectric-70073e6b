import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Seo } from "@/components/site/SiteLayout";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Privacy Policy — Vanlectric"
        description="How Vanlectric handles personal data, cookies and analytics for the vanlife electrical calculator."
        noindex
      />
      <main className="container mx-auto px-6 py-10 max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-sans text-primary hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to calculator
        </Link>

        <article className="step-card p-6 sm:p-10 prose-fieldnotes">
          <h1 className="font-display text-4xl font-bold text-primary tracking-tight mb-2">
            Privacy Policy
          </h1>
          <div className="h-px w-12 bg-primary/40 mb-8" />

          <Section title="Data Controller">
            <p>
              Hana Kunzfeldová<br />
              Luční 174, 267 01 Králův Dvůr, Czech Republic<br />
              IČ: 73119521<br />
              Email:{" "}
              <a href="mailto:privacy@vanlectric.com" className="text-primary hover:underline">
                privacy@vanlectric.com
              </a>
            </p>
          </Section>

          <Section title="What data we collect">
            <p>
              We collect only your email address, if you voluntarily provide it via the
              "Notify me about PRO launch" form.
            </p>
          </Section>

          <Section title="Purpose">
            <p>
              Your email is used solely to notify you when the PRO version of Vanlectric
              launches. We do not use it for any other purpose or share it with third parties.
            </p>
          </Section>

          <Section title="Legal basis">
            <p>Processing is based on your voluntary consent (Art. 6(1)(a) GDPR).</p>
          </Section>

          <Section title="Retention">
            <p>
              We retain your email until PRO launches or until you withdraw consent, maximum
              2 years.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              You may withdraw consent, request deletion, access or correction of your data at
              any time by emailing{" "}
              <a href="mailto:privacy@vanlectric.com" className="text-primary hover:underline">
                privacy@vanlectric.com
              </a>
              .
            </p>
          </Section>

          <Section title="Unsubscribe">
            <p>Every email contains an unsubscribe link.</p>
          </Section>

          <Section title="Cookies">
            <p>
              Vanlectric uses only technical cookies necessary for the calculator to function.
              We do not use advertising or tracking cookies.
            </p>
          </Section>
        </article>
      </main>
    </div>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-6">
    <h2 className="font-display text-xl font-bold text-foreground mb-2">{title}</h2>
    <div className="text-sm text-foreground/90 font-sans leading-relaxed">{children}</div>
  </section>
);
