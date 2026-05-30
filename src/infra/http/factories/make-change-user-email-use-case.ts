import { ChangeUserEmailUseCase } from "@/domain/marketplace/app/use-cases/change-user-email";
import { BcryptAdapter } from "@/infra/cryptography/hash/bcrypt-adapter";
import { PrismaUsersRepository } from "@/infra/db/repo/prisma-users-repository";

export function makeChangeUserEmailUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const bcrypt = new BcryptAdapter();
  const changeUserEmailUseCase = new ChangeUserEmailUseCase(
    usersRepository,
    bcrypt,
  );

  return changeUserEmailUseCase;
}
