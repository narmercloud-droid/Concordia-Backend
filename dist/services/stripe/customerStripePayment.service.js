import { prisma } from "../../prisma/client.js";
import { getStripe } from "./stripeClient.js";
export async function getOrCreateBranchStripeCustomer(customerId, branchId, stripeAccountId) {
    const existing = await prisma.customerBranchStripe.findUnique({
        where: { customerId_branchId: { customerId, branchId } }
    });
    if (existing)
        return existing.stripeCustomerId;
    const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        select: { email: true, name: true, phone: true, phoneNumber: true }
    });
    if (!customer)
        throw new Error("Customer not found");
    const stripe = getStripe();
    const stripeCustomer = await stripe.customers.create({
        email: customer.email,
        name: customer.name,
        phone: customer.phone ?? customer.phoneNumber ?? undefined,
        metadata: { customerId, branchId }
    }, { stripeAccount: stripeAccountId });
    await prisma.customerBranchStripe.create({
        data: {
            customerId,
            branchId,
            stripeCustomerId: stripeCustomer.id
        }
    });
    return stripeCustomer.id;
}
export async function createCustomerSessionForPayment(stripeCustomerId, stripeAccountId) {
    const stripe = getStripe();
    const session = await stripe.customerSessions.create({
        customer: stripeCustomerId,
        components: {
            payment_element: {
                enabled: true,
                features: {
                    payment_method_save: "enabled",
                    payment_method_redisplay: "enabled"
                }
            }
        }
    }, { stripeAccount: stripeAccountId });
    if (!session.client_secret) {
        throw new Error("Could not create customer payment session");
    }
    return session.client_secret;
}
