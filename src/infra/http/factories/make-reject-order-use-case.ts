import { RejectOrderUseCase } from "@/domain/payment/app/use-cases/reject-order";
import { PrismaOrderRepository } from "@/infra/db/repo/prisma-order-repository";

export function makeRejectOrderUseCase() {
  const orderRepository = new PrismaOrderRepository();
  const rejectOrderUseCase = new RejectOrderUseCase(orderRepository);

  return rejectOrderUseCase;
}
