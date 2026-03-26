export const getStripeWebhookSecret = (): string => {
  return process.env.STRIPE_WEBHOOK_SECRET || "";
};
