import { ProductRepository } from "@/domain/marketplace/app/repo/product-repository";
import { Product } from "@/domain/marketplace/enterprise/entities/product";
import { db } from "../libs/prisma";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";
import { PaginationParams } from "@/core/repo/pagination-params";

export class PrismaProductRespository implements ProductRepository {
    async create(product: Product): Promise<Product> {
        const createProduct = await db.product.create({
           data: {
    ...PrismaProductMapper.toPrisma(product),
    attachments: {
      create: product.attachments.currentItems.map((item) => ({
        attachmentId: item.attachmentId.toString(),
      })),
    },
  },
  include: {
    attachments: true,
  },
        })

        return PrismaProductMapper.toDomain(createProduct)
    }

    async findById(id: string): Promise<Product | null> {
      
    }

    async save(product: Product): Promise<void> {
      
    }

    async delete(product: string): Promise<void> {
      
    }

    async findManyProducts(params: PaginationParams): Promise<Product[]> {
      
    }

    async searchProduct(query: string): Promise<Product[] | null> {
      
    }

    async findManyProductsBySellerId(sellerId: string, params: PaginationParams): Promise<Product[] | null> {
      
    }
}
