import { NotificationsRepository } from '@/domain/notification/app/repo/notification-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { EventType } from '@/domain/notification/app/events-types'

export class InMemoryNotificationsRepository implements NotificationsRepository {
    public items: Notification[] = []

    async create(notification: Notification) {
        this.items.push(notification)
    }

    async findManyNewQuestionsNotifications(
        recipientId: string,
        eventType: EventType
    ) {
        return this.items.filter(
            (notification) =>
                notification.recipientId.toString() === recipientId &&
                notification.eventType === eventType
        )
    }

    async findMany(recipientId: string, options?: { eventType?: EventType }) {
        return this.items.filter(
            (notification) =>
                notification.recipientId.toString() === recipientId &&
                (!options?.eventType || notification.eventType === options.eventType)
        )
    }
}