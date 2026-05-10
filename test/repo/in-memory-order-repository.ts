import { OrderRepository } from '../../src/domain/payment/app/repo/order-repository';
import { Order } from '../../src/domain/payment/enterprise/order';

export class InMemoryOrderRepository implements OrderRepository {
    public items: Order[] = [];

    async create(order: Order): Promise<void> {
        this.items.push(order);
    }

    async save(order: Order): Promise<void> {
        const index = this.items.findIndex((o) => o.id.equals(order.id));
        if (index >= 0) {
            this.items[index] = order;
        }
    }
}
