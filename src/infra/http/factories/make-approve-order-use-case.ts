import { ApproveOrderUseCase } from "@/domain/payment/app/use-cases/approve-order";
import { PrismaOrderRepository } from "@/infra/db/repo/prisma-order-repository";

export function makeApproveOrderUseCase() {
  const orderRepository = new PrismaOrderRepository();
  const approveOrderUseCase = new ApproveOrderUseCase(orderRepository);

  return approveOrderUseCase;
}
