import { ListSellerPoductsUseCase } from "@/domain/marketplace/app/use-cases/list-seller-products";
import { PrismaProductRepository } from "@/infra/db/repo/prisma-product-repository";

export function makeListSellerProductUseCase(){
    const productRepository = new PrismaProductRepository()
    const listSellerProductUseCase = new ListSellerPoductsUseCase(productRepository)

    return listSellerProductUseCase
}