import { beforeEach, describe, expect, it, vi } from "vitest";
import { PrismaNotificationRepository } from "./prisma-notification-repository";
import { makeNotification } from "test/factories/make-notification";
import { db } from "../libs/prisma";
import { UniqueEntityId } from "@/core/unique-entity-id";

describe("PrismaNotificationRepository", () => {
  let sut: PrismaNotificationRepository;

  beforeEach(() => {
    sut = new PrismaNotificationRepository();
    vi.restoreAllMocks();
  });

  it("should create a notification in database", async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId("recipient-1"),
      title: "Nova pergunta",
      content: "Qual o tamanho do cabo?",
      eventType: "QUESTION_CREATED",
    });

    const createSpy = vi.spyOn(db.notification, "create").mockResolvedValue({
      id: notification.id.toString(),
      recipientId: "recipient-1",
      title: "Nova pergunta",
      content: "Qual o tamanho do cabo?",
      eventType: "QUESTION_CREATED",
      createdAt: notification.createdAt,
    });

    await sut.create(notification);

    expect(createSpy).toHaveBeenCalledWith({
      data: {
        id: notification.id.toString(),
        recipientId: "recipient-1",
        title: "Nova pergunta",
        content: "Qual o tamanho do cabo?",
        eventType: "QUESTION_CREATED",
        createdAt: notification.createdAt,
      },
    });
  });

  it("should find notifications by recipientId with optional eventType filter", async () => {
    const findManySpy = vi.spyOn(db.notification, "findMany").mockResolvedValue([
      {
        id: "notification-1",
        recipientId: "recipient-1",
        title: "Nova pergunta",
        content: "Qual o tamanho do cabo?",
        eventType: "QUESTION_CREATED",
        createdAt: new Date(),
      },
    ]);

    const result = await sut.findMany("recipient-1", {
      eventType: "QUESTION_CREATED",
    });

    expect(findManySpy).toHaveBeenCalledWith({
      where: {
        recipientId: "recipient-1",
        eventType: "QUESTION_CREATED",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    expect(result).toHaveLength(1);
    expect(result[0].id.toString()).toBe("notification-1");
  });
});
