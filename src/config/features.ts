// Feature flags — flip these to unlock phases without code changes.
export const FEATURES = {
  PDF_EXPORT: false,        // Phase 2
  EXCEL_EXPORT: false,      // Phase 2
  EMAIL_REPORT: false,      // Phase 2
  SAVE_DESIGNS: false,      // Phase 3
  USER_ACCOUNTS: false,     // Phase 3
  COMPARE_DESIGNS: false,   // Phase 3
  PRO_TIER: false,          // Phase 2
  AFFILIATE_LINKS: false,   // Phase 4
  WIRING_DIAGRAM: false,    // Phase 4
} as const;

export type FeatureFlag = keyof typeof FEATURES;

export const isEnabled = (flag: FeatureFlag): boolean => FEATURES[flag];
