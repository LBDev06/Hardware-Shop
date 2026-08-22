import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class NotificationPresenter {
  static toHTTP(notification: Notification) {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      content: notification.content,
      eventType: notification.eventType,
      createdAt: notification.createdAt.toISOString(),
    };
  }
}
