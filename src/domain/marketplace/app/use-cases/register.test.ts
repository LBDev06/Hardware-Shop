import { InMemoryUsersRepository } from "../../../../../test/repo/in-memory-users-repository";
import { RegisterUserUseCase } from "./register";
import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: RegisterUserUseCase

describe('Register Use Case', ()=>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new RegisterUserUseCase(inMemoryUsersRepository)
    })

    it('should be able to register.', async()=>{
      const passwordHash = '1234234234'
      
      const  user = await sut.execute({
        name:'Alberto',
        email:'Alberto1243@gmail.com',
        password: await hash(passwordHash, 7),
        createdAt: new Date()
       })

        if (user.isLeft()) {
          console.log(user.value)
      }

       expect(user).toBeRight()
    })
})