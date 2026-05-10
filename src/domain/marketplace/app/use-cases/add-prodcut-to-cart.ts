import { Either } from "@/core/either"
import { Cart } from "../../enterprise/entities/cart"
import { CartProduct } from "../../enterprise/entities/cart-product";
import { CartRepository } from "../repo/cart-repository"
import { ProductRepository } from "../repo/product-repository";
import { UniqueEntityId } from "@/core/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { left, right } from "@/core/either";

interface AddProductToCartUseCaseRequest {
    userId: string;
    productId: string;
    quantity: number;
}

type AddProductToCartUseCaseResponse = Either<ResourceNotFoundError, { cart: Cart }>

export class AddProductToCartUseCase {
    constructor(
        private cartRepository: CartRepository,
        private productRepository: ProductRepository
    ) { }

    async execute({
        userId,
        productId,
        quantity
    }: AddProductToCartUseCaseRequest): Promise<AddProductToCartUseCaseResponse> {

        let cart = await this.cartRepository.findByExistingCart(userId)

        if (!cart) {
            cart = Cart.create({
                userId: new UniqueEntityId(userId)
            })
        }

        const product = await this.productRepository.findById(productId)

        if (!product) {
            return left(new ResourceNotFoundError())
        }

        const cartProduct = CartProduct.create({
            productId: new UniqueEntityId(productId),
            quantity,
            price: product.price,
            name: product.name
        })

        cart.addItem(cartProduct)

        await this.cartRepository.save(cart)

        return right({ cart })
    }
}