export const paymentsService = {
  charge: (...args: any[]) => ({ success: true, transactionId: "mock" }),
  createStripePaymentIntent: (...args: any[]) => ({ success: true, client_secret: "mock" }),
  createPayPalOrder: (...args: any[]) => ({ success: true, orderId: "mock" }),
  capturePayPalOrder: (...args: any[]) => ({ success: true }),
  refund: (...args: any[]) => ({ success: true })
};
