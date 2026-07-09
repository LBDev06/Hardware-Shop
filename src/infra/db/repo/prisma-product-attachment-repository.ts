import { ProductAttachmentRepository } from "@/domain/marketplace/app/repo/product-attachment-repository";
import { ProductAttachment } from "@/domain/marketplace/enterprise/entities/product-attachment";
import { db } from "../libs/prisma";
import { PrismaProductAttachmentMapper } from "../mappers/prisma-product-attachment-mapper";

export class PrismaProductAttachmentRepository implements ProductAttachmentRepository {
  async findManyByProductId(productId: string): Promise<ProductAttachment[]> {
    const productAttachments = await db.productAttachment.findMany({
      where: { productId },
    });

    return productAttachments.map(PrismaProductAttachmentMapper.toDomain);
  }
}
