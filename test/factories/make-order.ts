import { Order, OrderProps } from "@/domain/payment/enterprise/entities/order"
import { UniqueEntityId } from "@/core/unique-entity-id"
import { makeOrderItem } from "./make-order-item"

export function makeOrder(
    override: Partial<OrderProps> = {},
    id?: UniqueEntityId
) {
    const order = Order.create(
        {
            items: override.items ?? [makeOrderItem()],
            ...override,
        },
        id
    )

    return order
}
