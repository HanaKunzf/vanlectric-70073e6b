// Step-level live region listing all current validation errors.
// Visible only when there are issues. Announces changes to assistive tech.
import { AlertTriangle } from "lucide-react";
import type { ValidationIssue } from "@/lib/validation";

interface Props {
  issues: ValidationIssue[];
  title?: string;
}

export const ErrorSummary = ({ issues, title = "Please fix before continuing:" }: Props) => {
  if (issues.length === 0) return null;
  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Form errors"
      className="mt-6 rounded-lg border-l-4 border-red-600 bg-red-50 p-4"
    >
      <div className="flex items-center gap-2 text-red-800 font-sans font-semibold text-sm">
        <AlertTriangle className="w-4 h-4" />
        {title}
      </div>
      <ul className="mt-2 list-disc pl-6 text-sm text-red-800 space-y-0.5">
        {issues.map((i) => (
          <li key={i.fieldId}>
            <a href={`#${i.fieldId}`} className="underline">
              {i.label}
            </a>
            : {i.message}
          </li>
        ))}
      </ul>
    </div>
  );
};
