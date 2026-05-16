import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CheckoutUseCase } from './checkout'
import { InMemoryOrderRepository } from '../../../../../test/repo/in-memory-order-repository';
import { InMemoryPaymentGateway } from '../../../../../test/repo/in-memory-payment-gateway';

describe('Checkout', () => {
    let orderRepository: InMemoryOrderRepository
    let paymentGateway: InMemoryPaymentGateway
    let sut: CheckoutUseCase

    beforeEach(() => {
        orderRepository = new InMemoryOrderRepository()
        paymentGateway = new InMemoryPaymentGateway()
        sut = new CheckoutUseCase(orderRepository, paymentGateway)
    })

    it('should be able to create a PENDING order when payment succeeds', async () => {

        const result = await sut.execute({
            clientId: 'client-1',
            productId: 'product-1',
            productName: 'Sample Product',
            price: 100,
            quantity: 2,
            paymentMethodId: 'pm_card_valid',
        })

        expect(result).toBeRight()
        if (result.isLeft()) return
        const { order } = result.value

        expect(order).toBeDefined()
        expect(order['props'].status).toBe('PENDING')
        expect(orderRepository.items).toHaveLength(1)
        expect(orderRepository.items[0]['props'].status).toBe('PENDING')
    })

    it('should be able to calculate the correct total value from cart items', async () => {
        const result = await sut.execute({
            clientId: 'client-1',
            productId: 'product-1',
            productName: 'Sample Product',
            price: 100,
            quantity: 2, // total should be 200
            paymentMethodId: 'pm_card_valid',
        })

        expect(result).toBeRight()
        if (result.isLeft()) return
        const { order } = result.value

        expect(order.totalValue).toBe(200)
    })

    it('should be able tocreate a CANCELED order and rethrow when payment fails', async () => {
        paymentGateway.shouldFail = true

        await expect(
            sut.execute({
                clientId: 'client-1',
                productId: 'product-1',
                productName: 'Sample Product',
                price: 200,
                quantity: 1,
                paymentMethodId: 'pm_card_declined'
            })
        ).rejects.toThrow('Payment declined')

        expect(orderRepository.items).toHaveLength(1)
        expect(orderRepository.items[0]['props'].status).toBe('CANCELED')
    })

    it('should be able to persist the order to the repository on success', async () => {
        await sut.execute({
            clientId: 'client-1',
            productId: 'product-1',
            productName: 'Sample Product',
            price: 75,
            quantity: 4,
            paymentMethodId: 'pm_card_valid'
        })

        expect(orderRepository.items).toHaveLength(1)
    })

    it('should be able to forward the correct amount and paymentMethodId to the payment gateway', async () => {
        const processSpy = vi.spyOn(paymentGateway, 'processPayment')

        await sut.execute({
            clientId: 'client-1',
            productId: 'product-1',
            productName: 'Sample Product',
            price: 120,
            quantity: 2, // total = 240
            paymentMethodId: 'pm_test_123'
        })

        expect(processSpy).toHaveBeenCalledOnce()
        expect(processSpy).toHaveBeenCalledWith(240, 'pm_test_123')
    })

    it('should be able to create an order with PENDING status before payment is processed', async () => {
        let capturedStatus: string | undefined

        vi.spyOn(paymentGateway, 'processPayment').mockImplementationOnce(
            async (_amount, _paymentMethodId) => {
                // Inspect status right before payment resolves
                capturedStatus = orderRepository.items[0]?.['props'].status
                return { transactionId: 'txn_spy' }
            }
        )

        // The order should be saved with PENDING status before payment is processed
        await sut.execute({
            clientId: 'client-1',
            productId: 'product-1',
            productName: 'Sample Product',
            price: 50,
            quantity: 1,
            paymentMethodId: 'pm_card_valid'
        })

        // Check that it was 'PENDING' during processPayment
        expect(capturedStatus).toBe('PENDING')
        // And 'PENDING' after processPayment resolves
        expect(orderRepository.items[0]['props'].status).toBe('PENDING')
    })
})
