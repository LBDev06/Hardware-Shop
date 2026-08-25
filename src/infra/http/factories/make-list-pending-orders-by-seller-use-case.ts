import { ListPendingOrdersBySellerUseCase } from "@/domain/payment/app/use-cases/list-pending-orders-by-seller";
import { PrismaOrderRepository } from "@/infra/db/repo/prisma-order-repository";
import { PrismaProductRespository } from "@/infra/db/repo/prisma-product-repository";

export function makeListPendingOrdersBySellerUseCase() {
  const orderRepository = new PrismaOrderRepository();
  const productRepository = new PrismaProductRespository();
  const listPendingOrdersBySellerUseCase = new ListPendingOrdersBySellerUseCase(
    orderRepository,
    productRepository
  );

  return listPendingOrdersBySellerUseCase;
}
