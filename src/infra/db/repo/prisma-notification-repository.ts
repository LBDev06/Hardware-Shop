import { NotificationsRepository } from "@/domain/notification/app/repo/notification-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { EventType } from "@/domain/notification/app/events-types";
import { db } from "../libs/prisma";
import { PrismaNotificationMapper } from "../mappers/prisma-notification-mapper";

export class PrismaNotificationRepository implements NotificationsRepository {
  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await db.notification.create({
      data,
    });
  }

  async findMany(
    recipientId: string,
    options?: { eventType?: EventType }
  ): Promise<Notification[]> {
    const notifications = await db.notification.findMany({
      where: {
        recipientId,
        ...(options?.eventType ? { eventType: options.eventType } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications.map(PrismaNotificationMapper.toDomain);
  }
}
