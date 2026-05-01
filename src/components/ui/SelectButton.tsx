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
    size === "sm" ? "px-4 py-3" : size === "lg" ? "px-6 py-5" : "px-5 py-4";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group relative text-left rounded-lg border-2 transition-[transform,border-color,background-color,box-shadow]",
        "min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        padding,
        fullWidth && "w-full",
        selected
          ? "border-primary bg-primary/10 text-foreground amber-glow"
          : "border-border bg-card text-foreground hover:border-primary/60 hover:bg-card/80",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex-shrink-0 w-4 h-4 rounded-full border-2 transition-colors",
            selected ? "border-primary bg-primary" : "border-border",
          )}
          aria-hidden
        />
        <div className="flex-1">{children}</div>
      </div>
    </button>
  );
};
