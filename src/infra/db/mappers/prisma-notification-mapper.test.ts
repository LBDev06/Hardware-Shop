import { describe, expect, it } from "vitest";
import { PrismaNotificationMapper } from "./prisma-notification-mapper";
import { makeNotification } from "test/factories/make-notification";
import { UniqueEntityId } from "@/core/unique-entity-id";

describe("PrismaNotificationMapper", () => {
  it("should map domain Notification to Prisma Notification object", () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId("recipient-1"),
      title: "Nova pergunta",
      content: "Qual o tamanho do cabo?",
      eventType: "QUESTION_CREATED",
    });

    const prismaNotification = PrismaNotificationMapper.toPrisma(notification);

    expect(prismaNotification).toEqual({
      id: notification.id.toString(),
      recipientId: "recipient-1",
      title: "Nova pergunta",
      content: "Qual o tamanho do cabo?",
      eventType: "QUESTION_CREATED",
      createdAt: notification.createdAt,
    });
  });

  it("should map raw Prisma Notification to domain Notification entity", () => {
    const raw = {
      id: "notification-1",
      recipientId: "recipient-1",
      title: "Nova pergunta",
      content: "Qual o tamanho do cabo?",
      eventType: "QUESTION_CREATED" as const,
      createdAt: new Date("2026-08-15T18:00:00Z"),
    };

    const notification = PrismaNotificationMapper.toDomain(raw);

    expect(notification.id.toString()).toBe("notification-1");
    expect(notification.recipientId.toString()).toBe("recipient-1");
    expect(notification.title).toBe("Nova pergunta");
    expect(notification.content).toBe("Qual o tamanho do cabo?");
    expect(notification.eventType).toBe("QUESTION_CREATED");
    expect(notification.createdAt).toEqual(new Date("2026-08-15T18:00:00Z"));
  });
});
