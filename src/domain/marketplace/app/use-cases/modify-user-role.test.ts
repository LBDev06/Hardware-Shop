import { InMemoryUsersRepository } from "../../../../../test/repo/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { ModifyUserRoleUseCase } from "./modify-user-role";
import { makeUser } from "test/factories/makeUser";
import { Role } from "../../enterprise/value-objects/role";

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: ModifyUserRoleUseCase

describe('Register Use Case', ()=>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new ModifyUserRoleUseCase(inMemoryUsersRepository)
    })

  it('should be able to modify user role.', async()=>{
      
    const user = await makeUser()

    await inMemoryUsersRepository.create(user)

    const changeRole = await sut.execute({
        userId: user.id.toString(),
        role: Role.fromString('seller')
 })

  expect(changeRole).toBeRight()
  expect(inMemoryUsersRepository.user[0].role.value).toBe('seller');
 })

 it('should not be able not modify user role with ivalid user id', async()=>{
        
    const user = await makeUser()

    await inMemoryUsersRepository.create(user)

    const changeRole = await sut.execute({
        userId:'1',
        role: Role.fromString('seller')
    })

     expect(changeRole).toBeLeft()
 })

 it('should not be able not modify user role with invalid role.', async()=>{
      
    const user = await makeUser()

    await inMemoryUsersRepository.create(user)

    await expect(async () => {
    await sut.execute({
    userId: user.id.toString(),
    role: Role.fromString('adm')
    })
  }).rejects.toThrow()

 })

})