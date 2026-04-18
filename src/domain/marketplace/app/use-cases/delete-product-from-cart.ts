import { CartRepository } from "../repo/cart-repository";
import { Either, left, right } from "@/core/either";
import { UsersRepository } from "../repo/users-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface DeleteProductFromCartUseCaseRequest {
    productId: string
    userId: string
}

type DeleteProductFromCartUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteProductFromCartUseCase {
    constructor(
        private usersRepository: UsersRepository,
        private cartRepository: CartRepository) { }

    async execute({
        userId,
        productId
    }: DeleteProductFromCartUseCaseRequest): Promise<DeleteProductFromCartUseCaseResponse> {
        const user = await this.usersRepository.findById(userId)

        if (!user) {
            return left(new ResourceNotFoundError())
        }

        const cart = await this.cartRepository.findByExistingCart(user.id.toString())

        if (!cart) {
            return left(new ResourceNotFoundError())
        }

        cart.removeItem(productId)
        await this.cartRepository.save(cart)

        return right({})
    }
}