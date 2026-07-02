import { CreateProductUseCase } from "@/domain/marketplace/app/use-cases/create-product"
import { PrismaProductRespository } from "@/infra/db/repo/prisma-product-repository"
import { PrismaUsersRepository } from "@/infra/db/repo/prisma-users-repository"

export function makeCreateProductUseCase(){
    const usersRepository = new PrismaUsersRepository()
    const productRepository = new PrismaProductRespository()

    const createProductUseCase = new CreateProductUseCase(usersRepository,productRepository)
    return createProductUseCase
}
