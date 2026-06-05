import { Either, right } from "@/core/either";
import { User } from "../../enterprise/entities/user";
import { UsersRepository } from "../repo/users-repository";
import { left } from "@/core/either";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";

interface GetUserProfileUseCaseRequest {
  id: string;
}

type GetUserProfileUseCaseResponse = Either<
  UserNotFoundError,
  {
    user: User;
  }
>;

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      return left(new UserNotFoundError());
    }

    return right({ user });
  }
}
