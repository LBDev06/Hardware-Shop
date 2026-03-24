import { UsersRepository } from "../repo/users-repository";
import { Either, left, right } from "@/core/either";
import { InvalidCredentialError } from "@/core/errors/invalid-credential-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SameOldCredentialsError } from "@/core/errors/same-old-credentials-error";
import { compare, hash } from "bcryptjs";

interface ChangeUserPasswordUseCaseRequest {
    userId: string;
    oldPassword: string;
    newPassword: string
}

type ChangeUserPasswordUseCaseResponse = Either<ResourceNotFoundError | InvalidCredentialError | SameOldCredentialsError, {}>

export class ChangeUserPasswordUseCase{
   
    constructor(
        private usersRepository: UsersRepository
    ){}

   async execute({
        userId,
        oldPassword,
        newPassword
    }: ChangeUserPasswordUseCaseRequest): Promise<ChangeUserPasswordUseCaseResponse>{
        const user = await this.usersRepository.findById(userId)

      if(!user){
        return left(new ResourceNotFoundError())
      }

      const isCorrectPassword = compare(oldPassword, user.password)

      if(!isCorrectPassword){
        return left(new InvalidCredentialError())
      }

      const isSameOldPassword = oldPassword === newPassword

      if(isSameOldPassword){
        return left(new SameOldCredentialsError())
      }

      const newPasswordHash = await hash(newPassword,7)

      user.updatePassword(newPasswordHash)

      await this.usersRepository.save(user.id, user)

      return right({})
    

    }
}