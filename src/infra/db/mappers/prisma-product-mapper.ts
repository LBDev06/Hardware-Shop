import { UniqueEntityId } from "@/core/unique-entity-id";
import { Product } from "@/domain/marketplace/enterprise/entities/product";
import { ProductAttachmentList } from "@/domain/marketplace/enterprise/entities/product-attachment-list";
import { ProductAttachment } from "@/domain/marketplace/enterprise/entities/product-attachment";
import { ProductCategory } from "@/domain/marketplace/enterprise/value-objects/product-category";
import {
  ProductSpecs,
  SpecInput,
} from "@/domain/marketplace/enterprise/value-objects/product-specs";
import {
  Product as PrismaProduct,
  ProductAttachment as PrismaProductAttachment,
} from "generated/prisma";

type PrismaProductWithAttachments = PrismaProduct & {
  attachments: PrismaProductAttachment[];
};

export class PrismaProductMapper {
  static toDomain(raw: PrismaProductWithAttachments): Product {
    const category = ProductCategory.create(raw.category);
    const specs = ProductSpecs.create(raw.specs as SpecInput, category.value);

    const attachments = raw.attachments.map((attachment) =>
      ProductAttachment.create(
        {
          productId: new UniqueEntityId(attachment.productId),
          attachmentId: new UniqueEntityId(attachment.attachmentId),
        },
        new UniqueEntityId(attachment.id),
      ),
    );

    return Product.create(
      {
        authorId: new UniqueEntityId(raw.authorId),
        name: raw.name,
        price: raw.price,
        stock: raw.stock,
        description: raw.description,
        category,
        specs,
        createdAt: raw.createdAt,
        attachments: new ProductAttachmentList(attachments),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(product: Product) {
    return {
      id: product.id.toString(),
      authorId: product.authorId.toString(),
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      category: product.category.value,
      specs: Object.fromEntries(
        product.specs.items.map((spec) => [spec.key, spec.value]),
      ),
      createdAt: product.createdAt,
    };
  }
}
