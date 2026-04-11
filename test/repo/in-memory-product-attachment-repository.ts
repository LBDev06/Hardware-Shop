import { ProductAttachmentRepository } from "@/domain/marketplace/app/repo/product-attachment-repository";
import { ProductAttachment } from "@/domain/marketplace/enterprise/entities/product-attachment";

export class InMemoryProductAttachmentRepository implements ProductAttachmentRepository {
    public products: ProductAttachment[] = []

    async findManyByProductId(productId: string): Promise<ProductAttachment[]> {
        const product = this.products.filter(product => product.productId.toString() === productId)
        return product
    }
}
