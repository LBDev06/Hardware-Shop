import { InMemoryProductsRepository } from "test/repo/in-memory-product-repository";
import { beforeEach, describe, it } from "vitest";
import { SearchProductUseCase } from "./search-product";
import { makeUser } from "test/factories/makeUser";
import { makeProduct } from "test/factories/makeProduct";
import { InMemoryUsersRepository } from "test/repo/in-memory-users-repository";
import { expect } from "vitest";

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let sut: SearchProductUseCase

describe('List Products Use Case', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryProductsRepository = new InMemoryProductsRepository()
        sut = new SearchProductUseCase(inMemoryProductsRepository)
    })

    it('should be able to search for products', async () => {
        const user = await makeUser({})
        await inMemoryUsersRepository.create(user)

        const product = makeProduct({ authorId: user.id, name: 'Product 1' })
        await inMemoryProductsRepository.create(product)

        const result = await sut.execute({
            query: 'Product 1'
        })

        expect(result).toBeRight()
        expect(result.value?.product).toHaveLength(1)
    })

})
