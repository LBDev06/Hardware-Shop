import { describe, it, expect, beforeEach } from 'vitest'
import { ListPendingOrdersBySellerUseCase } from './list-pending-orders-by-seller'
import { InMemoryOrderRepository } from '../../../../../test/repo/in-memory-order-repository';
import { InMemoryProductsRepository } from '../../../../../test/repo/in-memory-product-repository';
import { Order } from '../../enterprise/entities/order';
import { OrderItem } from '../../enterprise/entities/order-item';
import { UniqueEntityId } from '@/core/unique-entity-id';
import { makeProduct } from '../../../../../test/factories/makeProduct';

describe('List Pending Orders By Seller', () => {
    let orderRepository: InMemoryOrderRepository
    let productRepository: InMemoryProductsRepository
    let sut: ListPendingOrdersBySellerUseCase

    beforeEach(() => {
        orderRepository = new InMemoryOrderRepository()
        productRepository = new InMemoryProductsRepository()
        sut = new ListPendingOrdersBySellerUseCase(orderRepository, productRepository)
    })

    it('should be able to list pending orders for a specific seller', async () => {
        const sellerId = new UniqueEntityId('seller-1')

        const product1 = makeProduct({ authorId: sellerId }, new UniqueEntityId('product-1'))
        const product2 = makeProduct({ authorId: sellerId }, new UniqueEntityId('product-2'))
        await productRepository.create(product1)
        await productRepository.create(product2)

        const pendingOrder1 = Order.create({
            items: [
                OrderItem.create({
                    clientId: new UniqueEntityId('client-1'),
                    productId: new UniqueEntityId('product-1'),
                    productName: product1.name,
                    quantity: 1,
                    price: product1.price,
                })
            ]
        })

        const pendingOrder2 = Order.create({
            items: [
                OrderItem.create({
                    clientId: new UniqueEntityId('client-2'),
                    productId: new UniqueEntityId('product-2'),
                    productName: product2.name,
                    quantity: 2,
                    price: product2.price,
                })
            ]
        })

        await orderRepository.create(pendingOrder1)
        await orderRepository.create(pendingOrder2)

        const result = await sut.execute({ sellerId: 'seller-1' })

        expect(result).toBeRight()
        expect(result?.value?.orders).toHaveLength(2)
        expect(result?.value?.orders).toEqual(expect.arrayContaining([pendingOrder1, pendingOrder2]))
    })

    it('should not list orders that are not PENDING', async () => {
        const sellerId = new UniqueEntityId('seller-1')

        const product = makeProduct({ authorId: sellerId }, new UniqueEntityId('product-1'))
        await productRepository.create(product)

        const pendingOrder = Order.create({
            items: [
                OrderItem.create({
                    clientId: new UniqueEntityId('client-1'),
                    productId: new UniqueEntityId('product-1'),
                    productName: product.name,
                    quantity: 1,
                    price: product.price,
                })
            ]
        })

        const confirmedOrder = Order.create({
            items: [
                OrderItem.create({
                    clientId: new UniqueEntityId('client-2'),
                    productId: new UniqueEntityId('product-1'),
                    productName: product.name,
                    quantity: 1,
                    price: product.price,
                })
            ],
            status: 'CONFIRMED'
        })

        const canceledOrder = Order.create({
            items: [
                OrderItem.create({
                    clientId: new UniqueEntityId('client-3'),
                    productId: new UniqueEntityId('product-1'),
                    productName: product.name,
                    quantity: 1,
                    price: product.price,
                })
            ],
            status: 'CANCELED'
        })

        await orderRepository.create(pendingOrder)
        await orderRepository.create(confirmedOrder)
        await orderRepository.create(canceledOrder)

        const result = await sut.execute({ sellerId: 'seller-1' })

        expect(result).toBeRight()
        expect(result?.value?.orders).toHaveLength(1)
        expect(result?.value?.orders[0]).toEqual(pendingOrder)
    })

})
