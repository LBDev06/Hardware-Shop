import { DeleteProductUseCase } from "@/domain/marketplace/app/use-cases/delete-product";
import { PrismaProductRepository } from "@/infra/db/repo/prisma-product-repository";
import { PrismaUsersRepository } from "@/infra/db/repo/prisma-users-repository";

export function makeDeleteProductUseCase(){
    const usersRepository = new PrismaUsersRepository();
    const productRepository = new PrismaProductRepository();

    const deleteProductUseCase = new DeleteProductUseCase(usersRepository, productRepository)
    return deleteProductUseCase
}