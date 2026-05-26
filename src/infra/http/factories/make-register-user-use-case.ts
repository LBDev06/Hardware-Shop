import { RegisterUserUseCase } from "@/domain/marketplace/app/use-cases/register";
import { BcryptAdapter } from "@/infra/cryptography/hash/bcrypt-adapter";
import { PrismaUsersRepository } from "@/infra/db/repo/prisma-users-repository";

export function makeRegisterUserUseCase() {
  const userRepository = new PrismaUsersRepository();
  const bcryptAdapter = new BcryptAdapter();
  const registerUseCase = new RegisterUserUseCase(
    userRepository,
    bcryptAdapter,
  );

  return registerUseCase;
}
