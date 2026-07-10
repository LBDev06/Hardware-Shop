import { AddProductToCartUseCase } from "@/domain/marketplace/app/use-cases/add-prodcut-to-cart";
import { PrismaCartRepository } from "@/infra/db/repo/prisma-cart-repository";
import { PrismaProductRespository } from "@/infra/db/repo/prisma-product-repository";

export function makeAddProductToCartUseCase(){
    const productRepository = new PrismaProductRespository()
    const cartRepository = new PrismaCartRepository()
    const  addProductToCartUseCase = new AddProductToCartUseCase(cartRepository, productRepository)

    return addProductToCartUseCase
}