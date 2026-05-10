export interface PaymentGateway {
    processPayment(amount: number, paymentMethodId: string): Promise<{ transactionId: string }>
}