import { Order } from "../../enterprise/entities/order"

export interface OrderRepository {
    create(order: Order): Promise<void>
    save(order: Order): Promise<void>
    findById(id: string): Promise<Order | null>
    findManyOrdersByClientId(clientId: string): Promise<Order[] | null>
}