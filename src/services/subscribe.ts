// Vanlectric subscribe + report-delivery client.
// Both endpoints live as PHP files on Webkitty; the MailerLite API key
// stays server-side in vanlectric_secrets.php.

export type SubscribeSource =
  | "Email report"
  | "PRO coming soon"
  | "Existing components PRO waitlist"
  | "Landing page waitlist";

export interface SubscribeResponse {
  success: boolean;
  error?: string;
}

/**
 * Marketing / waitlist opt-in. Goes through /api/subscribe.php which adds
 * the address to MailerLite. Used by PRO waitlist and "Notify me" forms.
 */
export async function subscribeEmail(
  email: string,
  source: SubscribeSource,
): Promise<SubscribeResponse> {
  return postJson("/api/subscribe.php", { email, source });
}

/**
 * Transactional report delivery. Sends the user's own calculation back to
 * the email address they entered. This is NOT a marketing email — the
 * recipient explicitly requested their report. Marketing opt-in is a
 * separate, optional flag forwarded to the same endpoint so the server
 * can also enroll them in MailerLite if they ticked the optional box.
 */
export async function sendReport(params: {
  email: string;
  calculation: unknown;
  reportConsent: true; // must be explicitly true
  marketingConsent: boolean;
}): Promise<SubscribeResponse> {
  return postJson("/api/send-report.php", params);
}

async function postJson(url: string, body: unknown): Promise<SubscribeResponse> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as SubscribeResponse;
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Request failed" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export const isValidEmail = (email: string): boolean => {
  const v = email.trim();
  if (!v || v.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};
