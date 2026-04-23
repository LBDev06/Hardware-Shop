import { EventType } from "@/domain/notification/app/events-types"
import { Entity } from "@/core/entity"
import { UniqueEntityId } from "@/core/unique-entity-id"
import { Optional } from "@/core/types/optional"

export interface NotificationProps {
    recipientId: UniqueEntityId
    content: string
    title: string
    eventType: EventType
    createdAt: Date
}

export class Notification extends Entity<NotificationProps> {
    get recipientId() {
        return this.props.recipientId
    }

    get content() {
        return this.props.content
    }

    get title() {
        return this.props.title
    }

    get eventType() {
        return this.props.eventType
    }

    get createdAt() {
        return this.props.createdAt
    }

    static create(props: Optional<NotificationProps, 'createdAt'>, id?: UniqueEntityId) {
        const notification = new Notification({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id)

        return notification
    }
}