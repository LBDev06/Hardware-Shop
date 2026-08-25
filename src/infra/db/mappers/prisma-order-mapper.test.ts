import { describe, expect, it } from "vitest";
import { PrismaOrderMapper } from "./prisma-order-mapper";
import { makeOrder } from "test/factories/make-order";
import { makeOrderItem } from "test/factories/make-order-item";
import { UniqueEntityId } from "@/core/unique-entity-id";

describe("PrismaOrderMapper", () => {
  it("should map domain Order to Prisma Order object", () => {
    const order = makeOrder({
      status: "PENDING",
      createdAt: new Date("2026-08-25T10:00:00Z"),
    });

    const prismaOrder = PrismaOrderMapper.toPrisma(order);

    expect(prismaOrder).toEqual({
      id: order.id.toString(),
      status: "PENDING",
      createdAt: new Date("2026-08-25T10:00:00Z"),
    });
  });

  it("should map raw Prisma Order with items to domain Order entity", () => {
    const raw = {
      id: "order-1",
      status: "CONFIRMED" as const,
      createdAt: new Date("2026-08-25T10:00:00Z"),
      items: [
        {
          id: "item-1",
          orderId: "order-1",
          clientId: "client-1",
          productId: "product-1",
          productName: "Intel i9 14900K",
          quantity: 2,
          price: 3500,
        },
      ],
    };

    const order = PrismaOrderMapper.toDomain(raw);

    expect(order.id.toString()).toBe("order-1");
    expect(order.status).toBe("CONFIRMED");
    expect(order.createdAt).toEqual(new Date("2026-08-25T10:00:00Z"));
    expect(order.items).toHaveLength(1);
    expect(order.items[0].id.toString()).toBe("item-1");
    expect(order.items[0].clientId.toString()).toBe("client-1");
    expect(order.items[0].productId.toString()).toBe("product-1");
    expect(order.items[0].productName).toBe("Intel i9 14900K");
    expect(order.items[0].quantity).toBe(2);
    expect(order.items[0].price).toBe(3500);
    expect(order.totalValue).toBe(7000);
  });
});
