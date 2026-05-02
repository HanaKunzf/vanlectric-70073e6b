import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SelectButtonProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

export const SelectButton = ({
  selected,
  onClick,
  children,
  fullWidth = true,
  size = "md",
}: SelectButtonProps) => {
  const padding =
    size === "sm" ? "px-4 py-3 pr-8" : size === "lg" ? "px-6 py-5 pr-10" : "px-5 py-4 pr-9";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group relative text-left rounded-lg border-2 transition-[transform,border-color,background-color,box-shadow]",
        "min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        "w-full max-w-full box-border",
        padding,
        fullWidth && "w-full",
        selected
          ? "border-primary bg-[hsl(var(--selected-bg))] text-foreground"
          : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-card/80",
      )}
      style={selected ? { boxShadow: "var(--shadow-card)" } : undefined}
    >
      {/* Radio indicator pinned to top-right so it never steals horizontal space from text */}
      <span
        className={cn(
          "absolute top-3 right-3 flex-shrink-0 w-4 h-4 rounded-full border-2 transition-colors",
          selected ? "border-primary bg-primary" : "border-border",
        )}
        aria-hidden
      />
      <div className="min-w-0 [overflow-wrap:anywhere] [word-break:normal] hyphens-none">
        {children}
      </div>
    </button>
  );
};
