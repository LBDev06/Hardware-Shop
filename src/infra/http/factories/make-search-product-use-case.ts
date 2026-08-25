import { SearchProductUseCase } from "@/domain/marketplace/app/use-cases/search-product";
import { PrismaProductRepository } from "@/infra/db/repo/prisma-product-repository";

export function makeSearchProductUseCase(){
    const productsRepository = new PrismaProductRepository()
    const searchProductUseCase = new SearchProductUseCase(productsRepository)

    return searchProductUseCase
}