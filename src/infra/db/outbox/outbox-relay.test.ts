import { beforeEach, describe, expect, it, vi } from "vitest";
import { OutboxRelay } from "./outbox-relay";
import { db } from "../libs/prisma";
import { DomainEvents } from "@/core/events/domain-events";
import { QuestionCreatedEvent } from "@/domain/marketplace/enterprise/events/question-created-event";

describe("OutboxRelay", () => {
  let sut: OutboxRelay;

  beforeEach(() => {
    sut = new OutboxRelay();
    DomainEvents.clearHandlers();
    vi.restoreAllMocks();
  });

  it("should process pending outbox events and dispatch them to handlers", async () => {
    const rawOutbox = {
      id: "outbox-1",
      aggregateId: "question-1",
      eventType: "QuestionCreatedEvent",
      payload: {
        id: "question-1",
        authorId: "author-1",
        productId: "product-1",
        content: "Funciona no Linux?",
        createdAt: new Date().toISOString(),
      },
      publishedAt: null,
      createdAt: new Date(),
    };

    vi.spyOn(db.outbox, "findMany").mockResolvedValue([rawOutbox]);
    const updateSpy = vi.spyOn(db.outbox, "update").mockResolvedValue({
      ...rawOutbox,
      publishedAt: new Date(),
    });

    const handler = vi.fn();
    DomainEvents.register(handler, QuestionCreatedEvent.name);

    const count = await sut.publishPendingEvents();

    expect(count).toBe(1);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith({
      where: {
        id: "outbox-1",
      },
      data: {
        publishedAt: expect.any(Date),
      },
    });
  });
});
