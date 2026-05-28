import { ChangeUserPasswordUseCase } from "@/domain/marketplace/app/use-cases/change-user-password";
import { BcryptAdapter } from "@/infra/cryptography/hash/bcrypt-adapter";
import { PrismaUsersRepository } from "@/infra/db/repo/prisma-users-repository";

export function makeChangeUserPasswordUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const bcrypt = new BcryptAdapter();
  const changeUserPasswordUseCase = new ChangeUserPasswordUseCase(
    usersRepository,
    bcrypt,
  );

  return changeUserPasswordUseCase;
}
