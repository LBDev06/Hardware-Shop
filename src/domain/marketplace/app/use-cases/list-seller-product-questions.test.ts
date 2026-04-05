import { InMemoryUsersRepository } from "test/repo/in-memory-users-repository";
import { InMemoryQuestionRepository } from "test/repo/in-memory-question-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { ListSellerProductQuestionsUseCase } from "./list-seller-product-questions";
import { makeUser } from "test/factories/makeUser";
import { Role } from "../../enterprise/value-objects/role";
import { makeQuestion } from "test/factories/makeQuestion";

let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: ListSellerProductQuestionsUseCase

describe('List Seller Product Questions Use Case', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUsersRepository()
        inMemoryQuestionRepository = new InMemoryQuestionRepository()
        sut = new ListSellerProductQuestionsUseCase(inMemoryUserRepository, inMemoryQuestionRepository)
    })

    it('should be able to list questions.', async () => {
        const sellerUser = await makeUser({
            role: Role.fromString('seller')
        })

        await inMemoryUserRepository.create(sellerUser)

        const question1 = await makeQuestion({
            authorId: sellerUser.id,
        })
        const question2 = await makeQuestion({
            authorId: sellerUser.id,
        })
        const question3 = await makeQuestion({
            authorId: sellerUser.id,
        })

        await inMemoryQuestionRepository.create(question1)
        await inMemoryQuestionRepository.create(question2)
        await inMemoryQuestionRepository.create(question3)

        const result = await sut.execute({
            userId: sellerUser.id.toString(),
            page: 1
        })

        expect(result).toBeRight()
        if (result.isRight()) {
            expect(result.value.questions).toHaveLength(3)
        }
    })

    it('should not be able to list questions if user does not exists.', async () => {
        const result = await sut.execute({
            userId: 'user-does-not-exist',
            page: 1
        })

        expect(result).toBeLeft()
    })

    it('should not be able to list questions if user is not a seller.', async () => {
        const clientUser = await makeUser({
            role: Role.fromString('client')
        })

        await inMemoryUserRepository.create(clientUser)

        const result = await sut.execute({
            userId: clientUser.id.toString(),
            page: 1
        })

        expect(result).toBeLeft()
    })
})
