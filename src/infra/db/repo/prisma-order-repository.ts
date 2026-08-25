import { DomainEvents } from "@/core/events/domain-events";
import { OrderRepository } from "@/domain/payment/app/repo/order-repository";
import { Order } from "@/domain/payment/enterprise/entities/order";
import { db } from "../libs/prisma";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { OutboxEventMapper } from "../outbox/outbox-event-mapper";

export class PrismaOrderRepository implements OrderRepository {
  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await db.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          ...data,
          items: {
            create: order.items.map((item) => ({
              id: item.id.toString(),
              clientId: item.clientId.toString(),
              productId: item.productId.toString(),
              productName: item.productName,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      for (const event of order.domainEvents) {
        const outboxData = OutboxEventMapper.toOutbox(event);
        await tx.outbox.create({
          data: outboxData,
        });
      }
    });

    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await db.$transaction(async (tx) => {
      await tx.order.upsert({
        where: {
          id: order.id.toString(),
        },
        create: {
          ...data,
          items: {
            create: order.items.map((item) => ({
              id: item.id.toString(),
              clientId: item.clientId.toString(),
              productId: item.productId.toString(),
              productName: item.productName,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        update: {
          status: order.status,
        },
      });

      for (const event of order.domainEvents) {
        const outboxData = OutboxEventMapper.toOutbox(event);
        await tx.outbox.create({
          data: outboxData,
        });
      }
    });

    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async findById(id: string): Promise<Order | null> {
    const order = await db.order.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
      },
    });

    if (!order) return null;

    return PrismaOrderMapper.toDomain(order);
  }

  async findManyOrdersByClientId(clientId: string): Promise<Order[] | null> {
    const orders = await db.order.findMany({
      where: {
        items: {
          some: {
            clientId,
          },
        },
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (orders.length === 0) return null;

    return orders.map(PrismaOrderMapper.toDomain);
  }

  async findManyPendingOrdersByProductIds(productIds: string[]): Promise<Order[]> {
    const orders = await db.order.findMany({
      where: {
        status: "PENDING",
        items: {
          some: {
            productId: {
              in: productIds,
            },
          },
        },
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders.map(PrismaOrderMapper.toDomain);
  }

  async findManyConfirmedOrdersByProductIds(productIds: string[]): Promise<Order[]> {
    const orders = await db.order.findMany({
      where: {
        status: "CONFIRMED",
        items: {
          some: {
            productId: {
              in: productIds,
            },
          },
        },
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders.map(PrismaOrderMapper.toDomain);
  }
}
