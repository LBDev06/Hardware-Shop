import { Entity } from "@/core/entity";
import { UniqueEntityId } from "@/core/unique-entity-id";

interface CartProductProps {
    productId: UniqueEntityId;
    quantity: number;
    price: number;
}

export class CartProduct extends Entity<CartProductProps> {
    get productId() {
        return this.props.productId
    }

    get quantity() {
        return this.props.quantity
    }

    get price() {
        return this.props.price
    }

    updateQuantity(quantity: number) {
        this.props.quantity = quantity
    }

    updatePrice(price: number) {
        this.props.price = price
    }

    static create(props: CartProductProps, id?: UniqueEntityId) {
        const cartItem = new CartProduct(
            {
                ...props,
            },
            id,
        )

        return cartItem
    }


}