import { InMemoryUsersRepository } from "../../../../../test/repo/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryProductsRepository } from "test/repo/in-memory-product-repository";
import { makeUser } from "test/factories/makeUser";
import { EditProductUseCase } from "./edit-product";
import { makeProduct } from "test/factories/makeProduct";
import { UniqueEntityId } from "@/core/unique-entity-id";
import { InMemoryProductAttachmentRepository } from "test/repo/in-memory-product-attachment-repository";
import { makeProductAttachment } from "test/factories/make-product-attachment";

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryProductAttachmentRepository: InMemoryProductAttachmentRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let sut: EditProductUseCase

describe('Create Product Use Case', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryProductsRepository = new InMemoryProductsRepository()
        inMemoryProductAttachmentRepository = new InMemoryProductAttachmentRepository()
        sut = new EditProductUseCase(inMemoryUsersRepository, inMemoryProductAttachmentRepository, inMemoryProductsRepository)
    })

    it('should be able to edit a product.', async () => {
        const user = await makeUser({})

        const product = makeProduct({
            authorId: user.id,
        })

        await inMemoryUsersRepository.create(user)
        await inMemoryProductsRepository.create(product)
        await inMemoryProductAttachmentRepository.products.push(
            makeProductAttachment({
                productId: product.id,
                attachmentId: new UniqueEntityId('1')
            }),
            makeProductAttachment({
                productId: product.id,
                attachmentId: new UniqueEntityId('2')
            })
        )

        const editProduct = await sut.execute({
            authorId: user.id.toString(),
            productId: product.id.toString(),
            category: 'GPU',
            specs: {
                vram: 8,
                tdp: 100,
                interface: 'PCIe 4.0',
                memoryType: 'GDDR6',
            },
            attachmentsIds: ['1', '3']
        })

        expect(editProduct).toBeRight()
        expect(inMemoryProductsRepository.products[0].attachments.currentItems).toHaveLength(2)

    })

    it('should not be able to edit a product with invalid user id.', async () => {
        const user = await makeUser({})

        const product = makeProduct({
            authorId: new UniqueEntityId()
        })

        await inMemoryUsersRepository.create(user)
        await inMemoryProductsRepository.create(product)

        const editProduct = await sut.execute({
            authorId: user.id.toString(),
            productId: product.id.toString(),
            category: 'GPU',
            specs: {
                vram: 8,
                tdp: 100,
                interface: 'PCIe 4.0',
                memoryType: 'GDDR6',
            },
            attachmentsIds: ['1', '3']

        })

        expect(editProduct).toBeLeft()
    })

    it('should not be able to edit a category field without editing specs field.', async () => {
        const user = await makeUser({})

        const product = makeProduct({
            authorId: user.id
        })

        await inMemoryUsersRepository.create(user)
        await inMemoryProductsRepository.create(product)

        const editProduct = await sut.execute({
            authorId: user.id.toString(),
            productId: product.id.toString(),
            category: 'CPU',
            attachmentsIds: ['1', '3']
        })

        expect(editProduct).toBeLeft()
    })

})
