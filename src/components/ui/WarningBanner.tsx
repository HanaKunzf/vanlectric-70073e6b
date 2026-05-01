import { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

export const WarningBanner = ({ children }: { children: ReactNode }) => (
  <div className="warning-banner flex items-start gap-2">
    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
    <span>{children}</span>
  </div>
);

export const HelperText = ({ children }: { children: ReactNode }) => (
  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
    {children}
  </p>
);
