import { Cart } from "@/domain/marketplace/enterprise/entities/cart";

export class CartPresenter {
  static toHTTP(cart: Cart) {
    return {
      id: cart.id.toString(),
      items: cart.items.getItems().map((item) => ({
        productId: item.productId.toString(),
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalQuantity: cart.getTotalQuantity,
      totalValue: cart.totalValue,
    };
  }
}
