import { RegisterUserUseCase } from "@/domain/marketplace/app/use-cases/register";
import { PrismaUsersRepository } from "@/infra/db/repo/prisma-users-repository";

export function makeRegisterUserUseCase() {
  const userRepository = new PrismaUsersRepository();
  const registerUseCase = new RegisterUserUseCase(userRepository);

  return registerUseCase;
}
