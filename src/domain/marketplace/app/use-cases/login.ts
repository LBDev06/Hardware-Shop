import { Either, left, right } from "@/core/either";
import { UsersRepository } from "../repo/users-repository";
import { InvalidCredentialError } from "@/core/errors/invalid-credential-error";
import { User } from "../../enterprise/entities/user";
import { compare } from "bcryptjs";

interface LoginUseCaseRequest {
    email: string;
    password: string;
}

type LoginUseCaseResponse  = Either<InvalidCredentialError,
{
    user: User
}>

export class LoginUseCase {
    constructor(
        private usersRepository: UsersRepository
    ){}

    async execute({
        email,
        password
    
    }: LoginUseCaseRequest): Promise<LoginUseCaseResponse>{
        const user = await this.usersRepository.findByEmail(email)

        if(!user){
            return left(new InvalidCredentialError())
        }

        const isCorrectPassword = await compare(password, user.password)

        if(!isCorrectPassword){
            return left(new InvalidCredentialError())
        }

        return right({
            user
        })
    }
}