import { InMemoryQuestionRepository } from "test/repo/in-memory-question-repository"
import { InMemoryProductsRepository } from "test/repo/in-memory-product-repository"
import { CreateQuestionUseCase } from "./create-question"
import { beforeEach, describe, it, expect } from "vitest"
import { makeUser } from "test/factories/makeUser"
import { Role } from "../../enterprise/value-objects/role"
import { InMemoryUsersRepository } from "test/repo/in-memory-users-repository"
import { makeProduct } from "test/factories/makeProduct"
import { randomUUID } from "node:crypto"

let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryCommentRepository: InMemoryQuestionRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let sut: CreateQuestionUseCase

describe('Create Comment Use Case', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUsersRepository()
        inMemoryCommentRepository = new InMemoryQuestionRepository()
        inMemoryProductsRepository = new InMemoryProductsRepository()
        sut = new CreateQuestionUseCase(inMemoryCommentRepository, inMemoryProductsRepository)
    })

    it('should be able to create a question on a product', async () => {
        const user = await makeUser({
            role: Role.fromString('seller')
        })

        await inMemoryUserRepository.create(user)

        const product = await makeProduct({
            authorId: user.id
        })

        await inMemoryProductsRepository.create(product)

        const result = await sut.execute({
            authorId: user.id.toString(),
            productId: product.id.toString(),
            content: 'Comentário teste'
        })

        expect(result).toBeRight()
    })


    it('should be able to create a question on a non-existent product', async () => {
        const user = await makeUser({
            role: Role.fromString('seller')
        })

        await inMemoryUserRepository.create(user)

        const product = await makeProduct({
            authorId: user.id
        })

        await inMemoryProductsRepository.create(product)

        const result = await sut.execute({
            authorId: user.id.toString(),
            productId: randomUUID(),
            content: 'Comentário teste'
        })

        expect(result).toBeLeft
    })
})
