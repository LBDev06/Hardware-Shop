import { UniqueEntityId } from '@/core/unique-entity-id'
import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repo/notification-repository'
import { EventType } from '../events-types'

export interface SendNotificationUseCaseRequest {
    recipientId: string
    title: string
    content: string
    eventType: EventType
}

export type SendNotificationUseCaseResponse = Either<
    null,
    {
        notification: Notification
    }
>

export class SendNotificationUseCase {
    constructor(private notificationsRepository: NotificationsRepository) { }

    async execute({
        recipientId,
        title,
        content,
        eventType,
    }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
        const notification = Notification.create({
            recipientId: new UniqueEntityId(recipientId),
            title,
            content,
            eventType,
        })

        await this.notificationsRepository.create(notification)

        return right({
            notification,
        })
    }
}
