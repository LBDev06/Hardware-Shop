import { CartRepository } from "@/domain/marketplace/app/repo/cart-repository";
import { Cart } from "@/domain/marketplace/enterprise/entities/cart";

export class InMemoryCartRepository implements CartRepository {
    public carts: Cart[] = []

    async save(cart: Cart): Promise<void> {
        const index = this.carts.findIndex(c => c.id.toString() === cart.id.toString())
        if (index !== -1) {
            this.carts[index] = cart
        } else {
            this.carts.push(cart)
        }
    }

    async findByExistingCart(userId: string) {
        const cartFound = this.carts.find(cart => cart.userId.toString() === userId)

        return cartFound ?? null
    }
}
