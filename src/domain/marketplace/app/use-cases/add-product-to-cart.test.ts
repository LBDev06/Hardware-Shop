import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCartRepository } from "test/repo/in-memory-cart-repository";
import { InMemoryProductsRepository } from "test/repo/in-memory-product-repository";
import { AddProductToCartUseCase } from "./add-prodcut-to-cart";
import { UniqueEntityId } from "@/core/unique-entity-id";
import { makeProduct } from "test/factories/makeProduct";

let inMemoryCartRepository: InMemoryCartRepository
let inMemoryProductRepository: InMemoryProductsRepository
let sut: AddProductToCartUseCase

describe('Add Product To Cart Use Case', () => {
  beforeEach(() => {
    inMemoryCartRepository = new InMemoryCartRepository()
    inMemoryProductRepository = new InMemoryProductsRepository()
    sut = new AddProductToCartUseCase(inMemoryCartRepository, inMemoryProductRepository)
  })

  it('should be able to add a product to the cart', async () => {
    const product = makeProduct({ price: 1300 },
      new UniqueEntityId('product-1'))

    inMemoryProductRepository.products.push(product)

    const result = await sut.execute({
      userId: 'user-1',
      productId: 'product-1',
      quantity: 2
    })

    expect(result).toBeRight()
    expect(inMemoryCartRepository.carts).toHaveLength(1)
    expect(inMemoryCartRepository.carts[0].userId.toString()).toBe('user-1')
    expect(inMemoryCartRepository.carts[0].getTotalQuantity).toBe(2)
    expect(inMemoryCartRepository.carts[0].items.getItems()).toHaveLength(1)
    expect(inMemoryCartRepository.carts[0].totalValue).toBe(2600)
  })

  it('should be able to add a product to the cart and update the quantity if the product already exists', async () => {
    const product = makeProduct({ price: 1300 }, new UniqueEntityId('product-1'))
    inMemoryProductRepository.products.push(product)

    await sut.execute({
      userId: 'user-1',
      productId: 'product-1',
      quantity: 2
    })

    const result = await sut.execute({
      userId: 'user-1',
      productId: 'product-1',
      quantity: 2
    })

    expect(result).toBeRight()
    expect(inMemoryCartRepository.carts).toHaveLength(1)
    expect(inMemoryCartRepository.carts[0].items.getItems()).toHaveLength(1)
    expect(inMemoryCartRepository.carts[0].getTotalQuantity).toBe(4)
    expect(inMemoryCartRepository.carts[0].totalValue).toBe(5200)
  })

  it('should not be able to add a non-existing product to the cart', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      productId: 'invalid-product-id',
      quantity: 2
    })

    expect(result).toBeLeft()
    expect(inMemoryCartRepository.carts).toHaveLength(0)
  })

  it('should be able to add multiple products to the cart', async () => {
    const product1 = makeProduct({ price: 1300 }, new UniqueEntityId('product-1'))
    const product2 = makeProduct({ price: 500 }, new UniqueEntityId('product-2'))

    inMemoryProductRepository.products.push(product1, product2)

    await sut.execute({
      userId: 'user-1',
      productId: 'product-1',
      quantity: 1
    })

    const result = await sut.execute({
      userId: 'user-1',
      productId: 'product-2',
      quantity: 3
    })

    expect(result).toBeRight()
    expect(inMemoryCartRepository.carts).toHaveLength(1)
    expect(inMemoryCartRepository.carts[0].items.getItems()).toHaveLength(2)
    expect(inMemoryCartRepository.carts[0].getTotalQuantity).toBe(4)
    expect(inMemoryCartRepository.carts[0].totalValue).toBe(2800)
  })
})
