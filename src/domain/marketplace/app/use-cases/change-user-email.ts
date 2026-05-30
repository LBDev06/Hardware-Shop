import { Either } from "@/core/either";
import { UserAlreadyExistsError } from "@/core/errors/user-already-exists-error";
import { UsersRepository } from "../repo/users-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { left } from "@/core/either";
import { right } from "@/core/either";
import { User } from "../../enterprise/entities/user";
import { SameOldCredentialsError } from "@/core/errors/same-old-credentials-error";
import { InvalidCredentialError } from "@/core/errors/invalid-credential-error";
import { Bcrypt } from "../../infra/cryptography/bcrypt";

export interface ChangeUserEmailUseCaseRequest {
  userId: string;
  password: string;
  newEmail: string;
}

export type ChangeUserEmailUseCaseResponse = Either<
  | UserAlreadyExistsError
  | ResourceNotFoundError
  | SameOldCredentialsError
  | InvalidCredentialError,
  {
    user: User;
  }
>;

export class ChangeUserEmailUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private bcrypt: Bcrypt,
  ) {}

  async execute({
    userId,
    password,
    newEmail,
  }: ChangeUserEmailUseCaseRequest): Promise<ChangeUserEmailUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const isCorrectPassword = this.bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return left(new InvalidCredentialError());
    }

    const isSameOldEmail = newEmail === user.email;

    if (isSameOldEmail) {
      return left(new SameOldCredentialsError());
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(newEmail);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError());
    }

    user.updateEmail(newEmail);

    await this.usersRepository.save(user);

    return right({
      user,
    });
  }
}
