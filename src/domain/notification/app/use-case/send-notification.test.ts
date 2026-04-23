import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationsRepository } from 'test/repo/in-memory-notification-repository'
import { beforeEach, describe, expect, it } from 'vitest'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository

let sut: SendNotificationUseCase

describe('Send Notification', () => {
    beforeEach(() => {
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
        sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
    })

    it('should be able to send a notification', async () => {
        const result = await sut.execute({
            recipientId: '1',
            title: 'Nova notificação',
            content: 'Conteúdo da notificação',
            eventType: "QUESTION_CREATED"
        })

        expect(result).toBeRight()
        expect(inMemoryNotificationsRepository.items[0]).toEqual(result.value?.notification)
    })
})