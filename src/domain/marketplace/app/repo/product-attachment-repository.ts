import { ProductAttachment } from "../../enterprise/entities/product-attachment";

export interface ProductAttachmentRepository {
    findManyByProductId(productId: string): Promise<ProductAttachment[]>
}