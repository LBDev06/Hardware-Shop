import { beforeEach, describe, expect, it, vi } from "vitest";
import { PrismaOrderRepository } from "./prisma-order-repository";
import { makeOrder } from "test/factories/make-order";
import { makeOrderItem } from "test/factories/make-order-item";
import { db } from "../libs/prisma";
import { UniqueEntityId } from "@/core/unique-entity-id";

describe("PrismaOrderRepository", () => {
  let sut: PrismaOrderRepository;

  beforeEach(() => {
    sut = new PrismaOrderRepository();
    vi.restoreAllMocks();
  });

  it("should create an order in database with outbox and dispatch domain events", async () => {
    const item = makeOrderItem({
      clientId: new UniqueEntityId("client-1"),
      productId: new UniqueEntityId("product-1"),
      productName: "RTX 4090",
      quantity: 1,
      price: 15000,
    });
    const order = makeOrder({
      items: [item],
    });

    const createSpy = vi.fn().mockResolvedValue({
      id: order.id.toString(),
      status: "PENDING",
      createdAt: order.createdAt,
    });

    const outboxSpy = vi.fn().mockResolvedValue({
      id: "outbox-1",
    });

    vi.spyOn(db, "$transaction").mockImplementation(async (callback: any) => {
      return callback({
        order: { create: createSpy },
        outbox: { create: outboxSpy },
      });
    });

    await sut.create(order);

    expect(createSpy).toHaveBeenCalledWith({
      data: {
        id: order.id.toString(),
        status: "PENDING",
        createdAt: order.createdAt,
        items: {
          create: [
            {
              id: item.id.toString(),
              clientId: "client-1",
              productId: "product-1",
              productName: "RTX 4090",
              quantity: 1,
              price: 15000,
            },
          ],
        },
      },
    });
    expect(outboxSpy).toHaveBeenCalled();
  });

  it("should find an order by id", async () => {
    vi.spyOn(db.order, "findUnique").mockResolvedValue({
      id: "order-1",
      status: "PENDING",
      createdAt: new Date(),
      items: [
        {
          id: "item-1",
          orderId: "order-1",
          clientId: "client-1",
          productId: "product-1",
          productName: "RTX 4090",
          quantity: 1,
          price: 15000,
        },
      ],
    } as any);

    const order = await sut.findById("order-1");

    expect(order).not.toBeNull();
    expect(order?.id.toString()).toBe("order-1");
    expect(order?.items).toHaveLength(1);
    expect(order?.items[0].productName).toBe("RTX 4090");
  });

  it("should return null if order is not found by id", async () => {
    vi.spyOn(db.order, "findUnique").mockResolvedValue(null);

    const order = await sut.findById("non-existing");

    expect(order).toBeNull();
  });

  it("should find many orders by clientId", async () => {
    vi.spyOn(db.order, "findMany").mockResolvedValue([
      {
        id: "order-1",
        status: "PENDING",
        createdAt: new Date(),
        items: [
          {
            id: "item-1",
            orderId: "order-1",
            clientId: "client-1",
            productId: "product-1",
            productName: "RTX 4090",
            quantity: 1,
            price: 15000,
          },
        ],
      },
    ] as any);

    const orders = await sut.findManyOrdersByClientId("client-1");

    expect(orders).toHaveLength(1);
    expect(orders?.[0].id.toString()).toBe("order-1");
  });

  it("should find pending orders by product ids", async () => {
    vi.spyOn(db.order, "findMany").mockResolvedValue([
      {
        id: "order-1",
        status: "PENDING",
        createdAt: new Date(),
        items: [
          {
            id: "item-1",
            orderId: "order-1",
            clientId: "client-1",
            productId: "product-1",
            productName: "RTX 4090",
            quantity: 1,
            price: 15000,
          },
        ],
      },
    ] as any);

    const orders = await sut.findManyPendingOrdersByProductIds(["product-1"]);

    expect(orders).toHaveLength(1);
    expect(orders[0].status).toBe("PENDING");
  });

  it("should find confirmed orders by product ids", async () => {
    vi.spyOn(db.order, "findMany").mockResolvedValue([
      {
        id: "order-1",
        status: "CONFIRMED",
        createdAt: new Date(),
        items: [
          {
            id: "item-1",
            orderId: "order-1",
            clientId: "client-1",
            productId: "product-1",
            productName: "RTX 4090",
            quantity: 1,
            price: 15000,
          },
        ],
      },
    ] as any);

    const orders = await sut.findManyConfirmedOrdersByProductIds(["product-1"]);

    expect(orders).toHaveLength(1);
    expect(orders[0].status).toBe("CONFIRMED");
  });
});
