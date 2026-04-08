import { Entity } from "@/core/entity";
import { UniqueEntityId } from "@/core/unique-entity-id";

interface ProductAttachmentProps {
    productId: UniqueEntityId;
    attachmentId: UniqueEntityId;
}

export class ProductAttachment extends Entity<ProductAttachmentProps> {
    get productId() {
        return this.props.productId
    }

    get attachmentId() {
        return this.props.attachmentId
    }

    static create(props: ProductAttachmentProps, id?: UniqueEntityId) {
        const productAttachment = new ProductAttachment({
            ...props,
        }, id)

        return productAttachment
    }
}