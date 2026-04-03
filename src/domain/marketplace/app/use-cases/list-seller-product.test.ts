import { InMemoryProductsRepository } from "test/repo/in-memory-product-repository";
import { Role } from "../../enterprise/value-objects/role";
import { beforeEach, describe, expect, it } from "vitest";
import { ListSellerPoductsUseCase } from "./list-seller-products";
import { makeUser } from "test/factories/makeUser";
import { InMemoryUsersRepository } from "test/repo/in-memory-users-repository";
import { makeProduct } from "test/factories/makeProduct";

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let sut: ListSellerPoductsUseCase

describe('List Seller Products Use Case', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryProductsRepository = new InMemoryProductsRepository()
        sut = new ListSellerPoductsUseCase(inMemoryProductsRepository)
    })

    it('should be able to list seller products', async () => {
        const user = await makeUser({
            role: Role.fromString('seller')
        })
        await inMemoryUsersRepository.create(user)

        const product = makeProduct({
            authorId: user.id
        })

        await inMemoryProductsRepository.create(product)
        await inMemoryProductsRepository.create(product)
        await inMemoryProductsRepository.create(product)

        const result = await sut.executer({
            userId: user.id.toString(),
            page: 1
        })

        expect(result).toBeRight()
        expect(result.value?.products).toHaveLength(3)
    })

    it('should be able to list pagineted seller products', async () => {
        const user = await makeUser({
            role: Role.fromString('seller')
        })

        await inMemoryUsersRepository.create(user)

        const product = makeProduct({
            authorId: user.id
        })

        for (let i = 1; i <= 22; i++) {
            await inMemoryProductsRepository.create(product)
        }

        const result = await sut.executer({
            userId: user.id.toString(),
            page: 2
        })

        expect(result.isRight()).toBe(true)
        expect(result.value?.products).toHaveLength(2)
    })
})
