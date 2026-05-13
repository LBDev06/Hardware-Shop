import { UniqueEntityId } from "@/core/unique-entity-id";
import { Entity } from "@/core/entity";

interface OrderItemProps {
    clientId: UniqueEntityId;
    productId: UniqueEntityId;
    productName: string;
    quantity: number;
    price: number;
}

export class OrderItem extends Entity<OrderItemProps> {
    get productId() {
        return this.props.productId
    }

    get clientId() {
        return this.props.clientId
    }

    get productName() {
        return this.props.productName
    }

    get quantity() {
        return this.props.quantity
    }

    get price() {
        return this.props.price
    }

    static create(props: OrderItemProps, id?: UniqueEntityId) {
        const orderItem = new OrderItem({
            ...props,
        }, id)

        return orderItem
    }
}