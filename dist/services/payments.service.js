import { prisma } from "../prisma/client.js";
import Stripe from "stripe";
import axios from "axios";
import { notificationsService } from "./notifications.service";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT || "";
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || "";
const PAYPAL_BASE = "https://api-m.paypal.com";
async function getPayPalAccessToken() {
    const response = await axios({
        url: `${PAYPAL_BASE}/v1/oauth2/token`,
        method: "post",
        auth: {
            username: PAYPAL_CLIENT,
            password: PAYPAL_SECRET
        },
        params: { grant_type: "client_credentials" }
    });
    return response.data.access_token;
}
export class PaymentsService {
    // STRIPE PAYMENTINTENT
    async createStripePaymentIntent(orderId, amount, currency = "eur") {
        const intent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            metadata: { orderId }
        });
        await prisma.order.update({
            where: { id: orderId },
            data: { paymentIntentId: intent.id }
        });
        return intent;
    }
    // PAYPAL ORDER
    async createPayPalOrder(orderId, amount, currency = "EUR") {
        const token = await getPayPalAccessToken();
        const response = await axios.post(`${PAYPAL_BASE}/v2/checkout/orders`, {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: currency,
                        value: amount.toFixed(2)
                    }
                }
            ]
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const paypalOrderId = response.data.id;
        await prisma.order.update({
            where: { id: orderId },
            data: { paypalOrderId }
        });
        return response.data;
    }
    // PAYPAL CAPTURE
    async capturePayPalOrder(orderId) {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        const token = await getPayPalAccessToken();
        const response = await axios.post(`${PAYPAL_BASE}/v2/checkout/orders/${order?.paypalOrderId}/capture`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const captureId = response.data.purchase_units[0].payments.captures[0].id;
        await prisma.order.update({
            where: { id: orderId },
            data: {
                paypalCaptureId: captureId,
                paymentStatus: "paid"
            }
        });
        await notificationsService.sendOrderStatusUpdate(order, "Payment successful");
        return response.data;
    }
    // REFUND (Stripe or PayPal)
    async refund(orderId) {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (order?.paymentIntentId) {
            await stripe.refunds.create({
                payment_intent: order.paymentIntentId
            });
        }
        if (order?.paypalCaptureId) {
            const token = await getPayPalAccessToken();
            await axios.post(`${PAYPAL_BASE}/v2/payments/captures/${order.paypalCaptureId}/refund`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }
        return prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: "refunded" }
        });
    }
}
export const paymentsService = new PaymentsService();
