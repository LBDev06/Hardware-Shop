import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityId } from "@/core/unique-entity-id";
import { OrderItem } from "./order-item";
import { OrderCreatedEvent } from "../events/order-created-event";

export interface OrderProps {
    items: OrderItem[];
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELED';
    createdAt?: Date;
}

export class Order extends AggregateRoot<OrderProps> {
    get items() {
        return this.props.items
    }

    get productId() {
        return this.props.items.map((item) => item.productId.toString())
    }

    get productName() {
        return this.props.items.map((item) => item.productName)
    }

    get totalValue() {
        return this.props.items.reduce((acc, item) => {
            return acc + (item.price * item.quantity)
        }, 0)
    }

    get status() {
        return this.props.status
    }

    cancel() {
        this.props.status = 'CANCELED'
    }

    confirm() {
        this.props.status = 'CONFIRMED'
    }

    static create(props: OrderProps, id?: UniqueEntityId) {
        const order = new Order({
            ...props,
            status: props.status ?? 'PENDING',
            createdAt: props.createdAt ?? new Date(),
        }, id)

        const isNewOrder = !id

        if (isNewOrder) {
            order.addDomainEvent(new OrderCreatedEvent(order))
        }

        return order
    }

}