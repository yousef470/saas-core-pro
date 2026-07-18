import { getCustomers } from "./crmservice";

export const getSubscriptions = () => {
  return getCustomers().filter(
    (c) => c.subscriptionStatus === "paid"
  );
};

export const getSubscriptionRevenue = () => {
  return getSubscriptions().reduce(
    (sum, c) => sum + Number(c.subscriptionPrice || 0),
    0
  );
};

export const getInvoices = () => {
  return getSubscriptions().map((c) => ({
    id: c.invoiceId,
    customer: c.name,
    amount: c.subscriptionPrice,
    method: c.paymentMethod,
    date: c.nextBillingDate,
    status: c.subscriptionStatus,
  }));
};