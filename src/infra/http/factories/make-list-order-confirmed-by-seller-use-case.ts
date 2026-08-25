import { ListOrderConfirmedBySellerUseCase } from "@/domain/payment/app/use-cases/list-order-confirmed-by-seller";
import { PrismaOrderRepository } from "@/infra/db/repo/prisma-order-repository";
import { PrismaProductRespository } from "@/infra/db/repo/prisma-product-repository";

export function makeListOrderConfirmedBySellerUseCase() {
  const orderRepository = new PrismaOrderRepository();
  const productRepository = new PrismaProductRespository();
  const listOrderConfirmedBySellerUseCase = new ListOrderConfirmedBySellerUseCase(
    orderRepository,
    productRepository
  );

  return listOrderConfirmedBySellerUseCase;
}
