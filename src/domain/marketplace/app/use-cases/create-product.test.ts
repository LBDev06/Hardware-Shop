import { InMemoryUsersRepository } from "../../../../../test/repo/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryProductsRepository } from "test/repo/in-memory-product-repository";
import { CreateProductUseCase } from "./create-product";
import { makeUser } from "test/factories/makeUser";
import { Role } from "../../enterprise/value-objects/role";

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let sut: CreateProductUseCase

describe('Create Product Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new CreateProductUseCase(inMemoryUsersRepository, inMemoryProductsRepository)
  })

  it('should be able to create a product', async () => {
    const user = await makeUser({
      role: Role.fromString('seller')
    })

    await inMemoryUsersRepository.create(user)

    const CreateProduct = await sut.execute({
      userId: user.id.toString(),
      name: 'RTX 3060',
      price: 1300,
      stock: 10,
      description: 'Placa de vídeo de excelente custo-benefício para Full HD.',
      category: 'GPU',
      specs: {
        vram: 12,
        tdp: 170,
        interface: 'PCIe 4.0',
      },
      attachmentsIds: ['1', '2']
    })

    expect(CreateProduct).toBeRight()
    expect(inMemoryProductsRepository.products).toHaveLength(1)
    expect(inMemoryProductsRepository.products[0].attachments).toHaveLength(2)
  })


  it('should be not able to create a product with invalid role.', async () => {
    const user = await makeUser({})

    await inMemoryUsersRepository.create(user)

    const CreateProduct = await sut.execute({
      userId: user.id.toString(),
      name: 'RTX 3060',
      price: 1300,
      stock: 10,
      description: 'Placa de vídeo de excelente custo-benefício para Full HD.',
      category: 'GPU',
      specs: {
        vram: 12,
        tdp: 170,
        interface: 'PCIe 4.0',
      },
      attachmentsIds: ['1', '2']
    })

    expect(CreateProduct).toBeLeft()
  })

})
