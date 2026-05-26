import { LoginUseCase } from "@/domain/marketplace/app/use-cases/login";
import { BcryptAdapter } from "@/infra/cryptography/hash/bcrypt-adapter";
import { PrismaUsersRepository } from "@/infra/db/repo/prisma-users-repository";

export function makeLoginUserUseCase() {
  const userRepository = new PrismaUsersRepository();
  const bcryptAdapter = new BcryptAdapter();
  const loginUseCase = new LoginUseCase(userRepository, bcryptAdapter);

  return loginUseCase;
}
