import { describe, it, expect, beforeEach } from 'vitest'
import { ApproveOrderUseCase } from './approve-order'
import { InMemoryOrderRepository } from '../../../../../test/repo/in-memory-order-repository'
import { makeOrder } from '../../../../../test/factories/make-order'

describe('Approve Order Use Case', () => {
    let orderRepository: InMemoryOrderRepository
    let sut: ApproveOrderUseCase

    beforeEach(() => {
        orderRepository = new InMemoryOrderRepository()
        sut = new ApproveOrderUseCase(orderRepository)
    })

    it('should be able to approve an order', async () => {
        const order = makeOrder()
        orderRepository.items.push(order)

        expect(order.status).toBe('PENDING')

        const result = await sut.execute({
            orderId: order.id.toString(),
        })

        expect(result.isRight()).toBe(true)
        if (result.isRight()) {
            expect(result.value.order.status).toBe('CONFIRMED')
            expect(orderRepository.items[0].status).toBe('CONFIRMED')
        }
    })

    it('should not be able to approve a non-existing order', async () => {
        const result = await sut.execute({
            orderId: 'invalid-id',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(Error)
    })
})
