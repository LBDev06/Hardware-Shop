import { InMemoryProductsRepository } from "test/repo/in-memory-product-repository";
import { InMemoryQuestionRepository } from "test/repo/in-memory-question-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { ListProductQuestionsUseCase } from "./list-product-questions";
import { makeProduct } from "test/factories/makeProduct";
import { makeQuestion } from "test/factories/makeQuestion";

let inMemoryProductRepository: InMemoryProductsRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: ListProductQuestionsUseCase

describe('List Product Questions Use Case', () => {
    beforeEach(() => {
        inMemoryProductRepository = new InMemoryProductsRepository()
        inMemoryQuestionRepository = new InMemoryQuestionRepository()
        sut = new ListProductQuestionsUseCase(inMemoryProductRepository, inMemoryQuestionRepository)
    })

    it('should be able to list questions.', async () => {
        const product = await makeProduct()

        await inMemoryProductRepository.create(product)

        const question1 = await makeQuestion({
            productId: product.id,
        })
        const question2 = await makeQuestion({
            productId: product.id,
        })
        const question3 = await makeQuestion({
            productId: product.id,
        })

        await inMemoryQuestionRepository.create(question1)
        await inMemoryQuestionRepository.create(question2)
        await inMemoryQuestionRepository.create(question3)

        const result = await sut.execute({
            productId: product.id.toString(),
            page: 1
        })

        expect(result).toBeRight()
        if (result.isRight()) {
            expect(result.value.questions).toHaveLength(3)
        }
    })

    it('should not be able to list questions if product does not exists.', async () => {
        const result = await sut.execute({
            productId: 'product-does-not-exist',
            page: 1
        })

        expect(result).toBeLeft()
    })
})
