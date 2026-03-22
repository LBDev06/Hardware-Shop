import { Either, left, right } from "../../../../core/either";
import { User } from "../../enterprise/entities/user";
import { UsersRepository } from "../repo/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "../../../../core/errors/user-already-exists-error";

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

type RegisterUseCaseResponse = Either< UserAlreadyExistsError, {
    user: User
}>

export class RegisterUserUseCase {
   constructor(
    private usersRepository: UsersRepository
   ){}

   async execute({
    name,
    email,
    password,
    createdAt
}: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse>{
     
    const passwordHash = await hash(password, 7)
    
    const useWithSameEmail = await this.usersRepository.findByEmail(email)

    if(useWithSameEmail){
        return left(new UserAlreadyExistsError())
    }

    const user = User.create({
        name,
        email,
        password: passwordHash,
        createdAt
    })
   
    await this.usersRepository.create(user)

    return right({
        user
    })
}
}