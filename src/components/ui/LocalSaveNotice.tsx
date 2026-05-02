import { Info } from "lucide-react";

/**
 * Calm info box explaining the local-only nature of free-tier saving.
 * Used on the Results page near the "Save design" PRO button.
 */
export const LocalSaveNotice = () => (
  <div
    className="rounded-lg border border-primary/25 bg-primary/5 p-4 sm:p-5 flex gap-3 items-start text-sm font-sans text-foreground/85 leading-relaxed"
    role="note"
    aria-label="About local saving"
  >
    <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
    <div className="space-y-2">
      <p>
        <strong className="font-semibold text-foreground">
          Free version remembers your last calculation only on this device.
        </strong>{" "}
        You can usually come back to it later if you use the same phone, tablet or computer.
      </p>
      <div>
        <p className="text-foreground/75">Your calculation may disappear if:</p>
        <ul className="mt-1 ml-4 list-disc text-foreground/75 space-y-0.5">
          <li>you open Vanlectric on another device</li>
          <li>you use another browser</li>
          <li>you browse in private/incognito mode</li>
          <li>you clear website data</li>
          <li>you start a new calculation</li>
        </ul>
      </div>
      <p className="text-muted-foreground italic">
        PRO will let you save designs permanently and open them on any device.
      </p>
    </div>
  </div>
);
