import { describe, it, beforeEach, vi, expect, MockInstance } from 'vitest'
import { OnQuestionCreated } from './on-question-created'
import { makeQuestion } from 'test/factories/makeQuestion'
import { InMemoryQuestionRepository } from 'test/repo/in-memory-question-repository'
import { InMemoryProductsRepository } from 'test/repo/in-memory-product-repository'
import { SendNotificationUseCase } from '../use-case/send-notification'
import { InMemoryNotificationsRepository } from 'test/repo/in-memory-notification-repository'
import { makeProduct } from 'test/factories/makeProduct'
import { waitFor } from 'test/utils/wait-for'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryProductRepository: InMemoryProductsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationSpy: MockInstance<any>

describe('On Question Created', () => {
    beforeEach(() => {
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
        inMemoryProductRepository = new InMemoryProductsRepository()
        inMemoryQuestionRepository = new InMemoryQuestionRepository()
        sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository)
        sendNotificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')
        new OnQuestionCreated(inMemoryProductRepository, sendNotificationUseCase)
    })

    it('should send a notification when a question is created', async () => {
        const product = await makeProduct()
        const question = await makeQuestion({ productId: product.id })

        inMemoryProductRepository.products.push(product)
        inMemoryQuestionRepository.create(question)

        await waitFor(() => {
            expect(sendNotificationSpy).toHaveBeenCalled()
        })
    })
})