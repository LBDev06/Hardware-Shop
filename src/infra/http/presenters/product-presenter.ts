import { Product } from "@/domain/marketplace/enterprise/entities/product";

export class ProductPresenter {
  static toHTTP(product: Product) {
    return {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      category: product.category.value,
      specs: Object.fromEntries(
        product.specs.items.map((spec) => [spec.key, spec.value]),
      ),
      attachmentsIds: product.attachments
        .getItems()
        .map((attachment) => attachment.attachmentId.toString()),
      createdAt: product.createdAt.toISOString(),
    };
  }
}
