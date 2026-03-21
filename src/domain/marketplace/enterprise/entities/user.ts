import { Entity } from "@/core/entity"
import { Role } from "../value-objects/role"
import { UniqueEntityId } from "@/core/unique-entity-id"
import { Optional } from "@/core/types/optional"

interface UserProps {
    name:string
    email: string
    password: string
    role: Role
    createdAt: Date
}

export class User extends Entity<UserProps>{
 
get name (){
        return this.props.name
 }

 get email(){
    return this.props.email
 }

 set changeEmail(newEmail: string){
     this.props.email = newEmail
 }

 public changePassword(newPassword: string){
   if(newPassword === this.props.password){
    throw new Error('New password must be different from the old password')
   }
   return this.props.password = newPassword
 }


public role(role: string){
     const roleInstance = Role.fromString(role)

     if(!roleInstance){
        throw new Error(`Invalid role ${role}`)
     }
      this.props.role = roleInstance
 }
 
  static create(props: Optional<UserProps, 'createdAt'>, id?: UniqueEntityId){
    const user = new User({
        ...props,
        createdAt: props.createdAt ?? new Date(),
    }, id)
    return user 
  }

  }