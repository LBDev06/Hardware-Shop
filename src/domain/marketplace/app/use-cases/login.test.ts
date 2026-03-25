import { InMemoryUsersRepository } from "../../../../../test/repo/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { makeUser } from "test/factories/makeUser";
import { hash } from "bcryptjs";
import { LoginUseCase } from "./login";

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: LoginUseCase

describe('Login Use Case', ()=>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new LoginUseCase(inMemoryUsersRepository)
    })

    it('should be able to login.', async()=>{
      const password = 'senha124124124'
      const passwordHash = await hash(password, 7)

      const user = await makeUser({
        password:passwordHash
      })

      await inMemoryUsersRepository.create(user)

      const login = await sut.execute({
        email:user.email,
        password:password
      })
      
      expect(login).toBeRight()
     })

   it('should be not able to login with invalid credentials.', async()=>{
      const password = 'senha124124124'
      const passwordHash = await hash(password, 7)

      const user = await makeUser({
        password:passwordHash
      })

      await inMemoryUsersRepository.create(user)

      const login = await sut.execute({
        email:'Alberto00@gmail.com',
        password:password
      })
      
      expect(login).toBeLeft()
     })

    })
