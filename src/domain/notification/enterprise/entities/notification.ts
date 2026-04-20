import { Entity } from "@/core/entity"
import { UniqueEntityId } from "@/core/unique-entity-id"
import { Optional } from "@/core/types/optional"

interface NotificationProps {
    recipientId: UniqueEntityId
    content: string
    title: string
    createdAt: Date
    readAt?: Date
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

    get createdAt() {
        return this.props.createdAt
    }

    get readAt() {
        return this.props.readAt
    }

    static create(props: Optional<NotificationProps, 'createdAt'>, id?: UniqueEntityId) {
        const notification = new Notification({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id)

        return notification
    }
}