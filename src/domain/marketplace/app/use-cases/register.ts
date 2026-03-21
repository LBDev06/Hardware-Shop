import { Either, left, right } from "@/core/either";
import { User } from "../../enterprise/entities/user";
import { Role } from "../../enterprise/value-objects/role";
import { UsersRepository } from "../repo/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "@/core/errors/user-already-exists-error";

interface CreateUserUseCaseRequest {
    name: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
}

type CreateUseUseCaseResponse = Either< UserAlreadyExistsError, {
    user: User
}>

export class CreateUserUseCase {
   constructor(
    private usersRepository: UsersRepository
   ){}

   async execute({
    name,
    email,
    password,
    role,
    createdAt
}: CreateUserUseCaseRequest): Promise<CreateUseUseCaseResponse>{
     
    const passwordHash = await hash(password, 7)
    
    const useWithSameEmail = await this.usersRepository.findByEmail(email)

    if(!useWithSameEmail){
        return left(new UserAlreadyExistsError())
    }

    const user = User.create({
        name,
        email,
        password: passwordHash,
        role,
        createdAt
    })
   
    await this.usersRepository.create(user)

    return right({
        user
    })
}
}