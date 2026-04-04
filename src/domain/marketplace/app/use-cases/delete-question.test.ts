import { InMemoryUsersRepository } from "../../../../../test/repo/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryProductsRepository } from "test/repo/in-memory-product-repository";
import { makeUser } from "test/factories/makeUser";
import { InMemoryQuestionRepository } from "test/repo/in-memory-question-repository";
import { makeProduct } from "test/factories/makeProduct";
import { makeQuestion } from "test/factories/makeQuestion";
import { DeleteQuestionUseCase } from "./delete-question";
import { randomUUID } from "node:crypto";

let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: DeleteQuestionUseCase

describe('Edit QuestionUse Case', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUsersRepository()
        inMemoryProductsRepository = new InMemoryProductsRepository()
        inMemoryQuestionRepository = new InMemoryQuestionRepository()
        sut = new DeleteQuestionUseCase(inMemoryQuestionRepository)
    })

    it('should be able to delete a question', async () => {
        const user = await makeUser()

        await inMemoryUserRepository.create(user)

        const product = await makeProduct({
            authorId: user.id
        })

        await inMemoryProductsRepository.create(product)

        const question = await makeQuestion({
            authorId: user.id,
            productId: product.id
        })

        await inMemoryQuestionRepository.create(question)

        const result = await sut.execute({
            authorId: user.id.toString(),
            questionId: question.id.toString()
        })

        expect(result).toBeRight()
    })


    it('should be able to delete a question', async () => {
        const user = await makeUser()

        await inMemoryUserRepository.create(user)

        const product = await makeProduct({
            authorId: user.id
        })

        await inMemoryProductsRepository.create(product)

        const question = await makeQuestion({
            authorId: user.id,
            productId: product.id
        })

        await inMemoryQuestionRepository.create(question)

        const result = await sut.execute({
            authorId: user.id.toString(),
            questionId: question.id.toString()
        })

        expect(result).toBeRight()
    })
    it('should not be able to delete a question with wrong id.', async () => {
        const user = await makeUser()

        await inMemoryUserRepository.create(user)

        const product = await makeProduct({
            authorId: user.id
        })

        await inMemoryProductsRepository.create(product)

        const question = await makeQuestion({
            authorId: user.id,
            productId: product.id
        })

        await inMemoryQuestionRepository.create(question)

        const result = await sut.execute({
            authorId: randomUUID(),
            questionId: question.id.toString()
        })

        expect(result).toBeLeft()
    })
})