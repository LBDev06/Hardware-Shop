import { Cart } from "../../enterprise/entities/cart";

export interface CartRepository {
    save(cart: Cart): Promise<void>
    findByExistingCart(userId: string): Promise<Cart | null>
}