import { Entity } from "@/core/entity";
import { UniqueEntityId } from "@/core/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface AttachmentProps {
    link: string;
    createdAt?: Date;
}

export class Attachment extends Entity<AttachmentProps> {
    get link() {
        return this.props.link
    }

    get createdAt() {
        return this.props.createdAt
    }

    static create(props: Optional<AttachmentProps, 'createdAt'>, id?: UniqueEntityId) {
        const attachment = new Attachment({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id)

        return attachment
    }
}