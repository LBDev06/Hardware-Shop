import { CartProduct } from "./cart-product";
import { WatchedList } from "@/core/entities/watched-list";

export class CartProductList extends WatchedList<CartProduct> {
    compareItems(a: CartProduct, b: CartProduct): boolean {
        return a.productId === b.productId
    }

}