import { UniqueEntityId } from "@/core/unique-entity-id";
import { Order } from "@/domain/payment/enterprise/entities/order";
import { OrderItem } from "@/domain/payment/enterprise/entities/order-item";
import {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
} from "generated/prisma";

type PrismaOrderWithItems = PrismaOrder & {
  items: PrismaOrderItem[];
};

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrderWithItems): Order {
    const items = raw.items.map((item) =>
      OrderItem.create(
        {
          clientId: new UniqueEntityId(item.clientId),
          productId: new UniqueEntityId(item.productId),
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
        },
        new UniqueEntityId(item.id)
      )
    );

    return Order.create(
      {
        items,
        status: raw.status as "PENDING" | "CONFIRMED" | "CANCELED",
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(order: Order) {
    return {
      id: order.id.toString(),
      status: order.status,
      createdAt: order.createdAt,
    };
  }
}
