import { Entity } from "../../../../core/entity"
import { Role } from "../value-objects/role"
import { UniqueEntityId } from "@/core/unique-entity-id"
import { Optional } from "@/core/types/optional"

export interface UserProps {
    id?: UniqueEntityId
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

 updateEmail(newEmail: string){
    this.props.email = newEmail
 }

 get password(){
  return this.props.password
 }

 updatePassword( newPassword: string){
  this.props.password = newPassword
 }

public modifyUserRole(role: string){
    const roleInstance = Role.fromString(role)

     if(!roleInstance){
        throw new Error(`Invalid role ${role}`)
     }
      this.props.role = roleInstance
 }

 get role(){
  return this.props.role
 }
 
  static create(props: Optional<UserProps, 'createdAt' | 'role'>, id?: UniqueEntityId){
    const user = new User({
        ...props,
        createdAt: props.createdAt ?? new Date(),
        role: props.role ?? Role.fromString('client')
    }, id)
    return user 
  }

  }