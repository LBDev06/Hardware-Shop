import { Order } from "../../enterprise/order"

export interface OrderRepository {
    create(order: Order): Promise<void>
    save(order: Order): Promise<void>
}