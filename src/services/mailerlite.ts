// MailerLite subscriber API.
// NOTE: VITE_* env vars are bundled into the client and visible in DevTools.
// For production this should be moved behind an Edge Function.
const GROUP_ID = "186263385902417862";

export async function subscribeToMailerLite(email: string): Promise<void> {
  const apiKey = import.meta.env.VITE_MAILERLITE_API_KEY as string | undefined;
  if (!apiKey) throw new Error("Missing VITE_MAILERLITE_API_KEY");

  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, groups: [GROUP_ID] }),
  });

  if (!(res.status === 200 || res.status === 201)) {
    let detail = "";
    try {
      detail = JSON.stringify(await res.json());
    } catch {
      /* noop */
    }
    throw new Error(`MailerLite ${res.status}: ${detail}`);
  }
}
