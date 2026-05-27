import { ChangeUserPasswordUseCase } from "@/domain/marketplace/app/use-cases/change-user-password";
import { PrismaUsersRepository } from "@/infra/db/repo/prisma-users-repository";

export function makeChangeUserPasswordUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const changeUserPasswordUseCase = new ChangeUserPasswordUseCase(
    usersRepository,
  );

  return changeUserPasswordUseCase;
}
