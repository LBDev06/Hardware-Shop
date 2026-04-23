import { describe, beforeEach, it, expect } from 'vitest'
import { ListNewAnswerQuestionNotificationUseCase } from './list-new-answer-question-notification'
import { InMemoryNotificationsRepository } from 'test/repo/in-memory-notification-repository'
import { UniqueEntityId } from '@/core/unique-entity-id'
import { makeNotification } from 'test/factories/make-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ListNewAnswerQuestionNotificationUseCase

describe('List New Answer Questions Notifications', () => {
    beforeEach(() => {
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
        sut = new ListNewAnswerQuestionNotificationUseCase(inMemoryNotificationsRepository)
    })

    it('should be able to list new  answer questions notifications', async () => {
        const recipientId = new UniqueEntityId('recipient-1')

        await inMemoryNotificationsRepository.create(
            makeNotification({
                recipientId,
                eventType: 'ANSWER_QUESTION_CREATED',
            })
        )

        await inMemoryNotificationsRepository.create(
            makeNotification({
                recipientId,
                eventType: 'ANSWER_QUESTION_CREATED',
            })
        )

        await inMemoryNotificationsRepository.create(
            makeNotification({
                recipientId: new UniqueEntityId('recipient-2'),
                eventType: 'ANSWER_QUESTION_CREATED'
            })
        )

        await inMemoryNotificationsRepository.create(
            makeNotification({
                recipientId,
                eventType: 'ANSWER_QUESTION_CREATED',
            })
        )

        const result = await sut.execute({
            recipientId: 'recipient-1',
            eventType: 'ANSWER_QUESTION_CREATED',
        })

        expect(result).toBeRight()
        expect(result.value?.notifications).toHaveLength(3)
        expect(result.value?.notifications).toEqual([
            expect.objectContaining({ recipientId }),
            expect.objectContaining({ recipientId }),
            expect.objectContaining({ recipientId })
        ])
    })

    it('should return an empty list if no notifications are found', async () => {
        const result = await sut.execute({
            recipientId: 'non-existent-recipient',
            eventType: 'ANSWER_QUESTION_CREATED',
        })

        expect(result).toBeRight()
        expect(result.value?.notifications).toHaveLength(0)
    })
})
