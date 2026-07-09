import { EditProductUseCase } from "@/domain/marketplace/app/use-cases/edit-product";
import { PrismaProductAttachmentRepository } from "@/infra/db/repo/prisma-product-attachment-repository";
import { PrismaProductRespository } from "@/infra/db/repo/prisma-product-repository";
import { PrismaUsersRepository } from "@/infra/db/repo/prisma-users-repository";

export function makeEditProductUseCase(){
    const usersRepository = new PrismaUsersRepository()
    const productAttachmentRepository = new PrismaProductAttachmentRepository()
    const productsRepository = new PrismaProductRespository()
    const editProductUseCase = new EditProductUseCase(usersRepository,  productAttachmentRepository, productsRepository)

    return editProductUseCase
}
