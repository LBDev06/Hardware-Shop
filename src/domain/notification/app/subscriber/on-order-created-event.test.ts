import { describe, it, beforeEach, vi, expect, MockInstance } from 'vitest'
import { OnOrderCreated } from './on-order-created-event'
import { InMemoryOrderRepository } from 'test/repo/in-memory-order-repository'
import { InMemoryProductsRepository } from 'test/repo/in-memory-product-repository'
import { InMemoryNotificationsRepository } from 'test/repo/in-memory-notification-repository'
import { SendNotificationUseCase } from '../use-case/send-notification'
import { makeOrder } from 'test/factories/make-order'
import { makeOrderItem } from 'test/factories/make-order-item'
import { makeProduct } from 'test/factories/makeProduct'
import { waitFor } from 'test/utils/wait-for'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryProductRepository: InMemoryProductsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationSpy: MockInstance<any>

describe('On Order Created', () => {
    beforeEach(() => {
        inMemoryOrderRepository = new InMemoryOrderRepository()
        inMemoryProductRepository = new InMemoryProductsRepository()
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
        sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository)
        sendNotificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')
        new OnOrderCreated(inMemoryOrderRepository, inMemoryProductRepository, sendNotificationUseCase)
    })

    it('should send a notification when an order is created', async () => {
        const product = makeProduct()
        inMemoryProductRepository.products.push(product)

        const orderItem = makeOrderItem({ productId: product.id, productName: product.name })
        const order = makeOrder({ items: [orderItem] })

        await inMemoryOrderRepository.create(order)

        await waitFor(() => {
            expect(sendNotificationSpy).toHaveBeenCalled()
        })
    })
})
