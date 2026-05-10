export class PaymentDeclinedError extends Error {
    constructor() {
        super('Payment was declined.')
    }
}