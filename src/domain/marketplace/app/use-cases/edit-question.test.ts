import { InMemoryUsersRepository } from "../../../../../test/repo/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryProductsRepository } from "test/repo/in-memory-product-repository";
import { makeUser } from "test/factories/makeUser";
import { EditQuestionUseCase } from "./edit-question";
import { InMemoryQuestionRepository } from "test/repo/in-memory-question-repository";
import { makeProduct } from "test/factories/makeProduct";
import { makeQuestion } from "test/factories/makeQuestion";
import { randomUUID } from "node:crypto";

let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: EditQuestionUseCase

describe('Edit QuestionUse Case', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUsersRepository()
        inMemoryProductsRepository = new InMemoryProductsRepository()
        inMemoryQuestionRepository = new InMemoryQuestionRepository()
        sut = new EditQuestionUseCase(inMemoryQuestionRepository)
    })

    it('should be able to edit an question.', async () => {
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
            questionId: question.id.toString(),
            content: 'Comentário teste'
        })

        expect(result).toBeRight()
    })

    it('should not be able to edit an question with wrong id.', async () => {
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
            questionId: question.id.toString(),
            content: 'Comentário teste'
        })

        expect(result).toBeLeft()
    })

})
