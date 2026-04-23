import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { EventType } from '../events-types'

export interface NotificationsRepository {
    create(notification: Notification): Promise<void>
    findMany(recipientId: string, options?: { eventType?: EventType }): Promise<Notification[]>
}