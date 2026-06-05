import { GetUserProfileUseCase } from "@/domain/marketplace/app/use-cases/get-user-profile";
import { PrismaUsersRepository } from "@/infra/db/repo/prisma-users-repository";

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const getUserProfile = new GetUserProfileUseCase(usersRepository);

  return getUserProfile;
}
