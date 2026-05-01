// Feature flags — flip these to unlock phases without code changes.
export const FEATURES = {
  PDF_EXPORT: false,
  EXISTING_COMPONENTS: false,
  EXCEL_EXPORT: false,
  EMAIL_REPORT: false,
  SAVE_DESIGNS: false,
  USER_ACCOUNTS: false,
  COMPARE_DESIGNS: false,
  SCENARIO_COMPARISON: false,
  INSTALLER_EXPORT: false,
  PRO_TIER: false,
  AFFILIATE_LINKS: false,
  WIRING_DIAGRAM: false,
} as const;

export type FeatureFlag = keyof typeof FEATURES;

export const isEnabled = (flag: FeatureFlag): boolean => FEATURES[flag];
