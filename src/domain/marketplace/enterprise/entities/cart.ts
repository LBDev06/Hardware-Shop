import { CartProductList } from "./cart-product-list";
import { CartProduct } from "./cart-product";
import { UniqueEntityId } from "@/core/unique-entity-id";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { Optional } from "@/core/types/optional";

interface CartProps {
    id?: UniqueEntityId
    items: CartProductList
    userId: UniqueEntityId
}

export class Cart extends AggregateRoot<CartProps> {
    get items() {
        return this.props.items
    }

    get userId() {
        return this.props.userId
    }

    public addItem(newItem: CartProduct) {
        const alreadyExists = this.items.getItems().find(item => item.productId.toString() === newItem.productId.toString())

        if (alreadyExists) {
            alreadyExists.updateQuantity(alreadyExists.quantity + newItem.quantity)
            alreadyExists.updatePrice(newItem.price)
        } else {
            this.items.add(newItem)
        }
    }

    get getTotalQuantity() {
        return this.items.getItems().reduce((acc, item) => {
            return acc + item.quantity
        }, 0)
    }

    get totalValue() {
        return this.items.getItems().reduce((acc, item) => {
            return acc + (item.price * item.quantity)
        }, 0)
    }

    removeItem(productId: string) {
        const item = this.items.getItems().find(item => item.productId.toString() === productId)

        if (item) {
            this.items.remove(item)
        }
    }

    static create(props: Optional<CartProps, 'items'>, id?: UniqueEntityId) {
        return new Cart({
            ...props,
            items: props.items ?? new CartProductList([]),
        }, id)
    }

}