import { PaymentGateway } from "../../app/gateways/payment-gateway";
import { Stripe } from "stripe";

export class StripePaymentGateway implements PaymentGateway {
    constructor(private stripe: Stripe) { }

    async processPayment(amount: number, paymentMethodId: string): Promise<{ transactionId: string }> {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: amount,
            currency: 'brl',
            payment_method: paymentMethodId,
            confirm: true,
        })

        if (paymentIntent.status !== 'succeeded') {
            throw new Error('Payment processing failed.')
        }

        return {
            transactionId: paymentIntent.id
        }
    }
}