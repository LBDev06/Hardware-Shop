import { Entity } from "@/core/entity";
import { UniqueEntityId } from "@/core/unique-entity-id";

interface AttachmentProps {
    link: string;
}

export class Attachment extends Entity<AttachmentProps> {
    get link() {
        return this.props.link
    }

    static create(props: AttachmentProps, id?: UniqueEntityId) {
        const attachment = new Attachment({
            ...props,
        }, id)

        return attachment
    }
}