import { UsersRepository } from "../repo/users-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface ModifyUserRoleUseCaseRequest {
  userId: string;
  role: string;
}

type ModifyUserRoleUseCaseResponse = Either<ResourceNotFoundError, {}>;

export class ModifyUserRoleUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    role,
  }: ModifyUserRoleUseCaseRequest): Promise<ModifyUserRoleUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    user.modifyUserRole(role);

    await this.usersRepository.save(user);

    return right({});
  }
}
