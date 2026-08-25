import { ListOrderHistoryUseCase } from "@/domain/payment/app/use-cases/list-order-history";
import { PrismaOrderRepository } from "@/infra/db/repo/prisma-order-repository";

export function makeListOrderHistoryUseCase() {
  const orderRepository = new PrismaOrderRepository();
  const listOrderHistoryUseCase = new ListOrderHistoryUseCase(orderRepository);

  return listOrderHistoryUseCase;
}
