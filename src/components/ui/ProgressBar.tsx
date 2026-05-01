import { TOTAL_STEPS } from "@/types";
import { en } from "@/i18n/en";

interface ProgressBarProps {
  current: number; // 1-indexed; 0 = landing
  total?: number;
}

export const ProgressBar = ({ current, total = TOTAL_STEPS }: ProgressBarProps) => {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-xs sm:text-sm text-muted-foreground">
        <span className="font-display tracking-wider uppercase">
          {en.nav.stepOf(current, total)}
        </span>
        <span className="text-primary font-semibold">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%`, boxShadow: "0 0 12px hsl(var(--primary) / 0.6)" }}
        />
      </div>
    </div>
  );
};
