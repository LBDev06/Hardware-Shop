import { PaymentGateway } from '../../src/domain/payment/app/gateways/payment-gateway';

export class InMemoryPaymentGateway implements PaymentGateway {
    public shouldFail = false;

    async processPayment(_amount: number, _paymentMethodId: string): Promise<{ transactionId: string }> {
        if (this.shouldFail) {
            throw new Error('Payment declined');
        }
        return { transactionId: 'txn_' + Math.random().toString(36).slice(2) };
    }
}
