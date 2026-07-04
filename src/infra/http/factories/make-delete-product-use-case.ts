import { DeleteProductUseCase } from "@/domain/marketplace/app/use-cases/delete-product";
import { PrismaProductRespository } from "@/infra/db/repo/prisma-product-repository";
import { PrismaUsersRepository } from "@/infra/db/repo/prisma-users-repository";

export function makeDeleteProductUseCase(){
    const usersRepository = new PrismaUsersRepository();
    const productUsersRepository = new PrismaProductRespository();

    const deleteProductRepository = new DeleteProductUseCase(usersRepository, productUsersRepository)
    return deleteProductRepository
}