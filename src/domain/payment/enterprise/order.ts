import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityId } from "@/core/unique-entity-id";
import { OrderItem } from "./order-item";

export interface OrderProps {
    items: OrderItem[];
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELED';
    createdAt?: Date;
}

export class Order extends AggregateRoot<OrderProps> {
    get items() {
        return this.props.items
    }

    get totalValue() {
        return this.props.items.reduce((acc, item) => {
            return acc + (item.price * item.quantity)
        }, 0)
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
        return order
    }

}