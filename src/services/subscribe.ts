// Vanlectric waitlist / subscribe client.
// Calls the production PHP endpoint that proxies to MailerLite.
// The API key lives only on the server (vanlectric_secrets.php) and is
// NEVER exposed to the frontend.

export type SubscribeSource =
  | "Email report"
  | "PRO coming soon"
  | "Existing components PRO waitlist"
  | "Landing page waitlist";

export interface SubscribeResponse {
  success: boolean;
  error?: string;
}

export async function subscribeEmail(
  email: string,
  source: SubscribeSource,
): Promise<SubscribeResponse> {
  try {
    const res = await fetch("/api/subscribe.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source }),
    });
    const data = (await res.json().catch(() => ({}))) as SubscribeResponse;
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Subscription failed" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export const isValidEmail = (email: string): boolean => {
  const v = email.trim();
  if (!v || v.length > 254) return false;
  // Simple, pragmatic email regex matching server-side validation intent.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};
