// Stripe service stub. Phase 2.
export const stripeService = {
  async startCheckout(_plan: "monthly" | "lifetime"): Promise<{ url: string } | null> {
    return null;
  },
};
