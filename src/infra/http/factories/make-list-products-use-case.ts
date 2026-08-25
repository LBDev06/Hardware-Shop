import { ListProductsUseCase } from "@/domain/marketplace/app/use-cases/list-products";
import { PrismaProductRepository } from "@/infra/db/repo/prisma-product-repository";

export function makeListProductsUseCase() {
  const productRepository = new PrismaProductRepository();

  const listProductsUseCase = new ListProductsUseCase(productRepository);

  return listProductsUseCase;
}
