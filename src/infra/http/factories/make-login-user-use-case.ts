import { LoginUseCase } from "@/domain/marketplace/app/use-cases/login";
import { PrismaUsersRepository } from "@/infra/db/repo/prisma-users-repository";

export function makeLoginUserUseCase() {
  const userRepository = new PrismaUsersRepository();
  const loginUseCase = new LoginUseCase(userRepository);

  return loginUseCase;
}
