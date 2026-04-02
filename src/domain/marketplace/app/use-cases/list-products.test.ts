import { InMemoryProductsRepository } from "test/repo/in-memory-product-repository";
import { ListProductsUseCase } from "./list-products";
import { makeProduct } from "test/factories/makeProduct";
import { beforeEach, describe, expect, it } from "vitest";

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: ListProductsUseCase

describe('List Products Use Case', () => {
    beforeEach(() => {
        inMemoryProductsRepository = new InMemoryProductsRepository()
        sut = new ListProductsUseCase(inMemoryProductsRepository)
    })

    it('should be able to list products', async () => {
        await inMemoryProductsRepository.create(makeProduct({ name: 'Product 1' }))
        await inMemoryProductsRepository.create(makeProduct({ name: 'Product 2' }))
        await inMemoryProductsRepository.create(makeProduct({ name: 'Product 3' }))

        const result = await sut.execute({
            page: 1
        })

        expect(result.isRight()).toBe(true)
        expect(result.value?.products).toHaveLength(3)
    })

    it('should be able to list paginated products', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryProductsRepository.create(makeProduct({ name: `Product ${i}` }))
        }

        const result = await sut.execute({
            page: 2
        })

        expect(result.isRight()).toBe(true)
        expect(result.value?.products).toHaveLength(2)
    })
})
