import { InMemoryQuestionRepository } from "test/repo/in-memory-question-repository"
import { beforeEach, describe, it, expect } from "vitest"
import { CreateAnswerQuestionUseCase } from "./create-answer-question"
import { InMemoryAnswerQuestionsRepository } from "test/repo/in-memory-answer-questions-repository"
import { InMemoryUsersRepository } from "test/repo/in-memory-users-repository"
import { InMemoryProductsRepository } from "test/repo/in-memory-product-repository"
import { Role } from "../../enterprise/value-objects/role"
import { makeUser } from "test/factories/makeUser"
import { makeProduct } from "test/factories/makeProduct"
import { makeQuestion } from "test/factories/makeQuestion"

let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let inMemoryAnswerQuestionsRepository: InMemoryAnswerQuestionsRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: CreateAnswerQuestionUseCase

describe('Answer Question Use Case', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUsersRepository()
        inMemoryProductsRepository = new InMemoryProductsRepository()
        inMemoryAnswerQuestionsRepository = new InMemoryAnswerQuestionsRepository()
        inMemoryQuestionRepository = new InMemoryQuestionRepository()
        sut = new CreateAnswerQuestionUseCase(inMemoryProductsRepository, inMemoryQuestionRepository, inMemoryAnswerQuestionsRepository)
    })

    it('should be able to create an answer to a question', async () => {
        const sellerUser = await makeUser({
            role: Role.fromString('seller')
        })

        const clientUser = await makeUser()

        await inMemoryUserRepository.create(sellerUser)
        await inMemoryUserRepository.create(clientUser)

        const product = await makeProduct({
            authorId: sellerUser.id
        })

        await inMemoryProductsRepository.create(product)

        const question = await makeQuestion({
            productId: product.id,
            authorId: clientUser.id,
            content: "What is the price on the promotion?"
        })

        await inMemoryQuestionRepository.create(question)

        const result = await sut.execute({
            authorId: sellerUser.id.toString(),
            productId: product.id.toString(),
            questionId: question.id.toString(),
            content: "The price is R$ 1300,00"
        })

        expect(result).toBeRight()
        expect(inMemoryAnswerQuestionsRepository.answerQuestion[0].content).toEqual("The price is R$ 1300,00")
    })

    it('should not be able to create an answer to a question if product does not exist', async () => {
        const sellerUser = await makeUser({
            role: Role.fromString('seller')
        })

        const clientUser = await makeUser()

        await inMemoryUserRepository.create(sellerUser)
        await inMemoryUserRepository.create(clientUser)

        const question = await makeQuestion({
            authorId: clientUser.id,
            content: "What is the price on the promotion?"
        })

        await inMemoryQuestionRepository.create(question)

        const result = await sut.execute({
            authorId: sellerUser.id.toString(),
            productId: 'non-existing-product-id',
            questionId: question.id.toString(),
            content: "The price is R$ 1300,00"
        })

        expect(result).toBeLeft()
    })

    it('should not be able to create an answer to a question if question does not exist', async () => {
        const sellerUser = await makeUser({
            role: Role.fromString('seller')
        })

        await inMemoryUserRepository.create(sellerUser)

        const product = await makeProduct({
            authorId: sellerUser.id
        })

        await inMemoryProductsRepository.create(product)

        const result = await sut.execute({
            authorId: sellerUser.id.toString(),
            productId: product.id.toString(),
            questionId: 'non-existing-question-id',
            content: "The price is R$ 1300,00"
        })

        expect(result).toBeLeft()
    })

    it('should not be able to create an answer to a question if question does not belong to product', async () => {
        const sellerUser = await makeUser({
            role: Role.fromString('seller')
        })

        const clientUser = await makeUser()

        await inMemoryUserRepository.create(sellerUser)
        await inMemoryUserRepository.create(clientUser)

        const product = await makeProduct({
            authorId: sellerUser.id
        })

        const otherProduct = await makeProduct({
            authorId: sellerUser.id
        })

        await inMemoryProductsRepository.create(product)
        await inMemoryProductsRepository.create(otherProduct)

        const question = await makeQuestion({
            productId: otherProduct.id,
            authorId: clientUser.id,
            content: "What is the price on the promotion?"
        })

        await inMemoryQuestionRepository.create(question)

        const result = await sut.execute({
            authorId: sellerUser.id.toString(),
            productId: product.id.toString(),
            questionId: question.id.toString(),
            content: "The price is R$ 1300,00"
        })

        expect(result).toBeLeft()
    })
})
