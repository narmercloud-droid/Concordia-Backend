export const paymentsService = {
    charge: (...args) => ({ success: true, transactionId: "mock" }),
    createStripePaymentIntent: (...args) => ({ success: true, client_secret: "mock" }),
    createPayPalOrder: (...args) => ({ success: true, orderId: "mock" }),
    capturePayPalOrder: (...args) => ({ success: true }),
    refund: (...args) => ({ success: true })
};
