import { Either } from "@/core/either";
import { UserAlreadyExistsError } from "@/core/errors/user-already-exists-error";
import { UsersRepository } from "../repo/users-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { left } from "@/core/either";
import { right } from "@/core/either";
import { User } from "../../enterprise/entities/user";
import { SameOldCredentialsError } from "@/core/errors/same-old-credentials-error";

export interface ChangeUserEmailUseCaseRequest {
    userId:   string;
    newEmail: string;
    oldEmail: string;
}

export type ChangeUserEmailUseCaseResponse = Either<UserAlreadyExistsError | ResourceNotFoundError | SameOldCredentialsError, {
    user: User
}>

export class ChangeUserEmailUseCase {
  constructor(
    private usersRepository: UsersRepository
  ){}

 async execute({
  userId,
  newEmail,
  oldEmail
  }: ChangeUserEmailUseCaseRequest): Promise<ChangeUserEmailUseCaseResponse>{
   const user = await this.usersRepository.findById(userId)

   if(!user){
   return left(new ResourceNotFoundError())
   }

  const isExistingEmail = await this.usersRepository.findByEmail(newEmail)
  
  if(  isExistingEmail &&isExistingEmail.id.toString() !== userId){
    return left(new UserAlreadyExistsError())
  }
  
  const isSameOldEmail = newEmail === oldEmail

  if(isSameOldEmail){
    return left(new SameOldCredentialsError())
  }

   user.updateEmail(newEmail)
   
   await this.usersRepository.save(user.id, user)
   
   return right({
    user
   })
  }
}