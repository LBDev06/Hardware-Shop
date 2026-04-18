import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCartRepository } from "test/repo/in-memory-cart-repository";
import { InMemoryUsersRepository } from "test/repo/in-memory-users-repository";
import { DeleteProductFromCartUseCase } from "./delete-product-from-cart";
import { UniqueEntityId } from "@/core/unique-entity-id";
import { makeUser } from "test/factories/makeUser";
import { Cart } from "../../enterprise/entities/cart";
import { CartProduct } from "../../enterprise/entities/cart-product";

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryCartRepository: InMemoryCartRepository
let sut: DeleteProductFromCartUseCase

describe('Delete Product From Cart Use Case', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryCartRepository = new InMemoryCartRepository()
        sut = new DeleteProductFromCartUseCase(inMemoryUsersRepository, inMemoryCartRepository)
    })

    it('should be able to delete a product from the cart', async () => {
        const user = await makeUser({})
        await inMemoryUsersRepository.create(user)

        const cart = Cart.create({
            userId: user.id
        })

        const cartProduct = CartProduct.create({
            productId: new UniqueEntityId('product-1'),
            price: 1000,
            quantity: 2
        })

        cart.addItem(cartProduct)
        await inMemoryCartRepository.save(cart)

        const result = await sut.execute({
            userId: user.id.toString(),
            productId: 'product-1'
        })

        expect(result).toBeRight()
        expect(inMemoryCartRepository.carts[0].items.getItems()).toHaveLength(0)
    })

    it('should not be able to delete a product from non-existing user', async () => {
        const result = await sut.execute({
            userId: 'invalid-user',
            productId: 'product-1'
        })

        expect(result).toBeLeft()
    })
})
