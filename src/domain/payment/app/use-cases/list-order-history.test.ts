import { describe, it, expect, beforeEach } from 'vitest'
import { ListOrderHistoryUseCase } from './list-order-history'
import { InMemoryOrderRepository } from '../../../../../test/repo/in-memory-order-repository';
import { Order } from '../../enterprise/entities/order';
import { OrderItem } from '../../enterprise/entities/order-item';
import { UniqueEntityId } from '@/core/unique-entity-id';

describe('List Order History', () => {
    let orderRepository: InMemoryOrderRepository
    let sut: ListOrderHistoryUseCase

    beforeEach(() => {
        orderRepository = new InMemoryOrderRepository()
        sut = new ListOrderHistoryUseCase(orderRepository)
    })

    it('should be able to list order history for a specific client', async () => {
        const order1 = Order.create({
            items: [
                OrderItem.create({
                    clientId: new UniqueEntityId('client-1'),
                    productId: new UniqueEntityId('product-1'),
                    productName: 'Sample Product 1',
                    quantity: 1,
                    price: 100
                })
            ]
        })

        const order2 = Order.create({
            items: [
                OrderItem.create({
                    clientId: new UniqueEntityId('client-1'),
                    productId: new UniqueEntityId('product-2'),
                    productName: 'Sample Product 2',
                    quantity: 2,
                    price: 50
                })
            ]
        })

        const order3 = Order.create({
            items: [
                OrderItem.create({
                    clientId: new UniqueEntityId('client-2'),
                    productId: new UniqueEntityId('product-1'),
                    productName: 'Sample Product 1',
                    quantity: 1,
                    price: 100
                })
            ]
        })

        await orderRepository.create(order1)
        await orderRepository.create(order2)
        await orderRepository.create(order3)

        const result = await sut.execute({ clientId: 'client-1' })

        expect(result).toBeRight()
        if (result.isRight()) {
            expect(result.value.orders).toHaveLength(2)
            expect(result.value.orders).toEqual(expect.arrayContaining([order1, order2]))
        }
    })

    it('should return an empty list if the client has no orders', async () => {
        const result = await sut.execute({ clientId: 'client-999' })

        expect(result).toBeRight()
        if (result.isRight()) {
            expect(result.value.orders).toHaveLength(0)
        }
    })
})
