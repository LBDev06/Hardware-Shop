import { InMemoryQuestionRepository } from "test/repo/in-memory-question-repository"
import { beforeEach, describe, it, expect } from "vitest"
import { InMemoryAnswerQuestionsRepository } from "test/repo/in-memory-answer-questions-repository"
import { InMemoryUsersRepository } from "test/repo/in-memory-users-repository"
import { InMemoryProductsRepository } from "test/repo/in-memory-product-repository"
import { Role } from "../../enterprise/value-objects/role"
import { makeUser } from "test/factories/makeUser"
import { makeProduct } from "test/factories/makeProduct"
import { makeQuestion } from "test/factories/makeQuestion"
import { EditAnswerQuestionUseCase } from "./edit-answer-question"
import { makeAnswerQuestion } from "test/factories/makeAnswer"

let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let inMemoryAnswerQuestionsRepository: InMemoryAnswerQuestionsRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: EditAnswerQuestionUseCase

describe(' Edit Answer Question Use Case', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUsersRepository()
        inMemoryProductsRepository = new InMemoryProductsRepository()
        inMemoryAnswerQuestionsRepository = new InMemoryAnswerQuestionsRepository()
        inMemoryQuestionRepository = new InMemoryQuestionRepository()
        sut = new EditAnswerQuestionUseCase(inMemoryAnswerQuestionsRepository)
    })

    it('should be able to edit a answer question.', async () => {
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

        const answerQuestion = await makeAnswerQuestion({
            authorId: sellerUser.id,
            questionId: question.id,
            content: '$300'
        })

        await inMemoryAnswerQuestionsRepository.save(answerQuestion)

        const result = await sut.execute({
            authorId: sellerUser.id.toString(),
            answerId: answerQuestion.id.toString(),
            content: '$250'
        })

        expect(result).toBeRight()
        expect(inMemoryAnswerQuestionsRepository.answerQuestion[0]).toMatchObject({
            content: '$250'
        })
    })

    it('should not be able to edit a answer question if does not exist or not found.', async () => {
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

        const answerQuestion = await makeAnswerQuestion({
            questionId: question.id,
            content: '$300'
        })

        await inMemoryAnswerQuestionsRepository.save(answerQuestion)

        const result = await sut.execute({
            authorId: sellerUser.id.toString(),
            answerId: 'non-existing-answer-id',
            content: '$250'
        })

        expect(result).toBeLeft()
    })

    it('should not be able to edit a answer question if not is the author.', async () => {
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

        const answerQuestion = await makeAnswerQuestion({
            questionId: question.id,
            content: '$300'
        })

        await inMemoryAnswerQuestionsRepository.save(answerQuestion)

        const result = await sut.execute({
            authorId: sellerUser.id.toString(),
            answerId: answerQuestion.id.toString(),
            content: '$250'
        })

        expect(result).toBeLeft()
    })

})
