import { OrderRepository } from '../../src/domain/payment/app/repo/order-repository';
import { Order } from '../../src/domain/payment/enterprise/entities/order';
import { DomainEvents } from '@/core/events/domain-events';

export class InMemoryOrderRepository implements OrderRepository {
    public items: Order[] = [];

    async create(order: Order): Promise<void> {
        this.items.push(order);
        DomainEvents.dispatchEventsForAggregate(order.id);
    }

    async save(order: Order): Promise<void> {
        const index = this.items.findIndex((o) => o.id.equals(order.id));
        if (index >= 0) {
            this.items[index] = order;
        }
        DomainEvents.dispatchEventsForAggregate(order.id);
    }

    async findById(id: string): Promise<Order | null> {
        const order = this.items.find((o) => o.id.toString() === id);

        if (!order) {
            return null;
        }

        return order;
    }

    async findManyOrdersByClientId(clientId: string): Promise<Order[] | null> {
        const orders = this.items.filter((o) => o.items.find((item) => item.clientId.toString() === clientId))

        if (!orders) {
            return null;
        }

        return orders;
    }
}
