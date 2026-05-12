import { UniqueEntityId } from "@/core/unique-entity-id";
import { OrderItem } from "@/domain/payment/enterprise/entities/order-item";

export function makeOrderItem(
    override: Partial<{
        productId: UniqueEntityId
        productName: string
        quantity: number
        price: number
    }> = {},
    id?: UniqueEntityId
) {
    return OrderItem.create({
        productId: override.productId ?? new UniqueEntityId(),
        productName: override.productName ?? 'RTX 3060',
        quantity: override.quantity ?? 1,
        price: override.price ?? 1300,
    }, id)
}