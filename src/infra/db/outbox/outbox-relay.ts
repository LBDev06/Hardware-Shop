import { DomainEvents } from "@/core/events/domain-events";
import { db } from "../libs/prisma";
import { OutboxEventMapper } from "./outbox-event-mapper";

export class OutboxRelay {
  private timer: NodeJS.Timeout | null = null;

  async publishPendingEvents(batchSize = 20): Promise<number> {
    const pendingEvents = await db.outbox.findMany({
      where: {
        publishedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: batchSize,
    });

    let publishedCount = 0;

    for (const rawOutbox of pendingEvents) {
      const domainEvent = OutboxEventMapper.toDomainEvent(rawOutbox);

      if (domainEvent) {
        DomainEvents.dispatch(domainEvent);
      }

      await db.outbox.update({
        where: {
          id: rawOutbox.id,
        },
        data: {
          publishedAt: new Date(),
        },
      });

      publishedCount++;
    }

    return publishedCount;
  }

  start(intervalMs = 5000): void {
    if (this.timer) return;

    this.timer = setInterval(async () => {
      try {
        await this.publishPendingEvents();
      } catch (error) {
        console.error("Error processing outbox events:", error);
      }
    }, intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const outboxRelay = new OutboxRelay();
