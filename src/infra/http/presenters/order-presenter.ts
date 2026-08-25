import { Order } from "@/domain/payment/enterprise/entities/order";

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      status: order.status,
      totalValue: order.totalValue,
      createdAt: order.createdAt?.toISOString(),
      items: order.items.map((item) => ({
        id: item.id.toString(),
        clientId: item.clientId.toString(),
        productId: item.productId.toString(),
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }
}
