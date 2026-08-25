import { describe, expect, it } from "vitest";
import { OrderPresenter } from "./order-presenter";
import { makeOrder } from "test/factories/make-order";
import { makeOrderItem } from "test/factories/make-order-item";
import { UniqueEntityId } from "@/core/unique-entity-id";

describe("OrderPresenter", () => {
  it("should transform domain Order to HTTP response structure", () => {
    const item = makeOrderItem({
      clientId: new UniqueEntityId("client-1"),
      productId: new UniqueEntityId("product-1"),
      productName: "AMD Ryzen 7 7800X3D",
      quantity: 2,
      price: 2500,
    });
    const order = makeOrder({
      status: "PENDING",
      createdAt: new Date("2026-08-25T12:00:00Z"),
      items: [item],
    });

    const httpResponse = OrderPresenter.toHTTP(order);

    expect(httpResponse).toEqual({
      id: order.id.toString(),
      status: "PENDING",
      totalValue: 5000,
      createdAt: new Date("2026-08-25T12:00:00Z").toISOString(),
      items: [
        {
          id: item.id.toString(),
          clientId: "client-1",
          productId: "product-1",
          productName: "AMD Ryzen 7 7800X3D",
          quantity: 2,
          price: 2500,
        },
      ],
    });
  });
});
