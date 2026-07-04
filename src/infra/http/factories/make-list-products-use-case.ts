import { ListProductsUseCase } from "@/domain/marketplace/app/use-cases/list-products";
import { PrismaProductRespository } from "@/infra/db/repo/prisma-product-repository";

export function makeListProductsUseCase() {
  const productRepository = new PrismaProductRespository();

  const listProductsUseCase = new ListProductsUseCase(productRepository);

  return listProductsUseCase;
}
