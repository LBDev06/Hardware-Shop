import { InMemoryUsersRepository } from "../../../../../test/repo/in-memory-users-repository";
import { beforeEach, describe } from "vitest";
import { InMemoryProductsRepository } from "test/repo/in-memory-product-repository";
import { DeleteProductUseCase } from "./delete-product";
import { it, expect } from "vitest";
import { makeUser } from "test/factories/makeUser";
import { makeProduct } from "test/factories/makeProduct";

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let sut: DeleteProductUseCase

describe('Create Product Use Case', ()=>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryProductsRepository = new InMemoryProductsRepository()
        sut = new DeleteProductUseCase(inMemoryUsersRepository, inMemoryProductsRepository)
    })
      
    it('should to be able to delete a product', async()=>{
       const user = await makeUser({})

       const product = await makeProduct({
        authorId:user.id
       })

       await inMemoryUsersRepository.create(user)
       await inMemoryProductsRepository.create(product)

       const deleteProduct = await sut.execute({
        authorId:user.id.toString(),
        productId:product.id.toString()
       })

       expect(deleteProduct).toBeRight()
       expect(inMemoryProductsRepository.products).toHaveLength(0)
       })

           
    it('should not to be able to delete a product with invalid userId', async()=>{
       const user = await makeUser({})

       const product = await makeProduct({})

       await inMemoryUsersRepository.create(user)
       await inMemoryProductsRepository.create(product)

       const deleteProduct = await sut.execute({
        authorId:user.id.toString(),
        productId:product.id.toString()
       })

       expect(deleteProduct).toBeLeft()
    })



    })

