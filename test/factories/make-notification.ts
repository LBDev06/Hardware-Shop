import { Notification, NotificationProps } from "@/domain/notification/enterprise/entities/notification";
import { UniqueEntityId } from "@/core/unique-entity-id";

export function makeNotification(
    override: Partial<NotificationProps> = {},
    id?: UniqueEntityId
) {
    return Notification.create({
        recipientId: new UniqueEntityId(),
        title: 'Nova notificação',
        content: 'Conteúdo da notificação',
        eventType: 'QUESTION_CREATED',
        ...override
    }, id)
}