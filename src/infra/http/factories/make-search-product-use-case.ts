import { SearchProductUseCase } from "@/domain/marketplace/app/use-cases/search-product";
import { PrismaProductRespository } from "@/infra/db/repo/prisma-product-repository";

export function makeSearchProductUseCase(){
    const productsRepository = new PrismaProductRespository()
    const searchProductUseCase = new SearchProductUseCase(productsRepository)

    return searchProductUseCase
}