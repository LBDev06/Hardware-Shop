import { describe, it, expect, beforeEach } from 'vitest'
import { RejectOrderUseCase } from './reject-order'
import { InMemoryOrderRepository } from '../../../../../test/repo/in-memory-order-repository'
import { makeOrder } from '../../../../../test/factories/make-order'

describe('Reject Order Use Case', () => {
    let orderRepository: InMemoryOrderRepository
    let sut: RejectOrderUseCase

    beforeEach(() => {
        orderRepository = new InMemoryOrderRepository()
        sut = new RejectOrderUseCase(orderRepository)
    })

    it('should be able to reject an order', async () => {
        const order = makeOrder()
        orderRepository.items.push(order)

        expect(order.status).toBe('PENDING')

        const result = await sut.execute({
            orderId: order.id.toString(),
        })

        expect(result.isRight()).toBe(true)
        if (result.isRight()) {
            expect(result.value.order.status).toBe('CANCELED')
            expect(orderRepository.items[0].status).toBe('CANCELED')
        }
    })

    it('should not be able to reject a non-existing order', async () => {
        const result = await sut.execute({
            orderId: 'invalid-id',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(Error)
    })
})
