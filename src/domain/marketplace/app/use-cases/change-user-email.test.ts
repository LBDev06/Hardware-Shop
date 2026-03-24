import { InMemoryUsersRepository } from "../../../../../test/repo/in-memory-users-repository";
import { beforeEach, describe, it, expect } from "vitest";
import { makeUser } from "test/factories/makeUser";
import { ChangeUserEmailUseCase } from "./change-user-email";

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: ChangeUserEmailUseCase

describe('Change Password Use Case', ()=>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new ChangeUserEmailUseCase(inMemoryUsersRepository)
    })

  it('should be able to change email.', async()=>{
      
    const user = await makeUser({
        email:'Alberto1243@gmail.com'
    })

    await inMemoryUsersRepository.create(user)
    
    const updateEmail = await sut.execute({
        userId: user.id.toString(),
        oldEmail: 'Alberto124@gmail.com',
        newEmail:'Alberto12@gmail.com'
    })
    
    expect(updateEmail).toBeRight()
 })

  it('should not able to change a email in use for another user.', async()=>{
      
    const user = await makeUser({
        email:'Alberto1243@gmail.com'
    })

     const user2 = await makeUser({
        email:'Alberto12@gmail.com'
    })


    await inMemoryUsersRepository.create(user)
    await inMemoryUsersRepository.create(user2)
    
    const updateEmail = await sut.execute({
        userId: user.id.toString(),
        oldEmail: 'Alberto124@gmail.com',
        newEmail:'Alberto12@gmail.com'
    })
    
    expect(updateEmail).toBeLeft()
 })
 
  it('should not be able to update email to same old email.', async()=>{
      
    const user = await makeUser({
        email:'Alberto10@gmail.com'
    })

    await inMemoryUsersRepository.create(user)
    
    const updateEmail = await sut.execute({
        userId: user.id.toString(),
        oldEmail: 'Alberto10@gmail.com',
        newEmail:'Alberto10@gmail.com'
    })
    
    expect(updateEmail).toBeLeft()
 })
   
})