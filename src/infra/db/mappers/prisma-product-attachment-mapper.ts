import { UniqueEntityId } from "@/core/unique-entity-id";
import { ProductAttachment } from "@/domain/marketplace/enterprise/entities/product-attachment";
import { ProductAttachment as PrismaProductAttachment } from "generated/prisma";

export class PrismaProductAttachmentMapper {
  static toDomain(raw: PrismaProductAttachment): ProductAttachment {
    return ProductAttachment.create(
      {
        productId: new UniqueEntityId(raw.productId),
        attachmentId: new UniqueEntityId(raw.attachmentId),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(productAttachment: ProductAttachment) {
    return {
      id: productAttachment.id.toString(),
      productId: productAttachment.productId.toString(),
      attachmentId: productAttachment.attachmentId.toString(),
    };
  }
}
