import { GetUserProductCartUseCase } from "@/domain/marketplace/app/use-cases/get-user-product-cart";
import { PrismaCartRepository } from "@/infra/db/repo/prisma-cart-repository";

export function makeGetUserCartProduct(){
    const cartRepository = new PrismaCartRepository()
    const getUserCartProduct = new GetUserProductCartUseCase(cartRepository)

    return getUserCartProduct
}