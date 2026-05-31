import { ModifyUserRoleUseCase } from "@/domain/marketplace/app/use-cases/modify-user-role";
import { PrismaUsersRepository } from "@/infra/db/repo/prisma-users-repository";

export function makeModifyUserRoleUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const modifyUserRoleUseCase = new ModifyUserRoleUseCase(usersRepository);
  return modifyUserRoleUseCase;
}
