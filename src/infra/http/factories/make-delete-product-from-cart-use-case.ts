import { DeleteProductFromCartUseCase } from "@/domain/marketplace/app/use-cases/delete-product-from-cart";
import { PrismaCartRepository } from "@/infra/db/repo/prisma-cart-repository";
import { PrismaUsersRepository } from "@/infra/db/repo/prisma-users-repository";

export function makeDeleteProductFromCartUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const cartRepository = new PrismaCartRepository();

  return new DeleteProductFromCartUseCase(usersRepository, cartRepository);
}
