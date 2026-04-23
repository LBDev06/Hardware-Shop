import { InMemoryNotificationsRepository } from 'test/repo/in-memory-notification-repository'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityId } from '@/core/unique-entity-id'
import { ListNewQuestionsNotificationsUseCase } from './list-new-questions-notifications'
import { describe, beforeEach, it, expect } from 'vitest'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ListNewQuestionsNotificationsUseCase

describe('List New Questions Notifications', () => {
    beforeEach(() => {
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
        sut = new ListNewQuestionsNotificationsUseCase(inMemoryNotificationsRepository)
    })

    it('should be able to list new questions notifications', async () => {
        const recipientId = new UniqueEntityId('recipient-1')

        await inMemoryNotificationsRepository.create(
            makeNotification({
                recipientId,
                eventType: 'QUESTION_CREATED',
            })
        )

        await inMemoryNotificationsRepository.create(
            makeNotification({
                recipientId,
                eventType: 'QUESTION_CREATED',
            })
        )

        await inMemoryNotificationsRepository.create(
            makeNotification({
                recipientId: new UniqueEntityId('recipient-2'),
                eventType: 'QUESTION_CREATED'
            })
        )

        await inMemoryNotificationsRepository.create(
            makeNotification({
                recipientId,
                eventType: 'QUESTION_CREATED',
            })
        )

        const result = await sut.execute({
            recipientId: 'recipient-1',
            eventType: 'QUESTION_CREATED',
        })

        expect(result).toBeRight()
        expect(result.value?.notifications).toHaveLength(3)
        expect(result.value?.notifications).toEqual([
            expect.objectContaining({ recipientId }),
            expect.objectContaining({ recipientId }),
            expect.objectContaining({ recipientId }),
        ])
    })

    it('should return an empty list if no notifications are found', async () => {
        const result = await sut.execute({
            recipientId: 'non-existent-recipient',
            eventType: 'QUESTION_CREATED',
        })

        expect(result).toBeRight()
        expect(result.value?.notifications).toHaveLength(0)
    })
})
