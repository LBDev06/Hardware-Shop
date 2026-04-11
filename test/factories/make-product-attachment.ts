import { ProductAttachment, ProductAttachmentProps } from "@/domain/marketplace/enterprise/entities/product-attachment"
import { UniqueEntityId } from "@/core/unique-entity-id"

export function makeProductAttachment(
    override: Partial<ProductAttachmentProps> = {},
    id?: UniqueEntityId
) {


    const productAttachment = ProductAttachment.create(
        {
            productId: new UniqueEntityId(),
            attachmentId: new UniqueEntityId(),
            ...override,
        },
        id
    )

    return productAttachment
}