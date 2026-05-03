// Lightweight consent store for Vanlectric.
// Categories: "necessary" is always on; "analytics" is opt-in.
// Stored in localStorage so we don't need a backend.

export type ConsentCategories = {
  necessary: true;
  analytics: boolean;
};

const KEY = "vanlectric-consent-v1";
const LEGACY_KEYS = ["vanlectric-cookie-consent", "vanlectric_cookie_dismissed"];

export const DEFAULT_CONSENT: ConsentCategories = {
  necessary: true,
  analytics: false,
};

export function readConsent(): ConsentCategories | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      necessary: true,
      analytics: !!parsed?.analytics,
    };
  } catch {
    return null;
  }
}

export function writeConsent(c: Partial<ConsentCategories>) {
  const next: ConsentCategories = {
    necessary: true,
    analytics: !!c.analytics,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    // Clear legacy keys so older banners don't reappear.
    LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent("vanlectric:consent-change", { detail: next }));
  applyConsent(next);
  return next;
}

let analyticsLoaded = false;
function loadPlausible() {
  if (analyticsLoaded) return;
  analyticsLoaded = true;
  const s = document.createElement("script");
  s.defer = true;
  s.setAttribute("data-domain", "vanlectric.com");
  s.src = "https://plausible.io/js/script.js";
  document.head.appendChild(s);
}

export function applyConsent(c: ConsentCategories | null) {
  if (c?.analytics) loadPlausible();
}

export function initConsent() {
  applyConsent(readConsent());
}
