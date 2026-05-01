import { ReactNode } from "react";
import { Lock } from "lucide-react";
import { FEATURES, type FeatureFlag } from "@/config/features";
import { en } from "@/i18n/en";
import { cn } from "@/lib/utils";

interface LockedFeatureProps {
  flag: FeatureFlag;
  children: ReactNode;
  className?: string;
}

export const LockedFeature = ({ flag, children, className }: LockedFeatureProps) => {
  const enabled = FEATURES[flag];
  if (enabled) return <>{children}</>;

  return (
    <div className={cn("relative inline-block", className)}>
      <div
        className="opacity-50 grayscale pointer-events-none select-none"
        aria-hidden
      >
        {children}
      </div>
      <button
        type="button"
        className="absolute inset-0 flex items-center justify-center cursor-not-allowed"
        onClick={(e) => {
          e.preventDefault();
          alert(en.pro.locked);
        }}
        aria-label={en.pro.locked}
      >
        <span className="inline-flex items-center gap-1.5 rounded-md bg-card/90 backdrop-blur border border-primary px-2.5 py-1 text-xs font-sans font-semibold tracking-wide text-primary">
          <Lock className="w-3 h-3" />
          {en.pro.badge}
        </span>
      </button>
    </div>
  );
};
