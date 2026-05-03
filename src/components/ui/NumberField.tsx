// Controlled, accessible numeric input with inline validation.
// Use for any user-entered numeric value in the planner.
import { useId } from "react";
import { cn } from "@/lib/utils";
import { FieldError } from "./FieldError";

interface Props {
  /** Optional explicit DOM id — used so ErrorSummary anchor links work. */
  id?: string;
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Validation error message (controlled by parent). */
  error?: string | null;
  /** Compact label rendering for inline use. */
  hideLabel?: boolean;
  /** Suffix displayed after the input (e.g. "h/day", "W", "cm"). */
  suffix?: string;
  placeholder?: string;
  className?: string;
  inputMode?: "decimal" | "numeric";
}

export const NumberField = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  error,
  hideLabel,
  suffix,
  placeholder,
  className,
  inputMode = "decimal",
}: Props) => {
  const reactId = useId();
  const inputId = id ?? reactId;
  const errorId = `${inputId}-err`;
  const invalid = !!error;

  return (
    <div className={cn("w-full", className)} id={inputId}>
      <label
        htmlFor={`${inputId}-input`}
        className={cn(
          "block text-xs font-sans font-semibold text-muted-foreground",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </label>
      <div className="mt-1 flex items-stretch">
        <input
          id={`${inputId}-input`}
          type="number"
          inputMode={inputMode}
          min={min}
          max={max}
          step={step}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? undefined : Number(v));
          }}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId : undefined}
          className={cn(
            "w-full bg-background border rounded-md px-3 py-2 text-foreground focus:outline-none transition-colors",
            invalid
              ? "border-red-600 focus:border-red-700"
              : "border-border focus:border-primary",
            suffix && "rounded-r-none",
          )}
        />
        {suffix && (
          <span className="inline-flex items-center px-3 text-xs font-sans text-muted-foreground bg-muted/40 border border-l-0 border-border rounded-r-md whitespace-nowrap">
            {suffix}
          </span>
        )}
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
};
