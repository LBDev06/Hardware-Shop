import { ListSellerPoductsUseCase } from "@/domain/marketplace/app/use-cases/list-seller-products";
import { PrismaProductRespository } from "@/infra/db/repo/prisma-product-repository";

export function makeListSellerProductUseCase(){
    const productRepository = new PrismaProductRespository()
    const listSellerProductUseCase = new ListSellerPoductsUseCase(productRepository)

    return listSellerProductUseCase
}