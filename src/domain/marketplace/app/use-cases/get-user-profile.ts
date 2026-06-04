import { Either, right } from "@/core/either";
import { UserAlreadyExistsError } from "@/core/errors/user-already-exists-error";
import { User } from "../../enterprise/entities/user";
import { UsersRepository } from "../repo/users-repository";
import { left } from "@/core/either";

interface GetUserProfileUseCaseRequest {
  id: string;
}

type GetUserProfileUseCaseResponse = Either<
  UserAlreadyExistsError,
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
      return left(new UserAlreadyExistsError());
    }

    return right({ user });
  }
}
