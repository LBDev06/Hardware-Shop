import { Either, left, right } from "../../../../core/either";
import { User } from "../../enterprise/entities/user";
import { UsersRepository } from "../repo/users-repository";
import { UserAlreadyExistsError } from "../../../../core/errors/user-already-exists-error";
import { Bcrypt } from "../../infra/cryptography/bcrypt";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHash: Bcrypt,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const passwordHash = await this.passwordHash.hash(password, 7);

    const useWithSameEmail = await this.usersRepository.findByEmail(email);

    if (useWithSameEmail) {
      return left(new UserAlreadyExistsError());
    }

    const user = User.create({
      name,
      email,
      password: passwordHash,
    });

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}
