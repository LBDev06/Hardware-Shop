import { UniqueEntityId } from "@/core/unique-entity-id";
import { EventType } from "@/domain/notification/app/events-types";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { Notification as PrismaNotification, EventType as PrismaEventType } from "generated/prisma";

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        recipientId: new UniqueEntityId(raw.recipientId),
        title: raw.title,
        content: raw.content,
        eventType: raw.eventType as EventType,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(notification: Notification): PrismaNotification {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      content: notification.content,
      eventType: notification.eventType as PrismaEventType,
      createdAt: notification.createdAt,
    };
  }
}
