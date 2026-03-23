import { UsersRepository } from "../repo/users-repository";
import { Role } from "../../enterprise/value-objects/role";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface ModifyUserRoleUseCaseRequest {
    userId: string;
    role:   Role;
}

type ModifyUserRoleUseCaseResponse = Either<ResourceNotFoundError,{
}>

export class ModifyUserRoleUseCase {
    constructor(
    private usersRepository: UsersRepository
    ){}

 async execute({
        userId,
        role
    }: ModifyUserRoleUseCaseRequest): Promise<ModifyUserRoleUseCaseResponse>{
      const user = await this.usersRepository.findById(userId)

      if(!user){
        return left(new ResourceNotFoundError())
      }
      
      user.modifyUserRole(role.value)
      
      await this.usersRepository.save(user.id, role)

      return right({})
    } 
}