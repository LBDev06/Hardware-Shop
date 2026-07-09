import { ProductRepository } from "@/domain/marketplace/app/repo/product-repository";
import { Product } from "@/domain/marketplace/enterprise/entities/product";
import { db } from "../libs/prisma";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";
import { PaginationParams } from "@/core/repo/pagination-params";

export class PrismaProductRespository implements ProductRepository {
    async save(product: Product): Promise<void> {
      const data = PrismaProductMapper.toPrisma(product)

      await db.product.update({
        where: {
          id: product.id.toString(),
        },
        data: {
          ...data,
          attachments: {
            create: product.attachments.getNewItems().map((attachment) => ({
              attachmentId: attachment.attachmentId.toString(),
            })),
            deleteMany: product.attachments.getRemovedItems().map((attachment) => ({
              attachmentId: attachment.attachmentId.toString(),
            })),
          },
        },
      })
    }

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
      const productId = await db.product.findUnique({
        where:{
          id: id
        },
        include:{
          attachments: true
        }
      })

      if (!productId) return null

      return PrismaProductMapper.toDomain(productId)
    }


    async delete(product: string): Promise<void> {
      await db.product.delete({
        where: {
          id: product,
        },
      })
    }

    async findManyProducts(params: PaginationParams): Promise<Product[]> {
      const products = await db.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip: (params.page - 1) * 20,
        take: 20,
        include: {
          attachments: true,
        },
      })

      return products.map(PrismaProductMapper.toDomain)
    }

    async searchProduct(query: string): Promise<Product[] | null> {
      const products = await db.product.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          attachments: true,
        },
      })

      if (products.length === 0) return null

      return products.map(PrismaProductMapper.toDomain)
    }

    async findManyProductsBySellerId(sellerId: string, params: PaginationParams): Promise<Product[] | null> {
      const products = await db.product.findMany({
        where: {
          authorId: sellerId,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (params.page - 1) * 20,
        take: 20,
        include: {
          attachments: true,
        },
      })

      if (products.length === 0) return null

      return products.map(PrismaProductMapper.toDomain)
    }
}
