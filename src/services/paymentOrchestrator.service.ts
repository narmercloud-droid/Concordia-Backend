import { WalletService } from "./wallet.service.js";

export class PaymentOrchestrator {
  /**
   * Resolves how an order is paid using:
   * - wallet
   * - voucher (already credited to wallet)
   * - PayPal
   * - card (via PayPal)
   * - cash on delivery
   */
  static async resolvePayment(customerId, orderTotal, paymentMethod) {
    const wallet = await WalletService.getWallet(customerId);
    let walletUsed = 0;
    let externalAmount = 0;

    // 1. Wallet contribution
    if (wallet.balance.toNumber() > 0) {
      walletUsed = Math.min(wallet.balance.toNumber(), orderTotal);
    }

    // 2. Remaining amount after wallet
    externalAmount = orderTotal - walletUsed;

    // 3. Payment method logic
    if (paymentMethod === "COD") {
      // Cash on delivery must not require externalAmount > 0
      return {
        method: "COD",
        walletUsed,
        externalAmount: 0,
        requiresExternalPayment: false
      };
    }

    if (paymentMethod === "PAYPAL" || paymentMethod === "CARD") {
      return {
        method: paymentMethod,
        walletUsed,
        externalAmount,
        requiresExternalPayment: externalAmount > 0
      };
    }

    throw new Error("Invalid payment method");
  }

  /**
   * Deduct wallet funds after external payment is confirmed
   */
  static async finalizeWalletPayment(customerId, amount, orderId) {
    if (amount > 0) {
      await WalletService.deductFunds(customerId, amount, orderId);
    }
  }
}

